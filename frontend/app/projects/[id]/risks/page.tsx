"use client";

import React from 'react';
import { ProjectRiskAssessment } from '@/components/project/ProjectRiskAssessment'; // Reuse existing component or creating a wrapper
import { AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

interface PageProps {
    params: { id: string };
}

export default function ProjectRisksPage({ params }: PageProps) {
    const projectId = parseInt(params.id);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-600" />
                        Gestión de Riesgos del Proyecto
                    </h2>
                    <p className="text-slate-500 mt-1">Análisis predictivo y mitigación temprana.</p>
                </div>
                <div className="text-right">
                    <span className="bg-rose-100 text-rose-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                        <AlertTriangle size={16} />
                        Riesgo Crítico Detectado
                    </span>
                </div>
            </div>

            {/* Reuse the existing AI Risk Assessment Component */}
            <ProjectRiskAssessment
                projectId={projectId}
                onClose={() => { }} // No-op since it's embedded here, not a modal
            />
        </div>
    );
}
