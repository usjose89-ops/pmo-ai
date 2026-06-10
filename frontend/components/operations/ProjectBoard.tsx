"use client";

import React, { useState, useEffect } from 'react';
import { Columns, Calendar, Filter, MoreHorizontal, Plus, Edit2, Trash2 } from 'lucide-react';
import { TaskDetailPanel } from './TaskDetailPanel';

// Mock Data
const TASKS = [
    { id: 1, title: 'Instalación de Faenas', status: 'Done', assignee: 'JP', start: 1, duration: 5 },
    { id: 2, title: 'Excavaciones Masivas', status: 'In Progress', assignee: 'MR', start: 4, duration: 8 },
    { id: 3, title: 'Emplantillado', status: 'To Do', assignee: 'JP', start: 10, duration: 3 },
    { id: 4, title: 'Enfierradura Muros', status: 'Blocked', assignee: 'MR', start: 12, duration: 6 },
    { id: 5, title: 'Moldaje Muros', status: 'To Do', assignee: 'JP', start: 16, duration: 5 },
];

const TASKS_TROLLEY = [
    { id: 101, title: 'Desmovilización de Faenas', status: 'Done', assignee: 'PM', start: 1, duration: 15 },
    { id: 102, title: 'Entrega Dossier Calidad', status: 'QA/QC', assignee: 'CV', start: 10, duration: 10 },
    { id: 103, title: 'Cierre Administrativo', status: 'In Progress', assignee: 'PM', start: 15, duration: 20 },
    { id: 104, title: 'Firma Acta Recepción Provisoria', status: 'To Do', assignee: 'JP', start: 35, duration: 1 },
];

const TASKS_BP1 = [
    { id: 201, title: 'Instalación de Faenas (Campamento)', status: 'In Progress', assignee: 'FT', start: 1, duration: 15 },
    { id: 202, title: 'Topografía Inicial y Replanteo', status: 'Done', assignee: 'JP', start: 1, duration: 3 },
    { id: 203, title: 'Excavación Bancos de Ductos', status: 'In Progress', assignee: 'MG', start: 5, duration: 10 },
    { id: 204, title: 'Enfierradura Fundación Malla Puesta a Tierra', status: 'To Do', assignee: 'MG', start: 15, duration: 5 },
    { id: 205, title: 'Hormigonado Fundaciones Equipos', status: 'Blocked', assignee: 'FT', start: 20, duration: 8 },
];

const COLUMNS = [
    { id: 'To Do', label: 'Por Hacer', color: 'border-t-gray-400' },
    { id: 'In Progress', label: 'En Progreso', color: 'border-t-blue-500' },
    { id: 'Blocked', label: 'Bloqueado', color: 'border-t-red-500' },
    { id: 'QA/QC', label: 'Revisión Calidad', color: 'border-t-purple-500' },
    { id: 'Done', label: 'Terminado', color: 'border-t-green-500' },
];

import { saveProjectData, loadProjectData } from '@/utils/persistence';

// ... (imports)

