import React from 'react';
import { Search, UserPlus, Filter, Clock, CheckCircle2, UserX } from 'lucide-react';

export function RecruitmentDashboard() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Módulo de Búsqueda y Selección</h2>
                <p className="text-slate-500 max-w-md">
                    El proceso de selección para este proyecto ya ha concluido. Este espacio está reservado para futuros proyectos donde se requiera gestionar el pipeline de candidatos, entrevistas y pre-selección antes de pasar a la fase de Acreditación.
                </p>
                <button className="mt-6 px-6 py-2 bg-slate-100 text-slate-400 font-bold rounded-lg cursor-not-allowed">
                    Proceso Cerrado
                </button>
            </div>

            {/* Estructura placeholder de cómo se vería */}
            <div className="opacity-50 pointer-events-none">
                <h3 className="font-bold text-slate-500 mb-4 uppercase text-xs tracking-widest">Vista Preliminar (Estructura)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Columna 1 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[400px]">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-bold text-slate-700">CV Recibidos</span>
                            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">45</span>
                        </div>
                        {/* Mock Cards */}
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-2">
                            <p className="font-bold text-sm">Juan Pérez</p>
                            <p className="text-xs text-slate-500">Postulante a: Eléctrico</p>
                        </div>
                    </div>
                    {/* Columna 2 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[400px]">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-bold text-slate-700">Entrevistas</span>
                            <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">12</span>
                        </div>
                    </div>
                    {/* Columna 3 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[400px]">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-bold text-slate-700">Exámenes Pre-Ocupacionales</span>
                            <span className="bg-yellow-100 text-yellow-600 text-xs font-bold px-2 py-1 rounded-full">5</span>
                        </div>
                    </div>
                    {/* Columna 4 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[400px]">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <span className="font-bold text-slate-700">Seleccionados</span>
                            <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full">8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
