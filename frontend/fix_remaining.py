import os

# 1. QA PAGE
file_qa = r"c:\ConstructIA_MVP\frontend\app\projects\[id]\qa\page.tsx"
content_qa = """"use client";

import React, { useEffect, useState } from 'react';
import { QualityDashboard } from '@/components/qaqc/QualityDashboard';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';

export default function ProjectQAPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error(err));
        }
    }, [params.id]);

    if (!project) return <div>Cargando...</div>;

    return <QualityDashboard project={project} />;
}
"""
with open(file_qa, 'w', encoding='utf-8') as f: f.write(content_qa)

# 2. OPERATIONS PAGE
file_op = r"c:\ConstructIA_MVP\frontend\app\projects\[id]\operations\page.tsx"
content_op = """"use client";

import React, { useEffect, useState } from 'react';
import { ProjectBoard } from '@/components/operations/ProjectBoard';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';

export default function ProjectOperationsPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error(err));
        }
    }, [params.id]);

    if (!project) return <div>Cargando...</div>;

    return <ProjectBoard project={project} />;
}
"""
with open(file_op, 'w', encoding='utf-8') as f: f.write(content_op)

# 3. BUDGET PAGE
file_budget = r"c:\ConstructIA_MVP\frontend\app\projects\[id]\budget\page.tsx"
content_budget = """"use client";
import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { SmartResourceRow } from '@/components/budget/SmartResourceRow';
import { BudgetModule } from '@/components/budget/BudgetModule';
import { ProposalGenerator } from '@/components/proposal/ProposalGenerator';
import { ProjectStatus, Project } from '@/types/project';
import { projectService } from '@/services/projectService';

export default function ProjectBudgetPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error(err));
        }
    }, [params.id]);

    if (!project) return <div>Cargando...</div>;

    const isStudy = project.status === ProjectStatus.EN_ANALISIS || project.status === ProjectStatus.EN_LICITACION;

    if (isStudy) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4">
                <ProposalGenerator />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            <BudgetModule project={project} />
        </div>
    );
}
"""
with open(file_budget, 'w', encoding='utf-8') as f: f.write(content_budget)

# 4. ADVISOR PAGE
file_adv = r"c:\ConstructIA_MVP\frontend\app\projects\[id]\advisor\page.tsx"
content_adv = """"use client";

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
"""
with open(file_adv, 'w', encoding='utf-8') as f: f.write(content_adv)

print("Done generating pages!")
