"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { DollarSign, TrendingUp, BarChart3, AlertCircle, Activity, Target } from 'lucide-react';
import { Project } from '@/types/project';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PipelineTable } from './PipelineTable';

interface FinancialViewProps {
    projects?: Project[];
    isPipelineMode?: boolean;
}

export function FinancialView({ projects = [], isPipelineMode = false }: FinancialViewProps) {
    const [selectedYear, setSelectedYear] = useState<number>(2026);
    
    if (isPipelineMode) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PipelineTable projects={projects} />
            </div>
        );
    }
    
    // Calculate Aggregates
    const totalRevenue = projects.reduce((acc, p) => acc + (p.financials?.total_revenue || 0), 0);
    const totalCost = projects.reduce((acc, p) => acc + (p.financials?.total_cost || 0), 0);
    const totalMargin = projects.reduce((acc, p) => acc + (p.financials?.gross_margin || 0), 0);
    const globalMarginPercent = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;

    // Average SPI and CPI
    const avgSPI = projects.length > 0 
        ? projects.reduce((acc, p) => acc + (p.financials?.spi || 0), 0) / projects.length 
        : 1.0;
    const avgCPI = projects.length > 0 
        ? projects.reduce((acc, p) => acc + (p.financials?.cpi || 0), 0) / projects.length 
        : 1.0;

    // Targets & Deviations
    const targetRevenue = projects.reduce((acc, p) => acc + (p.financials?.target_revenue || 0), 0);
    const deviationRevenue = targetRevenue > 0 ? ((totalRevenue - targetRevenue) / targetRevenue) * 100 : 0;
    
    const targetMarginPercent = projects.length > 0 
        ? projects.reduce((acc, p) => acc + (p.financials?.target_margin_percent || 0), 0) / projects.length 
        : 15.0;
    const deviationMargin = globalMarginPercent - targetMarginPercent;

    // HR Metrics
    const totalHeadcount = projects.reduce((acc, p) => acc + (p.hr_metrics?.headcount || 0), 0);
    const totalHH = projects.reduce((acc, p) => acc + (p.hr_metrics?.total_hh || 0), 0);
    const avgCostHH = projects.length > 0 
        ? projects.reduce((acc, p) => acc + (p.hr_metrics?.avg_cost_hh || 0), 0) / projects.length 
        : 0;
    const avgProductiveFactor = projects.length > 0 
        ? projects.reduce((acc, p) => acc + (p.hr_metrics?.productive_factor || 0), 0) / projects.length 
        : 0;

    // Build Consolidated Monthly Chart Data (Revenue, Cost, Margin, Projected)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let cumulativeRealMargin = 0;
    let cumulativeProjectedMargin = 0;
    let finalProjectedMarginValue = 0; // The total expected margin at end of year
    
    // First pass to determine total expected projected margin
    projects.forEach(p => {
        p.financials?.monthly_data?.forEach(m => {
            if (m.year === selectedYear) {
                finalProjectedMarginValue += m.projected_margin;
            }
        });
    });

    const consolidatedData = months.map(month => {
        const monthlyData = projects.reduce((acc, p) => {
            const mData = p.financials.monthly_data?.find(m => m.month === month && m.year === selectedYear);
            if (mData) {
                acc.revenue += mData.revenue;
                acc.cost += mData.cost;
                acc.margin += mData.margin;
                acc.projected_margin += mData.projected_margin;
            }
            return acc;
        }, { revenue: 0, cost: 0, margin: 0, projected_margin: 0 });

        cumulativeRealMargin += monthlyData.margin;
        cumulativeProjectedMargin += monthlyData.projected_margin;

        return { 
            name: month, 
            ...monthlyData,
            acc_margin: cumulativeRealMargin,
            acc_projected: cumulativeProjectedMargin
        };
    });

    const marginPercentageCompleted = finalProjectedMarginValue > 0 ? (cumulativeRealMargin / finalProjectedMarginValue) * 100 : 0;
    const marginLacking = finalProjectedMarginValue - cumulativeRealMargin;

    const formatMM = (val: number) => {
        return `MM$ ${(val / 1000000).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} `;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#171a1f] p-6 rounded-xl shadow-sm border-none relative overflow-hidden group">
                    <p className="text-sm font-medium text-[#aaabb0] uppercase tracking-wider font-[var(--font-lexend)]">Facturación Acumulada</p>
                    <div className="flex items-end space-x-2 mt-2">
                        <span className="text-3xl font-bold text-[#f6f6fc] font-[var(--font-lexend)]">{formatMM(totalRevenue)}</span>
                        <span className="text-sm font-medium text-[#74757a] mb-1">CLP</span>
                    </div>
                    {targetRevenue > 0 && (
                        <div className="mt-3 flex items-center space-x-2 text-xs">
                            <span className="text-[#aaabb0]">Proyectado: {formatMM(targetRevenue)}</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${deviationRevenue >= 0 ? 'bg-emerald-500/20 text-[#1dfba5]' : 'bg-red-500/20 text-[#ff716c]'}`}>
                                {deviationRevenue > 0 ? '+' : ''}{deviationRevenue.toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-[#171a1f] p-6 rounded-xl shadow-sm border-none relative overflow-hidden group">
                    <p className="text-sm font-medium text-[#aaabb0] uppercase tracking-wider font-[var(--font-lexend)]">Margen Global Portafolio</p>
                    <div className="flex items-end space-x-2 mt-2">
                        <span className="text-3xl font-bold text-[#f6f6fc] font-[var(--font-lexend)]">
                            {globalMarginPercent.toFixed(1)}%
                        </span>
                    </div>
                    {(targetMarginPercent > 0 || deviationMargin !== 0) && (
                        <div className="mt-3 flex items-center space-x-2 text-xs">
                            <span className="text-[#aaabb0]">Proyectado: {targetMarginPercent.toFixed(1)}%</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${deviationMargin >= 0 ? 'bg-emerald-500/20 text-[#1dfba5]' : 'bg-red-500/20 text-[#ff716c]'}`}>
                                {deviationMargin > 0 ? '+' : ''}{deviationMargin.toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-[#171a1f] p-6 rounded-xl shadow-sm border-none relative overflow-hidden group">
                    <p className="text-sm font-medium text-[#aaabb0] uppercase tracking-wider font-[var(--font-lexend)]">Desempeño Operativo</p>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#53555a] uppercase">Avg SPI</span>
                            <span className={`text-3xl font-bold font-[var(--font-lexend)] ${avgSPI >= 1 ? 'text-[#1dfba5]' : 'text-[#ff716c]'}`}>
                                {avgSPI.toFixed(2)}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-slate-700/50 mx-2"></div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-bold text-[#53555a] uppercase">Avg CPI</span>
                            <span className={`text-3xl font-bold font-[var(--font-lexend)] ${avgCPI >= 1 ? 'text-[#1dfba5]' : 'text-[#ff716c]'}`}>
                                {avgCPI.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recursos Humanos y Productividad */}
            <div className="mt-8 bg-[#111318] rounded-2xl p-6 shadow-inner border border-[#1d2025]">
                <h3 className="font-bold text-[#f6f6fc] flex items-center mb-6 font-[var(--font-lexend)]">
                    Recursos Humanos y Productividad
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1d2025] rounded-xl p-4">
                        <p className="text-xs text-[#aaabb0] uppercase tracking-wide">Dotación (Headcount)</p>
                        <p className="text-2xl font-bold text-[#8eabff] mt-1 font-[var(--font-lexend)]">{totalHeadcount.toLocaleString()}</p>
                        <p className="text-[10px] text-[#74757a] mt-1">Personal en faena</p>
                    </div>
                    <div className="bg-[#1d2025] rounded-xl p-4">
                        <p className="text-xs text-[#aaabb0] uppercase tracking-wide">Horas Hombre (HH)</p>
                        <p className="text-2xl font-bold text-[#8eabff] mt-1 font-[var(--font-lexend)]">{(totalHH / 1000).toFixed(1)}K</p>
                        <p className="text-[10px] text-[#74757a] mt-1">Acumulado mes actual</p>
                    </div>
                    <div className="bg-[#1d2025] rounded-xl p-4">
                        <p className="text-xs text-[#aaabb0] uppercase tracking-wide">Costo Promedio HH</p>
                        <p className="text-2xl font-bold text-[#f6f6fc] mt-1 font-[var(--font-lexend)]">${avgCostHH.toFixed(2)}</p>
                        <p className="text-[10px] text-[#74757a] mt-1">USD / Hora</p>
                    </div>
                    <div className="bg-[#1d2025] rounded-xl p-4">
                        <p className="text-xs text-[#aaabb0] uppercase tracking-wide">Factor Productivo</p>
                        <p className={`text-2xl font-bold mt-1 font-[var(--font-lexend)] ${avgProductiveFactor >= 0.8 ? 'text-[#1dfba5]' : 'text-[#ff716c]'}`}>
                            {avgProductiveFactor.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-[#74757a] mt-1">Eficiencia geográfica</p>
                    </div>
                </div>
            </div>

            {/* MONTHLY AND MARGIN GRIDS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                {/* 1. MONTHLY PERFORMANCE CHART (Revenue vs Cost) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <BarChart3 className="mr-2 text-indigo-600" size={18} />
                                Desempeño Financiero
                            </h3>
                            <div className="flex bg-slate-100 rounded-lg p-1">
                                {[2025, 2026].map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedYear === year ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex items-center text-xs">
                                <span className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></span> Ingresos
                            </div>
                            <div className="flex items-center text-xs">
                                <span className="w-3 h-3 bg-rose-500 rounded-sm mr-1"></span> Costos
                            </div>
                        </div>
                    </div>

                    <div className="relative h-64 w-full flex items-end justify-between px-2 space-x-2 md:space-x-4">
                        {consolidatedData.map((c) => {
                            const maxVal = Math.max(...consolidatedData.map(d => Math.max(d.revenue, d.cost, 1000000))) * 1.1;
                            return (
                                <div key={c.name} className="w-full h-full flex flex-col justify-end items-center group relative">
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white text-[10px] p-2 rounded pointer-events-none transition-opacity z-20 w-24">
                                        <div className="font-bold mb-1">{c.name}</div>
                                        <div>Ing: {formatMM(c.revenue)}</div>
                                        <div>Cos: {formatMM(c.cost)}</div>
                                    </div>
                                    <div className="flex items-end justify-center w-full space-x-1 h-full pb-6">
                                        <div
                                            className="w-full max-w-[12px] bg-emerald-500 rounded-t opacity-90 group-hover:opacity-100 transition-all"
                                            style={{ height: `${(c.revenue / maxVal) * 100}%` }}
                                        ></div>
                                        <div
                                            className="w-full max-w-[12px] bg-rose-500 rounded-t opacity-90 group-hover:opacity-100 transition-all"
                                            style={{ height: `${(c.cost / maxVal) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="absolute bottom-0 text-[10px] text-gray-500 font-bold uppercase">{c.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 2. REAL VS BUDGET MARGIN AND TREND CHART */}
                <div className="bg-[#111318] p-6 rounded-lg shadow-sm border border-[#1d2025]">
                    <h3 className="font-bold text-[#f6f6fc] mb-6 flex items-center font-[var(--font-lexend)]">
                        <TrendingUp className="mr-2 text-[#8eabff]" size={18} /> Análisis de Margen y Tendencia
                    </h3>
                    
                    <div className="h-64 w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={consolidatedData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1d2025" vertical={false} />
                                <XAxis dataKey="name" stroke="#53555a" tick={{fill: '#74757a'}} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" stroke="#53555a" tick={{fill: '#74757a'}} axisLine={false} tickLine={false} tickFormatter={(val) => `MM$${Math.round(val / 1000000)}`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#53555a" tick={{fill: '#74757a'}} axisLine={false} tickLine={false} tickFormatter={(val) => `MM$${Math.round(val / 1000000)}`} />
                                <Tooltip
                                    cursor={{fill: '#1d2025'}}
                                    contentStyle={{ backgroundColor: '#171a1f', borderColor: '#2b2d31', borderRadius: '8px', color: '#f6f6fc' }}
                                    formatter={(value: number, name: string) => {
                                        const formatted = formatMM(value);
                                        const labels: any = { margin: 'Margen Real', projected_margin: 'Margen Presupuestado', acc_margin: 'Acumulado Real', acc_projected: 'Acumulado Proyectado' };
                                        return [formatted, labels[name]];
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', color: '#aaabb0' }} />
                                <Bar yAxisId="left" dataKey="margin" name="Margen Real" fill="#1dfba5" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                <Bar yAxisId="left" dataKey="projected_margin" name="Margen Presupuestado" fill="#53555a" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                <Line yAxisId="right" type="monotone" dataKey="acc_projected" name="Tendencia Proyectada" stroke="#74757a" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="acc_margin" name="Tendencia Real" stroke="#8eabff" strokeWidth={3} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Totalizers */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#1d2025]">
                        <div>
                            <p className="text-[10px] text-[#aaabb0] uppercase font-bold">Total Llevamos</p>
                            <p className="text-xl font-bold text-[#f6f6fc] font-[var(--font-lexend)]">{formatMM(cumulativeRealMargin)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-[#aaabb0] uppercase font-bold">Avance (%)</p>
                            <p className="text-xl font-bold text-[#8eabff] font-[var(--font-lexend)]">{marginPercentageCompleted.toFixed(1)}%</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-[#aaabb0] uppercase font-bold">Brecha a Meta</p>
                            <p className={`text-xl font-bold font-[var(--font-lexend)] ${marginLacking > 0 ? 'text-[#ff716c]' : 'text-[#1dfba5]'}`}>
                                {formatMM(Math.abs(marginLacking))} {marginLacking <= 0 ? 'Excedente' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Claims Table */}
            <Card title="Gestión de Adicionales & Claims">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                <th className="px-4 py-3 font-semibold">ID</th>
                                <th className="px-4 py-3 font-semibold">Descripción</th>
                                <th className="px-4 py-3 font-semibold">Monto (UF)</th>
                                <th className="px-4 py-3 font-semibold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr>
                                <td className="px-4 py-3 font-mono text-xs">CLM-001</td>
                                <td className="px-4 py-3">Obras Extraordinarias: Socalzado Muro Sur</td>
                                <td className="px-4 py-3 font-semibold">1,250 UF</td>
                                <td className="px-4 py-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">Pagado</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pipeline & Active Projects Stack for Mobile/Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Active Projects */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center border-b pb-2">
                        <Activity className="mr-2 text-indigo-600" size={18} />
                        Proyectos Activos
                    </h3>
                    {projects.filter(p => p.status === 'ADJUDICADO_EN_CURSO').map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase">{p.client}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${p.risk_label === 'CRITICO' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    Riesgo {p.risk_label}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-slate-600">Avance Físico</span>
                                <span className="font-bold">{p.advance_physical}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${p.advance_physical}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pipeline / Bidding */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center border-b pb-2">
                        <DollarSign className="mr-2 text-indigo-600" size={18} />
                        Proyectos en Estudio / Licitaciones
                    </h3>
                    {projects.filter(p => ['EN_ANALISIS', 'EN_LICITACION'].includes(p.status)).map(p => (
                        <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed flex flex-col space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
                            <div className="flex justify-between items-start pr-4">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase">{p.client}</p>
                                </div>
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-bold">
                                    En Revisión
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-2">
                                <span className="font-semibold text-slate-600">Presupuesto Est.</span>
                                <span className="font-bold font-[var(--font-lexend)]">{formatMM(p.financials?.total_revenue || 0)} CLP</span>
                            </div>
                        </div>
                    ))}
                    {projects.filter(p => ['EN_ANALISIS', 'EN_LICITACION'].includes(p.status)).length === 0 && (
                        <div className="text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                            No hay proyectos en pipeline actualmente.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start">
                <AlertCircle className="text-blue-500 mr-3 mt-1" size={20} />
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Insight Financiero</h4>
                    <p className="text-sm text-blue-600">El margen del portafolio se mantiene saludable. Los KPIs operativos indican dotación alineada con las metas del pipeline.</p>
                </div>
            </div>
        </div>
    );
}
