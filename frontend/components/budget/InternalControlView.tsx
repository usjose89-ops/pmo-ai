"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Save, Link2, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface WBSNode {
    id: string;
    wbs: string;
    description: string;
    bac: number;
    ac: number;
    oc: number;
    totalActual: number;
    available: number;
    realProgress: number; // percentage
    ev: number;
    cv: number;
    etc: number;
    eac: number;
    vac: number;
    comments: string;
    isLinked?: boolean;
    children?: WBSNode[];
}

const MOCK_WBS_DATA: WBSNode[] = [
    {
        id: '1', wbs: '1.0', description: 'RRHH DIRECTO E INDIRECTO',
        bac: 62700000, ac: 0, oc: 0, totalActual: 0, available: 62700000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 62700000, comments: '', isLinked: true,
        children: [
            { id: '1.1', wbs: '1.1', description: 'Supervisor de Terreno', bac: 6900000, ac: 0, oc: 0, totalActual: 0, available: 6900000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 6900000, comments: '' },
            { id: '1.2', wbs: '1.2', description: 'Administrativo de Obras y RRLL', bac: 4200000, ac: 0, oc: 0, totalActual: 0, available: 4200000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 4200000, comments: '' },
            { id: '1.3', wbs: '1.3', description: 'Topógrafo', bac: 5400000, ac: 0, oc: 0, totalActual: 0, available: 5400000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 5400000, comments: '' },
            { id: '1.4', wbs: '1.4', description: 'Alarife', bac: 3000000, ac: 0, oc: 0, totalActual: 0, available: 3000000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 3000000, comments: '' },
            { id: '1.5', wbs: '1.5', description: 'Maestro 1° Líneas Senior', bac: 4800000, ac: 0, oc: 0, totalActual: 0, available: 4800000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 4800000, comments: '' },
            { id: '1.6', wbs: '1.6', description: 'Maestro 1° Líneas', bac: 21000000, ac: 0, oc: 0, totalActual: 0, available: 21000000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 21000000, comments: '' },
            { id: '1.7', wbs: '1.7', description: 'Maestro 2° Líneas', bac: 7800000, ac: 0, oc: 0, totalActual: 0, available: 7800000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 7800000, comments: '' },
            { id: '1.8', wbs: '1.8', description: 'Operador Camión Pluma', bac: 5700000, ac: 0, oc: 0, totalActual: 0, available: 5700000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 5700000, comments: '' },
            { id: '1.9', wbs: '1.9', description: 'Rigger', bac: 3900000, ac: 0, oc: 0, totalActual: 0, available: 3900000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 3900000, comments: '' },
        ]
    },
    {
        id: '2', wbs: '2.0', description: 'MATERIALES E INSUMOS',
        bac: 2956644, ac: 0, oc: 0, totalActual: 0, available: 2956644, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 2956644, comments: '',
        children: [
            { id: '2.1', wbs: '2.1', description: 'Instalación y Equipamiento Oficina Faena', bac: 1509543, ac: 0, oc: 0, totalActual: 0, available: 1509543, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 1509543, comments: '' },
            { id: '2.2', wbs: '2.2', description: 'Suministros Menores (Agua, Café, etc.)', bac: 631833, ac: 0, oc: 0, totalActual: 0, available: 631833, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 631833, comments: '' },
            { id: '2.3', wbs: '2.3', description: 'Implementos HSEC (Extintor, Camilla)', bac: 815269, ac: 0, oc: 0, totalActual: 0, available: 815269, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 815269, comments: '' },
        ]
    },
    {
        id: '3', wbs: '3.0', description: 'EQUIPOS Y MAQUINARIA',
        bac: 57720797, ac: 0, oc: 0, totalActual: 0, available: 57720797, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 57720797, comments: '', isLinked: true,
        children: [
            { id: '3.1', wbs: '3.1', description: 'Arriendo Camionetas 4x4', bac: 19000000, ac: 0, oc: 0, totalActual: 0, available: 19000000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 19000000, comments: '' },
            { id: '3.2', wbs: '3.2', description: 'Arriendo Camión Pluma 20 Ton', bac: 22500000, ac: 0, oc: 0, totalActual: 0, available: 22500000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 22500000, comments: '' },
            { id: '3.3', wbs: '3.3', description: 'Equipos HTLS (Prensa, Alzabobina, Cordina)', bac: 10507320, ac: 0, oc: 0, totalActual: 0, available: 10507320, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 10507320, comments: '' },
            { id: '3.4', wbs: '3.4', description: 'Generador 30 kVA', bac: 2043011, ac: 0, oc: 0, totalActual: 0, available: 2043011, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 2043011, comments: '' },
            { id: '3.5', wbs: '3.5', description: 'Herramientas e Implementos Menores (Escalas, Señalética)', bac: 3670466, ac: 0, oc: 0, totalActual: 0, available: 3670466, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 3670466, comments: '' },
        ]
    },
    {
        id: '4', wbs: '4.0', description: 'SUBCONTRATOS',
        bac: 4510650, ac: 0, oc: 0, totalActual: 0, available: 4510650, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 4510650, comments: '',
        children: [
            { id: '4.1', wbs: '4.1', description: 'Arriendo Container Oficina', bac: 710650, ac: 0, oc: 0, totalActual: 0, available: 710650, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 710650, comments: '' },
            { id: '4.2', wbs: '4.2', description: 'Arriendo Baños Químicos', bac: 1800000, ac: 0, oc: 0, totalActual: 0, available: 1800000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 1800000, comments: '' },
            { id: '4.3', wbs: '4.3', description: 'Fletes y Transporte', bac: 2000000, ac: 0, oc: 0, totalActual: 0, available: 2000000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 2000000, comments: '' },
        ]
    },
    {
        id: '5', wbs: '5.0', description: 'ASESORIA TECNICA CTC GLOBAL',
        bac: 17980000, ac: 0, oc: 0, totalActual: 0, available: 17980000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 17980000, comments: '',
        children: [
            { id: '5.1', wbs: '5.1', description: 'Servicios de Asesoría y Standby', bac: 14800000, ac: 0, oc: 0, totalActual: 0, available: 14800000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 14800000, comments: '' },
            { id: '5.2', wbs: '5.2', description: 'Logística y Viáticos Asesor', bac: 1680000, ac: 0, oc: 0, totalActual: 0, available: 1680000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 1680000, comments: '' },
            { id: '5.3', wbs: '5.3', description: 'EPP Asesor Especialista', bac: 1500000, ac: 0, oc: 0, totalActual: 0, available: 1500000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 1500000, comments: '' },
        ]
    },
    {
        id: '6', wbs: '6.0', description: 'GASTOS GENERALES Y OPERACIONALES',
        bac: 80209991, ac: 200000, oc: 0, totalActual: 200000, available: 80009991, realProgress: 0, ev: 0, cv: -200000, etc: 0, eac: 200000, vac: 80009991, comments: '',
        children: [
            { id: '6.1', wbs: '6.1', description: 'Logística: Alojamiento MOD/MOI/Staff', bac: 20800000, ac: 200000, oc: 0, totalActual: 200000, available: 20600000, realProgress: 0, ev: 0, cv: -200000, etc: 0, eac: 200000, vac: 20600000, comments: '' },
            { id: '6.2', wbs: '6.2', description: 'Logística: Alimentación MOD/MOI/Staff', bac: 11400000, ac: 0, oc: 0, totalActual: 0, available: 11400000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 11400000, comments: '' },
            { id: '6.3', wbs: '6.3', description: 'Logística: Pasajes y Traslados', bac: 12900000, ac: 0, oc: 0, totalActual: 0, available: 12900000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 12900000, comments: '' },
            { id: '6.4', wbs: '6.4', description: 'Costo Operativo Equipos (Combustible, etc.)', bac: 3989991, ac: 0, oc: 0, totalActual: 0, available: 3989991, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 3989991, comments: '' },
            { id: '6.5', wbs: '6.5', description: 'EPP y Ropa de Trabajo Personal (Directo e Ind.)', bac: 25600000, ac: 0, oc: 0, totalActual: 0, available: 25600000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 25600000, comments: '' },
            { id: '6.6', wbs: '6.6', description: 'Certificaciones Externas', bac: 5520000, ac: 0, oc: 0, totalActual: 0, available: 5520000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 5520000, comments: '' },
        ]
    },
    {
        id: '7', wbs: '7.0', description: 'IMPREVISTOS Y CONTINGENCIAS',
        bac: 26950000, ac: 0, oc: 0, totalActual: 0, available: 26950000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 26950000, comments: '',
        children: [
            { id: '7.1', wbs: '7.1', description: 'Provisión Imprevistos (15 días)', bac: 26950000, ac: 0, oc: 0, totalActual: 0, available: 26950000, realProgress: 0, ev: 0, cv: 0, etc: 0, eac: 0, vac: 26950000, comments: '' },
        ]
    }
];

