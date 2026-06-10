import React from 'react';

// Lógica para capturar datos reales al terminar
export const LessonsLearnedForm = ({ onSave }: any) => {
    return (
        <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-700 pb-4">Recopilación de Lecciones Aprendidas</h3>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Tasa de Rotación Real (%)</label>
                    <input type="number" className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" placeholder="Ej: 20.5" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Días Perdidos por Clima</label>
                    <input type="number" className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" placeholder="Días" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Días Perdidos x Cliente</label>
                    <input type="number" className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" placeholder="Días de espera" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Incidentes Seguridad</label>
                    <input type="number" className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" placeholder="Cant. total" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Total Licencias Médicas</label>
                    <input type="number" className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" placeholder="Cant. días/personas" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Total Renuncias</label>
                    <input type="number" className="w-full bg-slate-800 border-none rounded-lg p-3 text-white" placeholder="Cant. personas" />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">Presupuesto Inicial (UF)</label>
                        <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white" placeholder="150.000" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-emerald-400 block mb-2">Costo Real Final (UF)</label>
                        <input type="number" className="w-full bg-slate-800 border border-emerald-500/50 rounded-lg p-3 text-white" placeholder="148.500" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 block mb-2">Motivo Principal de Retraso</label>
                    <select className="w-full bg-slate-800 border-none rounded-lg p-3 text-white">
                        <option>Responsabilidad Cliente</option>
                        <option>Falta de Mano de Obra</option>
                        <option>Logística / Materiales</option>
                        <option>Clima Extremo</option>
                    </select>
                </div>
            </div>
            <button onClick={onSave} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black py-4 rounded-xl transition-all uppercase tracking-widest">
                Guardar en Histórico y Finalizar Proyecto
            </button>
        </div>
    );
};
