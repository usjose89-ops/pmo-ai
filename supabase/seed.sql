-- Seed dummy data into Supabase PMO DB

INSERT INTO public.projects (id, code, name, start_date, bac_total, status)
VALUES 
('d5059e87-a22b-426c-85bd-4e2b02a28114', 'PRO-2026-001', 'Edificio Mirador Norte', '2026-01-15', 550000000, 'ejecución'),
('b82f0d98-1e4e-4e4b-912a-36195c80ed25', 'MIN-2026-089', 'Mantenimiento Chancador MEL', '2026-03-01', 125000000, 'ejecución')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.wbs_items (id, project_id, wbs_code, name, level, item_type)
VALUES 
('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'd5059e87-a22b-426c-85bd-4e2b02a28114', '1.1', 'Obras Preliminares', 1, 'chapter'),
('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'd5059e87-a22b-426c-85bd-4e2b02a28114', '1.2', 'Excavaciones y Fundaciones', 1, 'chapter')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.budget_lines (project_id, wbs_item_id, budget_category, description, bac_amount)
VALUES 
('d5059e87-a22b-426c-85bd-4e2b02a28114', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'Directo', 'Instalación de Faenas', 15000000),
('d5059e87-a22b-426c-85bd-4e2b02a28114', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b2b', 'Directo', 'Excavación Masiva', 18000000);
