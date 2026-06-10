from app.services.scheduler_engine import SchedulerEngine
import datetime

def test_scheduler():
    print("=== Testing CPM Scheduler ===")
    
    start_date = datetime.date(2026, 3, 1)
    
    # Task List (A -> B -> D, A -> C -> D)
    # A: 5 days
    # B: 3 days
    # C: 10 days (Longer path)
    # D: 2 days
    tasks = [
        {"id": 1, "name": "Task A: Start", "duration": 5, "dependencies": []},
        {"id": 2, "name": "Task B: Short Path", "duration": 3, "dependencies": [1]},
        {"id": 3, "name": "Task C: Long Path", "duration": 10, "dependencies": [1]},
        {"id": 4, "name": "Task D: Finish", "duration": 2, "dependencies": [2, 3]},
    ]
    
    print("Running Calculation...")
    results = SchedulerEngine.calculate_critical_path(tasks, start_date)
    
    print("\n[RESULTS]")
    print(f"{'ID':<4} {'Name':<20} {'Dur':<4} {'ES':<3} {'EF':<3} {'LS':<3} {'LF':<3} {'Float':<6} {'Critical'}")
    print("-" * 75)
    
    for t in results:
        crit_mark = "*" if t["is_critical"] else ""
        print(f"{t['id']:<4} {t['name']:<20} {t['duration']:<4} {t['early_start']:<3} {t['early_finish']:<3} {t['late_start']:<3} {t['late_finish']:<3} {t['total_float']:<6} {crit_mark}")

if __name__ == "__main__":
    test_scheduler()
