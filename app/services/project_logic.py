from datetime import date
from enum import Enum

class ProjectStatus(Enum):
    EN_ESTUDIO = "En Estudio"
    OFERTA_PRESENTADA = "Oferta Presentada"
    OFERTA_ADJUDICADA = "Oferta Adjudicada"
    TERMINADO = "Terminado"

def calculate_duration(start_date: date, end_date: date) -> int:
    """
    Calculates total days (días corridos) between start and end date.
    """
    if end_date < start_date:
        raise ValueError("End date must be after start date")
    delta = end_date - start_date
    return delta.days

def calculate_project_risk(status: str, location: str, base_risk: int = 10) -> int:
    """
    Calculates the risk percentage based on status and location.
    
    Rules:
    - Base Risk: Provided value (default 10%)
    - Execution (Adjudicada): +15% due to operational uncertainty.
    - Location 'Cordillera' or 'Remote': +5%.
    """
    risk = base_risk
    
    # Status Risk
    if status == ProjectStatus.OFERTA_ADJUDICADA.value:
        risk += 15
        
    # Location Risk
    if location.lower() in ['cordillera', 'remote', 'remoto']:
        risk += 5
        
    # Cap risk at 100
    return min(risk, 100)
