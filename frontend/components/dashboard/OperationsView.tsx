"use client";

import { Project } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { Flag, Activity, CloudSun, Wind, Droplets } from 'lucide-react';

interface OperationsViewProps {
    projects: Project[];
}

export function OperationsView({ projects }: OperationsViewProps) {
    const avgProgress = projects.length > 0 
        ? projects.reduce((acc, p) => acc + p.advance_physical, 0) / projects.length 
        : 0;
    
    // Real SPI Calculation from backend data
    const avgSPIValue = projects.length > 0
        ? projects.reduce((acc, p) => acc + (p.financials?.spi || 0), 0) / projects.length
        : 1.0;
    
    const spiValueString = avgSPIValue.toFixed(2);
    const spiColor = avgSPIValue >= 1 ? 'text-emerald-500' : 'text-rose-500';
    const spiStatusText = avgSPIValue >= 1 ? 'A Tiempo' : 'Atrasado';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* S-Curve Placeholder */}
            <Card title="Curva S (Avance Físico vs Financiero)">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-100 relative overflow-hidden">
                    {/* Mock Chart Lines */}
                    <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                        {/* Grid */}
                        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#e5e7eb" strokeWidth="1" />

                        {/* Planned Curve (Blue) */}
                        <path d="M0,256 C100,240 200,100 800,20" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="5,5" />

                        {/* Actual Curve (Green) */}
                        <path d="M0,256 C100,250 200,120 400,100" fill="none" stroke="#10b981" strokeWidth="3" />

                        {/* Projection (Red Dotted) */}
                        <path d="M400,100 C500,90 700,40 800,20" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2,2" />
                    </svg>

                    <div className="absolute bottom-4 right-4 flex space-x-4 bg-white/80 p-2 rounded shadow text-xs">
                        <span className="flex items-center"><div className="w-3 h-1 bg-blue-500 mr-1"></div> Planificado</span>
                        <span className="flex items-center"><div className="w-3 h-1 bg-emerald-500 mr-1"></div> Real</span>
                        <span className="flex items-center"><div className="w-3 h-1 bg-rose-500 mr-1"></div> Proyección</span>
                    </div>
                </div>
            </Card>

            {/* OPERATIONAL METRICS ROW (Prompt 15: SPI & Weather) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* WIDGET A: SPI (Schedule Performance Index) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Activity className="mr-2 text-indigo-600" size={18} /> Índice de Desempeño (SPI)
                    </h3>
                    <div className="flex items-end space-x-2">
                        <span className={`text-5xl font-bold ${spiColor}`}>{spiValueString}</span>
                        <span className={`text-sm font-medium ${spiColor} mb-2 uppercase`}>
                            {spiStatusText} (Target: 1.0)
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                        <div className={`h-2 rounded-full ${spiColor.replace('text-', 'bg-')}`} style={{ width: `${Math.min(avgSPIValue * 100, 100)}%` }}></div>
                    </div>
                </div>

                {/* WIDGET C: WEATHER (Clima en Faena) */}
                <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center text-white/90">
                        <CloudSun className="mr-2" size={18} /> Clima en Faena (Norte Grande)
                    </h3>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-5xl font-bold">28°C</span>
                            <span className="text-sm opacity-90">Despejado, Índice UV Extremo</span>
                        </div>
                        <CloudSun size={64} className="opacity-80" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 text-sm opacity-90">
                        <div className="flex items-center"><Wind size={16} className="mr-2" /> 45 km/h (Alerta Izaje)</div>
                        <div className="flex items-center"><Droplets size={16} className="mr-2" /> Humedad 10%</div>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                    <Flag className="mr-2 text-indigo-600" size={18} /> Hitos Contractuales Clave
                </h3>
                <div className="relative border-l-2 border-indigo-100 pl-6 space-y-8">
                    <div className="relative">
                        <div className="absolute -left-[33px] bg-emerald-500 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Completado</p>
                        <h4 className="font-bold text-gray-800">Inicio de Excavaciones</h4>
                        <p className="text-sm text-gray-500">15 de Enero 2026</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[33px] bg-emerald-500 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Completado</p>
                        <h4 className="font-bold text-gray-800">Primera Entrega de Hormigones</h4>
                        <p className="text-sm text-gray-500">20 de Febrero 2026</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[33px] bg-white h-4 w-4 rounded-full border-4 border-indigo-500 shadow-sm animate-pulse"></div>
                        <p className="text-xs text-indigo-600 font-bold uppercase mb-1">En Proceso</p>
                        <h4 className="font-bold text-gray-800">Término Obra Gruesa (Torre A)</h4>
                        <p className="text-sm text-gray-500">Est. 10 de Mayo 2026</p>
                    </div>
                    <div className="relative opacity-50">
                        <div className="absolute -left-[33px] bg-gray-200 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Futuro</p>
                        <h4 className="font-bold text-gray-800">Recepción Municipal</h4>
                        <p className="text-sm text-gray-500">15 de Septiembre 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
