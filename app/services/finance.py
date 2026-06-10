from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any

# Constants for Chilean Payroll (Mock 2025 values)
MINIMUM_WAGE = Decimal("500000")
UF_VALUE_MOCK = Decimal("38000.00")
USD_VALUE_MOCK = Decimal("950.00")

# Social Security Rates (Worker Side)
RATE_AFP = Decimal("0.115")      # 11.5% Average
RATE_HEALTH = Decimal("0.07")    # 7%
RATE_AFC_WORKER = Decimal("0.006") # 0.6% (Indefinite contract)

# Employer Costs
RATE_SIS = Decimal("0.0199")     # 1.99%
RATE_AFC_EMPLOYER = Decimal("0.024") # 2.4%
RATE_MUTUAL = Decimal("0.0093")  # 0.93% (Base, DS67 variable)

# Provisions
RATE_VACATIONS = Decimal("0.0417")       # Approx 15 days / 360 = 4.17% or 1/12? 
# Usually vacation cost is considering you pay 12 months for 11 months work. 
# Simplification: 1.25 days/month. Cost is ~4-5%. Let's use 1/12 (8.33%) if we want to cover replacement, 
# but usually it's just the time off. Let's use a standard provision factor.
# Prompt says "ADD PROVISIONS". I'll use 4.17% (15/360) for Vacations and 8.33% (1/12) for Indemnity.
RATE_INDEMNIFICATION = Decimal("0.0833") # 1 month per year

MONTHLY_HOURS = Decimal("180")

# Income Tax Table 2025 (Monthly Taxable Income in CLP) -> Factor, Deduction
# This changes monthly with UTM, but we will use fixed CLP ranges for this example based on approx UTM.
# Mock Table based on standard brackets
TAX_BRACKETS = [
    (Decimal("0"),       Decimal("0"),      Decimal("0")),
    (Decimal("850000"),  Decimal("0.04"),   Decimal("34000")),   # Exempt up to ~850k (approx 13.5 UTM)
    (Decimal("1890000"), Decimal("0.08"),   Decimal("109600")),
    (Decimal("3150000"), Decimal("0.135"),  Decimal("282850")),
    (Decimal("4400000"), Decimal("0.23"),   Decimal("700850")),
    (Decimal("5670000"), Decimal("0.304"),  Decimal("1120480")),
    (Decimal("7560000"), Decimal("0.35"),   Decimal("1468240")),
    (Decimal("18900000"),Decimal("0.40"),   Decimal("2413240")),
]

from app.services.mindicador_service import MindicadorService

def get_real_time_indicators() -> Dict[str, Decimal]:
    """
    Fetch UF, USD and UTM directly from mindicador.cl with automatic local fallback.
    """
    indicators = MindicadorService.get_indicators()
    return {
        "UF": Decimal(str(indicators.get("uf", UF_VALUE_MOCK))),
        "USD": Decimal(str(indicators.get("dolar", USD_VALUE_MOCK))),
        "UTM": Decimal(str(indicators.get("utm", 66000.0)))
    }

def calculate_monthly_tax(taxable_income: Decimal) -> Decimal:
    """
    Calculate Second Category Income Tax based on Taxable Income.
    Taxable Income = Gross - SocialSecurity.
    """
    for limit, factor, deduction in reversed(TAX_BRACKETS):
        if taxable_income > limit:
            return (taxable_income * factor) - deduction
    return Decimal("0")

def calculate_liquid(gross_salary: Decimal) -> Decimal:
    """
    Calculate Liquid Salary from Gross Salary.
    """
    social_security_worker = gross_salary * (RATE_AFP + RATE_HEALTH + RATE_AFC_WORKER)
    taxable_income = gross_salary - social_security_worker
    tax = calculate_monthly_tax(taxable_income)
    return taxable_income - tax

def calculate_gross_salary(liquid_salary: Decimal) -> Decimal:
    """
    Reverse calculate Gross Salary from Liquid Salary using binary search.
    """
    low = liquid_salary
    high = liquid_salary * Decimal("2.0") # Start with reasonable upper bound
    
    # Expand upper bound if needed
    while calculate_liquid(high) < liquid_salary:
        high *= Decimal("1.5")
        
    # Binary Search
    for _ in range(50): # 50 iterations is plenty for Decimal precision
        mid = (low + high) / Decimal("2")
        calculated = calculate_liquid(mid)
        if abs(calculated - liquid_salary) < Decimal("1.0"):
            return mid
        if calculated < liquid_salary:
            low = mid
        else:
            high = mid
            
    return (low + high) / Decimal("2")

def calculate_company_cost(liquid_salary: Decimal, role: str = "Employee") -> Dict[str, Any]:
    """
    Calculate the total company cost and hourly cost given a liquid salary.
    """
    # 1. Reverse Calculate Gross
    gross_salary = calculate_gross_salary(liquid_salary)
    
    # 2. Employer Costs
    sis = gross_salary * RATE_SIS
    afc_employer = gross_salary * RATE_AFC_EMPLOYER
    mutual = gross_salary * RATE_MUTUAL
    
    total_employer_laws = sis + afc_employer + mutual
    
    # 3. Provisions
    vacations = gross_salary * RATE_VACATIONS
    indemnification = gross_salary * RATE_INDEMNIFICATION
    
    total_provisions = vacations + indemnification
    
    # 4. Total Cost
    total_monthly_cost = gross_salary + total_employer_laws + total_provisions
    hourly_cost = total_monthly_cost / MONTHLY_HOURS
    
    return {
        "role": role,
        "liquid_salary": liquid_salary,
        "gross_salary": gross_salary.quantize(Decimal("1.00")),
        "employer_costs": total_employer_laws.quantize(Decimal("1.00")),
        "provisions": total_provisions.quantize(Decimal("1.00")),
        "total_monthly_cost": total_monthly_cost.quantize(Decimal("1.00")),
        "hourly_cost": hourly_cost.quantize(Decimal("1.00"))
    }
