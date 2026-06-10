import decimal
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional, Dict, List, Any
from app.models import APU, Resource, Project, Currency, ResourceType
from app.services.finance import get_real_time_indicators

# Constants
SOCIAL_LAWS_FACTOR_DEFAULT = Decimal("1.55") # 55% over liquid for standard construction
WEAR_AND_TEAR_FACTOR = Decimal("0.03") # 3% of Total Labor

def get_currency_rates_mock() -> Dict[str, Decimal]:
    """
    Mock function to get today's rates. 
    In production this would call an external API or DB.
    """
    # Using values from prompt / finance.py reference
    return {
        "UF": Decimal("38000.00"),
        "USD": Decimal("950.00"),
        "CLP": Decimal("1.00")
    }

def convert_currency(amount: Decimal, from_curr: str, to_curr: str, rates: Dict[str, Decimal]) -> Decimal:
    if from_curr == to_curr:
        return amount
    
    # Convert to CLP first (Base)
    amount_in_clp = amount
    if from_curr == "UF":
        amount_in_clp = amount * rates["UF"]
    elif from_curr == "USD":
        amount_in_clp = amount * rates["USD"]
    
    # Convert from CLP to Target
    if to_curr == "CLP":
        return amount_in_clp
    elif to_curr == "UF":
        return amount_in_clp / rates["UF"]
    elif to_curr == "USD":
        return amount_in_clp / rates["USD"]
    
    return amount_in_clp

def calculate_unit_price(
    apu_node: Dict[str, Any], 
    project_currency: str = "CLP",
    social_laws_factor: Decimal = SOCIAL_LAWS_FACTOR_DEFAULT
) -> Dict[str, Any]:
    """
    Recursive calculation of APU Unit Price with advanced logic.
    Returns a dictionary with detailed breakdown.
    """
    rates = get_currency_rates_mock()
    total_cost = Decimal("0.00")
    breakdown = {
        "MATERIAL": Decimal("0.00"),
        "LABOR": Decimal("0.00"),
        "EQUIPMENT": Decimal("0.00"),
        "SUBCONTRACT": Decimal("0.00")
    }
    
    # Process Children (Resources or Sub-APUs)
    processed_children = []
    
    # If this node has 'children', process them
    children = apu_node.get("children", [])
    
    for child in children:
        child_total = Decimal("0.00")
        child_type = child.get("type") # RESOURCE or SUBITEM
        
        if child_type == "SUBITEM":
            # Recursive call
            child_result = calculate_unit_price(child, project_currency, social_laws_factor)
            child_unit_price = child_result["unit_price"]
            qty = Decimal(str(child.get("qty", 0)))
            child_total = child_unit_price * qty
            
            # Aggregate categories
            for cat, val in child_result["breakdown"].items():
                breakdown[cat] += val * qty
                
            processed_children.append({
                **child,
                "calculated_unit_price": child_unit_price,
                "total_line_cost": child_total,
                "breakdown": child_result["breakdown"]
            })

        elif child_type == "RESOURCE":
            qty = Decimal(str(child.get("qty", 0)))
            base_price = Decimal(str(child.get("unit_price", 0)))
            res_currency = child.get("currency", "CLP")
            res_category = child.get("resource_type", "MATERIAL") # MATERIAL, LABOR, EQUIPMENT...
            
            # 1. Currency Conversion
            price_project_curr = convert_currency(base_price, res_currency, project_currency, rates)
            
            # 2. Social Laws (Only for LABOR)
            if res_category == "LABOR":
                # Assume input price is Liquid, so we apply factor to get Total Company Cost
                # Or if it's already "Cost", we might treat it differently. 
                # Prompt says: Input Hourly Rate (Liquid) -> Apply Factor.
                unitary_social_cost = price_project_curr * (social_laws_factor - 1)
                final_unit_price = price_project_curr * social_laws_factor
            else:
                unitary_social_cost = Decimal("0.00")
                final_unit_price = price_project_curr
            
            child_total = final_unit_price * qty
            breakdown[res_category] += child_total
            
            processed_children.append({
                **child,
                "original_price": base_price,
                "original_currency": res_currency,
                "converted_unit_price": final_unit_price,
                "unitary_social_cost": unitary_social_cost,
                "total_line_cost": child_total
            })
            
        total_cost += child_total

    # 3. Tools Wear & Tear (3% of Total Labor)
    labor_total = breakdown["LABOR"]
    wear_tear_cost = labor_total * WEAR_AND_TEAR_FACTOR
    
    if wear_tear_cost > 0:
        # Add as a virtual resource line item
        processed_children.append({
            "code": "GEN-001",
            "description": "Desgaste Herramientas y EPP (3% MO)",
            "unit": "glb",
            "qty": 1,
            "type": "GENERATED",
            "total_line_cost": wear_tear_cost,
            "resource_type": "TOOLS" # Custom type
        })
        total_cost += wear_tear_cost
        # Add to Equipment or its own category? Usually treated as Equipment or Overhead. 
        # Putting it in EQUIPMENT for now or keeping separate? 
        # Let's add to EQUIPMENT for simplicity in standard categories
        breakdown["EQUIPMENT"] += wear_tear_cost

    return {
        "code": apu_node.get("code"),
        "description": apu_node.get("description"),
        "unit_price": total_cost.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
        "currency": project_currency,
        "breakdown": breakdown,
        "children": processed_children
    }

