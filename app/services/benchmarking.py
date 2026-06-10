from decimal import Decimal
import random

# Mock Database of Historical Projects
HISTORICAL_DATA = {
    "Hormigón H30": [
        {"project": "Edificio Centro", "year": 2024, "price": 4200},
        {"project": "Torre Sur", "year": 2025, "price": 4450},
        {"project": "Condominio Los Alerces", "year": 2023, "price": 4100},
    ],
    "Enfierradura Muros": [
        {"project": "Edificio Centro", "year": 2024, "price": 1200},
        {"project": "Torre Sur", "year": 2025, "price": 1350},
    ],
    "Moldaje Losa": [
         {"project": "Edificio Centro", "year": 2024, "price": 18000},
         {"project": "Torre Sur", "year": 2025, "price": 19500},
    ]
}

def get_historical_apu_stats(apu_name: str, current_price: float):
    """
    Analyzes the current APU price against historical data.
    """
    history = HISTORICAL_DATA.get(apu_name, [])
    
    if not history:
        return {
            "found": False,
            "message": "No hay datos históricos para esta partida."
        }

    prices = [h["price"] for h in history]
    avg_price = sum(prices) / len(prices)
    min_price = min(prices)
    max_price = max(prices)
    
    # Calculate Deviation
    deviation_percent = ((current_price - avg_price) / avg_price) * 100
    
    alert_level = "NORMAL"
    if deviation_percent > 10:
        alert_level = "HIGH" # Over budget
    elif deviation_percent < -10:
        alert_level = "LOW" # Suspiciously low
        
    return {
        "found": True,
        "apu_name": apu_name,
        "history_count": len(history),
        "benchmark": {
            "avg": round(avg_price, 2),
            "min": min_price,
            "max": max_price,
            "last_project": history[-1]["price"]
        },
        "analysis": {
            "deviation_percent": round(deviation_percent, 1),
            "alert": alert_level,
            "recommendation": _get_recommendation(alert_level, deviation_percent)
        }
    }

def _get_recommendation(alert, deviation):
    if alert == "HIGH":
        return f"El precio es {deviation:.1f}% mayor al promedio histórico. Revise Rendimientos de Mano de Obra."
    elif alert == "LOW":
        return f"El precio es {deviation:.1f}% menor al promedio. Verifique si faltan Materiales o Leyes Sociales."
    return "Precio alineado con el mercado histórico."
