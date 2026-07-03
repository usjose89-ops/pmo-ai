import React, { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExcelUploader } from './ExcelUploader';

interface ExecutiveDashboardProps {
    project: Project;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ project }) => {
    // -------------------------------------------------------------
    // STATE: Para vincular con LocalStorage de los demás módulos
    // -------------------------------------------------------------
    const [evmData, setEvmData] = useState({ bac: 253028082, ac: 200000, eac: 253028082, ev: 0, cpi: 2.40, spi: 'Pendiente', vac: 199998 });
    const [hrData, setHrData] = useState({ dotacion_total: 18, examenes_aprobados: 16, carta_oferta: 15, acreditado_100: 0, promedio_hdr: '0,0%', hh_consumidas: 1250, riesgos_abiertos: 0, avance_carpeta_1: 1, avance_carpeta_2: '37,5%' });
    const [fleetData, setFleetData] = useState({ total_equipos: 8, equipos_acreditados: 0, avance_promedio: '0%', n_camionetas: 4, avance_camionetas: '0%', n_camion_pluma: 2, avance_camion_pluma: '0%' });

    const loadData = () => {
        // Cargar datos de RRHH
        const storedHr = localStorage.getItem('hrAccreditationData_v2');
        if (storedHr) {
            const parsedHr = JSON.parse(storedHr);
            const total = parsedHr.length;
            const aprobados100 = parsedHr.filter((r: any) => r.avance === '100%').length;
            setHrData(prev => ({
                ...prev,
                dotacion_total: total,
                acreditado_100: aprobados100,
                promedio_hdr: `${total > 0 ? Math.round((aprobados100 / total) * 100) : 0}%`
            }));
        }

        // Cargar datos de Equipos
        const storedEq = localStorage.getItem('equipmentAccreditationData');
        if (storedEq) {
            const parsedEq = JSON.parse(storedEq);
            const total = parsedEq.length;
            const habilitados = parsedEq.filter((r: any) => r.estado === 'Habilitado').length;
            
            const camionetas = parsedEq.filter((r: any) => r.tipo.includes('Camioneta'));
            const camionetasHab = camionetas.filter((r: any) => r.estado === 'Habilitado').length;
            
            const plumas = parsedEq.filter((r: any) => r.tipo.includes('Pluma'));
            const plumasHab = plumas.filter((r: any) => r.estado === 'Habilitado').length;

            setFleetData(prev => ({
                ...prev,
                total_equipos: total,
                equipos_acreditados: habilitados,
                avance_promedio: `${total > 0 ? Math.round((habilitados / total) * 100) : 0}%`,
                n_camionetas: camionetas.length,
                avance_camionetas: `${camionetas.length > 0 ? Math.round((camionetasHab / camionetas.length) * 100) : 0}%`,
                n_camion_pluma: plumas.length,
                avance_camion_pluma: `${plumas.length > 0 ? Math.round((plumasHab / plumas.length) * 100) : 0}%`
            }));
        }

        // Cargar datos de Presupuesto EVM
        const storedBudget = localStorage.getItem('budgetEVMData');
        if (storedBudget) {
            const parsedBgt = JSON.parse(storedBudget);
            // Sum roots
            let tBac = 0; let tAc = 0; let tEac = 0; let tVac = 0; let tEv = 0;
            parsedBgt.forEach((node: any) => {
                tBac += node.bac || 0;
                tAc += node.ac || 0;
                tEac += node.eac || 0;
                tVac += node.vac || 0;
                tEv += node.ev || 0;
            });
            
            const cpi = tAc > 0 ? (tEv / tAc).toFixed(2) : 'N/A';

            setEvmData(prev => ({
                ...prev,
                bac: tBac,
                ac: tAc,
                eac: tEac,
                vac: tVac,
                ev: tEv,
                cpi: cpi === 'N/A' ? 0 : Number(cpi)
            }));
        }
    };

    useEffect(() => {
        loadData();
        window.addEventListener('dashboardUpdate', loadData);
        return () => window.removeEventListener('dashboardUpdate', loadData);
    }, []);

    // -------------------------------------------------------------
    // FORMATTERS Y OTROS MOCKS
    // -------------------------------------------------------------
    const formatCurrency = (val: number | string) => {
        if (typeof val === 'string') return val;
        return `$${new Intl.NumberFormat('es-CL').format(val)}`;
    };

    const qaqcData = {
        tareas_totales: 9,
        protocolos_gen: 0,
        protocolos_apr: 0,
        liberacion: '0%',
        procedimientos_gen: 'Vincular',
        procedimientos_porc: 'Vincular'
    };

    const docData = [
        { name: 'Orden de Servicio STN', status: 'OK' },
        { name: 'Contrato KELTI / STN', status: 'NA' },
        { name: 'Contrato STN creado en PMF', status: 'OK' },
        { name: 'Orden de Servicio CTC Global', status: 'OK' },
        { name: 'Contrato CTC creado en PMF', status: 'OK' }
    ];

    const evmChartData = [
        { month: 'May 2026', pv: 30000000, ev: evmData.ev * 0.2, ac: evmData.ac * 0.2 },
        { month: 'Jun 2026', pv: 75000000, ev: evmData.ev * 0.5, ac: evmData.ac * 0.5 },
        { month: 'Jul 2026', pv: 230000000, ev: evmData.ev * 0.8, ac: evmData.ac * 0.8 },
        { month: 'Ago 2026', pv: evmData.bac, ev: evmData.ev, ac: evmData.ac },
    ];

    const physicalChartData = [
        { month: 'Mayo 2026', pv_perc: 0.1, ev_perc: 0.05 },
        { month: 'Junio 2026', pv_perc: 0.3, ev_perc: 0.05 },
        { month: 'Julio 2026', pv_perc: 0.9, ev_perc: 0.05 },
        { month: 'Agosto 2026', pv_perc: 1.0, ev_perc: 0.05 },
    ];

    const SectionHeader = ({ title }: { title: string }) => (
        <div className="bg-[#1f497d] text-white font-bold text-xs uppercase px-3 py-1 mt-4 mb-1">
            {title}
        </div>
    );

    const DataRow = ({ label, value, bg = 'bg-white', isLink = false }: { label: string, value: any, bg?: string, isLink?: boolean }) => (
        <div className={`flex justify-between items-center text-xs border-b border-gray-200 px-2 py-1 ${bg}`}>
            <span className="font-semibold text-slate-700">{label}</span>
            <span className={`${isLink ? 'bg-yellow-300 w-24 text-center border border-gray-400 font-bold px-1' : 'text-slate-900 font-bold'}`}>
                {value}
            </span>
        </div>
    );

    const StatusRow = ({ label, status }: { label: string, status: string }) => {
        let bgClass = 'bg-gray-200';
        if (status === 'OK' || status === 'NA') bgClass = 'bg-[#92d050] text-black';
        return (
            <div className="flex justify-between text-xs border-b border-gray-200">
                <span className="font-semibold text-slate-700 px-2 py-1">{label}</span>
                <span className={`w-32 text-center font-bold px-2 py-1 border-l border-gray-300 ${bgClass}`}>
                    {status}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-[#1f497d] text-white text-center p-2">
                <h2 className="font-bold text-lg">DASHBOARD EJECUTIVO - CONTROL INTEGRAL DEL PROYECTO</h2>
                <h3 className="font-semibold">Proyecto: {project.name}</h3>
                <p className="text-red-300 text-sm font-bold mt-1">Sincronizado en Tiempo Real</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <ExcelUploader />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                <div className="lg:col-span-5">
                    {/* 1. Salud Financiera */}
                    <SectionHeader title="1. SALUD FINANCIERA (EVM & Curva S)" />
                    <div className="border border-gray-300 bg-white">
                        <DataRow label="Presupuesto Total (BAC)" value={formatCurrency(evmData.bac)} bg="bg-gray-50" />
                        <DataRow label="Costo Real Incurrido (AC)" value={formatCurrency(evmData.ac)} isLink={true} />
                        <DataRow label="Valor Ganado (EV)" value={formatCurrency(evmData.ev)} bg="bg-gray-50" />
                        <DataRow label="Estimación al Cierre (EAC)" value={formatCurrency(evmData.eac)} isLink={true} />
                        <DataRow label="Índice Desempeño Costo (CPI)" value={evmData.cpi} bg="bg-gray-50" />
                        <DataRow label="Variación al Término (VAC)" value={formatCurrency(evmData.vac)} isLink={true} />
                    </div>

                    {/* 2. RRHH */}
                    <SectionHeader title="2. RECURSOS HUMANOS Y PRODUCTIVIDAD" />
                    <div className="border border-gray-300 bg-white">
                        <DataRow label="Dotación Total (Acreditación)" value={hrData.dotacion_total} />
                        <DataRow label="Personal 100% Acreditado" value={hrData.acreditado_100} isLink={true} bg="bg-gray-50" />
                        <DataRow label="Promedio Avance General" value={hrData.promedio_hdr} isLink={true} />
                        <DataRow label="Horas Hombre (HH) Consumidas" value={hrData.hh_consumidas} bg="bg-gray-50" />
                        <DataRow label="Riesgos Abiertos" value={hrData.riesgos_abiertos} />
                    </div>

                    {/* 3. Equipos Rodantes */}
                    <SectionHeader title="3. EQUIPOS RODANTES Y TOPOGRAFÍA" />
                    <div className="border border-gray-300 bg-white">
                        <DataRow label="Total Equipos y Vehículos" value={fleetData.total_equipos} />
                        <DataRow label="Equipos 100% Habilitados" value={fleetData.equipos_acreditados} isLink={true} bg="bg-gray-50" />
                        <DataRow label="Avance Promedio Flota" value={fleetData.avance_promedio} isLink={true} />
                        <DataRow label="Nº de Camionetas" value={fleetData.n_camionetas} bg="bg-gray-50" />
                        <DataRow label="% Habilitación Camionetas" value={fleetData.avance_camionetas} isLink={true} />
                        <DataRow label="Nº Equipos Pesados/Buses" value={fleetData.n_camion_pluma} bg="bg-gray-50" />
                        <DataRow label="% Habilitación Pesados" value={fleetData.avance_camion_pluma} isLink={true} />
                    </div>

                    {/* 4. Calidad */}
                    <SectionHeader title="4. CALIDAD (QA/QC) Y COMPROMISOS" />
                    <div className="border border-gray-300 bg-white">
                        <DataRow label="Tareas Compromisos Totales" value={qaqcData.tareas_totales} />
                        <DataRow label="Protocolos QA/QC Generados" value={qaqcData.protocolos_gen} bg="bg-gray-50" />
                        <DataRow label="% Liberación QA/QC" value={qaqcData.liberacion} />
                    </div>

                    {/* 5. Documentación */}
                    <SectionHeader title="5. DOCUMENTACION CONTRACTUAL" />
                    <div className="border border-gray-300 bg-white">
                        {docData.map((doc, idx) => (
                            <StatusRow key={idx} label={doc.name} status={doc.status} />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <div className="border border-gray-300 bg-white p-4 pb-12 mt-4 relative">
                        <h3 className="font-bold text-center text-sm mb-4">Curva S - Gestión del Valor Ganado (EVM $)</h3>
                        <p className="absolute -left-12 top-1/2 -rotate-90 text-[10px] font-bold text-slate-600 w-32 text-center">Costo Acumulado ($)</p>
                        
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={evmChartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{fontSize: 10}} />
                                    <YAxis tick={{fontSize: 10}} tickFormatter={(val) => new Intl.NumberFormat('es-CL').format(val)} />
                                    <Tooltip formatter={(val: number) => `$${new Intl.NumberFormat('es-CL').format(val)}`} />
                                    <Legend wrapperStyle={{fontSize: 12, paddingTop: '10px'}} />
                                    <Line type="monotone" dataKey="pv" name="PV ($)" stroke="#4472c4" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="ev" name="EV ($)" stroke="#c00000" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="ac" name="AC ($)" stroke="#70ad47" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="border border-gray-300 bg-white p-4 pb-12 relative">
                        <h3 className="font-bold text-center text-sm mb-4">Curva S - Avance Físico (%)</h3>
                        <p className="absolute -left-12 top-1/2 -rotate-90 text-[10px] font-bold text-slate-600 w-32 text-center">Avance Acumulado (%)</p>
                        
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={physicalChartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{fontSize: 10}} />
                                    <YAxis tick={{fontSize: 10}} domain={[0, 1.2]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1, 1.2]} />
                                    <Tooltip formatter={(val: number) => `${(val * 100).toFixed(1)}%`} />
                                    <Legend wrapperStyle={{fontSize: 12, paddingTop: '10px'}} />
                                    <Line type="monotone" dataKey="pv_perc" name="Avance Planificado (PV %)" stroke="#4472c4" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="ev_perc" name="Avance Real (EV %)" stroke="#c00000" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
