import { ProjectRiskData, RiskZone, Issue } from '../types/risk';

// --- MOCK DATA SOURCE (Simulating Database) ---
const MOCK_PROJECTS_DATA: ProjectRiskData[] = [
    {
        projectId: '1',
        projectName: 'Edificio Mirador Norte',
        zone: 'Alta Montaña',
        issues: [
            { id: 'i1', title: 'Riesgo de Avalancha en Acceso', probability: 5, impact: 5, financialImpact: 120000000, isWeatherRelated: true },
            { id: 'i2', title: 'Retraso en Entrega Aceros', probability: 3, impact: 4, financialImpact: 45000000, isWeatherRelated: false },
            { id: 'i3', title: 'Falla en Generador Principal', probability: 2, impact: 5, financialImpact: 15000000, isWeatherRelated: false }
        ]
    },
    {
        projectId: '2',
        projectName: 'Puente Loncomilla 2',
        zone: 'Costera',
        issues: [
            { id: 'i4', title: 'Marejadas Anormales', probability: 4, impact: 5, financialImpact: 85000000, isWeatherRelated: true },
            { id: 'i5', title: 'Corrosión Prematura', probability: 3, impact: 3, financialImpact: 12000000, isWeatherRelated: true }
        ]
    },
    {
        projectId: '3',
        projectName: 'Centro Logístico Sur',
        zone: 'Urbana',
        issues: [
            { id: 'i6', title: 'Huelga Sindical', probability: 5, impact: 5, financialImpact: 250000000, isWeatherRelated: false },
            { id: 'i7', title: 'Multa Municipal', probability: 2, impact: 2, financialImpact: 3500000, isWeatherRelated: false }
        ]
    }
];

export const RiskAggregatorService = {
    // 1. Fetch All Data
    getAllProjectsRiskData: (): ProjectRiskData[] => {
        return MOCK_PROJECTS_DATA;
    },

    // 2. Global VaR Calculation
    calculateGlobalVaR: (): number => {
        let totalVaR = 0;
        MOCK_PROJECTS_DATA.forEach(p => {
            p.issues.forEach(i => totalVaR += i.financialImpact);
        });
        return totalVaR;
    },

    // 3. Get Matrix Data (Aggregated Counts only)
    getMatrixData: () => {
        // Initialize 5x5 grid (1-based index for logic simplicity in keys)
        const grid: Record<string, { count: number, risks: { project: string, title: string, amount: number }[] }> = {};

        // Populate grid
        MOCK_PROJECTS_DATA.forEach(p => {
            p.issues.forEach(i => {
                const key = `${i.impact}-${i.probability}`; // X-Y
                if (!grid[key]) {
                    grid[key] = { count: 0, risks: [] };
                }
                grid[key].count++;
                grid[key].risks.push({
                    project: p.projectName,
                    title: i.title,
                    amount: i.financialImpact
                });
            });
        });

        return grid;
    },

    // 4. Get Weather Alerts based on Simulator
    getWeatherAlerts: (monthIndex: number): string[] => {
        const alerts: string[] = [];

        // Month index 0-11 (0 = Jan, 4 = May, 7 = Aug)
        const isWinter = monthIndex >= 4 && monthIndex <= 7; // May-Aug
        const isSummer = monthIndex >= 0 && monthIndex <= 1; // Jan-Feb

        const activeZones = new Set(MOCK_PROJECTS_DATA.map(p => p.zone));

        if (activeZones.has('Alta Montaña') && isWinter) {
            alerts.push("⚠️ Operación Invierno: Riesgo Crítico de Nieve/Avalancha en Zona Alta Montaña");
        }

        if (activeZones.has('Costera') && isSummer) {
            alerts.push("☀️ Alerta Costera: Alta Radiación UV y riesgo de Marejadas");
        }

        // Default check if no specific season match but works generally
        if (isWinter) alerts.push("🌧️ Plan Invierno General Activado");

        return alerts;
    },

    // 5. Get Top 5 Financial Threats
    getTopThreats: () => {
        const allIssues: { project: string, issue: Issue }[] = [];
        MOCK_PROJECTS_DATA.forEach(p => {
            p.issues.forEach(i => allIssues.push({ project: p.projectName, issue: i }));
        });

        return allIssues
            .sort((a, b) => b.issue.financialImpact - a.issue.financialImpact)
            .slice(0, 5);
    }
};
