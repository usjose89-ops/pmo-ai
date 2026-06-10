import psycopg2
import sys

def main():
    try:
        conn = psycopg2.connect("postgresql://postgres:postgres@127.0.0.1:54322/postgres")
        conn.autocommit = True
        cur = conn.cursor()
        
        # Read the migration and seed
        with open('supabase/migrations/20260608000002_allow_anon_reads.sql', 'r', encoding='utf-8') as f:
            mig_sql = f.read()
            
        with open('supabase/seed.sql', 'r', encoding='utf-8') as f:
            seed_sql = f.read()
            
        cur.execute(mig_sql)
        print("Applied anon reads policy.")
        
        cur.execute(seed_sql)
        print("Seeded data.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
