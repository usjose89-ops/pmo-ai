"use client";
import React, { useState, useEffect } from 'react';
import { ProjectFormModal } from '@/components/project/ProjectFormModal';
import { supabaseProjectService } from '@/services/supabaseProjectService';
import { Project } from '@/types/project';
import { Loader2, Plus, Edit2, Trash2, Settings } from 'lucide-react';

export default function ProjectSetupPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const loadProjects = async () => {
        setIsLoading(true);
        const data = await supabaseProjectService.getProjects();
        setProjects(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleNewProject = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDeleteProject = async (id: string, name: string) => {
        if(confirm(`¿Estás seguro de que deseas ELIMINAR el proyecto "${name}" y todos sus datos? Esta acción no se puede deshacer.`)) {
            setIsLoading(true);
            const success = await supabaseProjectService.deleteProject(id);
            if(success) {
                await loadProjects();
            } else {
                setIsLoading(false);
                alert("Error al eliminar el proyecto.");
            }
        }
    };

    const handleSave = () => {
        loadProjects();
    };

    return (
        <div className="p-10 space-y-8 animate-in fade-in duration-500 bg-[#f8fafc] min-h-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configuración de Proyectos</h1>
                        <p className="text-slate-500 text-sm mt-1">Administración centralizada: Crear, Editar y Eliminar proyectos del sistema.</p>
                    </div>
                </div>
                <button
                    onClick={handleNewProject}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="mr-2" size={20} />
                    Crear Proyecto
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="p-4 pl-6">Nombre del Proyecto</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Riesgo</th>
                                <th className="p-4 text-right pr-6">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500">
                                        <Loader2 size={32} className="animate-spin mx-auto text-indigo-500 mb-4" />
                                        Cargando datos de proyectos...
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500 italic">
                                        No hay proyectos registrados en la base de datos.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-slate-800">{project.name}</div>
                                            <div className="text-xs text-slate-400">{project.subtitle || 'Sin subtítulo'}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-medium">
                                            {project.client}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                {project.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                                                project.risk_score >= 4 ? 'bg-rose-100 text-rose-700' : 
                                                project.risk_score >= 2.6 ? 'bg-amber-100 text-amber-700' : 
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                Nivel {project.risk_score}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEditProject(project)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Editar Proyecto"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProject(project.id, project.name)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Eliminar Proyecto"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProjectFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingProject}
            />
        </div>
    );
}
