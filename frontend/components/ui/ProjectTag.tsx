import React from 'react';

export type ProjectStatus = 'EN_ESTUDIO' | 'OFERTA_PRESENTADA' | 'OFERTA_ADJUDICADA' | 'TERMINADO';

interface ProjectTagProps {
    status: ProjectStatus | string;
}

export const ProjectTag: React.FC<ProjectTagProps> = ({ status }) => {

    let colorClass = 'bg-gray-100 text-gray-600';
    let label = status;

    switch (status) {
        case 'EN_ESTUDIO':
            colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
            label = 'En Estudio';
            break;
        case 'OFERTA_PRESENTADA':
            colorClass = 'bg-purple-100 text-purple-700 border-purple-200';
            label = 'Oferta Presentada';
            break;
        case 'OFERTA_ADJUDICADA':
            colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
            label = 'Oferta Adjudicada';
            break;
        case 'TERMINADO':
            colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
            label = 'Terminado';
            break;
        default:
            // Fallback for string matching if exact enum isn't used
            if (status.includes('ADJUDICADA') || status.includes('EJECUCION')) {
                colorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
            }
            break;
    }

    return (
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter border ${colorClass}`}>
            {label.replace(/_/g, ' ')}
        </span>
    );
};
