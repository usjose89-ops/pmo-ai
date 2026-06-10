"use client";

import React from 'react';
import { Card } from '@/components/ui/Card'; // Assuming we have a Card component, or I will use a simple div
import { BarChart, AlertTriangle, CheckCircle, TrendingUp, History } from 'lucide-react';

// Mock Data Structure (matching what backend would return)
const MOCK_ANALYSIS = {
    apu_name: "Hormigón H30 (Bombeado)",
    current_price: 4600,
    benchmark: {
        avg: 4250,
        min: 4100,
        max: 4450,
        last_project: 4450
    },
    analysis: {
        deviation_percent: 8.2,
        alert: "NORMAL" // HIGH, LOW, NORMAL
    }
};

interface APUComparatorProps {
    apuName?: string;
    currentPrice?: number;
}

export function APUComparator({ apuName = "Hormigón H30", currentPrice = 4600 }: APUComparatorProps) {
    // In a real app, this would fetch from the benchmarking service
    const data = MOCK_ANALYSIS;
    const isHigh = data.analysis.deviation_percent > 5; // Stricter threshold for demo

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <History className="mr-2 text-indigo-600" size={20} />
                        Benchmarking Histórico
                    </h3>
                    <p className="text-sm text-gray-500">Comparando &quot;{apuName}&quot; con 3 proyectos anteriores.</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${isHigh ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isHigh ? 'Revisión Sugerida' : 'Precio Competitivo'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Chart (CSS Bar Chart) */}
                <div className="space-y-4">
                    {/* Historical Avg Bar */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 font-bold">Promedio Histórico</span>
                            <span className="text-gray-900">{data.benchmark.avg} UF</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
                            <div className="bg-gray-400 h-full rounded-full" style={{ width: '80%' }}></div>
                        </div>
                    </div>

                    {/* Current Price Bar */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-indigo-600 font-bold">Tu Precio (Actual)</span>
                            <span className="text-indigo-900 font-bold">{currentPrice} UF</span>
                        </div>
                        <div className="w-full bg-indigo-50 rounded-full h-4 overflow-hidden relative border border-indigo-100">
                            {/* Width calculated relative to max (simulated) */}
                            <div className={`h-full rounded-full ${isHigh ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: '88%' }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-amber-600 font-bold">
                            {isHigh && `+${data.analysis.deviation_percent}% sobre promedio`}
                        </p>
                    </div>
                </div>

                {/* Analysis & Recommendation */}
                <div className={`p-4 rounded-lg ${isHigh ? 'bg-amber-50 border border-amber-100' : 'bg-green-50 border border-green-100'}`}>
                    <h4 className={`font-bold text-sm mb-2 flex items-center ${isHigh ? 'text-amber-800' : 'text-green-800'}`}>
                        {isHigh ? <AlertTriangle size={16} className="mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                        Análisis de IA
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed mb-3">
                        {isHigh
                            ? "El precio unitario está por encima del promedio histórico. Esto puede reducir la competitividad de la oferta."
                            : "El precio se encuentra dentro de los rangos de mercado aceptables."
                        }
                    </p>
                    {isHigh && (
                        <div className="bg-white/60 p-2 rounded text-xs text-amber-900 font-medium">
                            <strong>Sugerencia:</strong> Revisar el rendimiento de la mano de obra o negociar mejor precio de hormigón.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <span>Datos basados en proyectos: Edificio Centro (2024), Torre Sur (2025).</span>
                <button className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center">
                    Ver detalle completo <TrendingUp size={12} className="ml-1" />
                </button>
            </div>
        </div>
    );
}
