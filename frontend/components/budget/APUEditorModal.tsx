"use client";

import React from 'react';
import { X, GripVertical, Plus } from 'lucide-react';

interface APUEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    apuData: any; // Using any for mock flexibility
}

export function APUEditorModal({ isOpen, onClose, apuData }: APUEditorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Slide-over Panel */}
            <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Análisis de Precio Unitario (APU)</h2>
                        <p className="text-sm text-gray-500">{apuData?.code} - {apuData?.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Col: The "Recipe" */}
                    <div className="flex-1 p-6 overflow-y-auto border-r border-gray-100">
                        <div className="mb-4 flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wide">Receta Actual</h3>
                            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">Total: $ {apuData?.price}</span>
                        </div>

                        <div className="space-y-3">
                            {/* Mock Resources in the APU */}
                            <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center group hover:border-blue-300 transition-colors">
                                <GripVertical size={16} className="text-gray-300 mr-2 cursor-move" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">Maestro Primera</p>
                                    <p className="text-xs text-green-600">Mano de Obra</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-slate-900">0.5 HH</p>
                                    <p className="text-xs text-gray-400">$ 4.500</p>
                                </div>
                            </div>

                            <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center group hover:border-blue-300 transition-colors">
                                <GripVertical size={16} className="text-gray-300 mr-2 cursor-move" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">Saco de Cemento 25kg</p>
                                    <p className="text-xs text-blue-600">Material</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-slate-900">1.2 Un</p>
                                    <p className="text-xs text-gray-400">$ 5.200</p>
                                </div>
                            </div>

                            {/* Visual Placeholder for Drag Target */}
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                                <Plus size={24} className="mb-1 opacity-50" />
                                <span className="text-xs font-medium">Arrastra recursos aquí</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Master DB (Source) */}
                    <div className="w-1/3 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
                        <h3 className="font-semibold text-xs text-gray-500 uppercase mb-4">Recursos Disponibles</h3>
                        <div className="space-y-2">
                            {/* Mock DB Items */}
                            {["Ayudante", "Capataz", "Arena", "Grava", "Betonera"].map((item, i) => (
                                <div key={i} className="p-2 bg-white border border-gray-200 rounded text-sm hover:shadow-md cursor-grab active:cursor-grabbing">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                    <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 shadow-sm font-medium">Guardar Cambios</button>
                </div>

            </div>
        </div>
    );
}
