
"use client";

import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, X, Edit2, Save } from 'lucide-react';
import { ESTANDARES_CARGOS, RoleStandard } from '@/data/costStandards';

// Helper to get initial role data
const getRole = (name: string) => ESTANDARES_CARGOS.find(c => c.nombre === name) || { nombre: name, rentaLiquida: 0, turno: '4x3' as const };

const initialNodes: Node[] = [
    {
        id: '1', position: { x: 250, y: 0 }, type: 'input',
        data: { label: 'Administrador de Contrato', roleData: getRole('Administrador de Contrato') }
    },
    {
        id: '2', position: { x: 100, y: 100 },
        data: { label: 'Jefe de Terreno', roleData: getRole('Jefe Terreno') }
    },
    {
        id: '3', position: { x: 400, y: 100 },
        data: { label: 'Jefe Oficina Técnica', roleData: getRole('Jefe Oficina Técnica') }
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
];

interface OrgChartEditorProps {
    onTeamUpdate?: (team: RoleStandard[]) => void;
}

export function OrgChartEditor({ onTeamUpdate }: OrgChartEditorProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Node editing state
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState("");

    // Add Node State
    const [showAddMenu, setShowAddMenu] = useState(false);

    // Notify parent of team changes
    useEffect(() => {
        if (onTeamUpdate) {
            // Extract role data from nodes
            const team = nodes.map(n => {
                if (n.data.roleData) return n.data.roleData;
                return { nombre: n.data.label, rentaLiquida: 0, turno: '4x3' }; // Fallback for generic
            });
            onTeamUpdate(team);
        }
    }, [nodes.length, nodes, onTeamUpdate]); // ReactFlow updates 'nodes' ref often, but useNodesState should handle it. To be safe we rely on length or deep check if needed.

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setEditingNodeId(node.id);
        setEditLabel(node.data.label);
    };

    const handleSaveNode = () => {
        if (!editingNodeId) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === editingNodeId) {
                    const newRoleData = { ...node.data.roleData, nombre: editLabel };
                    return { ...node, data: { ...node.data, label: editLabel, roleData: newRoleData } };
                }
                return node;
            })
        );
        setEditingNodeId(null);
    };

    const handleDeleteNode = () => {
        if (!editingNodeId) return;
        setNodes((nds) => nds.filter((n) => n.id !== editingNodeId));
        setEdges((eds) => eds.filter((e) => e.source !== editingNodeId && e.target !== editingNodeId));
        setEditingNodeId(null);
    };

    // ADD STANDARD ROLE
    const addStandardNode = (role: RoleStandard) => {
        const id = Math.random().toString();
        const newNode: Node = {
            id,
            position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 50 },
            data: {
                label: role.nombre,
                roleData: role // Store data for calculations
            },
        };
        setNodes((nds) => nds.concat(newNode));
        setShowAddMenu(false);
    };

    // ADD GENERIC
    const addGenericNode = () => {
        const id = Math.random().toString();
        const newNode: Node = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: 'Nuevo Cargo (Genérico)', roleData: { nombre: 'Nuevo Cargo', rentaLiquida: 0, turno: '4x3' } },
        };
        setNodes((nds) => nds.concat(newNode));
        setShowAddMenu(false);
    };

    return (
        <div className="h-[500px] w-full border border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>

            {/* Floating Editor Panel */}
            {editingNodeId && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-64 z-10 animate-in fade-in zoom-in">
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Edit2 size={16} /> Editar Cargo
                    </h4>
                    <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="w-full border p-2 rounded mb-3 text-sm"
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={handleDeleteNode}
                            className="bg-rose-100 text-rose-600 p-2 rounded hover:bg-rose-200"
                            title="Eliminar"
                        >
                            <X size={16} />
                        </button>
                        <button
                            onClick={handleSaveNode}
                            className="bg-indigo-600 text-white px-3 py-2 rounded text-sm font-bold flex items-center gap-1 hover:bg-indigo-700"
                        >
                            <Save size={14} /> Guardar
                        </button>
                    </div>
                </div>
            )}

            {/* Add Button with Menu */}
            <div className="absolute top-4 left-4 z-10">
                <div className="relative">
                    <button
                        onClick={() => setShowAddMenu(!showAddMenu)}
                        className="bg-white hover:bg-slate-50 text-indigo-600 px-4 py-2 rounded shadow border border-indigo-100 font-bold text-sm flex items-center gap-2"
                    >
                        <Plus size={16} /> Agregar Cargo
                    </button>

                    {showAddMenu && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 max-h-80 overflow-y-auto z-20">
                            <div className="p-2 border-b border-slate-50">
                                <button
                                    onClick={addGenericNode}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded italic"
                                >
                                    + Cargo Genérico / Manual
                                </button>
                            </div>
                            <div className="p-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 sticky top-0 bg-white pb-1">Estándares (Mel/Cmdic)</p>
                                {ESTANDARES_CARGOS.map((role, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => addStandardNode(role)}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded transition duration-150 border-b border-slate-50 last:border-0"
                                    >
                                        <div className="font-bold">{role.nombre}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{role.turno} • ${role.rentaLiquida.toLocaleString('es-CL')} Liq.</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
