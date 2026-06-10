from app.database import engine
from app.models import Base

# This will create any missing tables defined in models.py
# It does NOT drop existing tables or delete existing data.
print("Migrating ConstructIA local SQLite schema...")
Base.metadata.create_all(bind=engine)
print("Migration completed successfully! New tables integrated.")
