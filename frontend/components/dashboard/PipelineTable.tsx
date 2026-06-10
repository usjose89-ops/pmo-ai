"use client";

import React, { useState } from 'react';
import { Project } from '@/types/project';
import { Target, AlertTriangle, Users, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PipelineTableProps {
    projects: Project[];
}

export function PipelineTable({ projects }: PipelineTableProps) {
    const [selectedRiskProject, setSelectedRiskProject] = useState<Project | null>(null);

    const formatMoney = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

    const getStatusTheme = (status?: string) => {
        switch (status) {
            case 'Aprobado': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'Desechado': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Desierta': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'En Revisión': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Stand By': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            default: return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    const getRiskColor = (label: string) => {
        switch (label) {
            case 'CRITICO': return 'bg-red-600 text-white shadow-red-900/50';
            case 'MEDIO': return 'bg-orange-500 text-white shadow-orange-900/50';
            default: return 'bg-emerald-500 text-white shadow-emerald-900/50';
        }
    };

    return (
        <div className="text-slate-200">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Target className="text-indigo-400" />
                    Pipeline de Licitaciones
                </h2>
                <p className="text-slate-400 text-sm mt-1">Análisis documental y comercial de proyectos en estudio.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-left">
                            <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-semibold w-1/4">Proyecto / Cliente</th>
                            <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-semibold text-center">Evaluación</th>
                            <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-semibold text-right">Ppto. Estimado</th>
                            <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-semibold text-center">Fuerza Laboral</th>
                            <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-semibold text-center">Estado Licitación</th>
                            <th className="p-4 text-xs tracking-wider text-slate-400 uppercase font-semibold text-center">Riesgo (Doble Click)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {projects.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-8 text-slate-500">No hay proyectos en el Pipeline</td></tr>
                        ) : (
                            projects.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-sm text-slate-200">{p.name}</p>
                                        <p className="text-xs text-slate-500">{p.client}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 whitespace-nowrap">
                                            {p.evaluation_stage === 'Análisis de Bases' && <BookOpen className="w-3 h-3 text-slate-400" />}
                                            {p.evaluation_stage === 'Presupuesto Realizado' && <Clock className="w-3 h-3 text-blue-400" />}
                                            {p.evaluation_stage === 'Presupuesto Presentado' && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                                            {p.evaluation_stage || 'En Estudio'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <p className="font-mono text-sm font-semibold text-slate-300">
                                            {p.financials.target_revenue ? formatMoney(p.financials.target_revenue) : 'Por definir'}
                                        </p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-400">
                                            <Users className="w-4 h-4" />
                                            <span className="font-semibold">{p.hr_metrics?.headcount || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusTheme(p.pipeline_status)}`}>
                                            {p.pipeline_status || 'En Proceso'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onDoubleClick={() => setSelectedRiskProject(p)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95 ${getRiskColor(p.risk_label)} cursor-pointer`}
                                            title="Doble click para ver matriz de riesgo"
                                        >
                                            {p.risk_label}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Risk Explanation Modal */}
            {selectedRiskProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1d24] border border-[#2d313a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/10 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <AlertTriangle className={`w-6 h-6 ${selectedRiskProject.risk_label === 'CRITICO' ? 'text-red-500' : 'text-orange-500'}`} />
                                    Matriz de Riesgo Comercial
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">{selectedRiskProject.name}</p>
                            </div>
                            <button onClick={() => setSelectedRiskProject(null)} className="text-slate-500 hover:text-white transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 bg-[#16181d]">
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-widest ${getRiskColor(selectedRiskProject.risk_label)}`}>
                                    RIESGO {selectedRiskProject.risk_label}
                                </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                {selectedRiskProject.risk_explanation || 'No hay justificación detallada para el factor de riesgo de este proyecto en la base de datos.'}
                            </p>
                            
                            {selectedRiskProject.risk_label === 'CRITICO' && (
                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-xs text-red-400 font-medium">Recomendación IA (ConstructIA): Considerar declarar desierta la participación o exigir garantías anticipadas para mitigar exposición.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-[#1a1d24] border-t border-white/10 text-right">
                            <button onClick={() => setSelectedRiskProject(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
