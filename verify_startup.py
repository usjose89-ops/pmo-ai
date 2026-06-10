from app.services.startup_manager import StartupManager
from datetime import date, timedelta

def test_startup_module():
    print("=== Testing Startup Module (Traffic Lights) ===")
    
    # 1. Test Checklist Loading
    print("\n[CHECKLIST LOADING]")
    mel_items = StartupManager.load_standard_checklist("MEL")
    print(f"Loaded {len(mel_items)} items for MEL. First item: {mel_items[0]['description']}")
    
    # 2. Test Traffic Light Logic
    print("\n[TRAFFIC LIGHT LOGIC]")
    today = date.today()
    
    # Case A: Completed
    res_a = StartupManager.calculate_traffic_light(today, "COMPLETED")
    print(f"Status: COMPLETED -> Color: {res_a} (Expected: GREEN)")
    
    # Case B: Pending, Blocking, Future
    res_b = StartupManager.calculate_traffic_light(today + timedelta(days=20), "PENDING", is_blocking=True)
    print(f"Status: PENDING, Blocking=True, Days=20 -> Color: {res_b} (Expected: RED)")
    
    # Case C: Pending, Non-Blocking, Expired
    res_c = StartupManager.calculate_traffic_light(today - timedelta(days=1), "PENDING", is_blocking=False)
    print(f"Status: PENDING, Days=-1 -> Color: {res_c} (Expected: RED)")
    
    # Case D: Pending, Non-Blocking, Urgent (5 days)
    res_d = StartupManager.calculate_traffic_light(today + timedelta(days=5), "PENDING", is_blocking=False)
    print(f"Status: PENDING, Days=5 -> Color: {res_d} (Expected: YELLOW)")
    
    # Case E: Pending, Non-Blocking, Safe (20 days)
    res_e = StartupManager.calculate_traffic_light(today + timedelta(days=20), "PENDING", is_blocking=False)
    print(f"Status: PENDING, Days=20 -> Color: {res_e} (Expected: GRAY)")

if __name__ == "__main__":
    test_startup_module()
