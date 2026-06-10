import React from 'react';
import { GlobalOperationsMonitor } from '@/components/operations/GlobalOperationsMonitor';

export default function OperationsPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Monitor Global de Operaciones</h1>
                <p className="text-sm text-slate-500 font-medium"> Supervisión consolidada de puntos críticos y KPIs de proyectos activos.</p>
            </div>

            <GlobalOperationsMonitor />
        </div>
    );
}
