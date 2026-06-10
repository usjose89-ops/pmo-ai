import React from 'react';
import { BudgetGrid } from '@/components/budget/BudgetGrid';
import { Download, Plus, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function TendersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Licitación: Nueva Sala MT_Ventanas Feb26</h1>
                    <p className="text-sm text-gray-500">Versión 1.0 (CODELCO Div. Ventanas) • Carga Inicial de Bases</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm">
                        <Download size={16} className="mr-2" />
                        Exportar Excel
                    </button>
                    <button className="flex items-center px-3 py-2 bg-slate-900 border border-transparent rounded-lg text-sm text-white hover:bg-slate-800 shadow-sm">
                        <Plus size={16} className="mr-2" />
                        Nueva Partida
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Buscar partida..."
                        className="w-full pl-3 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                    <Filter size={18} />
                </button>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center space-x-2 text-sm">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Materiales</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Mano Obra</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Equipos</span>
                </div>
            </div>

            {/* Budget Grid Area */}
            <BudgetGrid projectId="11111111-1111-1111-1111-111111111111" />

            {/* Footer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card title="Costo Directo Total">
                    <p className="text-2xl font-bold text-slate-900">$ 245.000.000</p>
                </Card>
                <Card title="Margen Esperado">
                    <p className="text-2xl font-bold text-green-600">12.5 %</p>
                    <p className="text-xs text-gray-500">$ 30.625.000</p>
                </Card>
                <Card title="Gastos Generales (Ajustado)">
                    <p className="text-2xl font-bold text-slate-700">18 %</p>
                </Card>
            </div>
        </div>
    );
}
