import pandas as pd
import sys

excel_path = r"C:\ConstructIA_MVP\project_storage\BP1_Subestacion_OHiggins\2_PRESUPUESTO\Oferta económica de STN actualizado al 30.09.2025.xlsx"

try:
    print(f"Reading Excel: {excel_path}")
    xl = pd.ExcelFile(excel_path)
    print("Sheet names:", xl.sheet_names)
    
    # Try iterating sheets to find content
    for sheet in xl.sheet_names:
        print(f"\n--- SHEET: {sheet} ---")
        df = pd.read_excel(excel_path, sheet_name=sheet, header=None)
        
        print(f"Shape: {df.shape}")
        non_empty = df.dropna(how='all')
        
        count = 0
        for index, row in non_empty.iterrows():
            # Get valid values in this row
            values = [str(x) for x in row.tolist() if pd.notna(x) and str(x).strip() != ""]
            if values:
                print(f"Row {index}: {values}")
                count += 1
            if count > 50:
                break

except Exception as e:
    print(f"Error processing Excel: {e}")
