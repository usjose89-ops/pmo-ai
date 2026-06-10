import React from 'react';
import { Plus, Calendar, MapPin, Building2, TrendingUp } from 'lucide-react';
import { ProjectTag } from '../ui/ProjectTag';
import Link from 'next/link';

import { Project } from '@/types/project';

interface ProjectsListProps {
    projects: Project[];
    onNewProject: () => void;
    onEditProject: (project: Project) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onNewProject, onEditProject }) => {

    // Currency Formatter
    const formatMoney = (val: number, currency: string) => {
        const mmVal = val / 1000000;
        const prefix = currency === 'CLP' ? 'MM$' : currency;
        return `${prefix} ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(mmVal)}`;
    };

    const getRiskColor = (score: number) => {
        if (score >= 4.0) return 'bg-rose-500 text-white';
        if (score >= 2.6) return 'bg-amber-400 text-slate-900';
        return 'bg-emerald-500 text-white';
    };

    const [activeTab, setActiveTab] = React.useState<'ESTUDIO' | 'ACTIVOS' | 'CERRADOS'>('ACTIVOS');

    const filteredProjects = projects.filter(p => {
        if (activeTab === 'ESTUDIO') return p.status === 'EN_ANALISIS' || p.status === 'EN_LICITACION';
        if (activeTab === 'ACTIVOS') return p.status === 'ADJUDICADO_EN_CURSO';
        if (activeTab === 'CERRADOS') return p.status === 'TERMINADO';
        return false;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portafolio de Proyectos</h1>
                    <p className="text-slate-500 mt-1">Gestión centralizada de obras en estudio y ejecución</p>
                </div>
                {activeTab === 'ESTUDIO' && (
                    <Link
                        href="/studies/new"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                    >
                        <Plus className="mr-2" size={20} />
                        Crear Estudio
                    </Link>
                )}
            </div>

            {/* TABS */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('ESTUDIO')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ESTUDIO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    En Estudio
                </button>
                <button
                    onClick={() => setActiveTab('ACTIVOS')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ACTIVOS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Activos
                </button>
                <button
                    onClick={() => setActiveTab('CERRADOS')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CERRADOS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Cerrados
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No hay proyectos en esta categoría.</p>
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <Link
                            href={`/projects/${project.id}`}
                            key={project.id}
                            className="group block bg-white rounded-3xl p-0 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* HEADER: SEMÁFORO + CLIENTE */}
                            <div className="p-6 pb-4 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{project.client}</span>
                                    <h3 className="text-xl font-black text-slate-800 leading-tight mt-1 group-hover:text-indigo-700 transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">{project.subtitle}</p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-sm ${getRiskColor(project.risk_score)}`}>
                                        Riesgo {project.risk_score}
                                    </div>
                                    <button 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            onEditProject(project); 
                                        }}
                                        className="text-xs font-bold text-slate-400 hover:text-indigo-600 px-2 py-1 bg-white rounded shadow-sm border border-slate-200"
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>

                            {/* BODY: GRID 2x2 (PLAZOS & FINANZAS) */}
                            <div className="p-6 space-y-6">
                                {/* Row 1: Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                            <Building2 size={12} />
                                            <span className="text-[10px] font-bold uppercase">Término Terreno</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">{project.technical_finish_date}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-slate-400 mb-1">
                                            <Calendar size={12} />
                                            <span className="text-[10px] font-bold uppercase">Cierre Admin.</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">{project.admin_finish_date}</p>
                                    </div>
                                </div>

                                {/* Row 2: Financials */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-400 font-medium">Ingreso</span>
                                        <span className="text-xs font-bold text-slate-600">{formatMoney(project.financials.total_revenue, project.financials.currency)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-slate-400 font-medium">Costo Real</span>
                                        <span className="text-xs font-bold text-rose-500">{formatMoney(project.financials.total_cost, project.financials.currency)}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-800 uppercase">Margen</span>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-600">{formatMoney(project.financials.gross_margin, project.financials.currency)}</p>
                                            <p className="text-[10px] font-bold text-emerald-600">({project.financials.gross_margin_percent}%)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER: PROGRESS BARS */}
                            <div className="px-6 pb-6 pt-0 space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                    <span>Físico</span>
                                    <span>{project.advance_physical}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div style={{ width: `${project.advance_physical}%` }} className="h-full bg-indigo-500 rounded-full"></div>
                                </div>

                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mt-2">
                                    <span>Financiero</span>
                                    <span>{project.advance_financial}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div style={{ width: `${project.advance_financial}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};
