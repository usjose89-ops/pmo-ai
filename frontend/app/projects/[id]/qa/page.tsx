"use client";

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
