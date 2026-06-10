
export enum ProjectStatus {
    // Etapa 1.1: Pre-Venta / Análisis
    EN_ANALISIS = 'EN_ANALISIS',
    DESECHADO_RIESGO = 'DESECHADO_RIESGO',
    DESECHADO_COSTO = 'DESECHADO_COSTO',
    DESECHADO_CLIENTE = 'DESECHADO_CLIENTE',

    // Etapa 1.2: Licitación
    EN_LICITACION = 'EN_LICITACION',
    NO_ADJUDICADO = 'NO_ADJUDICADO',
    LICITACION_DESIERTA = 'LICITACION_DESIERTA',

    // Etapa 2.1: Ejecución
    ADJUDICADO_EN_CURSO = 'ADJUDICADO_EN_CURSO', // Start Active Projects here

    // Etapa 2.2: Cierre
    TERMINADO = 'TERMINADO', // Closed/Historical

    // Legacy mapping (Optional, can be removed if all data migrated)
    // CIERRE_ADMINISTRATIVO mapped to TERMINADO
    // OFERTA_ADJUDICADA mapped to ADJUDICADO_EN_CURSO
}

export interface MonthlyFinancial {
    year: number; // e.g., 2025, 2026
    month: string; // "Just use a deterministic string format like 'Jan' or full name, consistency key"
    revenue: number;
    cost: number;
    margin: number;
    projected_margin: number; // For budget comparison
}

export interface ProjectFinancials {
    total_revenue: number; // Ingreso Contrato + Adicionales
    total_cost: number;    // Costo Real + Comprometido
    gross_margin: number;  // Revenue - Cost
    gross_margin_percent: number; // (Margin / Revenue) * 100
    target_revenue: number;
    target_margin_percent: number;
    currency: 'CLP' | 'USD' | 'UF';
    spi?: number;
    cpi?: number;
    monthly_data?: MonthlyFinancial[]; // Optional for backward compatibility
}

export interface ProjectHRMetrics {
    headcount: number;
    total_hh: number;
    avg_cost_hh: number;
    productive_factor: number;
}

export interface Project {
    id: string;
    name: string;
    subtitle?: string;
    client: string;
    location: string;
    status: ProjectStatus;

    // Dates
    start_date: string;
    technical_finish_date: string; // Término Terreno
    admin_finish_date: string;     // Cierre Admin

    // Risk & Progress
    risk_score: number; // Global Risk Score (1-5) calculated by AI
    risk_label: 'BAJO' | 'MEDIO' | 'CRITICO';
    risk_explanation?: string; // Optional detailed explanation for matrix
    advance_physical: number; // %
    advance_financial: number; // %

    // Pipeline Data (Only required for EN_ANALISIS / EN_LICITACION)
    evaluation_stage?: 'Análisis de Bases' | 'Presupuesto Realizado' | 'Presupuesto Presentado' | 'En Espera de Cierre';
    pipeline_status?: 'Aprobado' | 'Desechado' | 'Stand By' | 'Desierta' | 'En Revisión';

    // Financials
    financials: ProjectFinancials;
    hr_metrics?: ProjectHRMetrics;
}
