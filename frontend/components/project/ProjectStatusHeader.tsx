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
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">{project.name}</h1>
                    <p className="text-slate-500 font-medium">{project.subtitle}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-white font-bold ${project.risk_score >= 4 ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                    Riesgo {project.risk_score}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs uppercase font-black text-slate-400">Inicio</p>
                    <p className="font-bold text-slate-800">{project.start_date}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs uppercase font-black text-slate-400">Término Terreno</p>
                    <p className="font-bold text-slate-800">{project.technical_finish_date}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs uppercase font-black text-slate-400">Presupuesto</p>
                    <p className="font-bold text-slate-800">{formatMoney(project.financials.total_revenue)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs uppercase font-black text-slate-400">Margen</p>
                    <p className={`font-bold ${project.financials.gross_margin > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatMoney(project.financials.gross_margin)}</p>
                </div>
            </div>
        </div>
    );
};
