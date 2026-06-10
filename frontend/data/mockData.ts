import { Project, ProjectStatus } from '@/types/project';

export const MOCK_PROJECTS: Project[] = [
    {
        id: "6",
        name: 'Nueva Sala MT_Ventanas Feb26',
        subtitle: 'Nueva Sala Eléctrica MT N°2 (STN rev.1)',
        client: 'CODELCO Div. Ventanas',
        status: ProjectStatus.EN_ANALISIS,
        location: 'Ventanas, Valparaíso',
        start_date: '2026-06-01',
        technical_finish_date: '2026-12-31',
        admin_finish_date: '2027-01-30',
        risk_score: 3.5,
        risk_label: 'MEDIO',
        risk_explanation: 'El historial de pagos del cliente principal suele exceder los 60 días en proyectos anteriores similares, afectando el flujo de caja del proyecto.',
        advance_physical: 0,
        advance_financial: 0,
        evaluation_stage: 'Análisis de Bases',
        pipeline_status: 'En Revisión',
        financials: {
            total_revenue: 1450000000,
            total_cost: 0,
            gross_margin: 0,
            gross_margin_percent: 0,
            target_revenue: 1450000000,
            target_margin_percent: 15,
            currency: 'CLP',
            monthly_data: []
        },
        hr_metrics: {
            headcount: 45,
            total_hh: 8640,
            avg_cost_hh: 12500,
            productive_factor: 75
        }
    },
    {
        id: "7",
        name: 'Obras Civiles PTAS San Pedro',
        subtitle: 'Ampliación Planta de Tratamiento',
        client: 'Aguas Andinas',
        status: ProjectStatus.EN_ANALISIS,
        location: 'San Pedro, Región Metropolitana',
        start_date: '2026-08-01',
        technical_finish_date: '2027-05-30',
        admin_finish_date: '2027-06-30',
        risk_score: 4.8,
        risk_label: 'CRITICO',
        risk_explanation: 'Cliente conflictivo con alto índice de judicialización en contratos de obras civiles. Condiciones de terreno inciertas sin estudio geomecánico validado.',
        advance_physical: 0,
        advance_financial: 0,
        evaluation_stage: 'Presupuesto Presentado',
        pipeline_status: 'Stand By',
        financials: {
            total_revenue: 3500000000,
            total_cost: 0,
            gross_margin: 0,
            gross_margin_percent: 0,
            target_revenue: 3500000000,
            target_margin_percent: 22,
            currency: 'CLP',
            monthly_data: []
        },
        hr_metrics: {
            headcount: 120,
            total_hh: 45000,
            avg_cost_hh: 9800,
            productive_factor: 80
        }
    },
    {
        id: "4",
        name: 'TROLLEY',
        subtitle: 'Proyecto de Cierre',
        client: 'MEL',
        status: ProjectStatus.TERMINADO,
        location: 'Iquique, Tarapacá',
        start_date: '2023-08-15',
        technical_finish_date: '2025-06-15',
        admin_finish_date: '2025-08-30',
        risk_score: 4.2,
        risk_label: 'CRITICO',
        advance_physical: 98,
        advance_financial: 85,
        financials: {
            total_revenue: 7504000000,
            total_cost: 5067000000,
            gross_margin: 2438000000, // User specified 2438
            gross_margin_percent: 32.5, // 2438 / 7504 approx 32.48%
            target_revenue: 7504000000,
            target_margin_percent: 30,
            currency: 'CLP',
            monthly_data: [
                // 2024 (Margin 800 Recognized)
                { year: 2024, month: 'Dic', revenue: 2000000000, cost: 1200000000, margin: 800000000, projected_margin: 800000000 },
                // 2025 Data (Execution & Peak)
                { year: 2025, month: 'Ene', revenue: 450000000, cost: 300000000, margin: 150000000, projected_margin: 140000000 },
                { year: 2025, month: 'Feb', revenue: 480000000, cost: 320000000, margin: 160000000, projected_margin: 150000000 },
                { year: 2025, month: 'Mar', revenue: 500000000, cost: 350000000, margin: 150000000, projected_margin: 145000000 },
                { year: 2025, month: 'Abr', revenue: 520000000, cost: 380000000, margin: 140000000, projected_margin: 140000000 },
                { year: 2025, month: 'May', revenue: 480000000, cost: 340000000, margin: 140000000, projected_margin: 135000000 },
                { year: 2025, month: 'Jun', revenue: 400000000, cost: 280000000, margin: 120000000, projected_margin: 110000000 },
                // 2026 Data (Project Finished - No Revenue/Cost)
                // Removed 2026 data as project ended in 2025
            ]
        }
    },
    {
        id: "5",
        name: 'Subestación O´Higgins',
        subtitle: 'Construcción Proyecto Aumento de capacidad en BP1',
        client: 'MEL',
        status: ProjectStatus.ADJUDICADO_EN_CURSO,
        location: 'Antofagasta',
        start_date: '2026-02-01',
        technical_finish_date: '2026-12-20',
        admin_finish_date: '2027-02-28',
        risk_score: 2.1,
        risk_label: 'BAJO',
        advance_physical: 0,
        advance_financial: 0,
        financials: {
            total_revenue: 2450000000,
            total_cost: 1800000000,
            gross_margin: 650000000,
            gross_margin_percent: 26.5,
            target_revenue: 2450000000,
            target_margin_percent: 25,
            currency: 'CLP',
            monthly_data: [
                // 2025 Data (Pre-Construction/Empty)
                { year: 2025, month: 'Ene', revenue: 0, cost: 0, margin: 0, projected_margin: 0 },
                { year: 2025, month: 'Feb', revenue: 0, cost: 0, margin: 0, projected_margin: 0 },
                { year: 2025, month: 'Mar', revenue: 0, cost: 0, margin: 0, projected_margin: 0 },
                { year: 2025, month: 'Abr', revenue: 0, cost: 0, margin: 0, projected_margin: 0 },
                { year: 2025, month: 'May', revenue: 0, cost: 0, margin: 0, projected_margin: 0 },
                { year: 2025, month: 'Jun', revenue: 0, cost: 0, margin: 0, projected_margin: 0 },
                // 2026 Data (Active Construction)
                { year: 2026, month: 'Ene', revenue: 50000000, cost: 40000000, margin: 10000000, projected_margin: 12000000 },
                { year: 2026, month: 'Feb', revenue: 80000000, cost: 60000000, margin: 20000000, projected_margin: 18000000 },
                { year: 2026, month: 'Mar', revenue: 120000000, cost: 100000000, margin: 20000000, projected_margin: 25000000 },
                { year: 2026, month: 'Abr', revenue: 150000000, cost: 110000000, margin: 40000000, projected_margin: 35000000 },
                { year: 2026, month: 'May', revenue: 200000000, cost: 150000000, margin: 50000000, projected_margin: 48000000 },
                { year: 2026, month: 'Jun', revenue: 250000000, cost: 180000000, margin: 70000000, projected_margin: 60000000 }
            ]
        }
    }
];

export const MOCK_PROJECT = MOCK_PROJECTS[0]; // Keep backward compatibility for now
