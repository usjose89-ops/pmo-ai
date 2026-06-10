
"use client";

import React, { useState, useEffect } from 'react';
import {
    User, Users, Calculator, Activity, Check, X, Edit2,
    ChevronDown, ChevronRight, Briefcase, DollarSign, Calendar, Info
} from 'lucide-react';
import { loadProjectData, saveProjectData } from '@/utils/persistence';
import { ESTANDARES_CARGOS, calcularCostoMensual, CONSTANTES_COSTOS, RoleStandard } from '@/data/costStandards';

// --- COMPONENTS ---
const SectionHeader = ({ id, title, icon: Icon, color, isOpen, toggle }: any) => (
    <div
        onClick={toggle}
        className={`flex justify-between items-center p-6 border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50 ${isOpen ? 'bg-slate-50' : 'bg-white'}`}
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${color}`}>
                {id}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </div>
);

const InputField = ({ label, value, onChange, type = "text", prefix, className = "", min, disabled = false }: any) => (
    <div className={className}>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
        <div className="relative">
            {prefix && <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">{prefix}</span>}
            <input
                type={type}
                min={min}
                disabled={disabled}
                value={value}
                onChange={type === 'number' ? (e) => onChange(parseFloat(e.target.value) || 0) : (e) => onChange(e.target.value)}
                className={`w-full p-2 border rounded-lg text-sm font-bold bg-white text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all ${prefix ? 'pl-8' : ''} ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
            />
        </div>
    </div>
);

const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(Math.round(val));
};

