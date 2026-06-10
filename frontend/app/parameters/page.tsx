"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Save, X, Trash2, Plus } from 'lucide-react';

interface CostParameter {
    id: number;
    name: string;
    category: string;
    unit: string;
    value: number;
    classification_rules: any;
    client_id: number | null;
}

export default function ParametersPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const [parameters, setParameters] = useState<CostParameter[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");

    useEffect(() => {
        fetchParameters();
    }, []);

    const fetchParameters = async () => {
        try {
            const res = await fetch(`${API_URL}/parameters/`);
            const data = await res.json();
            setParameters(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching parameters:", error);
            setLoading(false);
        }
    };

    const filteredParams = parameters.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["Todas", ...Array.from(new Set(parameters.map(p => p.category)))];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Parámetros de Costos</h1>
                <p className="text-slate-500 mt-2">Gestiona los costos base para la evaluación de proyectos.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar parámetro..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidad</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Valor Unitario</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reglas</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Cargando parámetros...</td></tr>
                        ) : filteredParams.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No se encontraron resultados</td></tr>
                        ) : (
                            filteredParams.map((param) => (
                                <tr key={param.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{param.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${param.category === 'EPP' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {param.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{param.unit}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                                        ${param.value.toLocaleString('es-CL')}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                                        {param.classification_rules?.stock_buffer_rule || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Editar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
