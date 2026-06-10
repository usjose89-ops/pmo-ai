from datetime import date, timedelta
from typing import List, Dict, Any, Optional

class StartupManager:
    
    # Mock Standard Checklists (Master Data)
    CHECKLISTS = {
        "MEL": [
            "Acreditación Empresa en Portal",
            "Entrega de Garantías (Boletas)",
            "Aprobación de Programa de Prevención",
            "Verificación de Equipos Críticos",
            "Charla de Inducción Cero Daño",
            # ... assume 35 items
            "Plan de Calidad Aprobado"
        ],
        "DEFAULT": [
            "Contrato Firmado",
            "Acta de Entrega de Terreno"
        ]
    }
    
    @staticmethod
    def load_standard_checklist(client_name: str) -> List[Dict[str, Any]]:
        """
        Loads the standard startup items for a client.
        """
        items_descriptions = StartupManager.CHECKLISTS.get(client_name, StartupManager.CHECKLISTS["DEFAULT"])
        startup_items = []
        
        for desc in items_descriptions:
            startup_items.append({
                "description": desc,
                "responsible_role": "Project Manager", # Default
                "status": "PENDING", # Pendiente, En Proceso, Completado
                "deadline": date.today() + timedelta(days=15), # Default 15 days from now
                "is_blocking": False
            })
            
        return startup_items

    @staticmethod
    def calculate_traffic_light(
        deadline: date, 
        status: str, 
        is_blocking: bool = False
    ) -> str:
        """
        Traffic Light Algorithm (Prompt 6).
        GREEN: Completed
        RED: Not Completed AND (Days <= 0 OR Blocking)
        YELLOW: Not Completed AND Days <= 10
        GRAY: Not Completed AND Days > 10 (Safe)
        """
        if status == "COMPLETED":
            return "GREEN"
            
        today = date.today()
        remaining_days = (deadline - today).days
        
        if remaining_days <= 0 or is_blocking:
            return "RED"
        
        if remaining_days <= 10:
            return "YELLOW"
            
        return "GRAY" # or GREEN if we strictly follow "Anything else" but prompt implies urgency levels
