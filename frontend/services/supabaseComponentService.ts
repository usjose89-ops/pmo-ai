import { createClient } from '@/utils/supabase/client';
import { WBSItem, BudgetLine } from '@/types/components';

export const supabaseComponentService = {
  getWBSItems: async (projectId: string): Promise<WBSItem[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('wbs_items')
      .select('*')
      .eq('project_id', projectId)
      .order('wbs_code', { ascending: true });

    if (error) {
      console.error('Error fetching WBS items:', error);
      return [];
    }
    return data || [];
  },

  createWBSItem: async (item: Partial<WBSItem>): Promise<WBSItem | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('wbs_items')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error creating WBS item:', error);
      return null;
    }
    return data;
  },

  deleteWBSItem: async (id: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
      .from('wbs_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting WBS item:', error);
      return false;
    }
    return true;
  },

  getBudgetLines: async (projectId: string): Promise<BudgetLine[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budget_lines')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching budget lines:', error);
      return [];
    }
    return data || [];
  },

  createBudgetLine: async (line: Partial<BudgetLine>): Promise<BudgetLine | null> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budget_lines')
      .insert([line])
      .select()
      .single();

    if (error) {
      console.error('Error creating budget line:', error);
      return null;
    }
    return data;
  },

  deleteBudgetLine: async (id: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
      .from('budget_lines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting budget line:', error);
      return false;
    }
    return true;
  }
};
