from datetime import date
from decimal import Decimal
from typing import List, Dict, Any, Optional

# Mock for ProjectLegacyData Entity
class ProjectLegacyData:
    def __init__(self, project_id, client_id, zone_id, financial_variance, labor_turnover, safety_incidents):
        self.project_id = project_id
        self.client_id = client_id
        self.zone_id = zone_id
        self.financial_variance = financial_variance # e.g. 0.15 for +15%
        self.labor_turnover = labor_turnover
        self.safety_incidents = safety_incidents

class IntelligenceService:
    
    # Mock Database
    LEGACY_DB = [
        ProjectLegacyData(101, "MEL", "Alta Montaña", 0.18, 0.05, 2), # Project A: +18% Cost
        ProjectLegacyData(102, "MEL", "Alta Montaña", 0.12, 0.03, 0), # Project B: +12% Cost
        ProjectLegacyData(103, "Codelco", "Valle", 0.02, 0.01, 1),    # Project C: +2% Cost
    ]
    
    @staticmethod
    def get_historical_suggestions(
        client_id: str, 
        zone_id: str
    ) -> Dict[str, Any]:
        """
        Analyzes legacy projects to suggest risk factors.
        """
        # Filter relevant history
        matches = [p for p in IntelligenceService.LEGACY_DB 
                  if p.client_id == client_id and p.zone_id == zone_id]
        
        if not matches:
            return {"risk_factor": 1.0, "reason": "No historical data found."}
            
        # Calculate Average Variance
        avg_variance = sum(p.financial_variance for p in matches) / len(matches)
        
        suggestion = {
            "risk_factor": 1.0,
            "avg_historical_variance": f"{avg_variance*100:.1f}%",
            "reason": "Historical performance is within tolerance."
        }
        
        # Rule: If > 15% variance, suggest factor
        if avg_variance > 0.15:
            suggestion["risk_factor"] = 1.0 + avg_variance # e.g. 1.15
            suggestion["reason"] = (
                f"⚠️ ALERTA PMO AI: Proyectos anteriores en '{zone_id}' con cliente '{client_id}' "
                f"tienen un sobrecosto promedio del {avg_variance*100:.1f}%. "
                f"Se sugiere aplicar Factor de Riesgo: {1.0+avg_variance:.2f}"
            )
            
        return suggestion

    @staticmethod
    def check_unit_price_alert(
        item_name: str, 
        quoted_price: Decimal, 
        zone_id: str
    ) -> Optional[str]:
        """
        Real-time Watchdog for APU Unit Prices.
        """
        # Mock Historical Data for Specific Items per Zone
        HISTORICAL_PRICES = {
            "Alta Montaña": {
                "Hormigón H30": Decimal("145000"),
                "Mano de Obra (Maestro)": Decimal("9500")
            }
        }
        
        zone_prices = HISTORICAL_PRICES.get(zone_id, {})
        avg_cost = zone_prices.get(item_name)
        
        if avg_cost:
            # Check if quoted price is dangerously low (e.g. < 90% of history)
            if quoted_price < (avg_cost * Decimal("0.9")):
                 return (
                     f"⚠️ Alerta PMO AI: Estás cotizando '{item_name}' a ${quoted_price:,.0f}. "
                     f"Tu costo real promedio en '{zone_id}' ha sido de ${avg_cost:,.0f}. "
                     f"¿Deseas ajustar?"
                 )
        
        return None
