"use client";
import React, { useState } from 'react';
import { Project, ProjectStatus } from '@/types/project';
import { supabaseProjectService } from '@/services/supabaseProjectService';
import { X, Save, Building2, MapPin, Calendar, DollarSign, Loader2 } from 'lucide-react';

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const isEditing = !!initialData;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Project>>(
        initialData || {
            name: '',
            subtitle: '',
            client: '',
            location: '',
            status: ProjectStatus.EN_ANALISIS,
            start_date: new Date().toISOString().split('T')[0],
            technical_finish_date: '',
            admin_finish_date: '',
            risk_label: 'BAJO',
            advance_physical: 0,
            advance_financial: 0,
            financials: {
                total_revenue: 0,
                total_cost: 0,
                gross_margin: 0,
                gross_margin_percent: 0,
                target_revenue: 0,
                target_margin_percent: 0,
                currency: 'CLP'
            },
            hr_metrics: {
                headcount: 0,
                total_hh: 0,
                avg_cost_hh: 0,
                productive_factor: 0
            }
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            financials: {
                ...prev.financials!,
                [name]: Number(value) || 0
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing && formData.id) {
                await supabaseProjectService.updateProject(formData.id, formData);
            } else {
                await supabaseProjectService.createProject(formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Error al guardar el proyecto. Verifica los datos.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">
                            {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">Ingresa los datos del portafolio</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* COLUMNA 1: Datos Generales */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Building2 size={16} /> Información General
                            </h3>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del Proyecto</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Ej: Nueva Sala Eléctrica" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Subtítulo / Descripción Breve</label>
                                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Cliente</label>
                                    <input required type="text" name="client" value={formData.client} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><MapPin size={12}/> Ubicación</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Estado en Portafolio</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold text-slate-700">
                                        <option value={ProjectStatus.EN_ANALISIS}>En Estudio / Pre-Venta</option>
                                        <option value={ProjectStatus.EN_LICITACION}>En Licitación</option>
                                        <option value={ProjectStatus.ADJUDICADO_EN_CURSO}>Adjudicado / Activo</option>
                                        <option value={ProjectStatus.TERMINADO}>Terminado / Histórico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Nivel de Riesgo</label>
                                    <select name="risk_label" value={formData.risk_label} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm font-bold text-slate-700">
                                        <option value="BAJO">Bajo</option>
                                        <option value="MEDIO">Medio</option>
                                        <option value="CRITICO">Crítico</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA 2: Plazos y Finanzas */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Calendar size={16} /> Plazos y Avance
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Fecha de Inicio</label>
                                    <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Término en Terreno</label>
                                    <input type="date" name="technical_finish_date" value={formData.technical_finish_date} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Avance Físico (%)</label>
                                    <input type="number" min="0" max="100" name="advance_physical" value={formData.advance_physical} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Avance Financiero (%)</label>
                                    <input type="number" min="0" max="100" name="advance_financial" value={formData.advance_financial} onChange={handleChange} className="w-full border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 text-sm" />
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mt-8 mb-4 pt-4 border-t border-slate-100">
                                <DollarSign size={16} /> Resumen Financiero
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Presupuesto Venta (Ingreso)</label>
                                    <input type="number" name="total_revenue" value={formData.financials?.total_revenue} onChange={handleFinancialChange} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Costo Proyectado (Presupuesto Meta)</label>
                                    <input type="number" name="total_cost" value={formData.financials?.total_cost} onChange={handleFinancialChange} className="w-full border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                            Cancelar
                        </button>
                        <button disabled={isLoading} type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
