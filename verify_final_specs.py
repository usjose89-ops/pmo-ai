from datetime import date
from decimal import Decimal
from app.services.hr_compliance import WorkerComplianceService
from app.services.intelligence_service import IntelligenceService

def test_final_specs():
    print("=== Testing Final Specifications (HR & Intelligence) ===")
    
    # --- PART 1: HR COMPLIANCE ---
    print("\n[MÓDULO 2: HR COMPLIANCE]")
    
    worker = {
        "id": 1, 
        "name": "Juan Pérez",
        "exams": [
            {"name": "Batería 3D", "expiration_date": date(2026, 6, 1)},
            {"name": "Examen Altura", "expiration_date": date(2026, 4, 1)} # Expires April
        ],
        "inductions": [
            {"name": "Cero Daño", "status": "VALID"}
        ]
    }
    
    # 1.1 Valid Date
    task_date_ok = date(2026, 3, 15)
    res_ok = WorkerComplianceService.validate_worker_eligibility(worker, task_date_ok)
    print(f"Task Date {task_date_ok}: {res_ok['allowed']} (Reason: {res_ok['block_reason']}) [Expected: True]")
    
    # 1.2 Expired Exam
    task_date_fail = date(2026, 5, 20)
    res_fail = WorkerComplianceService.validate_worker_eligibility(worker, task_date_fail)
    print(f"Task Date {task_date_fail}: {res_fail['allowed']} (Reason: {res_fail['block_reason']}) [Expected: False - Examen Altura]")
    
    # --- PART 2: INTELLIGENCE SERVICE ---
    print("\n[MÓDULO PMO AI: INTELLIGENCE]")
    
    # 2.1 Predictive Risk Factor
    client = "MEL"
    zone = "Alta Montaña"
    print(f"Analyzing History for Client: {client}, Zone: {zone}...")
    suggestion = IntelligenceService.get_historical_suggestions(client, zone)
    print(f"Suggestion: {suggestion['risk_factor']}")
    print(f"Reason: {suggestion['reason']}")
    
    # 2.2 Watchdog Alert
    item = "Hormigón H30"
    quote = Decimal("120000")
    print(f"\nChecking Quote: {item} at ${quote} in {zone}...")
    alert = IntelligenceService.check_unit_price_alert(item, quote, zone)
    print(f"Alert: {alert}")

if __name__ == "__main__":
    test_final_specs()
