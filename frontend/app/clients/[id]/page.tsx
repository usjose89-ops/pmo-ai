"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CLIENTS } from '@/data/mockClients';
import { MapPin, Mountain, Building, User, Phone, Mail, ChevronLeft, Settings, Save, AlertTriangle } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ClientDetailPageProps {
    params: { id: string };
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
    const client = MOCK_CLIENTS.find(c => c.id === params.id);
    const [activeTab, setActiveTab] = useState<'INFO' | 'COSTS'>('INFO');

    // Placeholder state for editing checks
    const [editMode, setEditMode] = useState(false);

    if (!client) {
        return notFound();
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in duration-500">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/clients" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5">
                            {client.logoUrl && <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" />}
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 leading-tight">{client.name}</h1>
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{client.holding || 'Cliente Minero'}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('INFO')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'INFO' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Información & Contactos
                    </button>
                    <button
                        onClick={() => setActiveTab('COSTS')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'COSTS' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Costos de Faena
                    </button>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1 overflow-y-auto">

                {activeTab === 'INFO' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                        {/* Submodule 1A: Ubicación */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <MapPin className="text-indigo-500" size={18} />
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Ubicación y Geografía</h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Ubicación Faena</span>
                                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                                        <Building size={16} className="text-slate-400" />
                                        {client.siteDetails?.location || 'No definida'}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Ciudad Más Cercana</span>
                                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                                        <Building size={16} className="text-slate-400" />
                                        {client.siteDetails?.nearestCity || 'No definida'}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Altura Promedio</span>
                                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                                        <Mountain size={16} className="text-slate-400" />
                                        {client.siteDetails?.averageAltitude ? `${client.siteDetails.averageAltitude} msnm` : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Submodule 1B: Ejecutivos */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="text-indigo-500" size={18} />
                                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Directorio de Ejecutivos</h2>
                                </div>
                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">+ Agregar Contacto</button>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3 font-bold">Cargo</th>
                                            <th className="px-6 py-3 font-bold">Nombre</th>
                                            <th className="px-6 py-3 font-bold">Departamento</th>
                                            <th className="px-6 py-3 font-bold">Contacto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {client.contacts?.length > 0 ? client.contacts.map((contact) => (
                                            <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-indigo-900 border-l-4 border-transparent hover:border-indigo-500">
                                                    {contact.role}
                                                </td>
                                                <td className="px-6 py-4 text-slate-800 font-medium">{contact.name}</td>
                                                <td className="px-6 py-4 text-slate-500">{contact.department || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                            <Mail size={12} className="text-slate-400" />
                                                            {contact.email}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                            <Phone size={12} className="text-slate-400" />
                                                            {contact.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                                                    No hay ejecutivos registrados. Esperando información...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'COSTS' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                        {/* Costos Placeholder / Future Implementaton */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <Settings className="text-amber-500" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-amber-900">Módulo de Parametrización de Costos</h3>
                            <p className="text-amber-700 max-w-md">
                                Aquí se cargarán los costos específicos de faena (Estadía, Maquinaria, EPP, Cursos) con vigencia semestral.
                            </p>
                            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-amber-200 transition-all">
                                Configurar Semestre 2026-S1
                            </button>
                        </div>

                        {/* Grid Example for future logic */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 opacity-60 pointer-events-none grayscale">
                            <h4 className="font-bold text-slate-400 mb-4 px-2 uppercase text-xs tracking-widest">Vista Previa: Estructura de Costos Logísticos</h4>
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

            </div>
        </div>
    );
}
