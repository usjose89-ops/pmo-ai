-- 001 Core Architecture (Sprint 0)
-- Initializes the core Supabase/PostgreSQL schema for OHiggins PMO.

-- ENUMs (if any) or simply TEXT check constraints

-- ==========================================
-- 1. PROJECTS (Core Master)
-- ==========================================
CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    client_name text,
    contract_number text,
    location text,
    service_description text,
    start_date date,
    finish_date date,
    baseline_finish_date date,
    revised_finish_date date,
    bac_total numeric(18,2) DEFAULT 0,
    total_revenue numeric(18,2) DEFAULT 0,
    committed_margin numeric(18,2) DEFAULT 0,
    status text CHECK (status IN ('backlog', 'ejecución', 'cierre', 'cerrado', 'pausado')),
    cut_off_date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects accessible by authenticated users" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 2. ROLES CATALOG
-- ==========================================
CREATE TABLE public.roles_catalog (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    area text,
    active boolean DEFAULT true
);

ALTER TABLE public.roles_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Roles accessible by authenticated users" ON public.roles_catalog FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 3. PEOPLE
-- ==========================================
CREATE TABLE public.people (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    person_code text,
    full_name text NOT NULL,
    role_id uuid REFERENCES public.roles_catalog(id),
    employer_type text,
    employer_name text,
    contract_type text,
    status text,
    observations text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (project_id, person_code)
);

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "People accessible by authenticated users" ON public.people FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 4. WBS ITEMS (EDT)
-- ==========================================
CREATE TABLE public.wbs_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES public.wbs_items(id) ON DELETE CASCADE,
    wbs_code text NOT NULL,
    name text NOT NULL,
    level integer NOT NULL,
    item_type text CHECK (item_type IN ('chapter', 'account', 'work_package', 'control_account', 'cost_item')),
    sort_order integer DEFAULT 0,
    is_cost_account boolean DEFAULT false,
    is_schedule_item boolean DEFAULT false,
    active boolean DEFAULT true,
    UNIQUE (project_id, wbs_code)
);

ALTER TABLE public.wbs_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "WBS items accessible by authenticated users" ON public.wbs_items FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 5. BUDGET LINES
-- ==========================================
CREATE TABLE public.budget_lines (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    wbs_item_id uuid REFERENCES public.wbs_items(id) ON DELETE CASCADE,
    budget_category text,
    description text,
    bac_amount numeric(18,2) DEFAULT 0,
    committed_amount numeric(18,2) DEFAULT 0,
    eac_amount numeric(18,2) DEFAULT 0,
    vac_amount numeric(18,2) DEFAULT 0,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.budget_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Budget Lines accessible by authenticated users" ON public.budget_lines FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 6. ACTIVITIES (Planificación)
-- ==========================================
CREATE TABLE public.activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    source_plan text,
    activity_code text NOT NULL,
    wbs_code text,
    wbs_item_id uuid REFERENCES public.wbs_items(id) ON DELETE SET NULL,
    activity_name text NOT NULL,
    original_duration_days numeric(10,2) DEFAULT 0,
    remaining_duration_days numeric(10,2) DEFAULT 0,
    start_date date,
    finish_date date,
    total_float_days numeric(10,2) DEFAULT 0,
    performance_complete_pct numeric(7,2) DEFAULT 0,
    weight numeric(10,2) DEFAULT 0,
    actual_complete_pct numeric(7,2) DEFAULT 0,
    status text,
    baseline_flag boolean DEFAULT false,
    current_flag boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE (project_id, source_plan, activity_code)
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities accessible by authenticated users" ON public.activities FOR ALL USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_budget_lines_updated_at BEFORE UPDATE ON public.budget_lines FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
