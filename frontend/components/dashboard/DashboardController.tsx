"use client";

import React, { useState } from 'react';
import { FinancialView } from './FinancialView';
import { HRView } from './HRView';
import { OperationsView } from './OperationsView';
import { QualityDashboard } from '../qaqc/QualityDashboard'; // Reusing QA/QC from previous prompt
import { LayoutDashboard, TrendingUp, Users, ShieldCheck, Printer } from 'lucide-react';

export default function DashboardController() {
    const [activeView, setActiveView] = useState<'GENERAL' | 'FINANCE' | 'HR' | 'QAQC'>('GENERAL');

    return (
        <div className="space-y-8">

            {/* Header & View Selector */}
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Panel de Control Unificado</h1>
                    <p className="text-sm text-gray-500">Proyecto: Edificio Mirador Norte | ID: PRO-2026-001</p>
                </div>

                {/* Persona Switcher */}
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <button
                        onClick={() => setActiveView('GENERAL')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'GENERAL' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <LayoutDashboard size={16} className="mr-2" /> Operaciones
                    </button>
                    <button
                        onClick={() => setActiveView('FINANCE')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'FINANCE' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <TrendingUp size={16} className="mr-2" /> Finanzas
                    </button>
                    <button
                        onClick={() => setActiveView('HR')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'HR' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Users size={16} className="mr-2" /> RRHH
                    </button>
                    <button
                        onClick={() => setActiveView('QAQC')}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'QAQC' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <ShieldCheck size={16} className="mr-2" /> Calidad
                    </button>
                </div>
            </div>

            {/* Content Render */}
            <div className="min-h-[500px]">
                {activeView === 'GENERAL' && <OperationsView projects={[]} />}
                {activeView === 'FINANCE' && <FinancialView />}
                {activeView === 'HR' && <HRView />}
                {activeView === 'QAQC' && <QualityDashboard />}
            </div>

        </div>
    );
}
