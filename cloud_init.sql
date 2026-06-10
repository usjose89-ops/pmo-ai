-- 1. CREACIÓN DE LA ARQUITECTURA CORE
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    start_date date,
    bac_total numeric(18,2) DEFAULT 0,
    status text DEFAULT 'planificación',
    client text,
    risk_label text,
    advance_physical numeric(5,2) DEFAULT 0,
    advance_financial numeric(5,2) DEFAULT 0,
    financials jsonb DEFAULT '{}'::jsonb,
    hr_metrics jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.wbs_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    wbs_code text NOT NULL,
    name text NOT NULL,
    level integer NOT NULL,
    item_type text DEFAULT 'work_package'
);

CREATE TABLE IF NOT EXISTS public.budget_lines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    wbs_item_id uuid REFERENCES public.wbs_items(id) ON DELETE CASCADE,
    budget_category text NOT NULL,
    description text NOT NULL,
    bac_amount numeric(18,2) DEFAULT 0
);

-- 2. HABILITAR PERMISOS (Lectura y Escritura Anónima temporal para MVP)
CREATE POLICY "Allow anon select on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow anon insert on projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on projects" ON public.projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete on projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Allow anon select on wbs_items" ON public.wbs_items FOR SELECT USING (true);
CREATE POLICY "Allow anon select on budget_lines" ON public.budget_lines FOR SELECT USING (true);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wbs_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_lines ENABLE ROW LEVEL SECURITY;

-- 3. INYECTAR DATOS DE PRUEBA REALES (DEL NEXT.JS MOCK)
-- Borrar datos viejos
TRUNCATE TABLE public.budget_lines CASCADE;
TRUNCATE TABLE public.wbs_items CASCADE;
TRUNCATE TABLE public.projects CASCADE;

INSERT INTO public.projects (id, code, name, client, status, risk_label, advance_physical, advance_financial, financials, hr_metrics)
VALUES 
(
    '11111111-1111-1111-1111-111111111111', 
    'PRJ-001', 
    'Nueva Sala MT_Ventanas Feb26', 
    'CODELCO Div. Ventanas', 
    'EN_ESTUDIO', 
    'MEDIO', 
    0, 0, 
    '{"total_revenue": 1450000000, "total_cost": 0, "gross_margin": 0, "gross_margin_percent": 0, "target_revenue": 1450000000, "target_margin_percent": 15, "spi": 1.0, "cpi": 1.0}', 
    '{"headcount": 45, "total_hh": 8640, "avg_cost_hh": 12500, "productive_factor": 0.75}'
),
(
    '22222222-2222-2222-2222-222222222222', 
    'PRJ-002', 
    'Obras Civiles PTAS San Pedro', 
    'Aguas Andinas', 
    'EN_ESTUDIO', 
    'CRITICO', 
    0, 0, 
    '{"total_revenue": 3500000000, "total_cost": 0, "gross_margin": 0, "gross_margin_percent": 0, "target_revenue": 3500000000, "target_margin_percent": 22, "spi": 1.0, "cpi": 1.0}', 
    '{"headcount": 120, "total_hh": 45000, "avg_cost_hh": 9800, "productive_factor": 0.80}'
),
(
    '33333333-3333-3333-3333-333333333333', 
    'PRJ-003', 
    'TROLLEY', 
    'MEL', 
    'TERMINADO', 
    'CRITICO', 
    98, 85, 
    '{"total_revenue": 7504000000, "total_cost": 5067000000, "gross_margin": 2438000000, "gross_margin_percent": 32.5, "target_revenue": 7504000000, "target_margin_percent": 30, "spi": 0.64, "cpi": 0.93}', 
    '{"headcount": 140, "total_hh": 65000, "avg_cost_hh": 39500, "productive_factor": 0.82}'
),
(
    '44444444-4444-4444-4444-444444444444', 
    'PRJ-004', 
    'Subestación O´Higgins', 
    'MEL', 
    'ACTIVO', 
    'BAJO', 
    15, 12, 
    '{"total_revenue": 2450000000, "total_cost": 1800000000, "gross_margin": 650000000, "gross_margin_percent": 26.5, "target_revenue": 2450000000, "target_margin_percent": 25, "spi": 1.02, "cpi": 1.05}', 
    '{"headcount": 1690, "total_hh": 247700, "avg_cost_hh": 40.25, "productive_factor": 0.85}'
);
