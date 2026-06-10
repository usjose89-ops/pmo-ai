"use client";

import { Project } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { HardHat, ShieldCheck, Activity } from 'lucide-react';

interface ClientViewProps {
    projects: Project[];
}

export function ClientView({ projects }: ClientViewProps) {
    const avgProgress = projects.length > 0 
        ? Math.round(projects.reduce((acc, p) => acc + p.advance_physical, 0) / projects.length)
        : 0;
    
    // SVG Dasharray calculation for circle circumference (2 * PI * R)
    // R = 56, so 2 * 3.14159 * 56 = 351.85
    const circumference = 351.85;
    const offset = circumference - (avgProgress / 100) * circumference;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Disclaimer for Client */}
            <div className="bg-slate-800 text-white p-4 rounded-lg flex items-center shadow-lg">
                <HardHat className="mr-3 text-yellow-400" size={24} />
                <div>
                    <h4 className="font-bold text-lg">Vista de Cliente (Externa)</h4>
                    <p className="text-sm text-slate-300">Resumen ejecutivo de avance y seguridad. Información financiera interna restringida.</p>
                </div>
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Avance Físico Global">
                    <div className="flex flex-col items-center justify-center p-6">
                        <div className="relative h-32 w-32 mb-4">
                            {/* Circular Progress Mock */}
                            <svg className="h-full w-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                                <circle 
                                    cx="64" cy="64" r="56" stroke="#3b82f6" strokeWidth="12" fill="none" 
                                    strokeDasharray={circumference} 
                                    strokeDashoffset={offset}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-700">{avgProgress}%</span>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 p-2 rounded">
                                <span className="block text-xs uppercase text-blue-500 font-bold">Portafolio</span>
                                <span className="text-lg font-bold text-blue-800">100%</span>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded">
                                <span className="block text-xs uppercase text-emerald-500 font-bold">Real Avg</span>
                                <span className="text-lg font-bold text-emerald-800">{avgProgress}%</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Estadísticas HSEC (Seguridad)">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center">
                                <ShieldCheck className="text-emerald-500 mr-3" size={28} />
                                <div>
                                    <h5 className="font-bold text-emerald-800">Días Sin Accidentes</h5>
                                    <p className="text-xs text-emerald-600">Con Tiempo Perdido (CTP)</p>
                                </div>
                            </div>
                            <span className="text-4xl font-bold text-emerald-600">145</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border border-gray-100 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">HH Trabajadas</p>
                                <p className="text-xl font-bold text-gray-800">12,450</p>
                            </div>
                            <div className="p-3 border border-gray-100 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase">Reportes Incidentes</p>
                                <p className="text-xl font-bold text-gray-800">3</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Photos / Evidence */}
            <Card title="Evidencia Fotográfica Reciente">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Foto 1 (Mock)
                    </div>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Foto 2 (Mock)
                    </div>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        Foto 3 (Mock)
                    </div>
                </div>
            </Card>
        </div>
    );
}
