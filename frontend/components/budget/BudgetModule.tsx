"use client";

import React, { useState } from 'react';
import { Project, ProjectStatus } from '@/types/project';
import { BudgetGrid } from './BudgetGrid';
import { ClientBudgetView } from './ClientBudgetView';
import { InternalControlView } from './InternalControlView';
import { Briefcase, ShieldCheck } from 'lucide-react';

interface BudgetModuleProps {
    project: Project;
}

export const BudgetModule: React.FC<BudgetModuleProps> = ({ project }) => {
    // Determine mode based on project status
    const isStudyPhase = project.status === ProjectStatus.EN_ANALISIS || project.status === ProjectStatus.EN_LICITACION;
    const isActivePhase = !isStudyPhase; // Simplified for now (Adjudicado, Ejecucion, etc)

    const [activeView, setActiveView] = useState<'CLIENT' | 'INTERNAL'>('CLIENT');

    if (isStudyPhase) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Generador de Presupuesto</h2>
                        <p className="text-slate-500">Fase de Estudio: Edita y optimiza tus APUs antes de ofertar.</p>
                    </div>
                </div>
                <BudgetGrid projectId={project.id} />
            </div>
        );
    }

    // Active Phase: Dual View
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gestión Presupuestaria</h2>
                    <p className="text-slate-500">Proyecto Activo: {project.name}</p>
                </div>

                {/* View Switcher */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center font-bold text-sm">
                    <button
                        onClick={() => setActiveView('CLIENT')}
                        className={`px-4 py-2 rounded-lg flex items-center transition-all ${activeView === 'CLIENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase size={16} className="mr-2" />
                        Vista Cliente
                    </button>
                    <button
                        onClick={() => setActiveView('INTERNAL')}
                        className={`px-4 py-2 rounded-lg flex items-center transition-all ${activeView === 'INTERNAL' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <ShieldCheck size={16} className="mr-2" />
                        Control Interno
                    </button>
                </div>
            </div>

            {/* Content Render */}
            <div className="min-h-[400px]">
                {activeView === 'CLIENT' ? (
                    <ClientBudgetView
                        pdfPath="C:\ConstructIA_MVP\project_storage\BP1_Subestacion_OHiggins\2_PRESUPUESTO\Oferta económica de STN actualizado al 30.09.2025.pdf"
                    />
                ) : (
                    <InternalControlView />
                )}
            </div>
        </div>
    );
};
