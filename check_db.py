import psycopg2
import sys
import os
from dotenv import load_dotenv

def main():
    load_dotenv()
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:54322/postgres")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print("=== CONEXIÓN EXITOSA A SUPABASE (POSTGRESQL) ===")
        
        # Check tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        tables = [row[0] for row in cur.fetchall()]
        print("\nTablas creadas en el esquema público:")
        for t in tables:
            print(f"- {t}")
            
        # Verify seeded projects
        if 'projects' in tables:
            cur.execute("SELECT code, name, status, bac_total FROM projects;")
            projects = cur.fetchall()
            print("\nProyectos Sembrados (Seed Data):")
            for p in projects:
                print(f"[{p[0]}] {p[1]} | Estado: {p[2]} | BAC: ${p[3]}")
                
        # Verify wbs items
        if 'wbs_items' in tables:
            cur.execute("SELECT wbs_code, name FROM wbs_items;")
            wbs = cur.fetchall()
            print("\nPartidas WBS (Estructura de Desglose):")
            for w in wbs:
                print(f"- {w[0]}: {w[1]}")
                
        # Verify RLS policies
        cur.execute("""
            SELECT tablename, policyname 
            FROM pg_policies 
            WHERE schemaname = 'public';
        """)
        policies = cur.fetchall()
        print("\nPolíticas RLS Activas (Seguridad):")
        for p in policies:
            print(f"- Tabla {p[0]}: {p[1]}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error verificando DB: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
