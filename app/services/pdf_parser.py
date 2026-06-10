import re
from typing import List, Dict, Any
import pandas as pd
import pdfplumber

try:
    from PIL import Image
    import pytesseract
except ImportError:
    Image = None
    pytesseract = None

class BudgetPDFParser:
    def parse(self, file_path: str) -> List[Dict[str, Any]]:
        # Determine file type
        ext = file_path.lower()
        if ext.endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
             return self.parse_image(file_path)
        elif ext.endswith(('.xlsx', '.xls')):
             return self.parse_excel(file_path)
             
        extracted_items = []
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    # Strategy: Extract words and reconstruct lines
                    words = page.extract_words()
                    # Sort by Y (top to bottom) then X (left to right)
                    words.sort(key=lambda w: (w['top'], w['x0']))
                    
                    # Group into lines (using a tolerance for Y alignment)
                    lines = self._group_words_into_lines(words)
                    
                    for line_text in lines:
                        # Heuristic: Find lines that look like budget items
                        item = self._parse_line(line_text)
                        if item:
                            extracted_items.append(item)
                            
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return []
        
        # Sort items by their numeric ID (1.1, 1.2, 2.1, etc.)
        def sort_key(item):
            desc = item.get('description', '')
            match = re.match(r'^(\d+(?:\.\d+)*)', desc)
            if match:
                parts = match.group(1).split('.')
                return tuple(int(p) for p in parts)
            return (999999,)
        
        extracted_items.sort(key=sort_key)
            
        return extracted_items

    def parse_excel(self, file_path: str) -> List[Dict[str, Any]]:
        extracted_items = []
        try:
            # Load with pandas
            # handle_none means NaN -> None
            df = pd.read_excel(file_path, header=None) # Read without header to catch top rows too
            
            # Iterate through all rows and treat them as lines
            for _, row in df.iterrows():
                # Convert row to string line, filtering NaNs
                # Join with spaces to mimic a text line
                line_parts = [str(val).strip() for val in row if pd.notna(val) and str(val).strip() != '']
                line_text = " ".join(line_parts)
                
                if not line_text:
                    continue
                    
                # Re-use the robust text line parser
                item = self._parse_line(line_text)
                if item:
                    extracted_items.append(item)
                    
        except Exception as e:
            print(f"Error parsing Excel: {e}")
            return []
        
        # Sort items by their numeric ID (1.1, 1.2, 2.1, etc.)
        def sort_key(item):
            desc = item.get('description', '')
            match = re.match(r'^(\d+(?:\.\d+)*)', desc)
            if match:
                parts = match.group(1).split('.')
                return tuple(int(p) for p in parts)
            return (999999,)
        
        extracted_items.sort(key=sort_key)
            
        return extracted_items

    def parse_image(self, image_path: str) -> List[Dict[str, Any]]:
        print(f"DEBUG: Starting parse_image for {image_path}")
        if not pytesseract or not Image:
             print("Error: pytesseract or PIL not installed.")
             return []
             
        # Set tesseract cmd manually as it's often not in PATH for background processes
        # Make sure this path is correct for the specific environment
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        extracted_items = []
        try:
            img = Image.open(image_path)
            print("DEBUG: Image opened successfully. Dimensions:", img.size)
            
            # Preprocessing for better OCR
            # 1. Convert to grayscale
            img = img.convert('L')
            
            # 2. Rescale (3x is usually good for docs)
            # Use Resampling.LANCZOS if available, else ANTIALIAS
            scale_factor = 3
            new_size = (int(img.width * scale_factor), int(img.height * scale_factor))
            resample_method = Image.Resampling.LANCZOS if hasattr(Image, 'Resampling') else Image.ANTIALIAS
            img = img.resize(new_size, resample_method)
            
            # 3. Apply binary threshold to sharpen text
            # Threshold level 180 is a good starting point for scanned docs
            img = img.point(lambda p: 255 if p > 180 else 0)
            
            # Use image_to_data to get spatial info
            print("DEBUG: Running Tesseract image_to_data...")
            # Detect orientation and script
            config = r'--oem 3 --psm 6' # Default but explicit. PSM 6 = Assume a single uniform block of text.
            data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT, config=config)
            print("DEBUG: Tesseract finished.")
            
            # Convert to 'words' format: {'text': ..., 'top': ..., 'x0': ...}
            words = []
            n_boxes = len(data['text'])
            for i in range(n_boxes):
                if int(data['conf'][i]) > 0: # Filter low confidence or empty text
                    text = data['text'][i].strip()
                    if text:
                        # Adjust coordinates back to original scale (optional, but good for visual debugging if needed)
                        # We don't strictly need to scale back for parsing logic as it's relative, 
                        # but "tolerance" relies on absolute pixels. 
                        # If we scaled 3x, our tolerance of 15 effectively becomes 5 in original scale.
                        # So we MUST scale coordinates back or increase tolerance drastically.
                        # Easier to scale coordinates back.
                        words.append({
                            'text': text,
                            'top': data['top'][i] / scale_factor,
                            'x0': data['left'][i] / scale_factor,
                            'bottom': (data['top'][i] + data['height'][i]) / scale_factor
                        })
            
            # Sort by Y then X (same as PDF)
            words.sort(key=lambda w: (w['top'], w['x0']))
            
            # Group into lines - Might need higher tolerance for images due to skew?
            # Let's use slighty higher tolerance default for images? 
            # Group into lines - Reduced tolerance to prevent merging unrelated rows
            lines = self._group_words_into_lines(words, tolerance=4)
            
            print(f"DEBUG: OCR extracted {len(lines)} lines")
            try:
                with open("c:/ConstructIA_MVP/debug_ocr.txt", "w", encoding="utf-8") as f:
                    f.write(f"Parsed {len(lines)} lines from {image_path}\n")
                    for i, line_text in enumerate(lines):
                         f.write(f"Line {i}: {line_text}\n")
            except Exception as e:
                print(f"Failed to write debug file: {e}")
            
            # Category tracking
            current_category = "direct" # Default
            
            for line_text in lines:
                # 1. Classification Logic
                line_lower = line_text.lower()
                if "costo indireto" in line_lower or "costo indirecto" in line_lower:
                    current_category = "indirect"
                    continue # Skip header line
                elif "costo directo" in line_lower:
                    current_category = "direct"
                    continue # Skip header line
                
                # 2. Exclusion Logic (Skip summarization rows)
                # Skip lines starting with "total", "utilidad", "iva", "neto"
                # But be careful with description "Retiro Total...". 
                # Summary rows usually start with "Total" or have "Total" + large number.
                if re.match(r'^\s*(total|utilidad|iva|neto)', line_lower):
                     continue
                if "presupuesto valor" in line_lower:
                     continue

                item = self._parse_line(line_text)
                if item:
                    item['category'] = current_category
                    extracted_items.append(item)
                else:
                    # Print first few failed lines to see what's wrong
                    if len(extracted_items) == 0 and len(line_text) > 10: 
                         print(f"DEBUG: Failed to parse line: {line_text}")
                    
        except Exception as e:
            print(f"Error parsing Image: {e}")
            # Identify if it's Tesseract missing
            if "tesseract is not installed" in str(e).lower() or "not found" in str(e).lower():
                 print("Tesseract OCR binary not found. Please install Tesseract-OCR.")
            return []
        
        # Sort items by their numeric ID (1.1, 1.2, 2.1, etc.)
        def sort_key(item):
            desc = item.get('description', '')
            # Extract leading number pattern like "1.1", "2.3.1", "14"
            match = re.match(r'^(\d+(?:\.\d+)*)', desc)
            if match:
                # Split by dots and convert to tuple of ints for proper numeric sorting
                parts = match.group(1).split('.')
                return tuple(int(p) for p in parts)
            return (999999,)  # Put items without IDs at the end
        
        extracted_items.sort(key=sort_key)
            
        return extracted_items

    def _group_words_into_lines(self, words, tolerance=10):
        """Groups words into text lines based on vertical alignment."""
        lines = []
        current_line = []
        last_top = 0
        
        for word in words:
            if not current_line:
                current_line.append(word['text'])
                last_top = word['top']
            else:
                if abs(word['top'] - last_top) <= tolerance:
                    current_line.append(word['text'])
                else:
                    lines.append(" ".join(current_line))
                    current_line = [word['text']]
                    last_top = word['top']
        if current_line:
            lines.append(" ".join(current_line))
        return lines

    def _parse_line(self, line: str) -> Dict[str, Any] | None:
        """
        Attempts to parse a text line into a budget item.
        Expected format variations:
        - "1 Movilización gl 1 45.000.000 45.000.000"
        - "Ingeniería gl 1 120.000.000 120.000.000"
        """
        # 1. Look for numbers at the end of the line (CLP format: 1.000.000)
        # Regex explanation:
        # \d{1,3}   : 1 to 3 digits
        # (?:\.\d{3})+ : Groups of .000 (thousands separators)
        # | \d+     : OR just plain digits
        
        # 1. Look for numbers at the end of the line (CLP format: 1.000.000)
        # Regex explanation:
        # \d{1,3}   : 1 to 3 digits
        # (?:\.\d{3})+ : Groups of .000 (thousands separators)
        # | \d+     : OR just plain digits
        
        # Handle metadata noise (e.g. watermarks) by removing them instead of skipping the line
        clean_line = line.replace("Página", "").replace("Page", "").replace("Fecha", "")
        
        # OCR Corrections:
        # $ often misused for 5 in Tesseract
        clean_line = clean_line.replace("$", "5")
        
        # If line becomes empty or too short, skip
        if len(clean_line.strip()) < 5:
            if "Fecha" in line or "Página" in line or "Page" in line:
             line = line.replace("Página", "").replace("Page", "").replace("Fecha", "")
            else:
                return None # Original behavior for short lines without metadata

        line = clean_line # Update line after cleaning
        line_lower = line.lower()
        if "utilidad" in line_lower or "utitidad" in line_lower or "total" in line_lower:
             return None

        # 1. Extract ALL potential numbers tokens from the line
        # Rigorous money regex for CLP (1.234.567 or 1234567 or 1,5 or 1.5)
        # matches: 1.234.567 | 1234567 | 1,5 | 1.5 | 10
        # We need to be careful with dots and commas. 
        
        # Capture all number-like tokens
        token_pattern = r'(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?|\d+)'
        tokens = list(re.finditer(token_pattern, line))
        
        if len(tokens) < 2:
            return None

        # Parse valid numbers from tokens
        parsed_numbers = []
        for tk in tokens:
            s_val = tk.group(0)
            try:
                # Normalize Chilean format: 1.234.567 -> 1234567
                # 1,5 -> 1.5
                clean_s = s_val.replace('.', '').replace(',', '.')
                val = float(clean_s)
                parsed_numbers.append({'val': val, 'start': tk.start(), 'end': tk.end(), 'text': s_val})
            except:
                pass

        # Solver Strategy: Find Price and Total
        # Usually Total is the largest value in the line, typically at the end.
        
        # Valid Candidates for Price/Total (usually > 0)
        candidates = parsed_numbers
        if not candidates:
            return None
            
        valid_matches = []
        
        # Strategy A: Check for Price == Total (Qty implicit 1)
        # Iterate ALL pairs
        for i in range(len(candidates)):
            total_cand = candidates[i]
            for j in range(i): # j < i
                price_cand = candidates[j]
                
                # Logic: Price ~= Total
                if abs(total_cand['val'] - price_cand['val']) < 1.0:
                    valid_matches.append({
                        'total': total_cand,
                        'price': price_cand,
                        'qty': 1.0,
                        'qty_token': None,
                        'score': total_cand['val'] # Prefer higher values
                    })

        # Strategy B: Check for Price * Qty == Total
        # Iterate ALL triplets
        for i in range(len(candidates)):
            total_cand = candidates[i]
            for j in range(i): # j < i (Price)
                price_cand = candidates[j]
                if price_cand['val'] == 0: continue
                
                calc_qty = total_cand['val'] / price_cand['val']
                
                # Search for Qty token BEFORE Price
                for k in range(j): # k < j (Qty)
                    qty_cand = candidates[k]
                    # Check partial match
                    if abs(qty_cand['val'] - calc_qty) < 0.05:
                         valid_matches.append({
                            'total': total_cand,
                            'price': price_cand,
                            'qty': qty_cand['val'],
                            'qty_token': qty_cand,
                            'score': total_cand['val'] + 0.1 # Slight bias for explicit qty? Or just total.
                        })
        
        best_match = None
        if valid_matches:
            # Sort by Score (Total Value) Descending
            # If totals are equal, maybe prefer the one closer to end? (Higher index)
            # But max() does first one encountered if ties? 
            # We want the highest money value.
            best_match = max(valid_matches, key=lambda x: x['score'])
            
            # Sanity check: If best match is < 100 and there are other large numbers in line, 
            # might be wrong. But if math works, it works.
            # Assuming budget items > 100. 
            if best_match['total']['val'] < 10 and len(parsed_numbers) > 3:
                 # If we matched 1=1 but there is 1000000 on the line, we probably ignored it 
                 # because we couldn't match the math. 
                 # But in this specific case (user report), 13509383 was Price and 1 was Total.
                 # The '1' at end failed math with 13509383.
                 # But 13509383 (Price) and 13509383 (Total) would match and have score 13509383.
                 # So max() should pick 13509383 > 1.
                 pass
                 
        # If still no match... fallback logic (usually not needed if max search works)


        if not best_match:
            # Fallback Strategy: "Rightmost Large Numbers"
            # If strict math failed, just look for the last two "money-like" numbers.
            # This handles cases where rounding errors prevent strict equality,
            # or where Qty is not explicitly in the text.
            
            # Filter for likely money values (e.g. > 100 or formatted with dots)
            # We assume budget items are rarely < 100 CLP unless decimals.
            money_candidates = [
                c for c in candidates 
                if c['val'] > 100 or ('.' in c['text'] and c['val'] > 0)
            ]
            
            if len(money_candidates) >= 2:
                # Take the last two
                total_cand = money_candidates[-1]
                price_cand = money_candidates[-2]
                
                # Infer Qty
                if price_cand['val'] > 0:
                    qty = round(total_cand['val'] / price_cand['val'], 2)
                    # If close to 1, make it 1.0
                    if abs(qty - 1.0) < 0.01:
                        qty = 1.0
                else:
                    qty = 1.0
                    
                best_match = {
                    'total': total_cand,
                    'price': price_cand,
                    'qty': qty,
                    'qty_token': None
                }

        if not best_match:
            return None

        # Build Result
        total_val = best_match['total']['val']
        price_val = best_match['price']['val']
        qty = best_match['qty']
        
        # Description is everything before the first token used?
        # Typically: ItemID Description Unit Qty Price Total
        # Use the start of the 'qty_token' or 'price' (if qty implicit) as cut-off
        
        cut_off_index = best_match['price']['start']
        if best_match['qty_token']:
             cut_off_index = min(cut_off_index, best_match['qty_token']['start'])
             
        remainder = line[:cut_off_index].strip()
        
        # Extract Item ID (robust search for embedded IDs)
        item_id = ""
        # Look for the first number sequence in the remainder
        # It might be "1.1" or "14" (misread 1.4) or "12" (misread 1.2)
        # Avoid matching years like "2025" if possible? 
        # Usually Item ID is first.
        
        item_id_match = re.search(r'\b(\d+(?:\.\d+)*)\b', remainder)
        if item_id_match:
            found_val = item_id_match.group(1)
            # Heuristic: IDs usually are short or have dots.
            if '.' in found_val or len(found_val) < 5:
                item_id = found_val
                # Remove it from description to clean it up.
                start, end = item_id_match.span()
                remainder = remainder[:start] + remainder[end:]
        
        # FIX OCR-MANGLED ITEM IDs
        # OCR often misses dots in item numbers like "1.2" -> "12", "2.2.2" -> "222"
        # Heuristic: Insert dots between single digits for typical budget item IDs
        if item_id and '.' not in item_id and len(item_id) >= 2 and len(item_id) <= 4:
            # Check if all characters are single digits (not like "10" which is valid)
            # Budget items are usually 1.1-1.10, 2.1-2.10, 2.2.1-2.2.10
            # "12" -> "1.2", "13" -> "1.3", "234" -> "2.3.4", "222" -> "2.2.2"
            # But avoid "10" -> "1.0" (which would be wrong if it's actually 1.10 read as 10)
            # Safest: insert dots between each digit for 2 and 3 digit IDs
            if len(item_id) == 2:
                # "12" -> "1.2", "23" -> "2.3"
                item_id = f"{item_id[0]}.{item_id[1]}"
            elif len(item_id) == 3:
                # "234" -> "2.3.4", "222" -> "2.2.2", "110" -> "1.10" (keep last two together if second is 0 or 1)
                # Actually, for "110" we want "1.10" not "1.1.0"
                # Heuristic: if last digit is 0 and middle is 1, treat as X.10
                if item_id[2] == '0' and item_id[1] == '1':
                    item_id = f"{item_id[0]}.{item_id[1]}{item_id[2]}"  # "110" -> "1.10"
                else:
                    item_id = f"{item_id[0]}.{item_id[1]}.{item_id[2]}"  # "234" -> "2.3.4"
            elif len(item_id) == 4:
                # "2234" could be "2.2.3.4" or "22.34" - assume first is section
                # Most likely: "2.2.3.4" for deeply nested items
                item_id = f"{item_id[0]}.{item_id[1]}.{item_id[2]}.{item_id[3]}"
            
        description = remainder.strip()
        
        # User Feedback: "No deletes los numeros que anteceden"
        # Re-attach ID to description for display
        if item_id:
             description = f"{item_id} {description}"

        
        # Unit extraction logic (unchanged)

                # Try to find Unit (word before quantity or at end of description)
        # Try to find Unit (word before quantity or at end of description)
        unit = "gl" # Default unit
        unit_pattern = r'\b(gl|un|m3|kg|ton|c/u|mes|dia|lt|u)\b'
        unit_match = re.search(unit_pattern, description, re.IGNORECASE)
        
        # If we found a unit at the very end of description, extract it
        if unit_match:
            found_unit = unit_match.group(1)
            # Check if it's at the end
            if description.endswith(found_unit):
                unit = found_unit
                description = description[:-len(found_unit)].strip()
            elif unit_match.start() > len(description) * 0.7: 
                # If unit is in the last 30% of text, probably the unit column
                    unit = found_unit
                    # Remove it
                    start, end = unit_match.span()
                    description = description[:start].strip() + " " + description[end:].strip()

        return {
            "item_id": item_id, 
            "description": description.strip(),
            "unit": unit,
            "qty": qty,
            "unit_price": price_val,
            "total_price": total_val,
            "original_line": line
        } 
