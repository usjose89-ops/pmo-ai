import React from 'react';
import { Project } from '@/types/project';

interface ProjectStatusHeaderProps {
    project: Project;
}

export const ProjectStatusHeader: React.FC<ProjectStatusHeaderProps> = ({ project }) => {

    const formatMoney = (val: number) => {
        const mmVal = val / 1000000;
        return `MM$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(mmVal)}`;
    };

    return (
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm mb-6 mt-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${project.status.includes('EN_ANALISIS') || project.status.includes('LICITACION') ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'}`}>
                            {project.status.replace(/_/g, ' ')}
                        </span>
                        <div className={`px-3 py-1 rounded text-white text-[10px] font-black uppercase tracking-widest ${project.risk_score >= 4 ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                            Riesgo {project.risk_score}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] md:text-xs uppercase font-black text-slate-400">Inicio</p>
                    <p className="font-bold text-sm md:text-base text-slate-800">{project.start_date}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] md:text-xs uppercase font-black text-slate-400">Término Terreno</p>
                    <p className="font-bold text-sm md:text-base text-slate-800">{project.technical_finish_date}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] md:text-xs uppercase font-black text-slate-400">Presupuesto</p>
                    <p className="font-bold text-sm md:text-base text-slate-800">{formatMoney(project.financials.total_revenue)}</p>
                </div>
                <div className="p-3 md:p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] md:text-xs uppercase font-black text-slate-400">Margen</p>
                    <p className={`font-bold text-sm md:text-base ${project.financials.gross_margin > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatMoney(project.financials.gross_margin)}</p>
                </div>
            </div>
        </div>
    );
};
