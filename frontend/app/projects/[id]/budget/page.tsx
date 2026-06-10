"use client";
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
