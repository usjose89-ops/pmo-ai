"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
    Controls,
    Background,
    Handle,
    Position,
    NodeTypes,
    Edge,
    Node,
    useNodesState,
    useEdgesState,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';

type PersonProgress = {
    examenes: number;
    contratacion: number;
    hdr: number;
    ceim: number;
    acreditacion: number;
};

// Componente para el círculo de progreso circular SVG
const CircularProgress = ({ value, label, color }: { value: number, label: string, color: string }) => {
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-8 h-8">
                    <circle cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
                    <circle cx="16" cy="16" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className={color} />
                </svg>
                <span className="absolute text-[8px] font-bold text-slate-700">{value}%</span>
            </div>
            <span className="text-[8px] font-bold text-slate-500 uppercase">{label}</span>
        </div>
    );
};

// Custom Node para una Persona
const PersonNode = ({ data }: any) => {
    return (
        <div className="bg-white border-2 border-slate-300 rounded-lg shadow-sm w-[300px] hover:border-indigo-400 transition-colors">
            <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-indigo-500" />
            <div className="bg-[#002060] text-white font-bold text-[10px] p-2 text-center rounded-t-md uppercase tracking-wider h-[40px] flex items-center justify-center">
                {data.cargo}
            </div>
            <div className="p-2 text-center border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800">{data.nombre}</p>
            </div>
            <div className="flex justify-around p-2 bg-slate-50 rounded-b-md">
                <CircularProgress value={data.examenes} label="Exám." color="text-blue-500" />
                <CircularProgress value={data.contratacion} label="Contr." color="text-purple-500" />
                <CircularProgress value={data.hdr} label="HDR" color="text-rose-500" />
                <CircularProgress value={data.ceim} label="3D CEIM" color="text-orange-500" />
                <CircularProgress value={data.acreditacion} label="Acred." color="text-emerald-500" />
            </div>
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-indigo-500" />
        </div>
    );
};

// Custom Node para un Grupo de Maestros
const GroupNode = ({ data }: any) => {
    return (
        <div className="bg-slate-50 border-2 border-slate-300 rounded shadow-sm w-[320px]">
            <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-indigo-500" />
            <div className="bg-slate-200 text-slate-700 font-bold text-xs p-2 text-center border-b border-slate-300 uppercase">
                {data.groupName} ({data.members.length})
            </div>
            <div className="divide-y divide-slate-200">
                {data.members.map((child: any) => (
                    <div key={child.id} className="p-2 text-left bg-white">
                        <div className="text-[11px] font-bold text-slate-800">{child.nombre}</div>
                        <div className="text-[9px] text-slate-500">{child.cargo}</div>
                        <div className="flex justify-between mt-1 px-1">
                            <div className="text-[9px] font-semibold text-slate-400">Ex:<span className="text-blue-500 ml-1">{child.examenes}%</span></div>
                            <div className="text-[9px] font-semibold text-slate-400">Ct:<span className="text-purple-500 ml-1">{child.contratacion}%</span></div>
                            <div className="text-[9px] font-semibold text-slate-400">HDR:<span className="text-rose-500 ml-1">{child.hdr}%</span></div>
                            <div className="text-[9px] font-semibold text-slate-400">3D:<span className="text-orange-500 ml-1">{child.ceim}%</span></div>
                            <div className="text-[9px] font-semibold text-slate-400">Ac:<span className="text-emerald-500 ml-1">{child.acreditacion}%</span></div>
                        </div>
                    </div>
                ))}
            </div>
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-indigo-500" />
        </div>
    );
};

