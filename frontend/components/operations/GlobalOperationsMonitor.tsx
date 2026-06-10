
"use client";

import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '@/data/mockData';
import { ProjectStatus } from '@/types/project';
import {
    AlertTriangle,
    CheckCircle,
    Filter,
    Activity,
    Search,
    ChevronDown,
    AlertOctagon,
    ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export function GlobalOperationsMonitor() {
    const [selectedProject, setSelectedProject] = useState<string>('ALL');
    const [impactFilter, setImpactFilter] = useState<'CRITICAL' | 'ALL'>('CRITICAL');

    // Get Active Projects only
    const activeProjects = MOCK_PROJECTS.filter(p => p.status === ProjectStatus.ADJUDICADO_EN_CURSO);

    // Mock Alerts Generator (since we don't have a backend for this yet)
    const generateAlerts = (projectId: number) => {
        // Deterministic mock based on ID
        const alerts = [];
        if (projectId === 5) { // Subestación
            alerts.push({ id: 1, severity: 'CRITICAL', title: 'Retraso en Hormigonado', desc: 'SPI bajo 0.8 en sector fundaciones.', date: 'Hace 2 horas', category: 'PLANIFICACIÓN' });
            alerts.push({ id: 2, severity: 'HIGH', title: 'Falta de EPP Específico', desc: 'Stock crítico de guantes dieléctricos.', date: 'Ayer', category: 'SEGURIDAD' });
        } else if (projectId === 4) { // Trolley (Cerrado but maybe has lingering alerts or historical?)
            // Should not be here if we filter active, but just in case.
        } else {
            // Generic
            alerts.push({ id: 3, severity: 'MEDIUM', title: 'Revisión de Calidad Pendiente', desc: 'Protocolo de Topografía sin firma.', date: 'Hace 5 horas', category: 'CALIDAD' });
        }
        return alerts;
    };

    const aggregatedData = useMemo(() => {
        return activeProjects.map(p => {
            const alerts = generateAlerts(p.id);
            // Filter specific project if selected
            if (selectedProject !== 'ALL' && String(p.id) !== selectedProject) return null;

            // Filter alerts by criticality
            const filteredAlerts = impactFilter === 'CRITICAL'
                ? alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH')
                : alerts;

            // If filtering by critical, and no critical alerts, do we show the project?
            // "Show only critical" -> maybe show project only if it has critical issues?
            // Or show project with "No critical issues"? User said "show only the most critical... switch to move parameter".
            // Let's show project always, but empty list if no alerts match.

            return {
                project: p,
                alerts: filteredAlerts,
                stats: {
                    spi: (Math.random() * (1.1 - 0.7) + 0.7).toFixed(2), // Mock SPI
                    cpi: (Math.random() * (1.1 - 0.8) + 0.8).toFixed(2), // Mock CPI
                    hse: Math.floor(Math.random() * 5) // Mock Safety Incidents
                }
            };
        }).filter(Boolean) as { project: any, alerts: any[], stats: any }[];
    }, [selectedProject, impactFilter, activeProjects]);


    return (
        <div className="space-y-6">
            {/* TOOLBAR */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Project Filter */}
                    <div className="relative">
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 min-w-[200px] focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="ALL">Todos los Proyectos Activos</option>
                            {activeProjects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Impact Switch */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setImpactFilter('CRITICAL')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${impactFilter === 'CRITICAL' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <AlertOctagon size={14} /> Solo Críticos
                        </button>
                        <button
                            onClick={() => setImpactFilter('ALL')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${impactFilter === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Activity size={14} /> Ver Todo
                        </button>
                    </div>
                </div>

                <div className="text-right hidden md:block">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Estado Global</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-slate-700">Operaciones en Curso</span>
                    </div>
                </div>
            </div>

            {/* MONITOR GRID */}
            <div className="grid grid-cols-1 gap-6">
                {aggregatedData.map((data, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Project Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Activity size={18} className="text-indigo-500" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{data.project.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{data.project.subtitle} • {data.project.location}</p>
                                </div>
                            </div>
                            <Link
                                href={`/projects/${data.project.id}`}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Ir a Panel Operaciones <ArrowRight size={12} />
                            </Link>
                        </div>

                        <div className="p-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                            {/* KPIs */}
                            <div className="col-span-4 p-6 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className={`text-2xl font-black ${parseFloat(data.stats.spi) < 0.85 ? 'text-rose-500' : 'text-emerald-500'}`}>{data.stats.spi}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">SPI (Avance)</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-black ${parseFloat(data.stats.cpi) < 0.9 ? 'text-amber-500' : 'text-emerald-500'}`}>{data.stats.cpi}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">CPI (Costo)</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-black ${data.stats.hse > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{data.stats.hse}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Incidentes</div>
                                </div>
                            </div>

                            {/* ALERTS FEED */}
                            <div className="col-span-8 p-4 bg-white">
                                {data.alerts.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.alerts.map((alert, aIdx) => (
                                            <div key={aIdx} className={`p-3 rounded-lg border-l-4 flex gap-3 ${alert.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-500' : alert.severity === 'HIGH' ? 'bg-amber-50 border-amber-500' : 'bg-slate-50 border-slate-300'}`}>
                                                <div className="mt-1">
                                                    {alert.severity === 'CRITICAL' && <AlertOctagon size={16} className="text-rose-600" />}
                                                    {alert.severity === 'HIGH' && <AlertTriangle size={16} className="text-amber-600" />}
                                                    {alert.severity === 'MEDIUM' && <Activity size={16} className="text-slate-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`text-sm font-bold ${alert.severity === 'CRITICAL' ? 'text-rose-800' : 'text-slate-800'}`}>{alert.title}</h4>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{alert.category}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-0.5">{alert.desc}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-medium text-right">{alert.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-4">
                                        <CheckCircle size={32} className="mb-2 text-emerald-100" />
                                        <p className="text-sm font-medium">Sin alertas {impactFilter === 'CRITICAL' ? 'críticas' : ''} activas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {aggregatedData.length === 0 && (
                    <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Activity size={32} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold">No se encontraron proyectos activos con los filtros seleccionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
