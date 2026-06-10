"use client";
import React, { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { projectService } from '@/services/projectService';
import { DashboardCockpit } from '@/components/dashboard/DashboardCockpit';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('No se pudo conectar con el servidor de ConstructIA. Verifique que el backend esté corriendo en el puerto 8000.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Cargando Portafolio ConstructIA...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-20">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-4">
                    <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Error de Conexión</h3>
                        <p className="text-red-700 mt-1">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                        >
                            Reintentar Conexión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafc] min-h-full">
            <DashboardCockpit projects={projects} />
        </div>
    );
}
