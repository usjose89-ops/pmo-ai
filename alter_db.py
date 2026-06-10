import psycopg2
import sys

def main():
    try:
        # Connect to Supabase
        conn = psycopg2.connect("postgresql://postgres:Chile2026%23%24%25@db.jcmjepvpzygtsmpvudob.supabase.co:5432/postgres")
        conn.autocommit = True
        cur = conn.cursor()
        
        # Add missing columns
        alter_queries = [
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS subtitle text;",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS location text;",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technical_finish_date date;",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS admin_finish_date date;",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS risk_score numeric(3,1);",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS risk_explanation text;",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS evaluation_stage text;",
            "ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS pipeline_status text;"
        ]
        
        for q in alter_queries:
            cur.execute(q)
            print(f"Executed: {q}")
            
        cur.close()
        conn.close()
        print("Database altered successfully!")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
