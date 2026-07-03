import React, { useState } from 'react';
import { X, Save, FileText, Award, MapPin, Phone, AlertTriangle, User, Activity } from 'lucide-react';

export const PersonProfileModal = ({ isOpen, onClose, person, onSave }: any) => {
    if (!isOpen || !person) return null;

    const [formData, setFormData] = useState({ ...person });

    // Calculate expiration logic
    const checkExpiration = (dateStr: string) => {
        if (!dateStr || dateStr === 'Pendiente') return false;
        const expDate = new Date(dateStr);
        const today = new Date();
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 60 && diffDays > 0; // Less than or equal to 60 days
    };

    const isCedulaExpiring = checkExpiration(formData.fecha_vencimiento_cedula);
    const isExamenExpiring = checkExpiration(formData.fecha_vencimiento_examen_med);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-2xl font-black shadow-inner">
                            {formData.nombre?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <input 
                                type="text" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                className={`text-2xl font-black bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none w-full min-w-[300px] transition-colors ${isCedulaExpiring || isExamenExpiring ? 'text-red-600' : 'text-slate-800'}`}
                            />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{formData.cargo}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Col 1 */}
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Datos Personales</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cédula (RUT)</label>
                                        <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="w-full p-2 border rounded text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vencimiento Cédula</label>
                                        <input type="date" name="fecha_vencimiento_cedula" value={formData.fecha_vencimiento_cedula || ''} onChange={handleChange} className={`w-full p-2 border rounded text-sm font-bold outline-none focus:ring-1 ${isCedulaExpiring ? 'border-red-500 text-red-600 bg-red-50' : 'border-slate-300 text-slate-700 focus:ring-indigo-500'}`} />
                                        {isCedulaExpiring && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Próximo a vencer</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><MapPin className="w-3 h-3"/> Dirección</label>
                                        <input type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} className="w-full p-2 border rounded text-sm text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Phone className="w-3 h-3"/> Contacto de Emergencia</label>
                                        <input type="text" name="contacto_emergencia" value={formData.contacto_emergencia || ''} onChange={handleChange} placeholder="Nombre y Teléfono" className="w-full p-2 border rounded text-sm text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Documentos Adjuntos</h3>
                                <button className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors text-left flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-500" /> Ver Currículum Vitae (CV)
                                </button>
                                <button className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors text-left flex items-center gap-3">
                                    <Award className="w-5 h-5 text-emerald-500" /> Ver Certificaciones y Títulos
                                </button>
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Estado de Exámenes y Acreditación</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vencimiento Examen Médico (Mutual)</label>
                                        <input type="date" name="fecha_vencimiento_examen_med" value={formData.fecha_vencimiento_examen_med || ''} onChange={handleChange} className={`w-full p-2 border rounded text-sm font-bold outline-none focus:ring-1 ${isExamenExpiring ? 'border-red-500 text-red-600 bg-red-50' : 'border-slate-300 text-slate-700 focus:ring-indigo-500'}`} />
                                        {isExamenExpiring && <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Próximo a vencer</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha Envío a CyD</label>
                                            <input type="date" name="fecha_envio_cyd" value={formData.fecha_envio_cyd || ''} onChange={handleChange} className="w-full p-2 border rounded text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Resultado CyD</label>
                                            <select name="resultado_cyd" value={formData.resultado_cyd || 'Pendiente'} onChange={handleChange} className="w-full p-2 border rounded text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500">
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En Revisión">En Revisión</option>
                                                <option value="Observada">Observada</option>
                                                <option value="Aprobada">Aprobada</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Credencial MEL</label>
                                        <select name="credencial" value={formData.credencial || 'Pendiente'} onChange={handleChange} className="w-full p-2 border rounded text-sm font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500">
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Aprobada">Aprobada</option>
                                            <option value="Rechazada">Rechazada</option>
                                            <option value="Vencida">Vencida</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-md">
                        <Save className="w-4 h-4" /> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};
