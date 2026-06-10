-- Allow anonymous reads for public dashboard MVP
CREATE POLICY "Allow anon select on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow anon select on wbs_items" ON public.wbs_items FOR SELECT USING (true);
CREATE POLICY "Allow anon select on budget_lines" ON public.budget_lines FOR SELECT USING (true);
