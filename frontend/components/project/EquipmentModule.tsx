"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, Search, Filter, Download, Truck } from 'lucide-react';

const STATUS_OPTIONS = ['Pendiente', 'En Revisión', 'Revisado', 'Aprobado', 'Terminado', 'Atrasado', 'Rechazado', 'Vencido', 'N/A', 'Habilitado', 'Restringido'];

const EVALUATED_COLUMNS = [
    'antiguedad', 'ncap', 'tracktec', 'lkas', 'ecas', 'pertiga', 'torque', 'mantencion', 'radio', 'carpeta_cyd'
];

const initialMockData = [
    {
        id: 'EQ-01', tipo: 'Camioneta 4x4', patente: 'LVPX-44', 
        antiguedad: 'Aprobado', ncap: 'Aprobado', tracktec: 'Aprobado', 
        lkas: 'Aprobado', ecas: 'Aprobado', pertiga: 'Aprobado', 
        torque: 'Aprobado', mantencion: 'Aprobado', radio: 'Aprobado', 
        carpeta_cyd: 'Aprobado', estado: 'Habilitado'
    },
    {
        id: 'EQ-02', tipo: 'Camioneta 4x4', patente: 'LVPX-45', 
        antiguedad: 'Aprobado', ncap: 'Aprobado', tracktec: 'Aprobado', 
        lkas: 'Vencido', ecas: 'Aprobado', pertiga: 'Aprobado', 
        torque: 'Pendiente', mantencion: 'Aprobado', radio: 'Aprobado', 
        carpeta_cyd: 'En Revisión', estado: 'Restringido'
    },
    {
        id: 'EQ-03', tipo: 'Camión Pluma 20T', patente: 'HRTT-12', 
        antiguedad: 'Aprobado', ncap: 'N/A', tracktec: 'Aprobado', 
        lkas: 'Aprobado', ecas: 'Pendiente', pertiga: 'Aprobado', 
        torque: 'Aprobado', mantencion: 'Aprobado', radio: 'Aprobado', 
        carpeta_cyd: 'Aprobado', estado: 'Habilitado'
    },
    {
        id: 'EQ-04', tipo: 'Bus Transporte Personal', patente: 'JJKK-99', 
        antiguedad: 'Rechazado', ncap: 'Pendiente', tracktec: 'Aprobado', 
        lkas: 'Aprobado', ecas: 'Aprobado', pertiga: 'Aprobado', 
        torque: 'Aprobado', mantencion: 'Vencido', radio: 'Aprobado', 
        carpeta_cyd: 'Rechazado', estado: 'Rechazado'
    }
];

