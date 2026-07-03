
"use client";

import React, { useState, useEffect } from 'react';
import {
    User, Users, Calculator, Activity, Check, X, Edit2,
    ChevronDown, ChevronRight, Briefcase, DollarSign, Calendar, Info
} from 'lucide-react';
import { loadProjectData, saveProjectData } from '@/utils/persistence';
import { ESTANDARES_CARGOS, calcularCostoMensual, CONSTANTES_COSTOS, RoleStandard } from '@/data/costStandards';
import { AccreditationDashboard } from './AccreditationDashboard';
import { RecruitmentDashboard } from './RecruitmentDashboard';
import { OrgChartDashboard } from './OrgChartDashboard';

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
    const [activeTab, setActiveTab] = useState<'BUDGET' | 'RECRUITMENT' | 'ACCREDITATION' | 'ORGCHART'>('ACCREDITATION');
    const [openModules, setOpenModules] = useState({ mod1: true, mod2: true });

    // Budget Table Data
    const budgetData = [
        { wbs: '1.0', description: 'RRHH DIRECTO E INDIRECTO', amount: 62700000, isTotal: true },
        { wbs: '1.1', description: 'Supervisor de Terreno', amount: 6900000, isTotal: false },
        { wbs: '1.2', description: 'Administrativo de Obras y RRLL', amount: 4200000, isTotal: false },
        { wbs: '1.3', description: 'Topógrafo', amount: 5400000, isTotal: false },
        { wbs: '1.4', description: 'Alarife', amount: 3000000, isTotal: false },
        { wbs: '1.5', description: 'Maestro 1° Líneas Senior', amount: 4800000, isTotal: false },
        { wbs: '1.6', description: 'Maestro 1° Líneas', amount: 21000000, isTotal: false },
        { wbs: '1.7', description: 'Maestro 2° Líneas', amount: 7800000, isTotal: false },
        { wbs: '1.8', description: 'Operador Camión Pluma', amount: 5700000, isTotal: false },
        { wbs: '1.9', description: 'Rigger', amount: 3900000, isTotal: false },
    ];

    // --- RENDER HELPERS ---
    const toggleMod = (m: 'mod1' | 'mod2') => setOpenModules(prev => ({ ...prev, [m]: !prev[m] }));
    const isReadOnly = project && project.status !== 'EN_ANALISIS' && project.status !== 'PREDICTIVE' && project.status !== 'AGILE' && project.status !== 'HYBRID'; // Safe fallback vs mock vs API

    return (
        <div className="space-y-6 w-full px-4 pb-20">
            {/* HEADER */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hub de Recursos Humanos</h1>
                <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Gestión Integral de Dotación y Costos</p>
            </div>

            {/* TABS */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-full max-w-2xl mx-auto shadow-inner">
                <button
                    onClick={() => setActiveTab('BUDGET')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'BUDGET' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Presupuesto y Costos
                </button>
                <button
                    onClick={() => setActiveTab('RECRUITMENT')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'RECRUITMENT' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Búsqueda y Selección
                </button>
                <button
                    onClick={() => setActiveTab('ACCREDITATION')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'ACCREDITATION' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Acreditación de Personal
                </button>
                <button
                    onClick={() => setActiveTab('ORGCHART')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'ORGCHART' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                    Organigrama
                </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'BUDGET' && (
                <div className="animate-in fade-in space-y-6">

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

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <SectionHeader id="1" title="Presupuesto Base de Recursos Humanos" color="bg-indigo-600" isOpen={openModules.mod1} toggle={() => toggleMod('mod1')} />

                {openModules.mod1 && (
                    <div className="p-0 border-t border-slate-100 animate-in slide-in-from-top-2">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-[#1f497d] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold w-32 border-r border-slate-500/30">WBS</th>
                                    <th className="px-6 py-4 text-left font-bold border-r border-slate-500/30">Descripción de la Partida</th>
                                    <th className="px-6 py-4 text-right font-bold w-64">Presupuesto Base (BAC)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {budgetData.map((row, idx) => (
                                    <tr key={row.wbs} className={row.isTotal ? 'bg-slate-50 font-black' : 'hover:bg-slate-50'}>
                                        <td className={`px-6 py-4 font-mono ${row.isTotal ? 'text-slate-800' : 'text-slate-600'}`}>{row.wbs}</td>
                                        <td className={`px-6 py-4 ${row.isTotal ? 'text-slate-800' : 'text-slate-600'}`}>{row.description}</td>
                                        <td className={`px-6 py-4 text-right font-mono ${row.isTotal ? 'text-slate-800' : 'text-slate-600'}`}>{formatMoney(row.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            </div>
            )}

            {activeTab === 'RECRUITMENT' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <RecruitmentDashboard />
                </div>
            )}

            {activeTab === 'ACCREDITATION' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <AccreditationDashboard />
                </div>
            )}

            {activeTab === 'ORGCHART' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <OrgChartDashboard />
                </div>
            )}
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
