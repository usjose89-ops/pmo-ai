# Mock "ProjectLegacyData"
# Indexed by Resource Name and Zone
LEGACY_RESOURCE_DATA = {
    "Camioneta 4x4": {
        "Cordillera": {
            "avg_cost": 1200000, # Monthly lease
            "last_project_note": "En el Proyecto 'Torre Sur', esto costó un 15% más debido a mantenimientos por altura geográfica.",
            "last_project_name": "Torre Sur"
        },
        "Valle": {
            "avg_cost": 950000,
            "last_project_note": "Precio estándar de mercado.",
            "last_project_name": "Condominio Valle"
        }
    },
    "Generador 100kVA": {
        "Cordillera": {
             "avg_cost": 850000,
             "last_project_note": "Alto consumo de filtros por polvo en suspensión.",
             "last_project_name": "Minera X"
        }
    }
}

def validate_resource_price(resource_name: str, zone: str, current_price: float) -> dict:
    """
    Validates a resource price against historical data for the specific zone.
    """
    if resource_name not in LEGACY_RESOURCE_DATA or zone not in LEGACY_RESOURCE_DATA[resource_name]:
        return {"status": "UNKNOWN", "message": ""}
        
    historical = LEGACY_RESOURCE_DATA[resource_name][zone]
    avg_cost = historical["avg_cost"]
    
    # Check if price is significantly lower (more than 10% below avg)
    threshold = avg_cost * 0.90
    
    if current_price < threshold:
        diff_percent = round(((avg_cost - current_price) / avg_cost) * 100, 1)
        return {
            "status": "LOW_PRICE_WARNING",
            "historical_avg": avg_cost,
            "diff_percent": diff_percent,
            "tooltip": historical["last_project_note"]
        }
        
    return {"status": "OK", "message": "Precio dentro de rango."}
