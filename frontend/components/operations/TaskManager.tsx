"use client";

import React, { useState } from 'react';
import { Mail, AlertOctagon, CalendarClock, User, CheckCircle, AlertTriangle, Calendar, LayoutList, Columns, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';

// Types
interface Task {
    id: string;
    name: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    deadline: string;
    responsible: string;
    responsibleAvatar: string;
    status: 'ON_TIME' | 'DELAYED';
    delayReason?: string;
    completionStatus: 'PENDING' | 'DONE';
    kanbanStatus: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE'; // Added for Prompt 14
}

const MOCK_TASKS: Task[] = [
    { id: '1', name: 'Entrega Protocolo Topografía', priority: 'HIGH', deadline: '2026-03-10', responsible: 'Juan Pérez', responsibleAvatar: 'JP', status: 'ON_TIME', completionStatus: 'PENDING', kanbanStatus: 'IN_PROGRESS' },
    { id: '2', name: 'Montaje Grúa Torre', priority: 'HIGH', deadline: '2026-03-15', responsible: 'Maria Rojas', responsibleAvatar: 'MR', status: 'DELAYED', delayReason: 'Retraso llegada equipos.', completionStatus: 'PENDING', kanbanStatus: 'BLOCKED' },
    { id: '3', name: 'Revisión Planos Eje 5', priority: 'MEDIUM', deadline: '2026-03-12', responsible: 'Juan Pérez', responsibleAvatar: 'JP', status: 'ON_TIME', completionStatus: 'PENDING', kanbanStatus: 'TODO' },
    { id: '4', name: 'Solicitud Hormigón H30', priority: 'MEDIUM', deadline: '2026-03-13', responsible: 'Juan Pérez', responsibleAvatar: 'JP', status: 'ON_TIME', completionStatus: 'PENDING', kanbanStatus: 'TODO' },
    { id: '5', name: 'Charla Inducción', priority: 'LOW', deadline: '2026-03-14', responsible: 'Juan Pérez', responsibleAvatar: 'JP', status: 'ON_TIME', completionStatus: 'PENDING', kanbanStatus: 'TODO' },
    { id: '6', name: 'Compra EPP', priority: 'LOW', deadline: '2026-03-14', responsible: 'Juan Pérez', responsibleAvatar: 'JP', status: 'ON_TIME', completionStatus: 'PENDING', kanbanStatus: 'DONE' },
    { id: '7', name: 'Instalación Faenas', priority: 'HIGH', deadline: '2026-03-20', responsible: 'Carlos Ruiz', responsibleAvatar: 'CR', status: 'ON_TIME', completionStatus: 'PENDING', kanbanStatus: 'IN_PROGRESS' },
    { id: '8', name: 'Cierre Perimetral', priority: 'MEDIUM', deadline: '2026-03-18', responsible: 'Carlos Ruiz', responsibleAvatar: 'CR', status: 'DELAYED', delayReason: 'Falta de materiales.', completionStatus: 'PENDING', kanbanStatus: 'BLOCKED' },
];

type ViewMode = 'LIST' | 'KANBAN' | 'WORKLOAD';

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [viewMode, setViewMode] = useState<ViewMode>('KANBAN');
    const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [newDateBuffer, setNewDateBuffer] = useState<string>("");
    const [delayReason, setDelayReason] = useState("");

    // Form State
    const [newTaskName, setNewTaskName] = useState("");
    const [newPriority, setNewPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
    const [newDeadline, setNewDeadline] = useState("");
    const [newResponsible, setNewResponsible] = useState("Juan Pérez");

    const handleAssign = () => {
        const newTask: Task = {
            id: Date.now().toString(),
            name: newTaskName,
            priority: newPriority,
            deadline: newDeadline,
            responsible: newResponsible,
            responsibleAvatar: newResponsible.split(' ').map(n => n[0]).join(''),
            status: 'ON_TIME',
            completionStatus: 'PENDING',
            kanbanStatus: 'TODO'
        };
        setTasks([...tasks, newTask]);
        alert(`Compromiso asignado y notificado a ${newResponsible}`);
        setNewTaskName("");
        setNewDeadline("");
    };

    const handleDateChangeRequest = (task: Task, newDate: string) => {
        if (newDate > task.deadline) {
            setSelectedTask(task);
            setNewDateBuffer(newDate);
            setIsDelayModalOpen(true);
        } else {
            updateTaskDate(task.id, newDate);
        }
    };

    const updateTaskDate = (id: string, newDate: string, reason?: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                return {
                    ...t,
                    deadline: newDate,
                    status: reason ? 'DELAYED' : t.status,
                    delayReason: reason || t.delayReason
                };
            }
            return t;
        }));
    };

    const confirmDelay = () => {
        if (selectedTask && newDateBuffer && delayReason) {
            updateTaskDate(selectedTask.id, newDateBuffer, delayReason);
            setIsDelayModalOpen(false);
            setDelayReason("");
            setNewDateBuffer("");
            setSelectedTask(null);
        }
    };

    // -- Render Helpers --

    const renderTaskCard = (task: Task) => (
        <div key={task.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm mb-2 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                    task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {task.priority}
                </span>
                {task.status === 'DELAYED' && (
                    <span className="text-rose-600" title={task.delayReason}>
                        <AlertTriangle size={14} />
                    </span>
                )}
            </div>
            <p className="text-sm font-medium text-gray-800 mb-2 leading-tight">{task.name}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                    <Calendar size={12} className="mr-1" /> {task.deadline}
                </div>
                <div className="h-5 w-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {task.responsibleAvatar}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">

            {/* SECTION 1: THE ASSIGNER */}
            <Card title="Asignación de Compromisos">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre del Compromiso</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ej: Terminar Enfierradura Eje 5"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Prioridad</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as any)}
                        >
                            <option value="HIGH">Alta</option>
                            <option value="MEDIUM">Media</option>
                            <option value="LOW">Baja</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Fecha Límite</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleAssign}
                        className="w-full py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 flex items-center justify-center shadow-sm"
                    >
                        <Mail size={16} className="mr-2" />
                        Asignar y Notificar
                    </button>
                </div>
            </Card>

            {/* SECTION 2: THE WATCHTOWER */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                {/* Header & View Selector */}
                <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <AlertOctagon size={18} className="mr-2 text-slate-500" />
                        Tablero de Mando
                    </h3>
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => setViewMode('KANBAN')}
                            className={`px-3 py-1 text-xs font-medium rounded flex items-center transition-colors ${viewMode === 'KANBAN' ? 'bg-slate-100 text-slate-800' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Columns size={14} className="mr-1" /> Kanban
                        </button>
                        <button
                            onClick={() => setViewMode('WORKLOAD')}
                            className={`px-3 py-1 text-xs font-medium rounded flex items-center transition-colors ${viewMode === 'WORKLOAD' ? 'bg-slate-100 text-slate-800' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Users size={14} className="mr-1" /> Carga
                        </button>
                    </div>
                </div>

                {/* VIEW RENDERER */}
                <div className="p-6 bg-slate-50/50">

                    {/* --- VIEW: LIST (Restored) --- */}
                    {viewMode === 'LIST' && (
                        <table className="w-full text-left bg-white rounded-lg shadow-sm overflow-hidden">
                            <thead>
                                <tr className="bg-slate-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                                    <th className="px-6 py-3 font-semibold">Compromiso</th>
                                    <th className="px-6 py-3 font-semibold w-32">Responsable</th>
                                    <th className="px-6 py-3 font-semibold w-24">Prioridad</th>
                                    <th className="px-6 py-3 font-semibold w-40">Deadline</th>
                                    <th className="px-6 py-3 font-semibold w-32 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tasks.map(task => (
                                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-800">{task.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 mr-2">
                                                    {task.responsibleAvatar}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                                                task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar size={14} className="mr-2 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={task.deadline}
                                                    className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none w-28 cursor-pointer"
                                                    onChange={(e) => handleDateChangeRequest(task, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {task.status === 'ON_TIME' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    <CheckCircle size={12} className="mr-1" /> Al Día
                                                </span>
                                            ) : (
                                                <div className="group relative inline-block">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 cursor-help">
                                                        <AlertTriangle size={12} className="mr-1" /> Atrasado
                                                    </span>
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                                        {task.delayReason}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* --- VIEW: KANBAN (Prompt 14) --- */}
                    {viewMode === 'KANBAN' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
                            {/* COLUMNS: TODO, IN_PROGRESS, BLOCKED, DONE */}
                            {[
                                { id: 'TODO', title: 'Por Hacer', color: 'border-l-4 border-gray-400' },
                                { id: 'IN_PROGRESS', title: 'En Progreso', color: 'border-l-4 border-indigo-500' },
                                { id: 'BLOCKED', title: 'Bloqueado', color: 'border-l-4 border-rose-500 bg-rose-50' },
                                { id: 'DONE', title: 'Terminado', color: 'border-l-4 border-emerald-500' }
                            ].map(col => {
                                const colTasks = tasks.filter(t => (t as any).kanbanStatus === col.id);
                                return (
                                    <div key={col.id} className={`bg-slate-100 rounded-lg p-3 flex flex-col ${col.color}`}>
                                        <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 flex justify-between">
                                            {col.title}
                                            <span className="bg-white px-2 py-0.5 rounded shadow-sm text-gray-800">{colTasks.length}</span>
                                        </h4>
                                        <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1 scrollbar-thin">
                                            {colTasks.map(task => (
                                                <div key={task.id} className="cursor-move bg-white p-3 rounded border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' :
                                                                task.priority === 'MEDIUM' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                                            }`}>
                                                            {task.priority === 'HIGH' ? 'Alta' : task.priority === 'MEDIUM' ? 'Media' : 'Baja'}
                                                        </span>
                                                        {task.status === 'DELAYED' && (
                                                            <AlertTriangle size={14} className="text-rose-500 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-800 mb-2 line-clamp-2">{task.name}</p>
                                                    <div className="flex justify-between items-end border-t border-gray-50 pt-2 mt-2">
                                                        <div className="flex items-center text-[10px] text-gray-400">
                                                            <Calendar size={10} className="mr-1" />
                                                            {task.deadline}
                                                        </div>
                                                        <div className="h-6 w-6 bg-slate-100 border border-white shadow-sm rounded-full flex items-center justify-center text-[9px] font-bold text-slate-500">
                                                            {task.responsibleAvatar}
                                                        </div>
                                                    </div>
                                                    {(col.id === 'DONE' || col.id === 'BLOCKED') && (
                                                        <button className="w-full mt-2 text-[10px] bg-slate-50 hover:bg-slate-200 text-slate-600 py-1 rounded border border-slate-200 flex items-center justify-center transition-colors">
                                                            📸 {col.id === 'BLOCKED' ? 'Ver Issue' : 'Ver Evidencia'}
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* --- VIEW: WORKLOAD --- */}
                    {viewMode === 'WORKLOAD' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Array.from(new Set(tasks.map(t => t.responsible))).map(person => {
                                const personTasks = tasks.filter(t => t.responsible === person);
                                const count = personTasks.length;
                                const isOverloaded = count >= 5;

                                return (
                                    <div key={person} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                        <div className={`px-4 py-3 border-b flex justify-between items-center ${isOverloaded ? 'bg-rose-50 border-rose-100' : 'bg-gray-50 border-gray-100'}`}>
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 mr-2">
                                                    {personTasks[0]?.responsibleAvatar || person[0]}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-800">{person}</h4>
                                                    <p className="text-[10px] text-gray-500 uppercase">Carga: {count} Tareas</p>
                                                </div>
                                            </div>
                                            {isOverloaded && <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold">⚠️ Sobrecarga</span>}
                                        </div>
                                        <div className="p-3 space-y-2 bg-slate-50/50 min-h-[200px]">
                                            {personTasks.map(task => renderTaskCard(task))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            {/* DELAY MODAL (Copied from previous step, same logic) */}
            {isDelayModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center mb-4 text-rose-600">
                            <CalendarClock size={24} className="mr-2" />
                            <h3 className="text-lg font-bold">Reporte de Atraso</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Estás moviendo la fecha del compromiso <strong>{selectedTask?.name}</strong> para el <strong>{newDateBuffer}</strong>.
                            <br />Esta acción enviará una alerta inmediata a Gerencia.
                        </p>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Motivo del cambio (Obligatorio)</label>
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-rose-500 mb-4 h-24 resize-none"
                            placeholder="Especifique la razón técnica o administrativa..."
                            value={delayReason}
                            onChange={(e) => setDelayReason(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => { setIsDelayModalOpen(false); setNewDateBuffer(""); setDelayReason(""); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button disabled={!delayReason.trim()} onClick={confirmDelay} className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Atraso</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
