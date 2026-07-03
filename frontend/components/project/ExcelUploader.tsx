"use client";

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ExcelUploader = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{type: 'idle'|'success'|'error', message: string}>({type: 'idle', message: ''});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus({ type: 'idle', message: 'Procesando archivo...' });

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });

                // 1. Parse Control_Presupuesto -> budgetEVMData
                if (workbook.SheetNames.includes('Control_Presupuesto')) {
                    const ws = workbook.Sheets['Control_Presupuesto'];
                    const data = XLSX.utils.sheet_to_json(ws);
                    
                    const storedBudget = localStorage.getItem('budgetEVMData');
                    if (storedBudget) {
                        const parsedBgt = JSON.parse(storedBudget);
                        
                        const updateNodes = (nodes: any[]): any[] => {
                            return nodes.map(node => {
                                const excelRow: any = data.find((r: any) => String(r['WBS']) === String(node.wbs));
                                
                                if (excelRow) {
                                    const getVal = (keywords: string[]) => {
                                        const key = Object.keys(excelRow).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
                                        return key ? Number(excelRow[key]) || 0 : undefined;
                                    };

                                    const ac = getVal(['ac', 'costo real', 'incurrido']);
                                    const oc = getVal(['oc', 'comprometido', 'ordenes']);
                                    const etc = getVal(['etc', 'estimacion']);
                                    const avance = getVal(['avance real', '%', 'progreso']);

                                    if (ac !== undefined) node.ac = ac;
                                    if (oc !== undefined) node.oc = oc;
                                    if (etc !== undefined) node.etc = etc;
                                    if (avance !== undefined) node.realProgress = avance <= 1 ? avance * 100 : avance;
                                }
                                
                                if (node.children) {
                                    node.children = updateNodes(node.children);
                                }
                                return node;
                            });
                        };

                        const newBgt = updateNodes(parsedBgt);
                        
                        const calculateNodeEVM = (node: any): any => {
                            if (node.children && node.children.length > 0) {
                                node.children = node.children.map(calculateNodeEVM);
                                node.ac = node.children.reduce((sum: number, child: any) => sum + child.ac, 0);
                                node.oc = node.children.reduce((sum: number, child: any) => sum + child.oc, 0);
                                node.etc = node.children.reduce((sum: number, child: any) => sum + child.etc, 0);
                                const totalProgressBac = node.children.reduce((sum: number, child: any) => sum + (child.realProgress * child.bac), 0);
                                node.realProgress = node.bac > 0 ? totalProgressBac / node.bac : 0;
                            }
                            node.totalActual = node.ac + node.oc;
                            node.available = node.bac - node.totalActual;
                            node.ev = (node.realProgress / 100) * node.bac;
                            node.cv = node.ev - node.ac;
                            node.eac = node.ac + node.etc;
                            node.vac = node.bac - node.eac;
                            return node;
                        };
                        
                        const calculatedFinal = newBgt.map(calculateNodeEVM);
                        localStorage.setItem('budgetEVMData', JSON.stringify(calculatedFinal));
                    }
                }

                // 2. Parse HDR_Matriz -> hrAccreditationData_v2
                if (workbook.SheetNames.includes('HDR_Matriz')) {
                    const ws = workbook.Sheets['HDR_Matriz'];
                    const data: any[] = XLSX.utils.sheet_to_json(ws);
                    
                    const newHrData = data.map((row, idx) => {
                        const id = row['ID'] || `P${idx}`;
                        const nombre = row['Nombre'] || `Trabajador ${id}`;
                        const cargo = row['Cargo'] || 'Sin Cargo';
                        const avanceRaw = row['% Avance HDR'] || row['Avance'] || 0;
                        const avance = avanceRaw <= 1 ? `${Math.round(avanceRaw * 100)}%` : `${Math.round(avanceRaw)}%`;
                        
                        return {
                            id, nombre, cargo, rut: '11.111.111-1', especialidad: 'Operativo', avance,
                            pre_acc: avance === '100%' ? 'Aprobado' : 'Pendiente',
                            charla_odi: avance === '100%' ? 'Aprobado' : 'Pendiente',
                            examen_pre: avance === '100%' ? 'Aprobado' : 'Pendiente',
                            induccion: avance === '100%' ? 'Aprobado' : 'Pendiente'
                        };
                    });
                    
                    if (newHrData.length > 0) {
                        localStorage.setItem('hrAccreditationData_v2', JSON.stringify(newHrData));
                    }
                }

                // 3. Parse Equipos_y_Flota -> equipmentAccreditationData
                if (workbook.SheetNames.includes('Equipos_y_Flota')) {
                    const ws = workbook.Sheets['Equipos_y_Flota'];
                    const data: any[] = XLSX.utils.sheet_to_json(ws);
                    
                    const newFleetData = data.map((row, idx) => {
                        const id = row['ID'] || `EQ-${idx}`;
                        const tipo = row['Tipo Equipo'] || row['Tipo'] || 'Vehículo';
                        const semaforo = row['Semáforo (Icono)'] || row['Semaforo'];
                        const estado = (semaforo === 1 || semaforo === 'Verde' || semaforo === 'Habilitado') ? 'Habilitado' : 'Rechazado';
                        
                        return {
                            id, tipo, patente: `XX-${idx}`,
                            antiguedad: estado === 'Habilitado' ? 'Aprobado' : 'Pendiente',
                            ncap: 'Aprobado', tracktec: 'Aprobado', lkas: 'Aprobado', ecas: 'Aprobado',
                            pertiga: 'Aprobado', torque: 'Aprobado', mantencion: 'Aprobado',
                            radio: 'Aprobado', carpeta_cyd: estado === 'Habilitado' ? 'Aprobado' : 'Rechazado',
                            estado
                        };
                    });
                    
                    if (newFleetData.length > 0) {
                        localStorage.setItem('equipmentAccreditationData', JSON.stringify(newFleetData));
                    }
                }

                window.dispatchEvent(new Event('dashboardUpdate'));
                setStatus({ type: 'success', message: '¡Datos sincronizados exitosamente desde Excel!' });

            } catch (error) {
                console.error(error);
                setStatus({ type: 'error', message: 'Error al procesar el archivo Excel. Verifica el formato.' });
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 h-full">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
                accept=".xlsx, .xls" 
                className="hidden" 
            />
            
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
            >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isUploading ? 'Procesando...' : 'Cargar Excel (Sincronización)'}
            </button>

            {status.type === 'success' && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> {status.message}
                </div>
            )}
            
            {status.type === 'error' && (
                <div className="flex items-center gap-2 text-sm text-red-600 font-medium text-center">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {status.message}
                </div>
            )}
            
            {status.type === 'idle' && (
                <p className="text-xs text-slate-500 text-center">Carga masiva de Control_Presupuesto, HDR_Matriz y Equipos_y_Flota</p>
            )}
        </div>
    );
};
