"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, HardHat, ClipboardCheck, Bot, AlertTriangle } from 'lucide-react';
import { ProjectStatusHeader } from '@/components/project/ProjectStatusHeader';
import { HistoricalAlerts } from '@/components/project/HistoricalAlerts';
import { LessonsLearnedForm } from '@/components/project/LessonsLearnedForm';
import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';


export default function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const pathname = usePathname();
    const [showClosureForm, setShowClosureForm] = React.useState(false);
    const [project, setProject] = React.useState<Project | null>(null);

    React.useEffect(() => {
        if (params.id) {
            projectService.getProject(Number(params.id))
                .then(setProject)
                .catch(err => console.error("Error loading project in layout:", err));
        }
    }, [params.id]);

    if (!project) {
        return <div className="p-10 text-center font-medium text-slate-500">Cargando contexto del proyecto...</div>;
    }

    // Determine active tab for styling
    // /projects/1 -> DASHBOARD
    // /projects/1/hr -> HR
    // /projects/1/budget -> BUDGET
    const isBudget = pathname?.includes('/budget');
    const isHr = pathname?.includes('/hr');
    const isOperations = pathname?.includes('/operations');
    const isQA = pathname?.includes('/qa');
    const isRisks = pathname?.includes('/risks');
    const isAdvisor = pathname?.includes('/advisor');
    const isDashboard = !isBudget && !isHr && !isOperations && !isQA && !isRisks && !isAdvisor;

    return (
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
            {showClosureForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="max-w-2xl w-full">
                        <LessonsLearnedForm onSave={() => setShowClosureForm(false)} />
                    </div>
                </div>
            )}

            <HistoricalAlerts client={project.client} location={project.location} />

            <div className="flex justify-end mb-2">
                <button
                    onClick={() => setShowClosureForm(true)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                >
                    [Simular Cierre de Proyecto]
                </button>
            </div>

            <ProjectStatusHeader project={project} />

            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 mb-6">
                <Link
                    href={`/projects/${project.id}`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isDashboard
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <LayoutDashboard size={18} className="mr-2" /> Dashboard
                </Link>

                <Link
                    href={`/projects/${project.id}/hr`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isHr
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users size={18} className="mr-2" /> RRHH (Equipo)
                </Link>

                <Link
                    href={`/projects/${project.id}/budget`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isBudget
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CreditCard size={18} className="mr-2" /> Presupuesto
                </Link>

                <Link
                    href={`/projects/${project.id}/operations`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isOperations
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <HardHat size={18} className="mr-2" /> Operaciones
                </Link>

                <Link
                    href={`/projects/${project.id}/qa`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isQA
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <ClipboardCheck size={18} className="mr-2" /> Calidad
                </Link>

                <Link
                    href={`/projects/${project.id}/risks`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isRisks
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <AlertTriangle size={18} className="mr-2" /> Riesgos
                </Link>

                <Link
                    href={`/projects/${project.id}/advisor`}
                    className={`pb-3 border-b-2 flex items-center font-medium transition-colors ${isAdvisor
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Bot size={18} className="mr-2" /> Asesor IA
                </Link>
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-200">
                {children}
            </div>
        </div >
    );
}
