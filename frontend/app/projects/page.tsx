"use client";
import React, { useState, useEffect } from 'react';
import { ProjectsList } from '@/components/dashboard/ProjectsList';
import { supabaseProjectService } from '@/services/supabaseProjectService';
import { Project } from '@/types/project';
import { Loader2 } from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadProjects = async () => {
        setIsLoading(true);
        const data = await supabaseProjectService.getProjects();
        setProjects(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div className="p-10 space-y-8 animate-in fade-in duration-500 bg-[#f8fafc] min-h-full relative">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-indigo-500">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-medium text-slate-500">Cargando portafolio real...</p>
                </div>
            ) : (
                <ProjectsList 
                    projects={projects} 
                />
            )}
        </div>
    );
}
