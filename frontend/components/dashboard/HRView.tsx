"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Users, UserMinus, Briefcase } from 'lucide-react';

export function HRView() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HR Headcount Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-lg shadow-sm border border-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-indigo-900 uppercase">Dotación Activa</p>
                        <Users className="text-indigo-400" size={20} />
                    </div>
                    <span className="text-4xl font-bold text-indigo-900">142</span>
                    <p className="text-xs text-indigo-500 mt-1">Personas en faena hoy</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-lg shadow-sm border border-rose-100">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-medium text-rose-900 uppercase">Desmovilización (Mes)</p>
                        <UserMinus className="text-rose-400" size={20} />
                    </div>
                    <span className="text-4xl font-bold text-rose-900">12</span>
                    <p className="text-xs text-rose-500 mt-1">Programados para salida</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 uppercase">Turnos Críticos</p>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Turno 14x14 (Ayuda)</span>
                            <span className="font-bold">45 Personas</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: '30%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Severance Liability */}
            <Card title="Provisión de Finiquitos (Riesgo Financiero)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-gray-700 mb-4">Proyección de Cierre</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Indemnización Legal (Años Servicio)</p>
                                    <p className="text-xs text-gray-400">Obligatorio por ley</p>
                                </div>
                                <span className="font-bold text-gray-800">$125.000.000</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded border border-indigo-100">
                                <div>
                                    <p className="text-xs text-indigo-700 uppercase font-bold">Bono Término Conflicto (Sindical)</p>
                                    <p className="text-xs text-indigo-400">Convenio Colectivo</p>
                                </div>
                                <span className="font-bold text-indigo-900">$45.000.000</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="font-bold text-lg">Total Provisión</span>
                                <span className="font-bold text-lg text-rose-600">$170.000.000</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <Briefcase size={32} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                            <strong>Tip:</strong> La desmovilización masiva inicia en <strong>60 días</strong>.<br />Revise las cartas de aviso para evitar multas por el Art. 162.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