export function EquipmentModule() {
    const [data, setData] = useState<any[]>(initialMockData);

    useEffect(() => {
        const stored = localStorage.getItem('equipmentAccreditationData');
        if (stored) {
            setData(JSON.parse(stored));
        } else {
            const recalculated = initialMockData.map(row => ({ ...row, estado: calculateAvance(row) }));
            setData(recalculated);
            localStorage.setItem('equipmentAccreditationData', JSON.stringify(recalculated));
        }
    }, []);

    const calculateAvance = (row: any) => {
        let hasRechazadoOVencido = false;
        let hasPendiente = false;
        
        EVALUATED_COLUMNS.forEach(col => {
            const val = row[col];
            if (val === 'Rechazado' || val === 'Vencido') hasRechazadoOVencido = true;
            if (val === 'Pendiente' || val === 'En Revisión') hasPendiente = true;
        });

        if (hasRechazadoOVencido) return 'Rechazado';
        if (hasPendiente) return 'Restringido';
        return 'Habilitado';
    };

    const handleStatusChange = (rowId: string, columnKey: string, newValue: string) => {
        const newData = data.map(row => {
            if (row.id === rowId) {
                const updatedRow = { ...row, [columnKey]: newValue };
                updatedRow.estado = calculateAvance(updatedRow);
                return updatedRow;
            }
            return row;
        });
        
        setData(newData);
        localStorage.setItem('equipmentAccreditationData', JSON.stringify(newData));
        window.dispatchEvent(new Event('dashboardUpdate'));
    };

    const columns = [
        { key: 'id', label: 'ID', width: 'w-16', fixed: true },
        { key: 'tipo', label: 'Tipo de Equipo', width: 'w-40', fixed: true },
        { key: 'patente', label: 'Patente/VIN', width: 'w-24', fixed: true },
        { key: 'antiguedad', label: 'Antigüedad', width: 'w-32' },
        { key: 'ncap', label: 'NCAP / ECE', width: 'w-32' },
        { key: 'tracktec', label: 'GPS / Tracktec', width: 'w-32' },
        { key: 'lkas', label: 'LKAS', width: 'w-32' },
        { key: 'ecas', label: 'ECAS', width: 'w-32' },
        { key: 'pertiga', label: 'Pértiga/Balizas', width: 'w-32' },
        { key: 'torque', label: 'Torque Ruedas', width: 'w-32' },
        { key: 'mantencion', label: 'Mantención al Día', width: 'w-36' },
        { key: 'radio', label: 'Comunicaciones', width: 'w-32' },
        { key: 'carpeta_cyd', label: 'Carpeta CyD', width: 'w-32' },
        { key: 'estado', label: 'Estado', width: 'w-24' },
    ];

    const getStatusColor = (status: string) => {
        if (status === 'Aprobado' || status === 'Aprobada' || status === 'Habilitado' || status === 'Terminado' || status === 'Revisado') return 'bg-[#92d050] text-slate-800 font-bold';
        if (status === 'Pendiente' || status === 'En Revisión' || status === 'Restringido') return 'bg-yellow-300 text-slate-800 font-bold';
        if (status === 'Rechazado' || status === 'Vencido' || status === 'Rechazada' || status === 'Atrasado') return 'bg-red-500 text-white font-bold';
        if (status === 'N/A') return 'bg-slate-200 text-slate-500 font-medium';
        return 'bg-white text-slate-700';
    };

    const equiposHabilitados = data.filter(d => d.estado === 'Habilitado').length;
    const carpetasCyD = data.filter(d => d.carpeta_cyd === 'Aprobado' || d.carpeta_cyd === 'Aprobada').length;
    const restringidos = data.filter(d => d.estado === 'Restringido').length;
    const criticos = data.filter(d => d.estado === 'Rechazado').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hub de Equipos Rodantes</h1>
                <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-xs">Gestión y Acreditación de Maquinaria</p>
            </div>

            {/* Header KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600"><Truck /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Equipos Habilitados</p>
                        <h3 className="text-2xl font-black text-slate-800">{equiposHabilitados} / {data.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Carpetas CyD OK</p>
                        <h3 className="text-2xl font-black text-slate-800">{carpetasCyD}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600"><Clock /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">En Revisión / Restringidos</p>
                        <h3 className="text-2xl font-black text-slate-800">{restringidos}</h3>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg text-red-600"><AlertCircle /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Alertas Críticas / Rechazados</p>
                        <h3 className="text-2xl font-black text-slate-800">{criticos}</h3>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 w-1/2">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Buscar por patente, tipo o estado..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                        <Download className="w-4 h-4" /> Exportar
                    </button>
                </div>
            </div>

            {/* Matriz de Equipos (Scroll Horizontal) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Matriz de Acreditación de Vehículos y Maquinaria (MEL)</h3>
                    <p className="text-xs text-slate-500">Haz clic en las celdas para editar el estado. Los cambios se guardarán automáticamente.</p>
                </div>
                
                <div className="overflow-x-auto relative w-full" style={{ maxWidth: '100%' }}>
                    <table className="w-max min-w-full text-left text-xs border-collapse">
                        <thead className="bg-[#1f497d] text-white">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th 
                                        key={col.key} 
                                        className={`py-3 px-2 font-bold uppercase tracking-wider border-r border-slate-500/30 ${col.width} ${col.fixed ? 'sticky z-10 bg-[#1f497d]' : ''}`}
                                        style={col.fixed ? { left: idx === 0 ? 0 : idx === 1 ? '4rem' : '14rem' } : {}}
                                    >
                                        <div className="truncate">{col.label}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.map((row) => (
                                <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="sticky left-0 bg-white border-r border-slate-200 py-2 px-2 font-mono text-slate-500 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        {row.id}
                                    </td>
                                    <td className="sticky bg-white border-r border-slate-200 py-2 px-2 font-bold text-slate-700 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ left: '4rem' }}>
                                        <div className="truncate w-[140px]">{row.tipo}</div>
                                    </td>
                                    <td className="sticky bg-white border-r border-slate-200 py-2 px-2 font-mono font-bold text-slate-900 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ left: '14rem' }}>
                                        {row.patente}
                                    </td>
                                    
                                    {EVALUATED_COLUMNS.map(colKey => (
                                        <td key={colKey} className={`border-r border-slate-200 py-1 px-1 text-center ${getStatusColor(row[colKey])}`}>
                                            <select 
                                                value={row[colKey]}
                                                onChange={(e) => handleStatusChange(row.id, colKey, e.target.value)}
                                                className={`w-full bg-transparent text-center font-semibold outline-none cursor-pointer p-1 appearance-none hover:bg-black/5 rounded`}
                                                style={{ textAlignLast: 'center' }}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt} className="text-slate-800 bg-white">{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                    ))}
                                    
                                    <td className={`border-r border-slate-200 py-2 px-2 text-center ${getStatusColor(row.estado)}`}>
                                        <div className="flex items-center justify-center gap-1">
                                            {row.estado}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