export function HumanResources({ project }: { project?: any }) {
    // --- STATE ---
    const [openModules, setOpenModules] = useState({ mod1: true, mod2: true });

    // Module 1 Inputs
    const [selectedRoleName, setSelectedRoleName] = useState('Gerente Proyecto');
    const [formState, setFormState] = useState({
        rentaLiquida: 6000000,
        fechaInicio: '',
        duracionMeses: 12,
        tipoContrato: 'indefinido',
        turno: '4x3',
        horasMensuales: 176,
        applySinergia: false,
        bonoImponible: 0,
        colacion: CONSTANTES_COSTOS.COLACION,
        movilizacion: CONSTANTES_COSTOS.MOVILIZACION,
        cliente: 'MEL',
        estadiaTipo: 'cliente',
        costoEstadia: 0,
        pasajeAereo: CONSTANTES_COSTOS.PASAJE_AEREO,
        pasajeTerrestre: CONSTANTES_COSTOS.PASAJE_TERRESTRE,
        cotAdicional: 0.4,
        horasExtras: 0,
        eppBase: CONSTANTES_COSTOS.EPP_ANUAL_MEL,
        bonoTermino: 0
    });

    const [calculationResult, setCalculationResult] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Module 2 Data
    const [projectStaff, setProjectStaff] = useState<any[]>([]);

    // --- EFFECTS ---
    useEffect(() => {
        // Load role presets
        const role = ESTANDARES_CARGOS.find(r => r.nombre === selectedRoleName);
        if (role) {
            setFormState(prev => ({
                ...prev,
                rentaLiquida: role.rentaLiquida,
                turno: role.turno,
                horasMensuales: role.turno === '4x3' ? 176 : 168
            }));
        }
    }, [selectedRoleName]);

    // Handle EPP update based on Client
    useEffect(() => {
        setFormState(prev => ({
            ...prev,
            eppBase: prev.cliente === 'MEL' ? CONSTANTES_COSTOS.EPP_ANUAL_MEL : CONSTANTES_COSTOS.EPP_ANUAL_BASE
        }));
    }, [formState.cliente]);


    // --- ACTIONS ---
    const runCalculation = () => {
        setIsCalculating(true);
        setTimeout(() => {
            const res = calcularCostoMensual({
                rentaLiquida: formState.rentaLiquida,
                hoursPerMonth: formState.horasMensuales,
                durationMonths: formState.duracionMeses,
                isMel: formState.cliente === 'MEL',
                includeLodging: formState.estadiaTipo === 'empresa',
                lodgingCostDaily: formState.costoEstadia,
                applySinergia: formState.applySinergia,
                bonoImponible: formState.bonoImponible,
                passThroughCosts: {
                    colacion: formState.colacion,
                    movilizacion: formState.movilizacion,
                    pasajeAereo: formState.pasajeAereo,
                    pasajeTerrestre: formState.pasajeTerrestre,
                    eppBase: formState.eppBase
                }
            });
            setCalculationResult(res);
            setIsCalculating(false);
        }, 600);
    };

    const addToStaff = (qty: number) => {
        if (!calculationResult) return;

        const newStaff = {
            id: Date.now(),
            role: selectedRoleName,
            monthlyCost: calculationResult.totalMensual,
            monthlyDistribution: Array(formState.duracionMeses).fill(qty)
        };
        setProjectStaff(prev => [...prev, newStaff]);
    };

    const updateStaffQty = (staffId: number, monthIdx: number, val: number) => {
        setProjectStaff(prev => prev.map(s => {
            if (s.id !== staffId) return s;
            const newDist = [...s.monthlyDistribution];
            newDist[monthIdx] = val;
            return { ...s, monthlyDistribution: newDist };
        }));
    };

    const removeStaff = (id: number) => {
        setProjectStaff(prev => prev.filter(s => s.id !== id));
    };

    // --- RENDER HELPERS ---
    const toggleMod = (m: 'mod1' | 'mod2') => setOpenModules(prev => ({ ...prev, [m]: !prev[m] }));
    const isReadOnly = project && project.status !== 'EN_ANALISIS' && project.status !== 'PREDICTIVE' && project.status !== 'AGILE' && project.status !== 'HYBRID'; // Safe fallback vs mock vs API

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* HEADER */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Costos de Proyecto</h1>
                <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Análisis Técnico-Económico Chile 2025</p>
            </div>

            {/* AVISO MODO LECTURA */}
            {isReadOnly && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Presupuesto RRHH Adjudicado y Aprobado</p>
                        <p className="text-xs mt-1">Este proyecto se encuentra adjudicado / en ejecución. Los parámetros base para RRHH ya se encuentran fijados en la línea base y operan en formato de <b>Sólo Lectura</b>.</p>
                    </div>
                </div>
            )}

            {/* MÓDULO 1: ANÁLISIS PRECIO UNITARIO */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <SectionHeader id="1" title="Módulo 1: Análisis de Precio Unitario (HH)" color="bg-indigo-600" isOpen={openModules.mod1} toggle={() => toggleMod('mod1')} />

                {openModules.mod1 && (
                    <div className="p-6 border-t border-slate-100 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* INPUTS LEFT */}
                            <div className="lg:col-span-5 space-y-4">
                                {/* CARD 1.1 */}
                                <div className="p-5 border rounded-2xl bg-slate-50/50 shadow-sm space-y-3">
                                    <h3 className="font-bold text-xs text-slate-400 uppercase mb-4 tracking-widest">1.1 Perfil y Tiempo</h3>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Cargo</label>
                                        <select
                                            disabled={isReadOnly}
                                            value={selectedRoleName}
                                            onChange={(e) => setSelectedRoleName(e.target.value)}
                                            className={`w-full p-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-200 font-bold text-slate-700 ${isReadOnly ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
                                        >
                                            {ESTANDARES_CARGOS.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                                        </select>
                                    </div>
                                    <InputField disabled={isReadOnly} label="Sueldo Líquido ($)" value={formState.rentaLiquida} onChange={(v: any) => setFormState({ ...formState, rentaLiquida: v })} type="number" prefix="$" />

                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField disabled={isReadOnly} label="Fecha Inicio" value={formState.fechaInicio} onChange={(v: any) => setFormState({ ...formState, fechaInicio: v })} type="date" />
                                        <InputField disabled={isReadOnly} label="Duración (Meses)" value={formState.duracionMeses} onChange={(v: any) => setFormState({ ...formState, duracionMeses: v })} type="number" min={1} className="font-black text-indigo-700" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Turno</label>
                                            <select
                                                disabled={isReadOnly}
                                                value={formState.turno}
                                                onChange={(e) => setFormState({ ...formState, turno: e.target.value })}
                                                className={`w-full p-2 border rounded-lg text-xs bg-white font-medium ${isReadOnly ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
                                            >
                                                <option value="4x3">4x3</option>
                                                <option value="7x7">7x7</option>
                                                <option value="14x14">14x14</option>
                                            </select>
                                        </div>
                                        <InputField disabled={isReadOnly} label="Horas Mensuales" value={formState.horasMensuales} onChange={(v: any) => setFormState({ ...formState, horasMensuales: v })} type="number" />
                                    </div>

                                    <div className="flex items-center pt-2 gap-2">
                                        <input
                                            type="checkbox"
                                            disabled={isReadOnly}
                                            checked={formState.applySinergia}
                                            onChange={(e) => setFormState({ ...formState, applySinergia: e.target.checked })}
                                            className="h-4 w-4 text-indigo-600 rounded"
                                        />
                                        <label className="text-xs text-slate-700 font-medium">Modo Sinergia (Sin provisión finiquito)</label>
                                    </div>
                                </div>

                                {/* CARD 1.2 */}
                                <div className="p-5 border rounded-2xl bg-slate-50/50 shadow-sm">
                                    <h3 className="font-bold text-xs text-slate-400 uppercase mb-4 tracking-widest">1.2 Logística y Prorrateos</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cliente Proyecto</label>
                                            <select
                                                disabled={isReadOnly}
                                                value={formState.cliente}
                                                onChange={(e) => setFormState({ ...formState, cliente: e.target.value })}
                                                className={`w-full p-2 border rounded-lg text-xs font-bold ${isReadOnly ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
                                            >
                                                <option value="MEL">MEL</option>
                                                <option value="CMDIC">CMDIC</option>
                                            </select>
                                        </div>
                                        <InputField disabled={isReadOnly} label="Estadía" type="select" /> {/* Simplified */}
                                        <InputField disabled={isReadOnly} label="Pasaje Aéreo" value={formState.pasajeAereo} onChange={(v: any) => setFormState({ ...formState, pasajeAereo: v })} type="number" prefix="$" />
                                        <InputField disabled={isReadOnly} label="Pasaje Bus" value={formState.pasajeTerrestre} onChange={(v: any) => setFormState({ ...formState, pasajeTerrestre: v })} type="number" prefix="$" />
                                        <div className="col-span-2">
                                            <InputField disabled={isReadOnly} label="EPP Anual ($)" value={formState.eppBase} onChange={(v: any) => setFormState({ ...formState, eppBase: v })} type="number" prefix="$" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RESULTS RIGHT */}
                            <div className="lg:col-span-7 flex flex-col space-y-6">
                                <button
                                    disabled={isReadOnly}
                                    onClick={runCalculation}
                                    className={`w-full text-white font-black py-5 rounded-3xl transition shadow-xl text-xl uppercase tracking-widest flex justify-center items-center gap-2 ${isReadOnly ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {isCalculating ? 'Calculando...' : 'CALCULAR ANÁLISIS DE COSTO'}
                                </button>

                                {!calculationResult && (
                                    <div className="flex-grow flex flex-col justify-center items-center p-20 border-4 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30 text-slate-400">
                                        <Calculator className="w-24 h-24 mb-6 opacity-10" />
                                        <p className="text-2xl font-black italic opacity-50">Listo para Analizar</p>
                                        <p className="text-[10px] uppercase tracking-widest mt-2 font-bold">El cálculo ajustará costos fijos según la duración</p>
                                    </div>
                                )}

                                {calculationResult && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                            <div className="relative z-10">
                                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-400 mb-2">Resultado Final APU por Duración:</p>
                                                <h4 className="text-3xl font-black mb-6">{selectedRoleName}</h4>
                                                <div className="grid grid-cols-2 gap-12 border-t border-slate-800 pt-8">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Costo HH (Indemn. Vol.)</p>
                                                        <p className="text-5xl font-black text-white">{formatMoney(calculationResult.costoHH)}</p>
                                                        <p className="text-[10px] text-emerald-400 mt-2 font-bold">
                                                            Costo Operacional: {formatMoney(calculationResult.costoHH_Operacional)} HH
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mensual Total Empresa</p>
                                                        <p className="text-3xl font-black text-indigo-300">{formatMoney(calculationResult.totalMensual)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {!isReadOnly && (
                                            <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm">
                                                <div className="flex-grow">
                                                    <label className="block text-[10px] font-black text-emerald-700 uppercase mb-2 tracking-widest">Añadir Dotación a Matriz Mensual:</label>
                                                    <div className="flex gap-4">
                                                        <input
                                                            type="number"
                                                            defaultValue={1}
                                                            className="w-24 p-3 border-2 border-emerald-300 rounded-2xl font-black text-center text-2xl outline-none focus:bg-white transition-all text-emerald-800"
                                                            id="qty-to-add"
                                                        />
                                                        <button
                                                            onClick={() => addToStaff(parseInt((document.getElementById('qty-to-add') as HTMLInputElement).value) || 1)}
                                                            className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl hover:bg-emerald-700 transition uppercase shadow-lg tracking-tighter"
                                                        >
                                                            Añadir al Presupuesto
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Breakdown */}
                                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                            <h5 className="font-black text-slate-400 uppercase text-[10px] mb-6 border-b pb-3 tracking-[0.2em] text-center">Desglose Analítico Mensualizado</h5>
                                            <div className="space-y-2 text-sm">
                                                <ResultRow label="Renta Líquida + Bonos Imponibles" val={formState.rentaLiquida + formState.bonoImponible} />
                                                <ResultRow label="Haberes No Imp. (Col+Mov)" val={formState.colacion + formState.movilizacion} />
                                                <ResultRow label="Leyes Sociales y Previsión" val={calculationResult.detalles.leyesSociales} />
                                                <ResultRow label="Provisión Finiquito" val={calculationResult.detalles.finiquitoFull} isDanger />
                                                <div className="bg-gray-50 p-3 rounded-2xl mt-4 space-y-1">
                                                    <p className="text-[9px] font-black uppercase text-indigo-700 mb-2">Costos Logísticos (Prorrateo)</p>
                                                    <ResultSubRow label="Logística Total (EPP, Viajes, Cursos, Estadía)" val={calculationResult.detalles.logistica} />
                                                </div>
                                                <div className="border-t pt-2 mt-2 flex justify-between items-center text-indigo-700 font-black uppercase">
                                                    <span>Subtotal Mensual</span>
                                                    <span>{formatMoney(calculationResult.totalMensual)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MÓDULO 2: MATRIZ DOTACIÓN */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                <SectionHeader id="2" title="Módulo 2: Matriz de Dotación Mensual" color="bg-blue-600" isOpen={openModules.mod2} toggle={() => toggleMod('mod2')} />

                {openModules.mod2 && (
                    <div className="p-6 border-t border-slate-100 text-xs animate-in slide-in-from-top-2">
                        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-4 text-left sticky left-0 bg-slate-100 border-r min-w-[180px] text-[10px] font-black uppercase text-slate-500 tracking-widest">Cargo del Proyecto</th>
                                        <th className="px-2 text-center text-[9px] text-slate-400 uppercase font-black">C.Unit.</th>
                                        {Array.from({ length: formState.duracionMeses }).map((_, i) => (
                                            <th key={i} className="px-1 text-center text-[9px] font-bold text-slate-600 bg-slate-50/50 min-w-[40px]">M{i + 1}</th>
                                        ))}
                                        <th className="p-4 text-right text-[10px] font-black uppercase bg-slate-100 min-w-[110px]">Subtotal MO</th>
                                        {!isReadOnly && <th className="p-2 bg-slate-100"></th>}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {projectStaff.length === 0 && (
                                        <tr><td colSpan={formState.duracionMeses + 4} className="p-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest italic bg-slate-50/30">Sin dotación cargada</td></tr>
                                    )}
                                    {projectStaff.map(staff => {
                                        const rowSum = staff.monthlyDistribution.reduce((a: number, b: number) => a + (b * staff.monthlyCost), 0);
                                        return (
                                            <tr key={staff.id}>
                                                <td className="p-4 font-bold sticky left-0 bg-white border-r text-slate-700 text-xs">{staff.role}</td>
                                                <td className="p-2 text-right text-[10px] text-slate-300 font-mono">{formatMoney(staff.monthlyCost)}</td>
                                                {staff.monthlyDistribution.map((qty: number, i: number) => (
                                                    <td key={i} className="p-1 text-center">
                                                        <input
                                                            type="number"
                                                            disabled={isReadOnly}
                                                            value={qty}
                                                            onChange={(e) => updateStaffQty(staff.id, i, parseInt(e.target.value) || 0)}
                                                            className={`w-[40px] text-center p-1 border border-slate-300 rounded text-xs font-bold outline-none ${isReadOnly ? 'bg-transparent border-transparent' : 'focus:ring-1 focus:ring-blue-500 bg-white'}`}
                                                        />
                                                    </td>
                                                ))}
                                                <td className="p-4 text-right font-black text-indigo-900 bg-indigo-50/10 font-mono">{formatMoney(rowSum)}</td>
                                                {!isReadOnly && (
                                                    <td className="p-2 text-center">
                                                        <button onClick={() => removeStaff(staff.id)} className="text-red-400 font-black hover:text-red-600 transition">×</button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="bg-slate-50 font-black border-t-2 border-slate-200 text-blue-900">
                                    <tr>
                                        <td colSpan={2} className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Total Mano de Obra Proyecto</td>
                                        <td colSpan={formState.duracionMeses}></td>
                                        <td className="p-4 text-right text-indigo-700 text-xl font-black bg-indigo-50 shadow-inner">
                                            {formatMoney(projectStaff.reduce((sum, staff) => sum + staff.monthlyDistribution.reduce((a: number, b: number) => a + b, 0) * staff.monthlyCost, 0))}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const ResultRow = ({ label, val, isDanger }: any) => (
    <div className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0 last:pb-0">
        <span className="text-slate-400">{label}</span>
        <span className={`font-bold ${isDanger ? 'text-red-600' : 'text-slate-700'}`}>{formatMoney(val)}</span>
    </div>
);

const ResultSubRow = ({ label, val }: any) => (
    <div className="flex justify-between items-center py-0.5 pl-3 text-xs text-slate-500">
        <span>{label}</span>
        <span>{formatMoney(val)}</span>
    </div>
);