export function ProjectBoard({ project }: { project?: any }) {
    const [view, setView] = useState<'KANBAN' | 'GANTT'>('KANBAN');
    const [tasks, setTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    // Load Data
    useEffect(() => {
        if (project) {
            let defaultData = TASKS;
            if (project.name === 'TROLLEY') defaultData = TASKS_TROLLEY;
            if (project.name === 'Subestación O´Higgins') defaultData = TASKS_BP1;

            const loadedData = loadProjectData(project.id || 0, 'OPERATIONS', defaultData);
            setTasks(loadedData);
        }
    }, [project]);

    // Save Data
    useEffect(() => {
        if (project && tasks.length > 0) {
            saveProjectData(project.id || 0, 'OPERATIONS', tasks);
        }
    }, [tasks, project]);

    // Edit Handlers
    const updateTaskStatus = (taskId: number, newStatus: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const updateTaskTitle = (taskId: number, newTitle: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title: newTitle } : t));
    };

    const addTask = () => {
        const newTask = {
            id: Date.now(),
            title: 'Nueva Tarea',
            status: 'To Do',
            assignee: '??',
            start: 1,
            duration: 1
        };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (taskId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Eliminar tarea?')) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView('KANBAN')}
                        className={`px-3 py-1.5 rounded flex items-center text-sm font-medium transition-all ${view === 'KANBAN' ? 'bg-white shadow text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Columns size={16} className="mr-2" /> Kanban
                    </button>
                    <button
                        onClick={() => setView('GANTT')}
                        className={`px-3 py-1.5 rounded flex items-center text-sm font-medium transition-all ${view === 'GANTT' ? 'bg-white shadow text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Calendar size={16} className="mr-2" /> Gantt
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button onClick={addTask} className="px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 flex items-center">
                        <Plus size={16} className="mr-2" /> Nueva Tarea
                    </button>
                </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">

                {/* KANBAN VIEW */}
                {view === 'KANBAN' && (
                    <div className="flex h-full space-x-4 min-w-max pb-4">
                        {COLUMNS.map(col => (
                            <div key={col.id} className={`w-72 bg-gray-50 rounded-xl flex flex-col border-t-4 ${col.color} shadow-sm`}>
                                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-sm text-slate-700">{col.label}</h3>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                                        {tasks.filter(t => t.status === col.id).length}
                                    </span>
                                </div>
                                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                    {tasks.filter(t => t.status === col.id).map(task => (
                                        <div
                                            key={task.id}
                                            className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 group ${task.status === 'Blocked' ? 'bg-red-50 border-red-100' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-gray-400">#{task.id}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => deleteTask(task.id, e)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>

                                            {/* Editable Title */}
                                            <input
                                                className="w-full text-sm font-medium text-slate-800 mb-3 bg-transparent border-transparent hover:border-gray-200 border rounded px-1 focus:bg-white focus:border-indigo-500 outline-none"
                                                value={task.title}
                                                onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                                            />

                                            <div className="flex justify-between items-center mt-2">
                                                <div className="h-6 w-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white cursor-pointer" title="Asignado a">
                                                    {task.assignee}
                                                </div>

                                                {/* Status Dropdown (Mini) */}
                                                <select
                                                    className="text-xs border rounded bg-slate-50 text-slate-600 max-w-[80px]"
                                                    value={task.status}
                                                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                >
                                                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* GANTT VIEW (SIMULATED) */}
                {view === 'GANTT' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden flex flex-col">
                        <div className="flex border-b border-gray-200 bg-gray-50">
                            <div className="w-64 p-3 font-semibold text-xs text-gray-500 uppercase border-r border-gray-200 sticky left-0 bg-gray-50 z-10">Tarea</div>
                            <div className="flex-1 flex">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div key={i} className="flex-1 min-w-[40px] border-r border-gray-100 p-2 text-center text-xs text-gray-400">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {tasks.map(task => (
                                <div key={task.id} className="flex border-b border-gray-100 hover:bg-gray-50 group">
                                    <div className="w-64 p-3 text-sm font-medium text-slate-700 border-r border-gray-100 sticky left-0 bg-white group-hover:bg-gray-50 z-10">
                                        <input
                                            value={task.title}
                                            onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                                            className="w-full bg-transparent border-none outline-none focus:underline"
                                        />
                                        <span className="text-xs text-gray-400 block">{task.duration}d</span>
                                    </div>
                                    <div className="flex-1 flex relative py-2">
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <div key={i} className="flex-1 min-w-[40px] border-r border-gray-50"></div>
                                        ))}
                                        <div
                                            className={`absolute h-6 rounded-full top-2 shadow-sm ${task.status === 'Done' ? 'bg-green-500' :
                                                task.status === 'Blocked' ? 'bg-red-500' :
                                                    task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                                                } cursor-pointer hover:opacity-80`}
                                            style={{
                                                left: `calc(${(task.start - 1) * 3.33}% + 2px)`,
                                                width: `calc(${task.duration * 3.33}% - 4px)`
                                            }}
                                            onClick={() => setSelectedTask(task)}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Detail Panel */}
            {selectedTask && (
                <TaskDetailPanel
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}
