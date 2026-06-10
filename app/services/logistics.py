from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any

# Client Rules Mock Database
CLIENT_RULES_DB = {
    "CLIENT_A": {
        "name": "Inmobiliaria Santiago",
        "accreditation_days": 0,
        "hotel_rate_uf": Decimal("0.0"), # No hotel needed
        "requires_flights": False,
        "induction_cost_usd": Decimal("0.0")
    },
    "CLIENT_B": {
        "name": "Minera Escondida (MEL)",
        "accreditation_days": 15,
        "hotel_rate_uf": Decimal("3.5"),
        "requires_flights": True, # Santiago-Antofagasta
        "flight_cost_clp": Decimal("150000"), # Mock average flight cost
        "induction_cost_usd": Decimal("200.0")
    }
}

def get_currency_rates_mock() -> Dict[str, Decimal]:
    # Duplicated from apu_engine for simplicity, or import
    return {
        "UF": Decimal("38000.00"),
        "USD": Decimal("950.00"),
        "CLP": Decimal("1.00")
    }

def calculate_accreditation_impact(client_key: str, headcount: int, duration_months: int) -> Dict[str, Any]:
    """
    Calculates the indirect logistics cost based on client rules.
    """
    client = CLIENT_RULES_DB.get(client_key)
    if not client:
        return {"error": "Client not found"}

    rates = get_currency_rates_mock()
    
    # 1. Accreditation (Lost Man Days)
    # Cost assumes paying the worker while they are accrediting but not producing
    # Simplified: We assume a standardized daily cost for a worker during accreditation (e.g. 50.000 CLP salary + costs)
    # In a real app, this would come from the specific roster.
    AVERAGE_DAILY_LABOR_COST_CLP = Decimal("60000") 
    
    accreditation_days = client["accreditation_days"]
    lost_labor_cost = accreditation_days * headcount * AVERAGE_DAILY_LABOR_COST_CLP
    
    # 2. Hotel Costs (Accommodation)
    # Accreditation Days + Shift stays? 
    # Let's assume for this "Impact" calculation we focus on the Accreditation period + Logistics setup
    # Prompt says: "Calculate Indirect Logistics Cost".
    # Scenario: 10 Workers, 2 Months.
    # If mining, they likely stay in hotel/camp. 
    # Let's assume standard shift 14x14 or similar. So 30 days/month -> 30 days hotel per person if remote?
    # Or just accreditation hotel? 
    # The prompt asks for "Impact". Let's assume "Hotel during project" + "Hotel during accreditation".
    # Client B has hotel_rate. Client A does not.
    
    days_in_hotel = 0
    if client["hotel_rate_uf"] > 0:
        # Full duration stay (Camp/Hotel)
        days_in_hotel = duration_months * 30 * headcount 
    
    hotel_cost_uf = days_in_hotel * client["hotel_rate_uf"]
    hotel_cost_clp = hotel_cost_uf * rates["UF"]

    # 3. Flights
    flights_cost_clp = Decimal("0")
    if client["requires_flights"]:
        # Assume 2 flights per month per person (Roundtrip)
        flights_per_month = 2
        total_flights = flights_per_month * duration_months * headcount
        flights_cost_clp = total_flights * client.get("flight_cost_clp", Decimal("150000"))

    # 4. Induction Cost (One time)
    induction_usd = client["induction_cost_usd"]
    induction_cost_clp = induction_usd * rates["USD"] * headcount

    total_logistics_clp = lost_labor_cost + hotel_cost_clp + flights_cost_clp + induction_cost_clp

    return {
        "client_name": client["name"],
        "headcount": headcount,
        "duration_months": duration_months,
        "details": {
            "accreditation_lost_days": accreditation_days * headcount,
            "lost_labor_cost_clp": lost_labor_cost,
            "hotel_nights": days_in_hotel,
            "hotel_cost_clp": hotel_cost_clp,
            "flights_cost_clp": flights_cost_clp,
            "induction_cost_clp": induction_cost_clp
        },
        "total_logistics_cost_clp": total_logistics_clp
    }
