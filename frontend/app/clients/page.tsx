"use client";
import React from 'react';
import Link from 'next/link';
import { MOCK_CLIENTS } from '@/data/mockClients';
import { Building2, MapPin, Users, Briefcase } from 'lucide-react';

export default function ClientsPage() {
    return (
        <div className="p-10 space-y-8 animate-in fade-in duration-500 bg-[#f8fafc] min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Directorio de Clientes</h1>
                    <p className="text-slate-500 mt-1">Gestión de Mandantes, Contactos y Parámetros de Costo</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
                    + Agregar Nuevo Cliente
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_CLIENTS.map((client) => (
                    <Link
                        href={`/clients/${client.id}`}
                        key={client.id}
                        className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 overflow-hidden">
                                {client.logoUrl ? (
                                    <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 className="text-slate-300" size={32} />
                                )}
                            </div>
                            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md tracking-wider">
                                {client.holding || 'Independiente'}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                            {client.name}
                        </h3>

                        <div className="space-y-2 mt-4 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400" />
                                <span>{client.region}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400" />
                                <span>{client.contacts ? client.contacts.length : 0} Contactos Clave</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase size={14} className="text-slate-400" />
                                <span>Parametrización {client.costParameters[0]?.semester || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-400">Estado</span>
                            <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span>
                                Activo
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
