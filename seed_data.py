"""
Seed script to populate the SQLite database with sample data.
Includes Clients, Projects, Resources and Tasks.
"""
import sys
import os
from datetime import date, timedelta

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, init_db
from app.models import (
    ClientProfile, Project, Currency, Methodology, 
    Task, TaskPriority, TaskStatus, Resource, ResourceType
)

def seed_db():
    print("[SEED] Starting database initialization...")
    init_db()
    db = SessionLocal()
    
    try:
        # 1. Create Clients
        print("[SEED] Creating clients...")
        client_mel = ClientProfile(name="MEL - Minera Escondida", rules_config={"accreditation_days": 15})
        client_codelco = ClientProfile(name="CODELCO Div. Ventanas", rules_config={"accreditation_days": 10})
        db.add_all([client_mel, client_codelco])
        db.commit()
        
        # 2. Create Projects
        print("[SEED] Creating projects...")
        p1 = Project(
            name="Nueva Sala MT Ventanas",
            client_id=client_codelco.id,
            currency=Currency.CLP,
            methodology=Methodology.PREDICTIVE
        )
        p2 = Project(
            name="Mantenimiento Subestación MEL",
            client_id=client_mel.id,
            currency=Currency.USD,
            methodology=Methodology.HYBRID
        )
        db.add_all([p1, p2])
        db.commit()
        
        # 3. Create Resources
        print("[SEED] Creating resources...")
        r1 = Resource(name="Hormigón H30", unit="m3", base_price=145000, currency=Currency.CLP, resource_type=ResourceType.MATERIAL)
        r2 = Resource(name="Maestro Liniero", unit="hr", base_price=9500, currency=Currency.CLP, resource_type=ResourceType.LABOR)
        r3 = Resource(name="Camión Pluma 5T", unit="dia", base_price=250000, currency=Currency.CLP, resource_type=ResourceType.EQUIPMENT)
        db.add_all([r1, r2, r3])
        db.commit()
        
        # 4. Create Tasks
        print("[SEED] Creating tasks...")
        today = date.today()
        t1 = Task(
            name="Excavación y Fundaciones",
            project_id=p1.id,
            start_date=today,
            end_date=today + timedelta(days=15),
            priority=TaskPriority.HIGH,
            status=TaskStatus.IN_PROGRESS,
            planned_value=50000000,
            earned_value=25000000
        )
        t2 = Task(
            name="Montaje de Estructuras",
            project_id=p1.id,
            start_date=today + timedelta(days=16),
            end_date=today + timedelta(days=30),
            priority=TaskPriority.MEDIUM,
            status=TaskStatus.PENDING,
            planned_value=40000000,
            earned_value=0
        )
        t3 = Task(
            name="Inspección de Equipos",
            project_id=p2.id,
            start_date=today,
            end_date=today + timedelta(days=5),
            priority=TaskPriority.HIGH,
            status=TaskStatus.DONE,
            planned_value=1500,
            earned_value=1500
        )
        db.add_all([t1, t2, t3])
        db.commit()
        
        print(f"[SEED] Success! Seeded {db.query(Project).count()} projects and {db.query(Task).count()} tasks.")
        
    except Exception as e:
        print(f"[ERROR] Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
