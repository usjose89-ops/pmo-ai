import React from 'react';
import { TaskManager } from '@/components/operations/TaskManager';

export default function TasksPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Compromisos</h1>
                <p className="text-sm text-gray-500">Asignación, seguimiento y control de atrasos.</p>
            </div>

            <TaskManager />
        </div>
    );
}
