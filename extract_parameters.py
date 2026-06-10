import pdfplumber
import json
import re

pdf_path = r"c:\ConstructIA_MVP\data\parameters\epp_ropa_16.02.26.pdf"
output_path = r"c:\ConstructIA_MVP\data\parameters\epp_ropa_parsed.json"

def extract_data():
    data = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                print(f"Processing Page {page_num + 1}...")
                
                # Extract Tables
                tables = page.extract_tables()
                for table in tables:
                    # Clean table data
                    clean_table = []
                    for row in table:
                        clean_row = [str(cell).replace('\n', ' ').strip() if cell else "" for cell in row]
                        clean_table.append(clean_row)
                    
                    if clean_table:
                        data.append({
                            "type": "table",
                            "page": page_num + 1,
                            "content": clean_table
                        })
                
                # Extract Text (fallback if no tables or for context)
                text = page.extract_text()
                if text:
                    data.append({
                        "type": "text",
                        "page": page_num + 1,
                        "content": text
                    })

        # Save to JSON
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            
        print(f"Extraction complete. Data saved to {output_path}")
        return data

    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    extract_data()
