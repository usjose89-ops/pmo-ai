"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit3, Calculator } from 'lucide-react';
import { APUEditorModal } from './APUEditorModal';

import { supabaseComponentService } from '@/services/supabaseComponentService';

// Types
interface BudgetRow {
    id: string;
    code: string;
    description: string;
    unit: string;
    qty: number;
    unitPrice: number;
    totalPrice: number;
    type: 'ITEM' | 'SUBITEM' | 'RESOURCE';
    resourceType?: 'LABOR' | 'MATERIAL' | 'EQUIPMENT';
    children?: BudgetRow[];
    isExpanded?: boolean;
}

interface BudgetGridProps {
    projectId: string;
}

export function BudgetGrid({ projectId }: BudgetGridProps) {
    const [data, setData] = useState<BudgetRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingAPU, setEditingAPU] = useState<BudgetRow | null>(null);
    const [flashingRow, setFlashingRow] = useState<string | null>(null);

    const toggleExpand = (id: string, rows: BudgetRow[]): BudgetRow[] => {
        return rows.map(row => {
            if (row.id === id) {
                return { ...row, isExpanded: !row.isExpanded };
            }
            if (row.children) {
                return { ...row, children: toggleExpand(id, row.children) };
            }
            return row;
        });
    };

    const handleToggle = (id: string) => {
        setData(prev => toggleExpand(id, prev));
    };

    const handleEditAPU = (row: BudgetRow) => {
        setEditingAPU(row);
    };

    const loadBudgetLines = async () => {
        setIsLoading(true);
        const lines = await supabaseComponentService.getBudgetLines(projectId);
        
        const mapped: BudgetRow[] = lines.map((line, index) => ({
            id: line.id,
            code: `${index + 1}`,
            description: line.description,
            unit: 'glb',
            qty: 1,
            unitPrice: line.bac_amount,
            totalPrice: line.bac_amount,
            type: 'SUBITEM',
            isExpanded: false,
            children: []
        }));
        
        setData(mapped);
        setIsLoading(false);
    };

    React.useEffect(() => {
        if(projectId) loadBudgetLines();
    }, [projectId]);

    const handleAddLine = async () => {
        const newLine = await supabaseComponentService.createBudgetLine({
            project_id: projectId,
            budget_category: 'GENERAL',
            description: 'Nueva Partida',
            bac_amount: 0
        });
        if (newLine) loadBudgetLines();
    };

    const handleDeleteLine = async (id: string) => {
        if(confirm('¿Seguro que deseas eliminar esta partida?')) {
            await supabaseComponentService.deleteBudgetLine(id);
            loadBudgetLines();
        }
    };

    const handlePriceUpdateMock = (id: string) => {
        setFlashingRow(id);
        setTimeout(() => setFlashingRow(null), 800);
    };

    // Recursive Render
    const renderRows = (rows: BudgetRow[], level: number = 0) => {
        return rows.map(row => {
            const isParent = row.children && row.children.length > 0;
            const paddingLeft = level * 20 + 10;

            // Color Coding
            let textColor = "text-slate-700";
            if (row.type === 'RESOURCE') {
                if (row.resourceType === 'MATERIAL') textColor = "text-blue-600";
                if (row.resourceType === 'LABOR') textColor = "text-green-600";
                if (row.resourceType === 'EQUIPMENT') textColor = "text-orange-600";
            }

            // Flash Effect
            const flashClass = flashingRow === row.id ? "bg-yellow-100 transition-colors duration-500" : "hover:bg-gray-50";

            return (
                <React.Fragment key={row.id}>
                    <tr className={`border-b border-gray-100 group ${flashClass}`}>
                        {/* Code & Expand */}
                        <td className="py-2 px-2 text-sm font-mono text-gray-500 w-16 sticky left-0 bg-white group-hover:bg-inherit transition-colors">
                            <div className="flex items-center">
                                {isParent ? (
                                    <button onClick={() => handleToggle(row.id)} className="mr-1 p-0.5 hover:bg-gray-200 rounded">
                                        {row.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>
                                ) : <span className="w-5"></span>}
                                {row.code}
                            </div>
                        </td>

                        {/* Description */}
                        <td className="py-2 px-2" style={{ paddingLeft: `${paddingLeft}px` }}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${textColor} flex items-center gap-2`}>
                                    {row.description}
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                        {row.type === 'SUBITEM' && (
                                            <button
                                                onClick={() => handleEditAPU(row)}
                                                className="p-1 text-gray-400 hover:text-indigo-600 bg-gray-100 rounded"
                                                title="Editar APU"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteLine(row.id)}
                                            className="p-1 text-gray-400 hover:text-rose-600 bg-gray-100 rounded"
                                            title="Eliminar"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </span>
                            </div>
                        </td>

                        {/* Metadata */}
                        <td className="py-2 px-4 text-sm text-center text-gray-500">{row.unit}</td>
                        <td className="py-2 px-4 text-sm text-right text-gray-700 font-mono">
                            {row.type === 'RESOURCE' ? '' : row.qty.toLocaleString('es-CL')}
                        </td>
                        <td className="py-2 px-4 text-sm text-right font-mono bg-gray-50/50">
                            <div className="flex items-center justify-end space-x-2">
                                {/* Simulate input for Resources */}
                                {row.type === 'RESOURCE' ? (
                                    <input
                                        defaultValue={row.unitPrice}
                                        className="w-20 text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-xs"
                                        onChange={() => handlePriceUpdateMock(row.id)}
                                    />
                                ) : (
                                    <span className={row.type === 'ITEM' ? "font-bold" : ""}>{row.unitPrice.toLocaleString('es-CL')}</span>
                                )}
                            </div>
                        </td>
                        <td className="py-2 px-4 text-sm text-right font-mono font-bold text-slate-800">
                            {(row.type === 'RESOURCE' ? (row.qty * row.unitPrice) : row.totalPrice).toLocaleString('es-CL')}
                        </td>
                    </tr>

                    {/* Children Recursion */}
                    {isParent && row.isExpanded && renderRows(row.children!, level + 1)}
                </React.Fragment>
            );
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button 
                    onClick={handleAddLine}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center shadow-md transition-all text-sm"
                >
                    + Nueva Partida
                </button>
            </div>
            {isLoading ? (
                <div className="p-10 text-center text-slate-500">Cargando presupuesto...</div>
            ) : (
                <div className="max-w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                        <th className="py-3 px-2 font-semibold w-24">Código</th>
                        <th className="py-3 px-2 font-semibold">Descripción</th>
                        <th className="py-3 px-2 text-center font-semibold w-20">Unidad</th>
                        <th className="py-3 px-2 text-right font-semibold w-24">Cant.</th>
                        <th className="py-3 px-2 text-right font-semibold w-32">P. Unit</th>
                        <th className="py-3 px-2 text-right font-semibold w-32">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows(data)}
                </tbody>
            </table>

            {/* Editor Modal */}
            <APUEditorModal
                isOpen={!!editingAPU}
                onClose={() => setEditingAPU(null)}
                apuData={editingAPU}
            />
        </div>
            )}
        </div>
    );
}
