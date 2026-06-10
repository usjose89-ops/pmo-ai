from datetime import date, timedelta
from app.models import Task, APU
from app.services.scheduler import Scheduler
from app.services.auditor import Auditor
from app.services.logistics import LogisticsCalculator

# Mock Session
class MockSession:
    def query(self, *args): return self
    def join(self, *args): return self
    def filter(self, *args): return self
    def all(self): return []
    def get(self, model, id): return None 

def test_engines():
    print("Testing Scheduler, Auditor, and Logistics...")

    # 1. Setup Mock Tasks
    t1 = Task(id=1, name="Excavation", start_date=date(2026, 3, 1), end_date=date(2026, 3, 5), dependencies={})
    t2 = Task(id=2, name="Foundation", start_date=date(2026, 3, 1), end_date=date(2026, 3, 1), dependencies={"predecessors": [1]}) # Duration will be calced
    t3 = Task(id=3, name="Walls", start_date=date(2026, 3, 1), end_date=date(2026, 3, 1), dependencies={"predecessors": [2]})
    
    # Set durations via end_date for mock (since Scheduler uses end-start)
    # T1: 4 days. T2: Let's say 3 days. T3: 5 days.
    # In pure Scheduler logic, we might Input Duration instead of Dates, but Model uses Dates.
    # Scheduler.calculate_dates is supposed to OVERWRITE these based on CPM.
    # But it needs 'duration' from somewhere. It inferred it from the initial object dates.
    # Let's ensure initial objects have "Duration" represented by start/end delta.
    t2.end_date = t2.start_date + timedelta(days=3)
    t3.end_date = t3.start_date + timedelta(days=5)

    tasks = [t1, t2, t3]

    # 2. Test Scheduler
    scheduler = Scheduler(tasks)
    schedule = scheduler.calculate_dates(project_start_date=date(2026, 3, 1))
    
    print("\n--- CPM Schedule ---")
    for tid, dates in schedule.items():
        print(f"Task {tid}: ES={dates['ES']} EF={dates['EF']}")
        
    # Validation: T1 (03-01 to 03-05) -> T2 (Starts 03-05) -> T3 (Starts 03-08)
    
    # 3. Test Auditor
    print("\n--- Auditor Report ---")
    auditor = Auditor(MockSession(), project_id=1)
    report = auditor.sanity_check_project(tasks)
    print(report)
    
    # 4. Test Logistics
    print("\n--- Logistics ---")
    log_calc = LogisticsCalculator(MockSession())
    travel_cost = log_calc.calculate_travel_logistics(headcount=10, shift_system="7x7")
    print(f"Travel Cost (10 pax, 7x7): {travel_cost}")

if __name__ == "__main__":
    test_engines()
