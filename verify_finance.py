from app.services.finance_service import FinanceService
from decimal import Decimal

def test_finance_mvp():
    print("=== Testing FinanceService (MVP) ===")
    
    # 1. Test Indicators
    indicators = FinanceService.get_real_time_indicators()
    print(f"\n[INDICATORS] {indicators}")
    
    # 2. Test Currency Conversion
    val_uf = Decimal("10")
    val_clp = FinanceService.convert_currency(val_uf, "UF", "CLP")
    print(f"\n[CONVERSION] {val_uf} UF -> {val_clp:,.2f} CLP (Expected: {val_uf * FinanceService.UF_VALUE})")
    
    # 3. Test Cost Calculation
    liquid_salary = Decimal("1000000")
    print(f"\n[COST CALCULATION] Input Liquid Salary: {liquid_salary:,.0f} CLP")
    
    # Role: Standard
    hourly_standard = FinanceService.calculate_company_cost(liquid_salary, role="Carpenter")
    print(f" -> Role 'Carpenter' (Standard Risk): {hourly_standard:,.2f} CLP/hr")
    
    # Role: Mining (High Risk Mutual)
    hourly_mining = FinanceService.calculate_company_cost(liquid_salary, role="Jefe Faena Minera")
    print(f" -> Role 'Minera' (High Risk):       {hourly_mining:,.2f} CLP/hr")
    
    print("\nTest Complete.")

if __name__ == "__main__":
    test_finance_mvp()
