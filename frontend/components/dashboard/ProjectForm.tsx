import React from 'react';
import { X } from 'lucide-react';

interface ProjectFormProps {
    onClose: () => void;
    onSave: (data: any) => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSave }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock save
        onSave({ name: 'Nuevo Proyecto Demo' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">Crear Nuevo Proyecto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Proyecto</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej: Edificio Altman" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cliente</label>
                            <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Nombre Cliente" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Ubicación (Zona)</label>
                            <select className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option>Santiago Centro</option>
                                <option>Valle</option>
                                <option>Cordillera</option>
                                <option>Costa</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Fecha Inicio</label>
                            <input type="date" className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estado Inicial</label>
                            <select className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="EN_ESTUDIO">En Estudio</option>
                                <option value="OFERTA_PRESENTADA">Oferta Presentada</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
                            Crear Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
