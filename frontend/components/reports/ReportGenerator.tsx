"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Printer, Eye, Lock, ShieldCheck, AlertTriangle, Briefcase, TrendingUp, DollarSign } from 'lucide-react';

/* 
  AUTO-PPT GENERATOR
  Uses Tailwind's `print:` modifiers to create slide-like pages.
*/

export function ReportGenerator() {
    const [audience, setAudience] = useState<'CLIENT' | 'INTERNAL'>('CLIENT');
    // In a real app, this would come from props or a context/hook
    const reportData: ReportData = MOCK_REPORT_DATA;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 font-sans">

            {/* CONTROL PANEL (Hidden on Print) */}
            <div className="bg-slate-900 text-white p-6 rounded-lg shadow-xl print:hidden border-l-4 border-indigo-500">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center">
                            <Printer className="mr-2" size={24} /> Generador de Reportes &quot;Auto-PPT&quot;
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Seleccione el modo de audiencia y exporte a PDF.</p>
                    </div>

                    <div className="flex bg-slate-800 rounded p-1">
                        <button
                            onClick={() => setAudience('CLIENT')}
                            className={`px-4 py-2 rounded text-sm font-bold flex items-center transition-colors ${audience === 'CLIENT' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Eye size={16} className="mr-2" /> Cliente (Avance & Seguridad)
                        </button>
                        <button
                            onClick={() => setAudience('INTERNAL')}
                            className={`px-4 py-2 rounded text-sm font-bold flex items-center transition-colors ${audience === 'INTERNAL' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Lock size={16} className="mr-2" /> Interno (Financiero)
                        </button>
                    </div>

                    <button
                        onClick={handlePrint}
                        className="bg-white text-indigo-900 px-6 py-2 rounded font-bold hover:bg-gray-100 flex items-center shadow-lg transition-transform transform hover:-translate-y-1"
                    >
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* REPORT CANVAS (What gets printed) */}
            <div className="print:w-full bg-white text-slate-900 min-h-screen">

                {/* === SLIDE 1: COVER & EXECUTIVE SUMMARY === */}
                <div className="print:h-screen print:w-full print:flex print:flex-col print:justify-between print:break-after-page p-8 mb-8 border border-gray-100 shadow-sm print:border-none print:shadow-none bg-white">

                    {/* HEADER LOGOS */}
                    <div className="flex justify-between items-center border-b-4 border-indigo-600 pb-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-indigo-900 rounded flex items-center justify-center text-white font-black text-xs">CONSTRUCTIA</div>
                            <div className="h-8 w-[1px] bg-gray-300"></div>
                            <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">{reportData.projectName}</div>
                        </div>
                        {/* Mock Client Logo */}
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400 uppercase font-bold">Cliente:</span>
                            <div className="h-10 w-24 bg-orange-600 rounded flex items-center justify-center text-white font-bold tracking-tighter">{reportData.clientName}</div>
                        </div>
                    </div>

                    {/* TITLE & METADATA */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                            {audience === 'CLIENT' ? 'Reporte de Avance Semanal' : 'Reporte de Gestión Mensual'}
                        </h1>
                        <p className="text-xl text-slate-500 font-medium">{reportData.period}</p>
                        <div className={`inline-block px-3 py-1 rounded text-xs font-bold mt-4 uppercase ${audience === 'INTERNAL' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {audience === 'INTERNAL' ? 'Confidencial - Uso Interno' : 'Distribución Externa Aprobada'}
                        </div>
                    </div>

                    {/* EXECUTIVE SUMMARY (AI Generated Mock) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-grow">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-slate-800 border-b border-gray-200 pb-2 flex items-center">
                                <TrendingUp className="mr-2 text-indigo-600" /> Resumen Ejecutivo
                            </h3>
                            <ul className="space-y-4 text-sm md:text-base">
                                {reportData.highlights.map((item, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs mr-3 mt-0.5 ${
                                            // Color cycling for bullets
                                            idx === 0 ? 'bg-emerald-100 text-emerald-600' :
                                                idx === 1 ? 'bg-blue-100 text-blue-600' :
                                                    'bg-orange-100 text-orange-600'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: item }} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* KPI CARDS SMALL */}
                        <div className="grid grid-cols-2 gap-4 content-start">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                <p className="text-xs text-slate-500 uppercase font-bold">SPI (Schedule)</p>
                                <p className="text-3xl font-black text-emerald-600">{reportData.kpis.spi}</p>
                                <p className="text-[10px] text-emerald-600">Adelantado</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                <p className="text-xs text-slate-500 uppercase font-bold">CPI (Cost)</p>
                                <p className="text-3xl font-black text-blue-600">{reportData.kpis.cpi}</p>
                                <p className="text-[10px] text-blue-600">En Presupuesto</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center col-span-2">
                                <p className="text-xs text-slate-500 uppercase font-bold">Dotación Activa</p>
                                <p className="text-3xl font-black text-slate-700">{reportData.kpis.activeWorkers}</p>
                                <p className="text-[10px] text-slate-500">Personas</p>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                        <span>Generado por PMO AI</span>
                        <span>Página 1 de {audience === 'CLIENT' ? '2' : '3'}</span>
                    </div>
                </div>

                {/* === SLIDE 2: PHOTOS & CRITICAL PATH (Mode A) OR FINANCIALS (Mode B) === */}
                <div className="print:h-screen print:w-full print:break-after-page p-8 mb-8 border border-gray-100 shadow-sm print:border-none print:shadow-none bg-white">

                    {audience === 'CLIENT' ? (
                        // CLIENT MODE SLIDE 2
                        <div className="h-full flex flex-col">
                            <h2 className="text-2xl font-bold text-slate-900 border-l-8 border-orange-500 pl-4 mb-8">Avance en Terreno & Ruta Crítica</h2>

                            <div className="grid grid-cols-2 gap-8 h-full">
                                {/* 2x2 Photo Grid */}
                                <div className="grid grid-cols-2 gap-4 h-[400px]">
                                    {reportData.photos.map((photo, idx) => (
                                        <div key={idx} className="bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                            <span className="text-gray-400 font-bold text-sm">FOTO: {photo.category}</span>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate">{photo.description}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Critical Path List */}
                                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                                    <h3 className="font-bold text-orange-900 mb-4 flex items-center">
                                        <AlertTriangle className="mr-2" /> Focos de Atención (Ruta Crítica)
                                    </h3>
                                    <div className="space-y-4">
                                        {reportData.criticalPath.map((issue, idx) => (
                                            <div key={idx} className={`bg-white p-3 rounded shadow-sm border-l-4 ${issue.status === 'DELAYED' ? 'border-rose-500' : 'border-yellow-500'}`}>
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-sm text-gray-800">{issue.title}</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${issue.status === 'DELAYED' ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {issue.status === 'DELAYED' ? `${issue.delayDays} días retraso` : 'Pendiente'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{issue.impact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER SLIDE 2 (Client) */}
                            <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                                <span>Generado por PMO AI</span>
                                <span>Página 2 de 2</span>
                            </div>
                        </div>

                    ) : (
                        // INTERNAL MODE SLIDE 2: FINANCIALS
                        <div className="h-full flex flex-col">
                            <div className="flex items-center mb-8">
                                <Lock className="text-rose-600 mr-3" size={28} />
                                <h2 className="text-2xl font-bold text-slate-900 border-l-8 border-rose-600 pl-4">Salud Financiera (P&L)</h2>
                            </div>

                            {/* Financial Table */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Estado de Resultados (Acumulado)</h3>
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-600 font-bold">
                                            <tr>
                                                <th className="px-4 py-3">Ítem</th>
                                                <th className="px-4 py-3 text-right">Presupuesto</th>
                                                <th className="px-4 py-3 text-right">Real</th>
                                                <th className="px-4 py-3 text-right">Desviación</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {reportData.financials.rows.map((row, idx) => (
                                                <tr key={idx} className={row.highlight ? 'bg-indigo-50 font-bold' : ''}>
                                                    <td className={`px-4 py-3 ${row.highlight ? 'text-indigo-900' : ''}`}>{row.item}</td>
                                                    <td className={`px-4 py-3 text-right font-mono ${row.highlight ? 'text-indigo-900' : ''}`}>{row.budget}</td>
                                                    <td className={`px-4 py-3 text-right font-mono ${row.highlight ? 'text-indigo-900' : ''}`}>{row.real}</td>
                                                    <td className={`px-4 py-3 text-right ${row.deviationPositive ? 'text-emerald-600' : 'text-rose-600'}`}>{row.deviation}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Claims & HR Split */}
                            <div className="grid grid-cols-2 gap-8 flex-grow">
                                <div className="bg-white border focus-within:ring border-gray-200 rounded-lg p-4">
                                    <h3 className="font-bold text-gray-800 mb-2 flex justify-between">Claims & Adicionales <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Estrategia</span></h3>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex justify-between"><span className="text-gray-600">Monto Identificado:</span> <span className="font-bold">{reportData.financials.claims.identified}</span></li>
                                        <li className="flex justify-between"><span className="text-gray-600">Enviado a Cliente:</span> <span className="font-bold">{reportData.financials.claims.sent}</span></li>
                                        <li className="flex justify-between"><span className="text-gray-600">Aprobado / Pagado:</span> <span className="font-bold text-emerald-600">{reportData.financials.claims.approved}</span></li>
                                    </ul>
                                </div>
                                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                                    <h3 className="font-bold text-rose-900 mb-2 flex items-center"><Briefcase size={16} className="mr-2" /> Pasivo Laboral (HR)</h3>
                                    <p className="text-xs text-rose-700 mb-3">Provisión estimada para cierre de obra (Desmovilización).</p>
                                    <div className="text-3xl font-black text-rose-600 mb-1">$170M <span className="text-sm font-normal text-rose-800">CLP</span></div>
                                    <div className="w-full bg-rose-200 h-1.5 rounded-full mt-2">
                                        <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <p className="text-[10px] text-rose-500 text-right mt-1">65% Financiado</p>
                                </div>
                            </div>

                            {/* FOOTER SLIDE 2 (Internal) */}
                            <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                                <span>Generado por PMO AI</span>
                                <span>Página 2 de 3</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* === SLIDE 3: INTERNAL DEEP DIVE (ONLY INTERNAL) === */}
                {audience === 'INTERNAL' && (
                    <div className="print:h-screen print:w-full print:break-after-page p-8 mb-8 border border-gray-100 shadow-sm print:border-none print:shadow-none bg-white">
                        <div className="h-full flex flex-col">
                            <div className="flex items-center mb-8">
                                <ShieldCheck className="text-indigo-600 mr-3" size={28} />
                                <h2 className="text-2xl font-bold text-slate-900 border-l-8 border-indigo-600 pl-4">Riesgos & Recursos</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-12 h-full">

                                {/* Resource Histogram Placeholder */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-700 border-b pb-2">Histograma de Recursos Críticos</h3>
                                    <div className="h-64 bg-slate-50 border border-slate-200 rounded flex items-end justify-between p-4 px-8">
                                        {/* Mock Histogram Bars */}
                                        {[40, 60, 85, 70, 50, 45].map((h, i) => (
                                            <div key={i} className="w-8 bg-indigo-400 rounded-t hover:bg-indigo-600 transition-colors relative group">
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">{h}</div>
                                                <div style={{ height: `${h}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-500 italic">
                                        Se observa un peak de demanda de enfierradores para las semanas 44-46. Se requiere coordinar subcontrato adicional.
                                    </p>
                                </div>

                                {/* Risk Matrix */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-700 border-b pb-2">Matriz de Riesgos (Top 3)</h3>
                                    <div className="space-y-3">
                                        <div className="bg-rose-50 p-4 rounded border-l-4 border-rose-500">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-rose-900 text-sm">1. Suministro de Hormigón</h4>
                                                <span className="bg-rose-200 text-rose-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Alto</span>
                                            </div>
                                            <p className="text-xs text-rose-800 mt-1">Riesgo de quiebre de stock en planta proveedora. Probabilidad 60%.</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded border-l-4 border-orange-500">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-orange-900 text-sm">2. Conflictos Sindicales</h4>
                                                <span className="bg-orange-200 text-orange-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Medio</span>
                                            </div>
                                            <p className="text-xs text-orange-800 mt-1">Negociación colectiva en curso con sindicato n°2. Posible paro parcial.</p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-yellow-900 text-sm">3. Modificaciones de Arquitectura</h4>
                                                <span className="bg-yellow-200 text-yellow-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Bajo</span>
                                            </div>
                                            <p className="text-xs text-yellow-800 mt-1">Cliente evalúa cambios en terminaciones de baños. Impacto en compras.</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* FOOTER SLIDE 3 */}
                            <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                                <span>Generado por PMO AI</span>
                                <span>Página 3 de 3</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

// --- DATA DEFINITIONS & MOCK ---
interface ReportData {
    projectName: string;
    clientName: string;
    period: string;
    highlights: string[];
    kpis: {
        spi: number;
        cpi: number;
        activeWorkers: number;
    };
    photos: { category: string; description: string }[];
    criticalPath: { title: string; status: 'DELAYED' | 'PENDING'; delayDays?: number; impact: string }[];
    financials: {
        rows: { item: string; budget: string; real: string; deviation: string; deviationPositive?: boolean; highlight?: boolean }[];
        claims: { identified: string; sent: string; approved: string };
    };
}

const MOCK_REPORT_DATA: ReportData = {
    projectName: 'Proyecto Mirador Norte',
    clientName: 'BHP',
    period: 'Semana 42 - Octubre 2026',
    highlights: [
        "<strong>Avance Físico:</strong> Se alcanzó un <strong>42%</strong> acumulado, superando la meta planificada del 40% gracias a la aceleración en Obras Civiles.",
        "<strong>Seguridad:</strong> Se completaron <strong>15,000 HH</strong> sin accidentes con tiempo perdido (LTI). Campaña de \"Manos Seguras\" exitosa.",
        "<strong>Alerta:</strong> Retraso menor en logística de acero por paro portuario. Plan de mitigación activado con proveedores locales."
    ],
    kpis: {
        spi: 1.05,
        cpi: 0.98,
        activeWorkers: 142
    },
    photos: [
        { category: "HORMIGONADO", description: "Losa Piso 5 - Eje 12" },
        { category: "ENFIERRADURA", description: "Muros Perimetrales" },
        { category: "INSTALACIONES", description: "Ductos HVAC - Subterráneo" },
        { category: "SEGURIDAD", description: "Charla 5 Minutos" }
    ],
    criticalPath: [
        { title: "Montaje Ascensores", status: "DELAYED", delayDays: 5, impact: "Impacto posible en terminaciones de hall. Proveedor confirmó nueva fecha." },
        { title: "Aprobación Planos Clima", status: "PENDING", impact: "Requiere VB del cliente para liberar fabricación de ductos especiales." }
    ],
    financials: {
        rows: [
            { item: "Ingresos (Venta)", budget: "150,000 UF", real: "62,000 UF", deviation: "41% Avance", deviationPositive: true },
            { item: "Costo Directo", budget: "(105,000 UF)", real: "(41,500 UF)", deviation: "+2.3% Ahorro", deviationPositive: true },
            { item: "Gastos Generales", budget: "(22,000 UF)", real: "(9,200 UF)", deviation: "-1.5% Sobre", deviationPositive: false },
            { item: "MARGEN OPERACIONAL", budget: "23,000 UF (15.3%)", real: "11,300 UF (18.2%)", deviation: "▲ Mejor que Venta", deviationPositive: true, highlight: true }
        ],
        claims: {
            identified: "2,500 UF",
            sent: "450 UF",
            approved: "1,250 UF"
        }
    }
};