// Configuración de Dagre para Auto-Layout
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    // Configuramos la distancia entre nodos
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 });

    nodes.forEach((node) => {
        // Estimamos la altura según el tipo
        const isGroup = node.type === 'groupNode';
        const height = isGroup ? 40 + (node.data.members.length * 55) : 160;
        dagreGraph.setNode(node.id, { width: 320, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const isGroup = node.type === 'groupNode';
        const height = isGroup ? 40 + (node.data.members.length * 55) : 160;
        
        node.position = {
            x: nodeWithPosition.x - 140, // Centrar según ancho
            y: nodeWithPosition.y - (height / 2), // Centrar según altura
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};

export function OrgChartDashboard() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Memoize los custom nodes
    const nodeTypes = useMemo<NodeTypes>(() => ({
        personNode: PersonNode,
        groupNode: GroupNode
    }), []);

    useEffect(() => {
        const loadData = () => {
            const stored = localStorage.getItem('hrAccreditationData_v6');
            if (!stored) return;

            const dbData: any[] = JSON.parse(stored);
            const progressData: Record<string, PersonProgress> = {};

            dbData.forEach(row => {
                const isApproved = (val: string) => {
                    if (!val || val === 'N/A' || val === 'No Iniciado' || val === 'En proceso' || val === 'Alterado' || val === 'Obs. Bajo lo esperado') return 0;
                    return 1;
                };
                const isNa = (val: string) => val === 'N/A';
                
                let exAp = 0; let exTot = 0;
                ['examen_med', 'test_ad', 'altura_geo', 'altura_fis', 'psicosenso', 'aversion_riesgo'].forEach(c => {
                    if (!isNa(row[c])) { exTot++; exAp += isApproved(row[c]); }
                });
                const examenes = exTot > 0 ? Math.round((exAp / exTot) * 100) : 100;

                let contratacion = 0;
                if (isApproved(row.contrato)) contratacion = 100;
                else if (row.contrato === 'En proceso') contratacion = 50;

                const hdr = Math.round(row.avance_hdr || 0);

                let ceim = 0;
                if (isNa(row.ceim_3d)) ceim = 100;
                else if (row.ceim_3d === 'En proceso') ceim = 50;
                else if (isApproved(row.ceim_3d)) ceim = 100;

                const acreditacion = Math.round(row.cumpl_consolidado || 0);
                
                progressData[row.id] = { examenes, contratacion, hdr, ceim, acreditacion };
            });

            const getProg = (id: string) => progressData[id] || { examenes: 0, contratacion: 0, hdr: 0, ceim: 0, acreditacion: 0 };
            const getPerson = (id: string, nombre: string, cargo: string) => ({ id, nombre, cargo, ...getProg(id) });

            // Definimos Nodos
            const initialNodes: Node[] = [
                { id: 'P01', type: 'personNode', data: getPerson('P01', 'Andrés Tebes', 'Administrador Contrato'), position: { x: 0, y: 0 } },
                { id: 'P06', type: 'personNode', data: getPerson('P06', 'Manuel Tapia', 'Topógrafo'), position: { x: 0, y: 0 } },
                { id: 'P07', type: 'personNode', data: getPerson('P07', 'Orlando Maita', 'Alarife'), position: { x: 0, y: 0 } },
                
                { id: 'P03', type: 'personNode', data: getPerson('P03', 'Leonel Sanchez', 'Supervisor de Montaje y Tendido'), position: { x: 0, y: 0 } },
                { id: 'P04', type: 'personNode', data: getPerson('P04', 'Ulises Psijas', 'Supervisor Terreno'), position: { x: 0, y: 0 } },
                
                { id: 'g_m1', type: 'groupNode', data: {
                    groupName: 'M1 Montaje y Tendido',
                    members: [
                        getPerson('P08', 'Wilmer Chambi', 'Maestro 1° Líneas'),
                        getPerson('P11', 'Ronald Orellana', 'Maestro 1° Líneas'),
                        getPerson('P10', 'Wilber Corrales', 'Maestro 1° Líneas'),
                        getPerson('P09', 'David Flores', 'Maestro 1° Líneas'),
                        getPerson('P12', 'Maica Villca', 'Maestro 1° Líneas'),
                        getPerson('P13', 'Fredy Arena', 'Maestro 1° Líneas'),
                    ]
                }, position: { x: 0, y: 0 } },
                
                { id: 'g_m2', type: 'groupNode', data: {
                    groupName: 'M2 Montaje y Tendido',
                    members: [
                        getPerson('P14', 'Roly Ipurani', 'Maestro 2° Líneas'),
                        getPerson('P15', 'Erasmo Castellon', 'Maestro 2° Líneas'),
                    ]
                }, position: { x: 0, y: 0 } },
                
                { id: 'P16', type: 'personNode', data: getPerson('P16', 'Matias Quiñenao', 'Operador Camión Pluma'), position: { x: 0, y: 0 } },
                { id: 'P17', type: 'personNode', data: getPerson('P17', 'Mauro Vega / S. Morales', 'Rigger'), position: { x: 0, y: 0 } },
                
                { id: 'P05', type: 'personNode', data: getPerson('P05', 'Jesenia Tapia', 'Administrativo & RRLL'), position: { x: 0, y: 0 } },
                { id: 'P02', type: 'personNode', data: getPerson('P02', 'Juan Carlos Santander', 'Asesor HSEC'), position: { x: 0, y: 0 } },
            ];

            const edgeOptions = { type: 'smoothstep', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } };

            const initialEdges: Edge[] = [
                // Top Level
                { id: 'e-P01-P06', source: 'P01', target: 'P06', ...edgeOptions },
                { id: 'e-P01-P03', source: 'P01', target: 'P03', ...edgeOptions },
                { id: 'e-P01-P05', source: 'P01', target: 'P05', ...edgeOptions },
                { id: 'e-P01-P02', source: 'P01', target: 'P02', ...edgeOptions },
                
                // Rama Topografía
                { id: 'e-P06-P07', source: 'P06', target: 'P07', ...edgeOptions },

                // Rama Montaje
                { id: 'e-P03-P04', source: 'P03', target: 'P04', ...edgeOptions },
                { id: 'e-P04-g_m1', source: 'P04', target: 'g_m1', ...edgeOptions },
                { id: 'e-P04-g_m2', source: 'P04', target: 'g_m2', ...edgeOptions },
                { id: 'e-P04-P16', source: 'P04', target: 'P16', ...edgeOptions },
                { id: 'e-P16-P17', source: 'P16', target: 'P17', ...edgeOptions },
            ];

            // Auto layout con Dagre
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
            
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        };

        loadData();
        window.addEventListener('dashboardUpdate', loadData);
        return () => window.removeEventListener('dashboardUpdate', loadData);
    }, [setNodes, setEdges]);

    return (
        <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 h-[700px] w-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.2}
            >
                <Background color="#cbd5e1" gap={20} size={2} />
                <Controls className="bg-white border-slate-200 fill-slate-700 shadow-lg" />
            </ReactFlow>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                Arrastra las cajas libremente o usa el mouse para hacer Zoom.
            </div>
        </div>
    );
}
