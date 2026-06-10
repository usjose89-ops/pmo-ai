
"use client";

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Settings, Play, CheckCircle, AlertTriangle, Plus, Trash2, Users } from 'lucide-react';
import { OrgChartEditor } from './OrgChartEditor';
import { ESTANDARES_CARGOS, RoleStandard, calcularCostoMensual, CONSTANTES_COSTOS } from '@/data/costStandards';

interface ProposalParams {
    productivityFactor: number; // Default 0.7
    imponderablesPercent: number; // % of Direct + Indirect
    utilityPercent: number; // % of Total Cost
    clientType: 'MEL' | 'CMDIC' | 'OTHER';
    durationMonths: number;
    includeLodging: boolean;
}

interface CostDetailRow {
    roleName: string;
    shift: string;
    liquidSalary: number;
    monthlyCost: number;
    hhCost: number;
    headcount: number;
}

export function ProposalGenerator() {
    const [step, setStep] = useState<number>(1);
    const [files, setFiles] = useState<{ category: string; name: string; type?: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Parameters
    const [params, setParams] = useState<ProposalParams>({
        productivityFactor: 0.7,
        imponderablesPercent: 5,
        utilityPercent: 12,
        clientType: 'MEL', // Default MEL as it has higher standards
        durationMonths: 12, // Default
        includeLodging: true
    });

    const [generatedAPU, setGeneratedAPU] = useState<any[]>([]);
    const [teamStructure, setTeamStructure] = useState<RoleStandard[]>([]);
    const [calculatedStaffCost, setCalculatedStaffCost] = useState<number>(0);
    const [staffDetails, setStaffDetails] = useState<CostDetailRow[]>([]);

    const DOCUMENT_CATEGORIES = [
        "Oferta Presentada (Presupuesto Base)", // New option
        "Bases Administrativas",
        "Bases Técnicas",
        "Información Comercial",
        "Presentaciones Internas",
        "Presentaciones al Cliente",
        "Minutas de Reunión",
        "Planos",
        "Ingeniería",
        "Otros"
    ];

    const [selectedCategory, setSelectedCategory] = useState<string>(DOCUMENT_CATEGORIES[0]); // Default to Oferta Presentada
    const [hasPriorOffer, setHasPriorOffer] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const fileCategory = selectedCategory;
            const newFiles = Array.from(e.target.files).map(f => ({
                category: fileCategory,
                name: f.name
            }));

            // Auto-detect if user uploaded an existing offer
            if (fileCategory.includes("Oferta Presentada")) {
                setHasPriorOffer(true);
            }

            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const runAIAnalysis = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(3);
            generateMockResults();
        }, 1500);
    };

    // ----- LOGIC -----

    // Recalculate staff costs whenever team or params change
    useEffect(() => {
        if (teamStructure.length > 0) {
            calculateIndirectStaffCost(teamStructure);
        }
    }, [teamStructure, params.clientType, params.durationMonths, params.includeLodging]);

    // Also recalculate APU if staff cost changes (this might trigger loop if not careful, better to do it explicitly)
    useEffect(() => {
        if (generatedAPU.length > 0) {
            // Apply new Overhead to APU
            recalculateAPUWithOverhead(generatedAPU, calculatedStaffCost);
        }
    }, [calculatedStaffCost, params.imponderablesPercent, params.utilityPercent, params.productivityFactor]);


    const calculateIndirectStaffCost = (team: RoleStandard[]) => {
        let totalMonthlyAll = 0;
        const details: CostDetailRow[] = [];

        team.forEach(role => {
            const hours = role.turno === '4x3' ? 176 : 168;
            const costData = calcularCostoMensual({
                rentaLiquida: role.rentaLiquida,
                hoursPerMonth: hours,
                durationMonths: params.durationMonths,
                isMel: params.clientType === 'MEL',
                includeLodging: params.includeLodging,
                lodgingCostDaily: 0
            });

            totalMonthlyAll += costData.totalMensual;

            // Aggregate for details view (grouping similar roles could be added, but for now exact list)
            details.push({
                roleName: role.nombre,
                shift: role.turno,
                liquidSalary: role.rentaLiquida,
                monthlyCost: costData.totalMensual,
                hhCost: costData.costoHH,
                headcount: 1
            });
        });

        setStaffDetails(details);
        // Total Project Cost = Monthly Total * Months
        setCalculatedStaffCost(totalMonthlyAll * params.durationMonths);
    };

    const recalculateAPUWithOverhead = (items: any[], overheadTotal: number) => {
        // 1. Calculate Base and Adjusted Direct
        const pass1Items = items.map(item => {
            const laborPortion = 0.4;
            const baseTotal = parseFloat(item.qty) * parseFloat(item.unitPrice); // This is now 'Re-Estudio'
            let efficiencyMultiplier = 1;

            if (item.category === 'DIRECT') {
                const laborCost = baseTotal * laborPortion;
                const otherCost = baseTotal * (1 - laborPortion);
                const adjustedLabor = laborCost / params.productivityFactor;
                if (baseTotal > 0) efficiencyMultiplier = (adjustedLabor + otherCost) / baseTotal;
            }

            return {
                ...item,
                totalDirect: baseTotal,
                adjustedDirect: baseTotal * efficiencyMultiplier
            };
        });

        const totalDirectCost = pass1Items.reduce((sum, i) => sum + (i.adjustedDirect || 0), 0);

        // Total Overhead = Staff + Imponderables
        // Logic: Total Cost = Direct + Staff. Imponderables = % of Total Cost? Or % of Direct?
        // Usually Imponderables is on top of Direct+Indirect.
        // Let's assume: Base Cost = Direct + Staff. Total Cost = Base Cost * (1 + Impond%)

        const baseCost = totalDirectCost + overheadTotal;
        const imponderablesAmount = baseCost * (params.imponderablesPercent / 100);
        const totalProjectCost = baseCost + imponderablesAmount;

        // Distribution of Overhead (Staff + Imponderables) onto Direct Costs
        const totalOverheadToDistribute = overheadTotal + imponderablesAmount;

        const prorationFactor = totalDirectCost > 0 ? (1 + (totalOverheadToDistribute / totalDirectCost)) : 1;
        const finalFactor = prorationFactor * (1 + (params.utilityPercent / 100));

        const finalItems = pass1Items.map(i => {
            const reStudiedTotal = i.adjustedDirect * finalFactor;
            const originalTotal = (i.originalUnitPrice || 0) * i.qty;
            const delta = reStudiedTotal - originalTotal;

            return {
                ...i,
                unitPriceLoaded: i.unitPrice * (i.adjustedDirect / (i.totalDirect || 1)) * finalFactor,
                totalLoaded: reStudiedTotal, // Costo Re-Estudiado Final
                delta: delta
            };
        });

        setGeneratedAPU(finalItems);
    };

    const handleApuChange = (index: number, field: string, value: any) => {
        const newItems = [...generatedAPU];
        newItems[index] = { ...newItems[index], [field]: value };
        recalculateAPUWithOverhead(newItems, calculatedStaffCost);
    };

    const generateMockResults = () => {
        // Mock data now simulates that we parsed the "Oferta Presentada" file
        const mockItems = [
            { id: 1, item: '1.1', desc: 'Instalación de Faena (Provisoria)', unit: 'gl', qty: 1, unitPrice: 14500000, originalUnitPrice: 15000000, category: 'INDIRECT' },
            { id: 2, item: '2.1', desc: 'Movimiento de Tierras Masivo', unit: 'm3', qty: 4500, unitPrice: 11800, originalUnitPrice: 12500, category: 'DIRECT' },
            { id: 3, item: '2.2', desc: 'Excavación para Fundaciones', unit: 'm3', qty: 850, unitPrice: 26500, originalUnitPrice: 28000, category: 'DIRECT' },
            { id: 4, item: '3.1', desc: 'Hormigón H30 (Suministro y Colocación)', unit: 'm3', qty: 1200, unitPrice: 195000, originalUnitPrice: 185000, category: 'DIRECT' }, // Here we are more expensive
        ];

        // If no prior offer was uploaded, maybe we don't set originalUnitPrice? 
        // But for demo if hasPriorOffer is true, we use this.
        if (!hasPriorOffer) {
            const simpleItems = mockItems.map(({ originalUnitPrice, ...rest }) => rest);
            setGeneratedAPU(simpleItems);
        } else {
            setGeneratedAPU(mockItems);
        }
    };

    const handleAddItem = () => {
        const newItem = { id: Date.now(), item: 'NEW', desc: 'Nueva Partida', unit: 'un', qty: 1, unitPrice: 0, category: 'DIRECT' };
        setGeneratedAPU([...generatedAPU, newItem]);
    };

    const handleDeleteItem = (index: number) => {
        const newItems = [...generatedAPU];
        newItems.splice(index, 1);
        setGeneratedAPU(newItems);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Steps Nav */}
            <div className="flex justify-between items-center border-b pb-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold">1</div>
                    <span className="font-medium">Carga de Bases</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200"></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold">2</div>
                    <span className="font-medium">Parámetros IA</span>
                </div>
                <div className="w-12 h-0.5 bg-slate-200"></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold">3</div>
                    <span className="font-medium">Resultados</span>
                </div>
            </div>

            {/* STEPS 1 & 2 (Simplified for brevity, assume same content as before) */}
            {step === 1 && (
                <div className="space-y-6">

                    {/* Category Selector */}
                    <div className="flex justify-center mb-4">
                        <div className="relative z-10 bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase px-2">Tipo de Documento:</span>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-slate-50 border-none text-sm font-bold text-indigo-700 py-1 pl-2 pr-8 rounded-md focus:ring-0 cursor-pointer"
                            >
                                {DOCUMENT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-10 border-2 border-dashed border-slate-300 rounded-xl text-center hover:bg-slate-50 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">Cargar {selectedCategory}</h3>
                        <p className="text-slate-500 mb-6">
                            Arrastra archivos PDF, Excel o Word aquí para <strong>{selectedCategory}</strong>.<br />
                            <span className="text-xs text-slate-400">(Soporta PDF, Excel, Word, DWG, Project)</span>
                        </p>
                        <button className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-lg font-bold pointer-events-none">
                            Seleccionar Archivos
                        </button>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm flex justify-between">
                                <span>Documentos Cargados ({files.length})</span>
                                <span className="text-indigo-600 cursor-pointer hover:underline text-xs" onClick={() => setFiles([])}>Limpiar todo</span>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {files.map((file, idx) => (
                                    <li key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 group">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{file.name}</p>
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">{file.category}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => setStep(2)}
                            disabled={files.length === 0}
                            className={`px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 ${files.length > 0
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Analizar Documentación <Play size={16} />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8 max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4">
                        <Settings className="text-slate-400" /> Parámetros Avanzados de Costo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Contexto del Proyecto</h3>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Cliente / Estándar</label>
                                <select value={params.clientType} onChange={(e) => setParams({ ...params, clientType: e.target.value as any })} className="w-full border p-2 rounded-lg font-bold text-slate-700 bg-slate-50">
                                    <option value="MEL">MEL (Escondida / BHP) - Alto Estándar</option>
                                    <option value="CMDIC">CMDIC (Collahuasi) - Estándar Medio/Alto</option>
                                    <option value="OTHER">Otro (Estándar General)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Duración (Meses)</label>
                                <input type="number" value={params.durationMonths} onChange={(e) => setParams({ ...params, durationMonths: parseInt(e.target.value) || 1 })} className="w-full border p-2 rounded-lg font-bold" />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="lodging" checked={params.includeLodging} onChange={(e) => setParams({ ...params, includeLodging: e.target.checked })} className="h-4 w-4 rounded text-indigo-600" />
                                <label htmlFor="lodging" className="text-xs font-bold text-slate-600">Incluir Alojamiento / Estadía</label>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Factores Económicos</h3>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Factor Productividad</label>
                                <input type="range" min="0.1" max="1.0" step="0.05" value={params.productivityFactor} onChange={(e) => setParams({ ...params, productivityFactor: parseFloat(e.target.value) })} className="w-full" />
                                <span className="font-bold text-indigo-600">{params.productivityFactor}</span>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Imprevistos (%)</label>
                                <input type="number" value={params.imponderablesPercent} onChange={(e) => setParams({ ...params, imponderablesPercent: parseFloat(e.target.value) })} className="w-full border p-2 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Utilidad Esperada (%)</label>
                                <input type="number" value={params.utilityPercent} onChange={(e) => setParams({ ...params, utilityPercent: parseFloat(e.target.value) })} className="w-full border p-2 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between pt-6 border-t mt-4">
                        <button onClick={() => setStep(1)} className="text-slate-500 font-medium hover:text-slate-700">Atrás</button>
                        <button onClick={runAIAnalysis} disabled={isProcessing} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2">{isProcessing ? 'Procesando...' : <><Play size={20} /> Generar Propuesta</>}</button>
                    </div>
                </div>
            )}

            {/* STEP 3: RESULTS */}
            {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">

                    {/* APU TABLE */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">
                                    {hasPriorOffer ? 'Análisis Comparativo (Oferta vs Re-Estudio)' : 'Análisis Económico Detallado'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Estándar: <b>{params.clientType}</b> • Duración: <b>{params.durationMonths} meses</b>
                                    {hasPriorOffer && <span className="text-indigo-600 font-bold ml-2"> • Modo Comparativo Activo</span>}
                                </p>
                            </div>
                            <button className="text-indigo-600 text-sm font-bold hover:underline bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Exportar Excel</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4 w-16">Item</th>
                                        <th className="p-4">Descripción</th>
                                        <th className="p-4 w-16 text-center">Und</th>
                                        <th className="p-4 w-20 text-right">Cant.</th>

                                        {/* COMPARATIVE COLUMNS */}
                                        {hasPriorOffer && (
                                            <th className="p-4 text-right text-slate-400 bg-slate-100/50">P.U. Oferta</th>
                                        )}

                                        <th className="p-4 text-right text-indigo-700">P.U. Re-Estudio</th>

                                        {hasPriorOffer && (
                                            <th className="p-4 text-right w-32">Diferencia</th>
                                        )}

                                        {!hasPriorOffer && <th className="p-4 text-right">Total Costo</th>}
                                        <th className="p-4 text-right text-emerald-600">Total Venta</th>
                                        <th className="p-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {generatedAPU.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-4"><input type="text" value={row.item} onChange={(e) => handleApuChange(i, 'item', e.target.value)} className="w-full bg-transparent border-none p-0 text-slate-500 font-medium" /></td>
                                            <td className="p-4"><input type="text" value={row.desc} onChange={(e) => handleApuChange(i, 'desc', e.target.value)} className="w-full bg-transparent border-none p-0 font-medium text-slate-700" /></td>
                                            <td className="p-4 text-center"><input type="text" value={row.unit} onChange={(e) => handleApuChange(i, 'unit', e.target.value)} className="w-full bg-transparent border-none p-0 text-slate-400 uppercase text-center" maxLength={3} /></td>
                                            <td className="p-4"><input type="number" value={row.qty} onChange={(e) => handleApuChange(i, 'qty', e.target.value)} className="w-full text-right bg-transparent border-b border-transparent hover:border-slate-300 p-1 font-mono" /></td>

                                            {/* P.U. OFERTA (ReadOnly) */}
                                            {hasPriorOffer && (
                                                <td className="p-4 text-right bg-slate-50/50">
                                                    <span className="font-mono text-slate-400 text-xs line-through decoration-slate-300">
                                                        ${Math.round(row.originalUnitPrice || 0).toLocaleString('es-CL')}
                                                    </span>
                                                </td>
                                            )}

                                            {/* P.U. RE-ESTUDIO (Editable Base Price) */}
                                            <td className="p-4">
                                                <input
                                                    type="number"
                                                    value={row.unitPrice}
                                                    onChange={(e) => handleApuChange(i, 'unitPrice', e.target.value)}
                                                    className="w-full text-right bg-indigo-50/30 border-b border-indigo-100 hover:border-indigo-300 p-1 font-mono font-bold text-indigo-700"
                                                />
                                            </td>

                                            {/* DIFERENCIA */}
                                            {hasPriorOffer && (
                                                <td className="p-4 text-right">
                                                    <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${(row.delta || 0) < 0 ? 'bg-emerald-100 text-emerald-700' :
                                                            (row.delta || 0) > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {((row.delta || 0) > 0 ? '+' : '')}{Math.round(row.delta || 0).toLocaleString('es-CL')}
                                                    </div>
                                                </td>
                                            )}

                                            {!hasPriorOffer && (
                                                <td className="p-4 text-right font-mono text-slate-500 text-xs">
                                                    ${Math.round(row.adjustedDirect || 0).toLocaleString('es-CL')}
                                                </td>
                                            )}

                                            <td className="p-4 text-right font-mono font-bold text-emerald-600 text-sm">
                                                ${Math.round(row.totalLoaded || 0).toLocaleString('es-CL')}
                                            </td>

                                            <td className="p-4 text-center"><button onClick={() => handleDeleteItem(i)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                            <button onClick={handleAddItem} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto"><Plus size={14} /> Agregar Partida</button>
                        </div>
                    </div>

                    {/* COST DETAIL PANEL */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* ORG CHART */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-slate-800">Estructura de Dotación</h3>
                                <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    Modifica el organigrama para recalcular al instante
                                </div>
                            </div>
                            <OrgChartEditor onTeamUpdate={setTeamStructure} />
                        </div>

                        {/* STAFF COST TABLE */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[580px]">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Users size={20} className="text-slate-400" /> Detalle de Personal</h3>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Costo Mensual Total</div>
                                    <div className="text-lg font-bold text-indigo-600">${Math.round(calculatedStaffCost / params.durationMonths).toLocaleString('es-CL')}</div>
                                </div>
                            </div>
                            <div className="overflow-y-auto flex-1 p-0">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase sticky top-0">
                                        <tr>
                                            <th className="p-3">Cargo</th>
                                            <th className="p-3">Turno</th>
                                            <th className="p-3 text-right hidden lg:table-cell">Sueldo Liq.</th>
                                            <th className="p-3 text-right">Costo HH</th>
                                            <th className="p-3 text-right">Total Mes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {staffDetails.map((staff, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="p-3 font-medium text-slate-700">{staff.roleName}</td>
                                                <td className="p-3 text-slate-500">{staff.shift}</td>
                                                <td className="p-3 text-right text-slate-400 hidden lg:table-cell">${staff.liquidSalary.toLocaleString('es-CL')}</td>
                                                <td className="p-3 text-right font-mono text-slate-600">${Math.round(staff.hhCost).toLocaleString('es-CL')}</td>
                                                <td className="p-3 text-right font-bold text-indigo-600">${Math.round(staff.monthlyCost).toLocaleString('es-CL')}</td>
                                            </tr>
                                        ))}
                                        {staffDetails.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                                                    Agrega cargos en el organigrama para ver el desglose.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50 text-[10px] text-slate-400 leading-tight border-t border-slate-100">
                                <strong>Nota:</strong> El costo mensual incluye: Sueldo Líquido + Leyes Sociales (12.9%) + Provisiones (14% Vac/Indem) + Colación + Movilización + EPP (Prorrateado) + Cursos (Prorrateado) + Pasajes (Prorrateado) + Alojamiento (si aplica).
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
