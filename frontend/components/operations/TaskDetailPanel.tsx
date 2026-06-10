"use client";

import React, { useState } from 'react';
import { X, FileText, AlertTriangle, CheckCircle, Upload } from 'lucide-react';

interface TaskDetailPanelProps {
    task: any;
    onClose: () => void;
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'protocols' | 'incidents'>('info');

    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="font-bold text-slate-800 text-lg">{task.title}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.status === 'Done' ? 'bg-green-100 text-green-700' :
                            task.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {task.status}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'info' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Info General
                    </button>
                    <button
                        onClick={() => setActiveTab('protocols')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'protocols' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Calidad (QA)
                    </button>
                    <button
                        onClick={() => setActiveTab('incidents')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'incidents' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Incidentes
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Responsable</label>
                                <div className="flex items-center mt-1">
                                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">JP</div>
                                    <span className="text-sm text-slate-700">Juan Pérez (Capataz)</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Fechas</label>
                                <p className="text-sm text-slate-700 mt-1">05 Mar 2026 - 15 Mar 2026 (10 días)</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Descripción</label>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                    Ejecución de fundaciones según planos de estructura REV-B. Se requiere hormigón H30.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'protocols' && (
                        <div className="space-y-4">
                            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition-colors">
                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm font-medium text-slate-600">Subir Protocolo Firmado</p>
                                <p className="text-xs text-gray-400">PDF, JPG (Max 5MB)</p>
                            </div>

                            <h4 className="text-xs font-bold text-gray-500 uppercase mt-6 mb-2">Protocolos Cargados</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center">
                                        <FileText size={16} className="text-blue-500 mr-2" />
                                        <span className="text-sm text-slate-700">Protocolo_Hormigon_001.pdf</span>
                                    </div>
                                    <CheckCircle size={16} className="text-green-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'incidents' && (
                        <div className="space-y-4">
                            <button className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-medium hover:bg-red-100 flex items-center justify-center">
                                <AlertTriangle size={16} className="mr-2" />
                                Reportar Nuevo Incidente
                            </button>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500 text-center italic">No hay incidentes reportados.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800">
                        Guardar Cambios
                    </button>
                </div>

            </div>
        </div>
    );
}
