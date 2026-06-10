"use client";

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Save } from 'lucide-react';

interface InternalItem {
    id: string;
    description: string;
    budgeted: number;
    actuals: number; // Real spending to date
    forecast: number; // Projected spending to completion
}

const MOCK_INTERNAL_DATA: InternalItem[] = [
    { id: '1', description: 'Personal Directo', budgeted: 150000000, actuals: 45000000, forecast: 148000000 },
    { id: '2', description: 'Materiales - Hormigón', budgeted: 80000000, actuals: 25000000, forecast: 85000000 },
    { id: '3', description: 'Materiales - Acero', budgeted: 45000000, actuals: 40000000, forecast: 45000000 },
    { id: '4', description: 'Arriendo Maquinaria', budgeted: 60000000, actuals: 22000000, forecast: 58000000 },
    { id: '5', description: 'Subcontrato Montaje', budgeted: 120000000, actuals: 0, forecast: 120000000 },
];

export const InternalControlView = () => {
    const [items, setItems] = useState<InternalItem[]>(MOCK_INTERNAL_DATA);
    // Simulation of Monthly Input State
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleUpdateForecast = (id: string, newVal: number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, forecast: newVal } : item
        ));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-emerald-900 font-bold text-lg mb-1">Control de Costos (Interno)</h3>
                    <p className="text-emerald-700/80 text-sm">
                        Seguimiento detallado de costos reales (Actuals) vs Presupuesto Base.
                    </p>
                </div>
                <div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors">
                        <Save size={16} className="mr-2" />
                        Guardar Cierre Mes
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="py-4 px-6 font-semibold">Partida de Control</th>
                            <th className="py-4 px-6 text-right w-40">Presupuesto Base</th>
                            <th className="py-4 px-6 text-right w-40">Gasto Real (Actuals)</th>
                            <th className="py-4 px-6 text-right w-40">Proyección (Forecast)</th>
                            <th className="py-4 px-6 text-right w-32">Desviación</th>
                            <th className="py-4 px-6 text-center w-24">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((row) => {
                            const deviation = row.forecast - row.budgeted;
                            const isOverBudget = deviation > 0;
                            const isUnderBudget = deviation < 0;

                            return (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-6 text-sm font-bold text-slate-700">{row.description}</td>

                                    {/* Budgeted */}
                                    <td className="py-3 px-6 text-sm text-right text-slate-500 font-mono">
                                        $ {row.budgeted.toLocaleString('es-CL')}
                                    </td>

                                    {/* Actuals (Input/Display) */}
                                    <td className="py-3 px-6 text-sm text-right font-mono text-slate-700 bg-slate-50/50">
                                        $ {row.actuals.toLocaleString('es-CL')}
                                    </td>

                                    {/* Forecast (Editable?) */}
                                    <td className="py-3 px-6 text-sm text-right font-mono font-bold text-slate-800">
                                        $ {row.forecast.toLocaleString('es-CL')}
                                    </td>

                                    {/* Deviation & Status */}
                                    <td className={`py-3 px-6 text-sm text-right font-mono font-bold ${isOverBudget ? 'text-rose-500' : isUnderBudget ? 'text-emerald-500' : 'text-gray-400'}`}>
                                        {deviation > 0 ? '+' : ''}{deviation.toLocaleString('es-CL')}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {isOverBudget && <ArrowUpRight className="inline text-rose-500" size={18} />}
                                        {isUnderBudget && <ArrowDownRight className="inline text-emerald-500" size={18} />}
                                        {deviation === 0 && <Minus className="inline text-gray-300" size={18} />}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Aggregated Totals */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold">Total Presupuesto</p>
                    <p className="text-xl font-black text-slate-700">
                        $ {items.reduce((a, b) => a + b.budgeted, 0).toLocaleString('es-CL')}
                    </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-600 uppercase font-bold">Total Proyectado (Forecast)</p>
                    <p className="text-xl font-black text-emerald-800">
                        $ {items.reduce((a, b) => a + b.forecast, 0).toLocaleString('es-CL')}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-400 uppercase font-bold">Desviación Total</p>
                    <p className={`text-xl font-black ${items.reduce((a, b) => a + (b.forecast - b.budgeted), 0) > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        $ {items.reduce((a, b) => a + (b.forecast - b.budgeted), 0).toLocaleString('es-CL')}
                    </p>
                </div>
            </div>
        </div>
    );
};
