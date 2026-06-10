"""
Consolidated Finance Service.
Delegates to finance.py for all calculations. This module provides the
class-based interface used by apu_engine.py and other consumers.
"""
from decimal import Decimal, ROUND_HALF_UP
from app.services.finance import (
    get_real_time_indicators,
    calculate_company_cost as _calc_company_cost,
)


class FinanceService:
    """Thin wrapper over finance.py functions for class-based consumers."""

    @staticmethod
    def get_real_time_indicators():
        return get_real_time_indicators()

    @staticmethod
    def calculate_company_cost(liquid_salary: Decimal, role: str = "Standard") -> Decimal:
        """Returns hourly cost given liquid salary."""
        result = _calc_company_cost(Decimal(liquid_salary), role)
        return result["hourly_cost"]

    @staticmethod
    def convert_currency(amount: Decimal, from_curr: str, to_curr: str) -> Decimal:
        amount = Decimal(amount)
        if from_curr == to_curr:
            return amount

        indicators = get_real_time_indicators()
        uf_value = indicators["UF"]
        usd_value = indicators["USD"]

        # Normalize to CLP first
        in_clp = amount
        if from_curr == "UF":
            in_clp = amount * uf_value
        elif from_curr == "USD":
            in_clp = amount * usd_value

        # Convert to Target
        if to_curr == "CLP":
            return in_clp
        elif to_curr == "UF":
            return in_clp / uf_value
        elif to_curr == "USD":
            return in_clp / usd_value

        return amount
