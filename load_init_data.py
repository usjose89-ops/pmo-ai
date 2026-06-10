import json
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, init_db
from app.models import CostParameter, Base
import decimal

def load_data():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Load JSON
        with open(r"c:\ConstructIA_MVP\data\parameters\epp_ropa_final.json", 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"Found {len(data)} items to load.")
        
        # Check if DB is empty to avoid duplicates
        count = db.query(CostParameter).count()
        if count > 0:
            print(f"Database already has {count} parameters. Skipping load.")
            return

        for item in data:
            # item keys: name, category, unit_price, duration_months, required_by, stock_buffer_rule
            
            # Create classification rules dict
            rules = {
                "duration_months": item["duration_months"],
                "required_by": item["required_by"],
                "stock_buffer_rule": item["stock_buffer_rule"]
            }
            
            param = CostParameter(
                name=item["name"],
                category=item["category"],
                unit="uni", # Defaulting to unit as per JSON
                value=decimal.Decimal(item["unit_price"]),
                classification_rules=rules,
                client_id=None # Global default
            )
            db.add(param)
        
        db.commit()
        print("Successfully loaded parameters into database.")
        
    except Exception as e:
        print(f"Error loading data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_data()