# --- NEW APU ENGINE CLASS (DB AWARE) ---
from app.services.finance_service import FinanceService

class APUEngine:
    
    def __init__(self, db_session):
        self.db = db_session

    def calculate_unit_price(self, apu_id: int) -> Decimal:
        """
        Recursively calculates the Unit Price of an APU.
        """
        # Lazy import to avoid circular dependency if models import this service
        from app.models import APU
        
        apu = self.db.query(APU).filter(APU.id == apu_id).first()
        if not apu:
            return Decimal(0)
            
        total_direct_cost = Decimal(0)
        # Assuming Project has a currency enum, we use its value (e.g. "CLP", "UF")
        project_currency = apu.project.currency.value if apu.project.currency else "CLP"
        
        # 1. Calculate Resources (Direct Children)
        # Adapted: apu.items -> apu.resources_association
        for association in apu.resources_association:
            resource = association.resource
            qty = Decimal(association.quantity)
            
            # Convert Resource Price to Project Currency
            # resource.currency is an Enum, use .value
            price_in_proj_curr = FinanceService.convert_currency(
                resource.base_price, 
                resource.currency.value if hasattr(resource.currency, 'value') else resource.currency, 
                project_currency
            )
            
            total_direct_cost += (price_in_proj_curr * qty)
            
        # 2. Calculate Sub-APUs (Recursive Children)
        # Adapted: apu.sub_apus -> apu.children
        for child_apu in apu.children:
            sub_price = self.calculate_unit_price(child_apu.id)
            # Logic Gap: The relationship `children` in standard Adjacency List usually implies 
            # the child belongs *only* to this parent or we need an association table for "APU-in-APU" with quantity.
            # The current model `parent_id` implies 1:N (One parent, many children).
            # If so, the child IS the item. But usually we need a Quantity.
            # For this MVP adaptation, we assume the child APU's unit price is added directly 
            # (implying Qty=1 or that the child represents the total sub-component).
            # To improve, we would need `APUComposition` table. 
            # For now, we sum the Unit Price of children (Qty=1 assumption).
            total_direct_cost += sub_price 

        # 3. Apply Markups (Indirects)
        # Note: Model Project might not have overhead_percentage fields yet, defaulting to 0 if missing.
        overhead = Decimal(getattr(apu.project, 'overhead_percentage', 0)) / 100
        profit = Decimal(getattr(apu.project, 'profit_percentage', 0)) / 100
        
        price_with_overhead = total_direct_cost * (1 + overhead)
        final_unit_price = price_with_overhead * (1 + profit)
        
        return final_unit_price.quantize(Decimal("0.01"))
