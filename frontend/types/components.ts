export interface WBSItem {
    id: string;
    project_id: string;
    wbs_code: string;
    name: string;
    level: number;
    item_type: 'project' | 'phase' | 'work_package' | 'task';
}

export interface BudgetLine {
    id: string;
    project_id: string;
    wbs_item_id?: string;
    budget_category: string; // e.g. 'MATERIAL', 'LABOR', 'SUBCONTRACT', 'EQUIPMENT'
    description: string;
    bac_amount: number; // Budget at Completion
}
