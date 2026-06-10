import json
import re

input_path = r"c:\ConstructIA_MVP\data\parameters\epp_ropa_parsed.json"
output_path = r"c:\ConstructIA_MVP\data\parameters\epp_ropa_final.json"

def clean_price(price_str):
    # Remove dots and currency symbols
    clean = re.sub(r'[^\d]', '', str(price_str))
    return int(clean) if clean else 0

def clean_data():
    with open(input_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    table_data = raw_data[0]['content']
    headers = table_data[0]
    rows = table_data[1:]
    
    cleaned_items = []
    
    for row in rows:
        # Expected columns based on inspection:
        # 0: Elemento
        # 1: Clasificación
        # 2: Valor Unitario
        # 3: Duración Meses
        # 4: Personal que los requiere
        # 5: Stock Adicional
        
        if len(row) < 6:
            continue
            
        item = {
            "name": row[0],
            "category": row[1],
            "unit_price": clean_price(row[2]),
            "duration_months": int(row[3]) if row[3].isdigit() else 0,
            "required_by": row[4],
            "stock_buffer_rule": row[5]
        }
        cleaned_items.append(item)
        
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_items, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully cleaned {len(cleaned_items)} items.")
    # Print sample
    for item in cleaned_items[:3]:
        print(item)

if __name__ == "__main__":
    clean_data()
