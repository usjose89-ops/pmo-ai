export type RiskZone = 'Costera' | 'Valle Central' | 'Alta Montaña' | 'Urbana';

export interface Issue {
    id: string;
    title: string;
    probability: 1 | 2 | 3 | 4 | 5; // Y-Axis
    impact: 1 | 2 | 3 | 4 | 5;      // X-Axis
    financialImpact: number;        // Monto en Riesgo ($ CLP)
    isWeatherRelated: boolean;
}

export interface ProjectRiskData {
    projectId: string;
    projectName: string;
    zone: RiskZone;
    issues: Issue[];
}
