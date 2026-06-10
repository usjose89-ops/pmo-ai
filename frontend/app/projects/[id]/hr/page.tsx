"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { HumanResources } from '@/components/project/HumanResources';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';

export default function ProjectHrPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error("Error loading project in HR module:", err));
        }
    }, [params.id]);

    if (!project) return <div className="p-10 text-center">Cargando módulo RRHH...</div>;

    return (
        <HumanResources project={project} />
    );
}
