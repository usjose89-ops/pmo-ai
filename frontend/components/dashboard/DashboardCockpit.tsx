"use client";

import React, { useState } from 'react';
import { FinancialView } from './FinancialView';
import { OperationsView } from './OperationsView';
import { ClientView } from './ClientView';
import { LayoutDashboard, HardHat, Briefcase } from 'lucide-react';

type Persona = 'MANAGEMENT' | 'OPERATIONS' | 'CLIENT';

import { Project } from '@/types/project';

interface DashboardCockpitProps {
    projects: Project[];
}

export function DashboardCockpit({ projects }: DashboardCockpitProps) {
    const [activePersona, setActivePersona] = useState<Persona>('MANAGEMENT');
    const [portfolioFilter, setPortfolioFilter] = useState<'TODOS' | 'ACTIVOS' | 'EN_ESTUDIO'>('TODOS');

    const filteredProjects = projects.filter(p => {
        if (portfolioFilter === 'TODOS') return true;
        if (portfolioFilter === 'ACTIVOS') return p.status !== 'EN_ANALISIS' && p.status !== 'TERMINADO';
        if (portfolioFilter === 'EN_ESTUDIO') return p.status === 'EN_ANALISIS' || p.status === 'EN_LICITACION';
        return true;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">

            {/* Header & Persona Selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <LayoutDashboard className="mr-3 text-indigo-600" />
                        Dashboard 360° (PMO AI)
                    </h1>

                    {/* Project Filter Segmented Control */}
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
                            {[
                                { id: 'TODOS', label: 'Todos los Proyectos' },
                                { id: 'ACTIVOS', label: 'En Ejecución' },
                                { id: 'EN_ESTUDIO', label: 'Pipeline Licitaciones' }
                            ].map(filterObj => (
                                <button
                                    key={filterObj.id}
                                    onClick={() => setPortfolioFilter(filterObj.id as any)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${portfolioFilter === filterObj.id
                                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {filterObj.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Persona Switcher (Prompt 15) */}
                <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex space-x-1">
                    <button
                        onClick={() => setActivePersona('MANAGEMENT')}
                        className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-all ${activePersona === 'MANAGEMENT'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Briefcase size={16} className="mr-2" /> Gerencia
                    </button>
                    <button
                        onClick={() => setActivePersona('OPERATIONS')}
                        className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-all ${activePersona === 'OPERATIONS'
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <HardHat size={16} className="mr-2" /> Operaciones
                    </button>
                    <button
                        onClick={() => setActivePersona('CLIENT')}
                        className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-all ${activePersona === 'CLIENT'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <span className="mr-2">🤝</span> Cliente
                    </button>
                </div>
            </div>

            {/* Dynamic View Rendering */}
            <div className={`rounded-xl border ${portfolioFilter === 'EN_ESTUDIO' ? 'bg-[#111318] border-[#1f232b]' : 'bg-slate-50 border-slate-200'} p-4 md:p-6 min-h-[600px]`}>
                {activePersona === 'MANAGEMENT' && <FinancialView projects={filteredProjects} isPipelineMode={portfolioFilter === 'EN_ESTUDIO'} />}
                {activePersona === 'OPERATIONS' && <OperationsView projects={filteredProjects} />}
                {activePersona === 'CLIENT' && <ClientView projects={filteredProjects} />}
            </div>
        </div>
    );
}

