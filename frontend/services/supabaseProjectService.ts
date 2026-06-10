import { createClient } from '@/utils/supabase/client';
import { Project, ProjectStatus } from '@/types/project';

export const supabaseProjectService = {
  getProjects: async (): Promise<Project[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    // Map DB fields to Frontend Project Interface
    return (data || []).map((dbProj: any) => ({
      id: dbProj.id,
      name: dbProj.name,
      subtitle: dbProj.subtitle || '',
      client: dbProj.client,
      location: dbProj.location || 'No especificada',
      status: (dbProj.status as ProjectStatus) || ProjectStatus.EN_ANALISIS,
      start_date: dbProj.start_date || new Date().toISOString().split('T')[0],
      technical_finish_date: dbProj.technical_finish_date || '',
      admin_finish_date: dbProj.admin_finish_date || '',
      risk_score: dbProj.risk_score || 0,
      risk_label: dbProj.risk_label || 'BAJO',
      risk_explanation: dbProj.risk_explanation || '',
      advance_physical: dbProj.advance_physical || 0,
      advance_financial: dbProj.advance_financial || 0,
      financials: dbProj.financials || {
        total_revenue: 0,
        total_cost: 0,
        gross_margin: 0,
        gross_margin_percent: 0,
        target_revenue: 0,
        target_margin_percent: 0,
        currency: 'CLP'
      },
      hr_metrics: dbProj.hr_metrics || {
        headcount: 0,
        total_hh: 0,
        avg_cost_hh: 0,
        productive_factor: 0
      }
    }));
  },

  createProject: async (project: Partial<Project>): Promise<Project | null> => {
    const supabase = createClient();
    
    // Convert frontend structure to DB structure
    const dbPayload = {
      name: project.name,
      code: `PRJ-${Math.floor(Math.random() * 1000)}`, // Simple auto-code for now
      client: project.client,
      status: project.status,
      start_date: project.start_date,
      subtitle: project.subtitle,
      location: project.location,
      technical_finish_date: project.technical_finish_date,
      admin_finish_date: project.admin_finish_date,
      risk_score: project.risk_score,
      risk_explanation: project.risk_explanation,
      evaluation_stage: project.evaluation_stage,
      pipeline_status: project.pipeline_status,
      risk_label: project.risk_label,
      advance_physical: project.advance_physical || 0,
      advance_financial: project.advance_financial || 0,
      financials: project.financials,
      hr_metrics: project.hr_metrics
      // location, subtitle, risk_score are not natively in the DB init script, but Supabase JSONB or adding columns works.
      // For now we pass what the DB has. If it throws error on extra columns, we should only pass valid columns.
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return data;
  },

  getProject: async (id: string | number): Promise<Project | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id.toString())
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      subtitle: data.subtitle || '',
      client: data.client,
      location: data.location || 'No especificada',
      status: data.status,
      start_date: data.start_date,
      technical_finish_date: data.technical_finish_date || '',
      admin_finish_date: data.admin_finish_date || '',
      risk_score: data.risk_score || 0,
      risk_label: data.risk_label || 'BAJO',
      risk_explanation: data.risk_explanation || '',
      evaluation_stage: data.evaluation_stage,
      pipeline_status: data.pipeline_status,
      advance_physical: data.advance_physical || 0,
      advance_financial: data.advance_financial || 0,
      financials: data.financials || {
        total_revenue: 0,
        total_cost: 0,
        gross_margin: 0,
        gross_margin_percent: 0,
        target_revenue: 0,
        target_margin_percent: 0,
        currency: 'CLP'
      },
      hr_metrics: data.hr_metrics || {
        headcount: 0,
        total_hh: 0,
        avg_cost_hh: 0,
        productive_factor: 0
      }
    } as Project;
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<Project | null> => {
    const supabase = createClient();
    
    // Convert frontend structure to DB structure
    const dbPayload = {
      name: project.name,
      client: project.client,
      status: project.status,
      start_date: project.start_date,
      subtitle: project.subtitle,
      location: project.location,
      technical_finish_date: project.technical_finish_date,
      admin_finish_date: project.admin_finish_date,
      risk_score: project.risk_score,
      risk_explanation: project.risk_explanation,
      evaluation_stage: project.evaluation_stage,
      pipeline_status: project.pipeline_status,
      risk_label: project.risk_label,
      advance_physical: project.advance_physical,
      advance_financial: project.advance_financial,
      financials: project.financials,
      hr_metrics: project.hr_metrics
    };

    const { data, error } = await supabase
      .from('projects')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }

    return data;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  }
};
