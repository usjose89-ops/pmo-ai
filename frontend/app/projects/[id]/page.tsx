"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project, ProjectStatus } from '@/types/project';
import { projectService } from '@/services/projectService';

// --- MODULE IMPORTS ---
import { ProjectRiskAssessment } from '@/components/project/ProjectRiskAssessment';
import { BudgetModule } from '@/components/budget/BudgetModule';
import { HumanResources } from '@/components/project/HumanResources';
import { ProjectBoard } from '@/components/operations/ProjectBoard';
import { QualityDashboard } from '@/components/qaqc/QualityDashboard';

// --- ICONOS SVG ---
const Icons = {
    Risk: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
    AI: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
    HardHat: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter(); // Added for navigation if needed
    const [project, setProject] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RRHH' | 'BUDGET' | 'QAQC' | 'OPERATIONS' | 'PROPOSAL'>('OVERVIEW');
    const [showRiskModal, setShowRiskModal] = useState(false);

    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(foundProject => {
                    const richProject = {
                        ...foundProject,
                        financials: foundProject.financials || {
                            total_revenue: 0,
                            total_cost: 0,
                            gross_margin: 0,
                            gross_margin_percent: 0,
                            currency: 'CLP',
                            monthly_data: []
                        }
                    };
                    setProject(richProject);
                })
                .catch(err => console.error("Error loading project data:", err));
        }
    }, [params.id]);

    if (!project) return <div className="p-10 text-center">Cargando proyecto...</div>;

    const formatMoney = (val: number) => {
        const mmVal = val / 1000000;
        return `MM$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(mmVal)}`;
    };

    const deviation = 0;
    const isClosed = project.status === ProjectStatus.TERMINADO;
    const isExecution = project.status === ProjectStatus.ADJUDICADO_EN_CURSO || project.status === 'EN_EJECUCION';
    // Fix: Defines Study mode as ANALYSIS or TENDERING
    const isStudy = project.status === ProjectStatus.EN_ANALISIS || project.status === ProjectStatus.EN_LICITACION;

    // --- TABS LOGIC ---
    // Dashboard only shows "Resumen" (Overview). Other interactions are via Top Header Navigation (layout.tsx).
    const tabs = [
        { id: 'OVERVIEW', label: 'Resumen' },
    ];

    // In Execution, we might want to show some dashboard-specific sub-tabs or widget toggles,
    // but the main navigation is now in the header.
    // For now, let's keep the Dashboard clean as just "Resumen" which contains the widgets.

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 p-6">
            {/* RISK MODAL */}
            {showRiskModal && (
                <ProjectRiskAssessment
                    projectId={project.id}
                    onClose={() => setShowRiskModal(false)}
                />
            )}

            <div className="card-premium p-10 border-t-8 border-t-indigo-600 bg-white rounded-2xl shadow-xl">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <span className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest mb-3 inline-block shadow-sm animate-pulse ${isStudy ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'}`}>
                            {project.status.replace(/_/g, ' ')}
                        </span>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">{project.name}</h1>
                        <p className="text-xl text-slate-400 font-medium">{project.subtitle || 'Proyecto de Construcción'}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowRiskModal(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold flex items-center shadow-lg shadow-slate-200 transition-all hover:scale-105"
                        >
                            <Icons.AI />
                            <span className="ml-2">Evaluar Riesgos con IA</span>
                        </button>
                        <div className="text-right bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Presupuesto</p>
                            <p className="text-3xl font-black text-slate-900">{formatMoney(project.financials.total_revenue)}</p>
                        </div>
                    </div>
                </div>

                {/* TABS DELETED - Clean Dashboard */}
                {/*
                   We removed the local tabs because navigation is handled by the Layout Header (Overview, HR, Budget, etc).
                   This view is specifically the "Overview" / "Dashboard" view.
                */}

                {/* MODULES */}
                <div className="min-h-[500px]">
                    {activeTab === 'OVERVIEW' && (
                        <div className="animate-in fade-in space-y-6">
                            {/* EXECUTION KPIS */}
                            {isExecution && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icons.HardHat /></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Avance Físico</p>
                                        <div className="flex items-end gap-2">
                                            <h3 className="text-5xl font-extrabold text-slate-900">{project.advance_real || 0}%</h3>
                                            <span className="text-sm font-bold text-slate-400 mb-2">/ {project.advance_projected || 0}% Proy.</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${project.advance_real || 0}%` }}></div>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${deviation < 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                        <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${deviation < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Desviación Constructiva</p>
                                        <h3 className={`text-5xl font-extrabold ${deviation < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {deviation > 0 ? '+' : ''}{deviation}%
                                        </h3>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl text-white">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-2">SPI (Schedule Performance)</p>
                                        <h3 className="text-5xl font-extrabold text-white">
                                            {((project.advance_real || 0) / (project.advance_projected || 1) || 0).toFixed(2)}
                                        </h3>
                                    </div>
                                </div>
                            )}

                            {/* STUDY PHASE ALERT ("Laboratorio") */}
                            {isStudy && (
                                <div className="p-12 text-center text-slate-400 bg-amber-50 rounded-2xl border border-dashed border-amber-200">
                                    <Icons.Risk />
                                    <h3 className="mt-4 font-bold text-amber-800 text-xl">Proyecto en Fase de Estudio &quot;Laboratorio&quot;</h3>
                                    <p className="text-sm text-amber-700/70 mb-6 max-w-lg mx-auto">
                                        Esta es una zona segura de simulación. Utiliza el Generador IA para iterar presupuesto y equipo.
                                        Cuando finalices, cierra la fase de estudio para adjudicar o descartar.
                                    </p>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => router.push(`/projects/${project.id}/budget`)}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
                                        >
                                            <Icons.AI /> Ir al Generador de Propuestas (Presupuesto)
                                        </button>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-amber-200/50 flex justify-center gap-6">
                                        <button className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:bg-emerald-100 px-5 py-3 rounded-xl transition uppercase tracking-widest border border-transparent hover:border-emerald-200">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            Aprobar y Pasar a Ejecución
                                        </button>
                                        <button className="flex items-center gap-2 text-xs font-black text-rose-500 hover:bg-rose-100 px-5 py-3 rounded-xl transition uppercase tracking-widest border border-transparent hover:border-rose-200">
                                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                            Descartar / Perdido
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Fallback for unknown state */}
                            {!isExecution && !isClosed && !isStudy && (
                                <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <Icons.Risk />
                                    <p className="mt-4 font-bold">Estado desconocido o en transición.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'OPERATIONS' && (
                        <div className="h-[600px] animate-in fade-in slide-in-from-bottom-2">
                            <ProjectBoard project={project} />
                        </div>
                    )}

                    {activeTab === 'RRHH' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <HumanResources project={project} />
                        </div>
                    )}

                    {activeTab === 'BUDGET' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <BudgetModule project={project} />
                        </div>
                    )}

                    {activeTab === 'QAQC' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <QualityDashboard project={project} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
