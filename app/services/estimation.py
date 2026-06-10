from decimal import Decimal
from sqlalchemy.orm import Session
from app.models import Project, ClientProfile, CostParameter
from app.services.parameters_service import get_effective_parameters

def calculate_indirect_costs(
    project_id: int, 
    duration_months: int,
    staffing: dict, # e.g. {"Linieros": 5, "Supervisores": 2, "Personal Directo": 10}
    db: Session
) -> dict:
    """
    Calculates the estimated indirect costs (EPP, Clothing) for a project
    based on its duration and staffing.
    
    staffing keys should match 'required_by' logic or be mapped.
    For MVP, we will try to match broad categories:
    - "Todos" -> Sum of all staff
    - "Personal Directo" -> 'Personal Directo' + 'Linieros' + 'Supervisores' (Approximation)
    - "Solo Linieros (M1 y M2)" -> 'Linieros'
    - "Supervisores" -> 'Supervisores'
    """
    
    project = db.get(Project, project_id)
    if not project:
        raise ValueError("Project not found")
        
    # Get parameters for this client
    params = get_effective_parameters(project.client_id, db)
    
    total_cost = Decimal(0)
    details = []
    
    # Normalize Staffing Counts
    count_linieros = staffing.get("Linieros", 0)
    count_supervisores = staffing.get("Supervisores", 0)
    count_directo_generic = staffing.get("Personal Directo", 0)
    
    total_staff = count_linieros + count_supervisores + count_directo_generic
    total_directo = count_linieros + count_supervisores + count_directo_generic # In this model almost everyone is direct?
    
    for param in params:
        rules = param.classification_rules or {}

        # Determine Quantity needed per month or total duration
        # Param rules: duration_months (durability) vs Project Duration

        try:
            durability = max(1, int(rules.get("duration_months", 12)))
        except (TypeError, ValueError):
            durability = 12
        replacements = (duration_months / durability) 
        if replacements < 1: replacements = 1
        else: replacements = int(replacements + 0.99) # Ceiling
        
        # Determine who needs it
        required_by = str(rules.get("required_by", "Todos"))
        
        applicable_headcount = 0
        
        if "Todos" in required_by:
            applicable_headcount = total_staff
        elif "Linieros" in required_by:
            applicable_headcount = count_linieros
        elif "Supervisores" in required_by:
            applicable_headcount = count_supervisores
        elif "Personal Directo" in required_by:
            applicable_headcount = total_directo
            
        if applicable_headcount > 0:
            quantity = applicable_headcount * replacements
            
            # Stock Buffer (e.g. 10%)
            buffer_rule = str(rules.get("stock_buffer_rule", ""))
            if "10%" in buffer_rule:
                quantity = int(quantity * 1.10)
            
            cost = Decimal(quantity) * param.value
            
            details.append({
                "item": param.name,
                "category": param.category,
                "quantity": quantity,
                "unit_price": param.value,
                "total_cost": cost,
                "rule_applied": f"{applicable_headcount} staff x {replacements} cycles"
            })
            
            total_cost += cost
            
    return {
        "project_id": project_id,
        "total_estimated_cost": total_cost,
        "breakdown": details
    }
