from app.services.apu_engine import calculate_unit_price
from app.services.logistics import calculate_accreditation_impact
from decimal import Decimal
import json

def run_simulation():
    print("=== 1. APU COST SIMULATION (Multi-currency & Social Laws) ===")
    
    # Mock APU Structure: Hormigón H30
    apu_data = {
        "code": "H30-FUND",
        "description": "Hormigón H30 Fundaciones",
        "unit": "m3",
        "children": [
            {
                "type": "RESOURCE",
                "resource_type": "LABOR",
                "description": "Jornal",
                "qty": 0.5, # hh / m3
                "unit_price": 4000, # CLP Liquid
                "currency": "CLP"
            },
            {
                "type": "RESOURCE",
                "resource_type": "MATERIAL",
                "description": "Cemento",
                "qty": 300, # kg / m3 (Simplified unit for calc) or if unit is 0.2 UF per m3 equivalent?
                # Prompt: "Cemento (300 kg) @ 0.2 UF". 
                # This seems to imply 300kg total cost 0.2 UF? Or 0.2 UF per unit? 
                # Usually cement is ~5000 CLP/sack. 0.2 UF is ~7600 CLP. 
                # Let's assume the Line Item is "Cemento" with a price of 0.2 UF for the required quantity, 
                # OR price per kg. " @ 0.2 UF " suggests Unit Price.
                # Let's assume Unit Price is 0.2 UF? That's expensive for 1 kg.
                # Maybe 0.2 UF is the TOTAL for the 300kg?
                # Re-reading prompt: "Cemento (300 kg) @ 0.2 UF". 
                # Let's interpret as: Resource 'Cemento', Qty 1 (Simulating the batch) Price 0.2??
                # Or Qty 300, Price X?
                # Let's assume the PROMPT meant "Total cost of cement per m3 is 0.2 UF".
                # So we set Qty=1, Unit=glb, Price=0.2 UF.
                # Actually, construction standard: Qty 300kg, Unit Price X. 
                # Let's assume the user meant "Saco Cemento" and price is 0.2 UF per Saco?
                # Let's stick to the prompt text literally as a line item.
                # "Cemento (300 kg)" -> Qty 1 unit (Batch) @ 0.2 UF.
                "qty": 1,
                "unit_price": 0.2,
                "currency": "UF"
            },
            {
                "type": "RESOURCE",
                "resource_type": "EQUIPMENT",
                "description": "Grua",
                "qty": 0.1, # hrs
                "unit_price": 50, # USD
                "currency": "USD"
            }
        ]
    }
    
    # Calculate
    result_apu = calculate_unit_price(apu_data, project_currency="CLP", social_laws_factor=Decimal("1.55"))
    
    # Print simplified output
    print(f"APU: {result_apu['description']}")
    print(f"Total Price (CLP): ${result_apu['unit_price']:,.2f}")
    print("Breakdown:")
    for item in result_apu['children']:
        print(f" - {item['description']}: {float(item['total_line_cost']):,.2f} CLP ({item.get('resource_type', '')})")
    print("-" * 30)
    
    print("\n=== 2. LOGISTICS SIMULATION (Client A vs Client B) ===")
    
    # Scenario: 10 Workers, 2 Months
    HEADCOUNT = 10
    DURATION = 2
    
    res_a = calculate_accreditation_impact("CLIENT_A", HEADCOUNT, DURATION)
    res_b = calculate_accreditation_impact("CLIENT_B", HEADCOUNT, DURATION)
    
    print(f"\nScenario: {HEADCOUNT} Workers for {DURATION} Months")
    
    # Table Header
    print(f"{'Item':<25} | {'Client A (Standard)':<20} | {'Client B (Mining)':<20}")
    print("-" * 70)
    
    # Data Extraction
    def get_val(res, key):
        return f"${float(res['details'].get(key, 0)):,.0f}"

    print(f"{'Accreditation Days':<25} | {res_a['details']['accreditation_lost_days']:<20} | {res_b['details']['accreditation_lost_days']:<20}")
    print(f"{'Lost Labor Cost':<25} | {get_val(res_a, 'lost_labor_cost_clp'):<20} | {get_val(res_b, 'lost_labor_cost_clp'):<20}")
    print(f"{'Hotel Cost':<25} | {get_val(res_a, 'hotel_cost_clp'):<20} | {get_val(res_b, 'hotel_cost_clp'):<20}")
    print(f"{'Flights Cost':<25} | {get_val(res_a, 'flights_cost_clp'):<20} | {get_val(res_b, 'flights_cost_clp'):<20}")
    print(f"{'Induction Cost':<25} | {get_val(res_a, 'induction_cost_clp'):<20} | {get_val(res_b, 'induction_cost_clp'):<20}")
    print("-" * 70)
    print(f"{'TOTAL LOGISTICS (CLP)':<25} | ${float(res_a['total_logistics_cost_clp']):,.0f}             | ${float(res_b['total_logistics_cost_clp']):,.0f}")
    
    diff = res_b['total_logistics_cost_clp'] - res_a['total_logistics_cost_clp']
    print(f"\nDifference (The 'Mining Tax'): ${float(diff):,.0f} CLP")

if __name__ == "__main__":
    run_simulation()
