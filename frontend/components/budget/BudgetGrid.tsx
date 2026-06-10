"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Edit3, Calculator } from 'lucide-react';
import { APUEditorModal } from './APUEditorModal';

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

// Mock Initial Data
const INITIAL_DATA: BudgetRow[] = [
    {
        id: '1',
        code: '1',
        description: 'Obras Civiles',
        unit: 'glb',
        qty: 1,
        unitPrice: 0, // calculated from children
        totalPrice: 0,
        type: 'ITEM',
        isExpanded: true,
        children: [
            {
                id: '1.1',
                code: '1.1',
                description: 'Hormigones',
                unit: 'm3',
                qty: 150,
                unitPrice: 120000,
                totalPrice: 18000000,
                type: 'SUBITEM',
                isExpanded: true,
                children: [
                    { id: 'r1', code: '', description: 'Cemento Especial', unit: 'saco', qty: 6, unitPrice: 4500, totalPrice: 27000, type: 'RESOURCE', resourceType: 'MATERIAL' },
                    { id: 'r2', code: '', description: 'Maestro Albañil', unit: 'hh', qty: 2.5, unitPrice: 8500, totalPrice: 21250, type: 'RESOURCE', resourceType: 'LABOR' },
                    { id: 'r3', code: '', description: 'Betonera 150L', unit: 'hm', qty: 0.5, unitPrice: 3500, totalPrice: 1750, type: 'RESOURCE', resourceType: 'EQUIPMENT' },
                ]
            },
            {
                id: '1.2',
                code: '1.2',
                description: 'Enfierradura',
                unit: 'kg',
                qty: 2500,
                unitPrice: 1350,
                totalPrice: 3375000,
                type: 'SUBITEM',
                children: []
            }
        ]
    }
];

export function BudgetGrid() {
    const [data, setData] = useState<BudgetRow[]>(INITIAL_DATA);
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

    const handlePriceUpdateMock = (id: string) => {
        // Simulate an update that triggers a flash on parent
        setFlashingRow('1.1'); // Hardcoded visual effect for demo
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
                                <span className={`text-sm font-medium ${textColor}`}>
                                    {row.description}
                                    {row.type === 'SUBITEM' && (
                                        <button
                                            onClick={() => handleEditAPU(row)}
                                            className="ml-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 rounded"
                                            title="Editar APU"
                                        >
                                            <Edit3 size={12} />
                                        </button>
                                    )}
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
    );
}
