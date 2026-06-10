import { ProjectRiskData, Issue } from '../types/risk';

export interface Insight {
    indicator_id: string; // 'global_var' | 'weather' | 'resources'
    status: 'CRITICAL' | 'WARNING' | 'OK';
    analysis: {
        explanation: string;
        recommendation: string;
        priority_score: number;
    };
}

export const RiskAnalysisEngine = {
    /**
     * Analyzes the Global VaR (Value at Risk) to generate insights.
     */
    analyzeFinancialRisk: (globalVaR: number, projects: ProjectRiskData[]): Insight | null => {
        if (globalVaR > 50000000) {
            // Find the biggest contributor
            let maxImpact = 0;
            let culpritIssue: Issue | null = null;
            let culpritProject = '';

            projects.forEach(p => {
                p.issues.forEach(i => {
                    if (i.financialImpact > maxImpact) {
                        maxImpact = i.financialImpact;
                        culpritIssue = i;
                        culpritProject = p.projectName;
                    }
                });
            });

            if (culpritIssue) {
                return {
                    indicator_id: 'global_var',
                    status: 'CRITICAL',
                    analysis: {
                        explanation: `El capital en riesgo supera el umbral crítico ($50MM), impulsado principalmente por '${(culpritIssue as Issue).title}' en el proyecto ${culpritProject}.`,
                        recommendation: "Agendar reunión de directorio con Contraparte Contractual para firmar Adicionales pendientes antes del cierre de mes.",
                        priority_score: 95
                    }
                };
            }
        }
        return null;
    },

    /**
     * Analyzes Weather Risks based on alert presence.
     */
    analyzeWeatherRisk: (alerts: string[], currentMonthIndex: number): Insight | null => {
        if (alerts.length > 0) {
            const isWinter = currentMonthIndex >= 4 && currentMonthIndex <= 7;
            const season = isWinter ? 'invierno' : 'verano';

            return {
                indicator_id: 'weather',
                status: 'WARNING',
                analysis: {
                    explanation: `Se detectan ${alerts.length} alertas activas en zona Cordillera/Valle durante temporada de ${season}, afectando la continuidad operacional.`,
                    recommendation: "1. Reprogramar actividades de izaje crítico. 2. Reforzar stock de combustible y EPP térmico en campamento.",
                    priority_score: 80
                }
            };
        }
        return null;
    },

    /**
     * Analyzes Resource/HR Risks (Mocked for now as we don't have deep HR data in this aggregate)
     */
    analyzeResourceRisk: (projects: ProjectRiskData[]): Insight | null => {
        // Mock check: if any project has > 5 issues
        const stressedProject = projects.find(p => p.issues.length >= 5);
        if (stressedProject) {
            return {
                indicator_id: 'resources',
                status: 'WARNING',
                analysis: {
                    explanation: `El proyecto ${stressedProject.projectName} reporta múltiples frentes con baja productividad (>${stressedProject.issues.length} incidentes).`,
                    recommendation: "Auditar el proceso de 'Hoja de Ruta' en el Módulo 2 para destrabar ingresos pendientes.",
                    priority_score: 75
                }
            };
        }
        return null;
    }
};
