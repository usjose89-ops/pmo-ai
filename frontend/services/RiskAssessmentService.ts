
export interface RiskModuleAssessment {
    moduleId: 'INGENIERIA' | 'ADQUISICIONES' | 'RRHH' | 'CONSTRUCCION' | 'FINANZAS' | 'HSEC';
    score: number; // 1-5
    aiScore?: number;
    weight: number; // 0-1 (Percentage)
    comments: string;
    actionPlan?: string;
}

export interface ProjectRiskProfile {
    projectId: number;
    modules: RiskModuleAssessment[];
    globalScore: number;
    lastUpdated: string;
}

const MOCK_RISK_PROFILES: Record<number, ProjectRiskProfile> = {
    5: { // Subestación O'Higgins
        projectId: 5,
        lastUpdated: new Date().toISOString(),
        globalScore: 0, // Calculated on runtime
        modules: [
            { moduleId: 'INGENIERIA', score: 2, weight: 0.15, comments: 'Planos aprobados.' },
            { moduleId: 'ADQUISICIONES', score: 4, weight: 0.20, comments: 'Retraso en cables de alta tensión.', actionPlan: 'Activar compra spot.' },
            { moduleId: 'RRHH', score: 1, weight: 0.10, comments: 'Dotación completa.' },
            { moduleId: 'CONSTRUCCION', score: 3, weight: 0.25, comments: 'Ritmo bajo por clima.' },
            { moduleId: 'FINANZAS', score: 2, weight: 0.20, comments: 'Flujo caja estable.' },
            { moduleId: 'HSEC', score: 1, weight: 0.10, comments: 'Sin accidentes.' }
        ]
    }
};

export const RiskAssessmentService = {
    getProjectRisk: (projectId: number): ProjectRiskProfile | null => {
        const profile = MOCK_RISK_PROFILES[projectId];
        if (!profile) return null;

        // Dynamic Calculation of Global Score (Weighted Average)
        let totalScore = 0;
        let totalWeight = 0;

        profile.modules.forEach(m => {
            totalScore += m.score * m.weight;
            totalWeight += m.weight;
        });

        profile.globalScore = parseFloat((totalScore / totalWeight).toFixed(1));
        return profile;
    },

    analyzeProjectWithAI: async (projectId: number): Promise<RiskModuleAssessment[]> => {
        // SIMULATED AI LATENCY
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real scenario, this would check specific DB tables
        // For MVP, we return deterministic "AI" suggestions based on the prompt examples.

        if (projectId === 5) {
            return [
                {
                    moduleId: 'ADQUISICIONES',
                    score: 4,
                    aiScore: 5,
                    weight: 0.20,
                    comments: 'Se detecta retraso en 3 órdenes de compra de Cables de Alta Tensión que impactan la Ruta Crítica.',
                    actionPlan: '1. Activar plan de aceleración con Proveedor X.\n2. Evaluar compra spot local.'
                },
                {
                    moduleId: 'RRHH',
                    score: 1,
                    aiScore: 2,
                    weight: 0.10,
                    comments: 'Alerta: 15% de exámenes de altura por vencer en 10 días.',
                    actionPlan: 'Programar operativos de salud esta semana.'
                }
            ];
        }

        return [];
    }
};
