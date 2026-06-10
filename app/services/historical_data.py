# Mock Historical Data Store
# Indexed by "ClientName_ZoneName"
HISTORICAL_DB = {
    "Inmobiliaria Santiago_Cordillera": {
        "avg_turnover_rate": 20.5, # Percentage
        "avg_weather_delay_days": 15,
        "avg_client_delay_days": 5,
        "safety_incidents_count": 2,
        "project_count": 3
    },
    "Inmobiliaria Santiago_Valle": {
        "avg_turnover_rate": 8.0,
        "avg_weather_delay_days": 2,
        "avg_client_delay_days": 12, # High client delays here
        "safety_incidents_count": 0,
        "project_count": 5
    }
}

def get_historical_warnings(client: str, zone: str) -> list[str]:
    """
    Retrieves specific warnings based on past performance with this Client in this Zone.
    """
    key = f"{client}_{zone}"
    stats = HISTORICAL_DB.get(key)
    
    if not stats:
        return []
        
    warnings = []
    
    # Validation Rules
    if stats["avg_turnover_rate"] > 15:
        warnings.append(
            f"⚠️ ADVERTENCIA: En proyectos anteriores con este cliente en esta zona ({zone}), "
            f"la rotación fue del {stats['avg_turnover_rate']}%. Se sugiere ajustar el APU de Mano de Obra."
        )
        
    if stats["avg_client_delay_days"] > 10:
        warnings.append(
             f"Historial de Atrasos: Este cliente promedia {stats['avg_client_delay_days']} días de demora "
             "en aprobaciones/entregas en esta zona. Revise plazos contractuales."
        )
        
    if stats["avg_weather_delay_days"] > 10:
        warnings.append(
            f"Clima: Históricamente se pierden {stats['avg_weather_delay_days']} días por clima en esta zona. "
            "¿Incluyó holguras suficientes?"
        )
        
    return warnings

def save_project_history(client: str, zone: str, data: dict):
    """
    Simulates saving new data to the historical engine.
    In a real app, this would recalculate the moving averages.
    """
    # Logic to update DB would go here
    print(f"Project history saved for {client} in {zone}: {data}")
    return True
