import pdfplumber
import sys

pdf_path = r"C:\ConstructIA_MVP\project_storage\BP1_Subestacion_OHiggins\2_PRESUPUESTO\Oferta económica de STN actualizado al 30.09.2025.pdf"

try:
    print(f"Opening PDF: {pdf_path}")
    with pdfplumber.open(pdf_path) as pdf:
        text_content = ""
        for i, page in enumerate(pdf.pages):
            print(f"--- Page {i+1} ---")
            text = page.extract_text()
            if text:
                print(text)
                text_content += text + "\n"
            else:
                print("[No text found on this page]")
                
            # Also try to extract tables specifically
            tables = page.extract_tables()
            if tables:
                print(f"--- Found {len(tables)} tables on Page {i+1} ---")
                for table in tables:
                     for row in table:
                         # Filter out None values
                         clean_row = [str(cell).replace('\n', ' ') if cell is not None else "" for cell in row]
                         print(" | ".join(clean_row))

except Exception as e:
    print(f"Error processing PDF: {e}")
