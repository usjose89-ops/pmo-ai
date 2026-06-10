"use client";

import React, { useState } from 'react';
import { HumanResources } from './HumanResources';
import { ProjectStatusHeader } from './ProjectStatusHeader';
import { MOCK_PROJECT } from '../../data/mockData';
import { AlertTriangle, LayoutDashboard, Users, CreditCard, BarChart } from 'lucide-react';
import { HistoricalAlerts } from './HistoricalAlerts';
import { LessonsLearnedForm } from './LessonsLearnedForm';
import { SmartResourceRow } from '../../components/budget/SmartResourceRow';

export default function ProjectDetail() {
    const [activeModule, setActiveModule] = useState<'DASHBOARD' | 'RRHH' | 'BUDGET'>('RRHH');
    const [showClosureForm, setShowClosureForm] = useState(false);

    return (
        <div className="space-y-6">
            {showClosureForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="max-w-2xl w-full">
                        <LessonsLearnedForm onSave={() => setShowClosureForm(false)} />
                    </div>
                </div>
            )}

            <HistoricalAlerts client={MOCK_PROJECT.client} location={MOCK_PROJECT.location} />

            <div className="flex justify-end mb-2">
                <button
                    onClick={() => setShowClosureForm(true)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                >
                    [Simular Cierre de Proyecto]
                </button>
            </div>

            {/* Project Header */}
            <ProjectStatusHeader project={MOCK_PROJECT} />

            {/* Main Navigation Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveModule('DASHBOARD')}
                    className={`pb-3 border-b-2 flex items-center font-medium ${activeModule === 'DASHBOARD' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <LayoutDashboard size={18} className="mr-2" /> Dashboard
                </button>
                <button
                    onClick={() => setActiveModule('RRHH')}
                    className={`pb-3 border-b-2 flex items-center font-medium ${activeModule === 'RRHH' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Users size={18} className="mr-2" /> RRHH (Equipo)
                </button>
                <button
                    onClick={() => setActiveModule('BUDGET')}
                    className={`pb-3 border-b-2 flex items-center font-medium ${activeModule === 'BUDGET' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <CreditCard size={18} className="mr-2" /> Presupuesto
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in zoom-in-95 duration-200">
                {activeModule === 'RRHH' && <HumanResources />}

                {activeModule === 'DASHBOARD' && (
                    <div className="p-12 text-center text-gray-400 border-2 border-dashed rounded-lg">
                        Dashboard Overview Placeholder
                    </div>
                )}
                {activeModule === 'BUDGET' && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="mr-2 text-indigo-600" size={20} />
                            Presupuesto Inteligente (Demo APU)
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Prueba cambiando el precio de la <b>Camioneta 4x4</b> a un valor bajo (ej: 900.000) para ver la IA histórica en acción.
                        </p>

                        <div className="space-y-1">
                            <SmartResourceRow
                                name="Camioneta 4x4 Minera"
                                unitPrice={1200000}
                                quantity={1}
                                benchmark={1100000}
                            />
                            <SmartResourceRow
                                name="Jornalero"
                                unitPrice={45000}
                                quantity={1}
                                benchmark={42000}
                            />
                            <SmartResourceRow
                                name="Petróleo Diesel"
                                unitPrice={1200}
                                quantity={1}
                                benchmark={1100}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