// Helper to calculate parent totals
const calculateNodeEVM = (node: WBSNode): WBSNode => {
    if (node.children && node.children.length > 0) {
        node.children = node.children.map(calculateNodeEVM);
        node.ac = node.children.reduce((sum, child) => sum + child.ac, 0);
        node.oc = node.children.reduce((sum, child) => sum + child.oc, 0);
        node.etc = node.children.reduce((sum, child) => sum + child.etc, 0);
        
        // Progress of parent is weighted average of children's progress by BAC
        const totalProgressBac = node.children.reduce((sum, child) => sum + (child.realProgress * child.bac), 0);
        node.realProgress = node.bac > 0 ? totalProgressBac / node.bac : 0;
    }
    
    node.totalActual = node.ac + node.oc;
    node.available = node.bac - node.totalActual;
    node.ev = (node.realProgress / 100) * node.bac;
    node.cv = node.ev - node.ac;
    
    // EAC = AC + ETC
    node.eac = node.ac + node.etc;
    node.vac = node.bac - node.eac;
    
    return node;
};

export const InternalControlView = () => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['1', '6']));
    const [wbsData, setWbsData] = useState<WBSNode[]>(MOCK_WBS_DATA);

    useEffect(() => {
        const stored = localStorage.getItem('budgetEVMData');
        if (stored) {
            setWbsData(JSON.parse(stored));
        } else {
            const calculatedInitial = MOCK_WBS_DATA.map(calculateNodeEVM);
            setWbsData(calculatedInitial);
            localStorage.setItem('budgetEVMData', JSON.stringify(calculatedInitial));
        }
    }, []);

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleNodeChange = (id: string, field: 'ac' | 'oc' | 'etc' | 'realProgress', value: number) => {
        const updateNodeTree = (nodes: WBSNode[]): WBSNode[] => {
            return nodes.map(node => {
                if (node.id === id) {
                    const updated = { ...node, [field]: value };
                    return calculateNodeEVM(updated);
                } else if (node.children) {
                    const updatedChildren = updateNodeTree(node.children);
                    return calculateNodeEVM({ ...node, children: updatedChildren });
                }
                return node;
            });
        };
        
        const newData = updateNodeTree(wbsData);
        setWbsData(newData);
        localStorage.setItem('budgetEVMData', JSON.stringify(newData));
        window.dispatchEvent(new Event('dashboardUpdate'));
    };

    const formatMoney = (val: number) => {
        if (val === 0) return '$0';
        return `$${new Intl.NumberFormat('es-CL').format(val)}`;
    };

    const formatPercent = (val: number) => {
        return `${val.toFixed(1)}%`;
    };

    const renderRow = (node: WBSNode, isChild: boolean = false) => {
        const isExpanded = expandedRows.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <React.Fragment key={node.id}>
                <tr className={`border-b border-gray-100 hover:bg-slate-50/80 transition-colors ${!isChild ? 'bg-white font-bold' : 'bg-slate-50/30'}`}>
                    <td className={`py-3 px-4 flex items-center sticky left-0 z-10 ${!isChild ? 'bg-white' : 'bg-slate-50'}`}>
                        {hasChildren ? (
                            <button onClick={() => toggleRow(node.id)} className="mr-2 text-slate-500 hover:text-indigo-600 transition-colors">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        ) : (
                            <span className="w-6 inline-block"></span>
                        )}
                        <span className={`w-12 text-xs font-mono text-slate-400 ${!isChild && 'text-slate-600'}`}>{node.wbs}</span>
                        <span className={`text-sm ${!isChild ? 'text-slate-800' : 'text-slate-600'} truncate w-64`}>
                            {node.description}
                        </span>
                        {node.isLinked && !isChild && (
                            <div className="ml-2 flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider border border-indigo-100" title="Alimentado desde otro módulo">
                                <Link2 size={12} /> Vinculado
                            </div>
                        )}
                    </td>

                    {/* Editable inputs for leaf nodes, otherwise static text */}
                    <td className="py-3 px-4 text-right font-mono text-sm text-slate-600 min-w-[120px]">{formatMoney(node.bac)}</td>
                    
                    <td className="py-2 px-2 text-right font-mono text-sm min-w-[120px] bg-red-50/30">
                        {hasChildren ? formatMoney(node.ac) : (
                            <input type="number" value={node.ac} onChange={(e) => handleNodeChange(node.id, 'ac', Number(e.target.value))} className="w-full bg-white border border-red-200 text-right px-2 py-1 rounded text-red-600 outline-none focus:ring-1 focus:ring-red-400" />
                        )}
                    </td>
                    
                    <td className="py-2 px-2 text-right font-mono text-sm min-w-[120px]">
                        {hasChildren ? formatMoney(node.oc) : (
                            <input type="number" value={node.oc} onChange={(e) => handleNodeChange(node.id, 'oc', Number(e.target.value))} className="w-full bg-white border border-slate-200 text-right px-2 py-1 rounded outline-none focus:ring-1 focus:ring-slate-400" />
                        )}
                    </td>
                    
                    <td className="py-3 px-4 text-right font-mono text-sm font-bold text-slate-800 min-w-[120px] bg-slate-100/50">{formatMoney(node.totalActual)}</td>
                    <td className="py-3 px-4 text-right font-mono text-sm font-bold text-emerald-600 min-w-[120px] bg-emerald-50/30">{formatMoney(node.available)}</td>
                    
                    <td className="py-2 px-2 text-center font-mono text-sm min-w-[100px]">
                        {hasChildren ? formatPercent(node.realProgress) : (
                            <div className="flex items-center">
                                <input type="number" min="0" max="100" value={node.realProgress} onChange={(e) => handleNodeChange(node.id, 'realProgress', Number(e.target.value))} className="w-16 bg-white border border-slate-200 text-center px-1 py-1 rounded outline-none focus:ring-1 focus:ring-slate-400" />
                                <span className="text-slate-400 ml-1">%</span>
                            </div>
                        )}
                    </td>
                    
                    <td className="py-3 px-4 text-right font-mono text-sm text-slate-600 min-w-[120px]">{formatMoney(node.ev)}</td>
                    <td className={`py-3 px-4 text-right font-mono text-sm font-bold min-w-[120px] ${node.cv < 0 ? 'text-red-500' : 'text-slate-500'}`}>{formatMoney(node.cv)}</td>
                    
                    <td className="py-2 px-2 text-right font-mono text-sm min-w-[120px]">
                        {hasChildren ? formatMoney(node.etc) : (
                            <input type="number" value={node.etc} onChange={(e) => handleNodeChange(node.id, 'etc', Number(e.target.value))} className="w-full bg-white border border-slate-200 text-right px-2 py-1 rounded outline-none focus:ring-1 focus:ring-slate-400" />
                        )}
                    </td>
                    
                    <td className="py-3 px-4 text-right font-mono text-sm font-bold text-indigo-600 min-w-[120px]">{formatMoney(node.eac)}</td>
                    <td className={`py-3 px-4 text-right font-mono text-sm font-bold min-w-[120px] ${node.vac < 0 ? 'text-red-500' : 'text-emerald-500'} bg-slate-100/50`}>{formatMoney(node.vac)}</td>
                    <td className="py-3 px-4 text-left text-xs text-slate-400 min-w-[150px]">{node.comments || '-'}</td>
                </tr>
                {isExpanded && hasChildren && node.children!.map(child => renderRow(child, true))}
            </React.Fragment>
        );
    };

    const totalBAC = wbsData.reduce((sum, node) => sum + node.bac, 0);
    const totalAC = wbsData.reduce((sum, node) => sum + node.ac, 0);
    const totalOC = wbsData.reduce((sum, node) => sum + node.oc, 0);
    const totalActual = wbsData.reduce((sum, node) => sum + node.totalActual, 0);
    const totalAvailable = wbsData.reduce((sum, node) => sum + node.available, 0);
    const totalEV = wbsData.reduce((sum, node) => sum + node.ev, 0);
    const totalCV = wbsData.reduce((sum, node) => sum + node.cv, 0);
    const totalETC = wbsData.reduce((sum, node) => sum + node.etc, 0);
    const totalEAC = wbsData.reduce((sum, node) => sum + node.eac, 0);
    const totalVAC = wbsData.reduce((sum, node) => sum + node.vac, 0);

    const totalRealProgress = totalBAC > 0 ? (wbsData.reduce((sum, node) => sum + (node.realProgress * node.bac), 0) / totalBAC) : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 pb-10">
            {/* Header & Alerts */}
            <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <FileSpreadsheet />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Control de Costos y WBS</h3>
                        <p className="text-xs text-slate-500">Puedes editar el Avance Real, Costo Real (AC), OC y ETC directamente en la tabla.</p>
                    </div>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors">
                    <Save size={16} className="mr-2" />
                    Guardar Estado
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm relative w-full overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-max min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1f497d] text-white text-xs uppercase tracking-wider">
                                <th className="py-3 px-4 font-bold sticky left-0 bg-[#1f497d] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[400px]">Descripción de la Partida</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]">Presupuesto Base (BAC)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]" title="Costo Real Acumulado">Costo Real (AC)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]" title="Ordenes de Compra Comprometidas">Comprometido (OC)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]">Costo Total Actual</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]">Ppto. Disponible</th>
                                <th className="py-3 px-4 font-bold text-center min-w-[100px]">Avance Real (%)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]">Valor Ganado (EV)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]" title="Cost Variance">Desviación a la fecha (CV)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]" title="Estimate To Complete">Estimación p/Terminar (ETC)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]" title="Estimate At Completion">Forecast (EAC)</th>
                                <th className="py-3 px-4 font-bold text-right min-w-[120px]" title="Variance At Completion">Desviación Proyectada (VAC)</th>
                                <th className="py-3 px-4 font-bold text-left min-w-[150px]">Comentarios</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {wbsData.map(node => renderRow(node))}
                        </tbody>
                        <tfoot className="bg-slate-100 text-slate-800 font-black">
                            <tr>
                                <td className="py-4 px-4 sticky left-0 bg-slate-200 z-20 text-right uppercase tracking-widest text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">TOTAL COSTOS</td>
                                <td className="py-4 px-4 text-right font-mono text-sm">{formatMoney(totalBAC)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm text-red-600">{formatMoney(totalAC)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm">{formatMoney(totalOC)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm">{formatMoney(totalActual)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm text-emerald-600">{formatMoney(totalAvailable)}</td>
                                <td className="py-4 px-4 text-center font-mono text-sm">{formatPercent(totalRealProgress)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm">{formatMoney(totalEV)}</td>
                                <td className={`py-4 px-4 text-right font-mono text-sm ${totalCV < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatMoney(totalCV)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm">{formatMoney(totalETC)}</td>
                                <td className="py-4 px-4 text-right font-mono text-sm">{formatMoney(totalEAC)}</td>
                                <td className={`py-4 px-4 text-right font-mono text-sm ${totalVAC < 0 ? 'text-red-600' : 'text-indigo-700'}`}>{formatMoney(totalVAC)}</td>
                                <td className="py-4 px-4"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};
