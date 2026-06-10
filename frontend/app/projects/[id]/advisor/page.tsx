"use client";

import React, { useEffect, useState } from 'react';
import { ChatWidget } from '@/components/advisor/ChatWidget';
import { FileText, Database, Bot } from 'lucide-react';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';

interface PageProps {
    params: { id: string };
}

export default function ProjectAdvisorPage({ params }: PageProps) {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error(err));
        }
    }, [params.id]);

    if (!project) return <div>Cargando...</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col animate-in fade-in duration-500">
            {/* Header Context */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bot className="text-indigo-400" />
                        Asesor IA - Contexto Activo: {project.name}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Utilizando RAG para consultar documentos específicos de este proyecto (Contratos, Planos, EETT).
                    </p>
                </div>
                <div className="flex gap-2 text-xs">
                    <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                        <Database size={12} className="text-emerald-400" /> 150 Vectores
                    </span>
                    <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                        <FileText size={12} className="text-blue-400" /> 12 Documentos
                    </span>
                </div>
            </div>

            {/* Chat Interface (Expanded) */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                <ChatWidget embedded={true} projectId={project.id} />
            </div>
        </div>
    );
}
