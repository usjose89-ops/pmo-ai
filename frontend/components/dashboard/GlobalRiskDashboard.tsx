import React, { useState, useEffect } from 'react';
import { RiskAggregatorService } from '@/services/RiskAggregatorService';
import { RiskAnalysisEngine, Insight } from '@/services/RiskAnalysisEngine';
import { AlertTriangle, CloudRain, Sun, X, Bot, Lightbulb, ArrowRight } from 'lucide-react';

export function GlobalRiskDashboard() {
    const [month, setMonth] = useState(6);
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);
    const [aggregatedRisks, setAggregatedRisks] = useState<any>(null);
    const [globalVaR, setGlobalVaR] = useState(0);
    const [weatherAlerts, setWeatherAlerts] = useState<string[]>([]);
    const [topThreats, setTopThreats] = useState<any[]>([]);

    // AI Insights State
    const [activeInsight, setActiveInsight] = useState<Insight | null>(null);

    useEffect(() => {
        const gridData = RiskAggregatorService.getMatrixData();
        const vaR = RiskAggregatorService.calculateGlobalVaR();
        const alerts = RiskAggregatorService.getWeatherAlerts(month);
        const threats = RiskAggregatorService.getTopThreats();
        const rawProjects = RiskAggregatorService.getAllProjectsRiskData();

        setAggregatedRisks(gridData);
        setGlobalVaR(vaR);
        setWeatherAlerts(alerts);
        setTopThreats(threats);

        // Run AI Analysis immediately on load/update
        const weatherInsight = RiskAnalysisEngine.analyzeWeatherRisk(alerts, month);
        const financialInsight = RiskAnalysisEngine.analyzeFinancialRisk(vaR, rawProjects);

        // Prioritize: Weather -> Financial
        if (weatherInsight) setActiveInsight(weatherInsight);
        else if (financialInsight) setActiveInsight(financialInsight);
        else setActiveInsight(null);

    }, [month]);

    const formatMoney = (val: number) => {
        const mmVal = val / 1000000;
        return `MM$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(mmVal)}`;
    };

    const getVarColor = (val: number) => {
        if (val > 50000000) return 'text-rose-600';
        if (val > 10000000) return 'text-amber-500';
        return 'text-emerald-600';
    };

    // Matrix Logic
    const renderMatrixCell = (impact: number, probability: number) => {
        if (!aggregatedRisks) return null;
        const key = `${impact}-${probability}`;
        const cellData = aggregatedRisks[key];
        const count = cellData ? cellData.count : 0;

        // Colors based on heat (Imp * Prob)
        const heat = impact * probability;
        let bgColor = 'bg-slate-50';
        if (heat >= 20) bgColor = 'bg-rose-500 text-white';        // Critical
        else if (heat >= 10) bgColor = 'bg-orange-400 text-white'; // High
        else if (heat >= 5) bgColor = 'bg-yellow-300 text-slate-800'; // Medium
        else if (count > 0) bgColor = 'bg-emerald-200 text-emerald-800'; // Low

        return (
            <div
                key={key}
                onClick={() => count > 0 && setSelectedCell({ x: impact, y: probability })}
                className={`flex items-center justify-center p-4 border border-white/50 rounded-lg cursor-pointer transition-all hover:scale-105 shadow-sm ${bgColor} ${count > 0 ? 'hover:shadow-lg ring-2 ring-transparent hover:ring-indigo-400' : 'opacity-40'}`}
            >
                {count > 0 ? <span className="text-xl font-bold">{count}</span> : <span className="text-xs opacity-20">-</span>}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* AI ADVISOR OVERLAY (If Insight Active) */}
            {activeInsight && (
                <div className="fixed bottom-10 right-10 z-50 w-96 animate-in slide-in-from-bottom duration-700">
                    <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[50px] rounded-full pointer-events-none"></div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                                <Bot size={20} />
                            </div>
                            <h4 className="text-white font-bold text-sm">AI Risk Advisor</h4>
                            <button onClick={() => setActiveInsight(null)} className="ml-auto text-slate-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-slate-300 text-xs leading-relaxed mb-4 border-l-2 border-indigo-500 pl-3">
                            {activeInsight.analysis.explanation}
                        </p>

                        <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-500/20">
                            <div className="flex items-center gap-2 mb-1 text-indigo-400">
                                <Lightbulb size={12} />
                                <span className="text-[10px] uppercase font-bold">Sugerencia de Mitigación</span>
                            </div>
                            <p className="text-white text-xs font-medium">
                                {activeInsight.analysis.recommendation}
                            </p>
                        </div>

                        {activeInsight.analysis.priority_score > 90 && (
                            <button className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors">
                                Activar Protocolo de Crisis <ArrowRight size={12} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* HEADLINE: CAPITAL EN RIESGO (VaR) */}
            <div className="card-premium p-10 flex flex-col md:flex-row justify-between items-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Capital Total en Riesgo (VaR)</h2>
                    <p className="text-xs text-slate-400 mb-4">Sumatoria de impacto financiero ponderado al día de hoy.</p>
                </div>
                <div className="text-right">
                    <h1 className={`text-6xl font-extrabold tracking-tight ${getVarColor(globalVaR)}`}>
                        {formatMoney(globalVaR)}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* MATRIZ DE RIESGOS (8 Cols) */}
                <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <AlertTriangle className="mr-2 text-rose-500" /> Mapa de Calor Corporativo
                    </h3>

                    {/* Matrix Grid */}
                    <div className="flex">
                        {/* Y-Axis Label */}
                        <div className="flex flex-col justify-center mr-4">
                            <span className="text-xs font-bold text-slate-400 uppercase transform -rotate-90 whitespace-nowrap">Probabilidad</span>
                        </div>
                        <div className="flex-1">
                            <div className="grid grid-cols-5 gap-2 h-[400px]">
                                {/* Rows rely on flex order reversing or explicit indexes. Let's do explicit loop loops */}
                                {/* Need loops 5 down to 1 for Prob, 1 to 5 for Impact */}
                                {[5, 4, 3, 2, 1].map(prob => (
                                    <React.Fragment key={prob}>
                                        {[1, 2, 3, 4, 5].map(imp => renderMatrixCell(imp, prob))}
                                    </React.Fragment>
                                ))}
                            </div>
                            {/* X-Axis Label */}
                            <div className="text-center mt-4">
                                <span className="text-xs font-bold text-slate-400 uppercase">Impacto</span>
                            </div>
                        </div>
                    </div>

                    {/* DRILL DOWN MODAL */}
                    {selectedCell && aggregatedRisks && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center p-8 rounded-2xl animate-in fade-in">
                            <div className="w-full max-w-lg bg-white shadow-2xl border border-slate-200 rounded-xl overflow-hidden ring-1 ring-black/5">
                                <div className="bg-slate-900 p-4 flex justify-between items-center">
                                    <h4 className="text-white font-bold">Riesgos Críticos (Prob: {selectedCell.y} / Imp: {selectedCell.x})</h4>
                                    <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
                                    {aggregatedRisks[`${selectedCell.x}-${selectedCell.y}`]?.risks.map((r: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                            <p className="font-bold text-sm text-slate-800">{r.title}</p>
                                            <div className="flex justify-between mt-1 text-xs text-slate-500">
                                                <span>{r.project}</span>
                                                <span className="font-mono text-rose-600 font-bold">{formatMoney(r.amount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDE COLUMN: WEATHER & TOP 5 (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* WEATHER RADAR */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            {month >= 4 && month <= 7 ? <CloudRain size={100} /> : <Sun size={100} />}
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center z-10 relative">
                            📡 Radar Climático
                        </h3>

                        {/* Month Simulator */}
                        <div className="mb-6 relative z-10">
                            <label className="text-[10px] uppercase text-slate-400 font-bold mb-1 block">Simulador de Mes</label>
                            <input
                                type="range"
                                min="0" max="11"
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                                className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                                <span>ENE</span><span>DIC</span>
                            </div>
                            <p className="text-center text-indigo-400 font-bold mt-2">Mes Actual: {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][month]}</p>
                        </div>

                        {/* Alerts List */}
                        <div className="space-y-3 relative z-10">
                            {weatherAlerts.length > 0 ? (
                                weatherAlerts.map((alert, idx) => (
                                    <div key={idx} className="bg-rose-500/20 border border-rose-500/50 p-3 rounded-xl flex items-start gap-3 animate-pulse">
                                        <AlertTriangle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                                        <p className="text-sm font-medium text-rose-100">{alert}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-center">
                                    <p className="text-sm text-emerald-400">Sin alertas climáticas activas.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TOP 5 THREATS */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Top 5 Amenazas</h3>
                        <div className="space-y-4">
                            {topThreats.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 line-clamp-1 w-32">{item.issue.title}</p>
                                            <p className="text-[10px] text-slate-400">{item.project}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-rose-600">{formatMoney(item.issue.financialImpact)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
