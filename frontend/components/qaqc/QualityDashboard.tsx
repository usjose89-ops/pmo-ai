"use client";

import React, { useState, useEffect } from 'react';
import { FileCheck, AlertTriangle, CheckCircle, Clock, Edit2, Check, X, Folder, FileText, ChevronRight, CornerUpLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { saveProjectData, loadProjectData } from '@/utils/persistence';

// --- DATA TYPES ---
export type ItemType = 'FOLDER' | 'PROTOCOL' | 'PLAN' | 'CERTIFICATE';
export type ItemStatus = 'DRAFT' | 'INTERNAL_REVIEW' | 'CLIENT_REVIEW' | 'APPROVED' | 'PENDING' | 'NA';

export interface QualityItem {
    id: string;
    parentId: string | null;
    name: string;
    type: ItemType;
    status: ItemStatus;
    progress: number; // 0-100 (Calculated for folders)
    linkedTask?: string; // Optional for folders
}

// --- MOCK DATA GENERATOR ---
const createFolder = (id: string, parentId: string | null, name: string): QualityItem => ({
    id, parentId, name, type: 'FOLDER', status: 'PENDING', progress: 0
});

const createFile = (id: string, parentId: string, name: string, type: ItemType, status: ItemStatus, progress: number, task?: string): QualityItem => ({
    id, parentId, name, type, status, progress, linkedTask: task || ''
});

// TROLLEY DATA (HIERARCHICAL)
const TROLLEY_ITEMS: QualityItem[] = [
    // TOP Folders (Root Children)
    createFolder('f1', null, 'Carpeta TOP: Energización Trolley'),

    // Subfolders of 'f1'
    createFolder('f1_1', 'f1', 'Protocolos de Calidad'),
    createFolder('f1_2', 'f1', 'Planos As-Built'),
    createFolder('f1_3', 'f1', 'Certificados y Ensayos'),

    // Files in 'Protocolos'
    createFile('p1', 'f1_1', 'Pruebas Carga Sistema', 'PROTOCOL', 'APPROVED', 100, 'Energización'),
    createFile('p2', 'f1_1', 'Continuidad Malla', 'PROTOCOL', 'APPROVED', 100, 'Malla Puesta a Tierra'),

    // Files in 'Planos'
    createFile('pl1', 'f1_2', 'Plano Unilineal General (V3)', 'PLAN', 'APPROVED', 100, 'Ingeniería'),

    // Files in 'Certificados'
    createFile('c1', 'f1_3', 'Certificado Calibre Cables', 'CERTIFICATE', 'CLIENT_REVIEW', 100, 'Materiales'),
];

// BP1 DATA (HIERARCHICAL)
const BP1_ITEMS: QualityItem[] = [
    createFolder('b1', null, 'Carpeta TOP: Obras Civiles BP1'),
    createFolder('b1_1', 'b1', 'Protocolos de Suelos'),
    createFolder('b1_2', 'b1', 'Protocolos Hormigones'),

    createFile('bp1', 'b1_1', 'Densidad de Compactación', 'PROTOCOL', 'APPROVED', 100, 'Excavación'),
    createFile('bp2', 'b1_2', 'Resistencia 7 Días', 'PROTOCOL', 'INTERNAL_REVIEW', 50, 'Hormigonado'),
];

// DEFAULT DATA
const DEFAULT_ITEMS: QualityItem[] = [
    createFolder('d1', null, 'Carpeta TOP General'),
    createFile('dp1', 'd1', 'Protocolo Ejemplo', 'PROTOCOL', 'DRAFT', 0),
];

// ... (Continue to Component)

// ... (Same MOCK Data)

// ... (Mock Data above)

export function QualityDashboard({ project }: { project?: any }) {
    const [items, setItems] = React.useState<QualityItem[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

    // --- DATA LOADING ---
    useEffect(() => {
        if (project) {
            let initialData = DEFAULT_ITEMS;
            if (project.name === 'TROLLEY') initialData = TROLLEY_ITEMS;
            if (project.name === 'Subestación O´Higgins') initialData = BP1_ITEMS;

            // Load persisted data or default
            const loaded = loadProjectData(project.id || 0, 'QAQC_TREE', initialData);
            setItems(loaded);
            setCurrentFolderId(null); // Reset navigation
        }
    }, [project]);

    // --- PERSISTENCE ---
    useEffect(() => {
        if (project && items.length > 0) {
            saveProjectData(project.id || 0, 'QAQC_TREE', items);
        }
    }, [items, project]);

    // --- HELPERS ---
    const getBreadcrumbs = () => {
        const crumbs = [{ id: null, name: 'Inicio' }];
        let curr = currentFolderId;
        const path = [];
        while (curr) {
            const folder = items.find(i => i.id === curr);
            if (folder) {
                path.unshift({ id: folder.id, name: folder.name });
                curr = folder.parentId;
            } else {
                break;
            }
        }
        return [...crumbs, ...path];
    };

    // Recursive Progress Calculation
    const getItemProgress = (itemId: string): number => {
        const item = items.find(i => i.id === itemId);
        if (!item) return 0;
        if (item.type !== 'FOLDER') return item.progress;

        const children = items.filter(i => i.parentId === itemId);
        if (children.length === 0) return 0;

        const totalProgress = children.reduce((sum, child) => sum + getItemProgress(child.id), 0);
        return Math.round(totalProgress / children.length);
    };

    const getFolderStats = (folderId: string | null) => {
        const children = items.filter(i => i.parentId === folderId);
        // If Root, just sum up the top-level folders? Or average them?
        // Let's average the progress of visible items
        if (children.length === 0) return 0;
        const total = children.reduce((sum, child) => sum + getItemProgress(child.id), 0);
        return Math.round(total / children.length);
    };

    // --- HANDLERS ---
    const handleDoubleClick = (item: QualityItem) => {
        if (item.type === 'FOLDER') {
            setCurrentFolderId(item.id);
        }
    };

    const handleNavigateUp = () => {
        if (!currentFolderId) return;
        const current = items.find(i => i.id === currentFolderId);
        setCurrentFolderId(current?.parentId || null);
    };

    const handleBreadcrumbClick = (id: string | null) => {
        setCurrentFolderId(id);
    };

    // Render Logic
    const visibleItems = items.filter(i => i.parentId === currentFolderId);
    const overallProgress = getFolderStats(currentFolderId);

    // Editing (Simplified for files only for now)
    const toggleStatus = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            // Define rotation logic based on current status
            const statuses: ItemStatus[] = ['DRAFT', 'INTERNAL_REVIEW', 'CLIENT_REVIEW', 'APPROVED'];
            const currIdx = statuses.indexOf(item.status);
            if (currIdx === -1) return item; // Don't rotate if PENDING or NA
            const next = statuses[(currIdx + 1) % statuses.length];
            return { ...item, status: next };
        }));
    };

    // Icons
    const getTypeIcon = (type: ItemType) => {
        switch (type) {
            case 'FOLDER': return <Folder className="text-blue-500 fill-blue-50" size={20} />;
            case 'PLAN': return <FileText className="text-orange-500" size={20} />;
            case 'CERTIFICATE': return <CheckCircle className="text-purple-500" size={20} />;
            default: return <FileCheck className="text-gray-500" size={20} />;
        }
    };

    const getStatusBadge = (status: ItemStatus) => {
        const base = "px-2 py-1 rounded text-xs font-bold";
        switch (status) {
            case 'APPROVED': return <span className={`${base} bg-emerald-100 text-emerald-800`}>Aprobado</span>;
            case 'CLIENT_REVIEW': return <span className={`${base} bg-blue-100 text-blue-800`}>Rev. Cliente</span>;
            case 'INTERNAL_REVIEW': return <span className={`${base} bg-orange-100 text-orange-800`}>Rev. Interna</span>;
            case 'PENDING': return <span className={`${base} bg-gray-100 text-gray-500`}>Pendiente</span>;
            default: return <span className={`${base} bg-gray-100 text-gray-400`}>Borrador</span>;
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER & NAV */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    {currentFolderId && (
                        <button onClick={handleNavigateUp} className="p-1 hover:bg-gray-100 rounded mr-2">
                            <CornerUpLeft size={18} />
                        </button>
                    )}
                    {getBreadcrumbs().map((crumb, idx) => (
                        <React.Fragment key={idx}>
                            {idx > 0 && <ChevronRight size={14} className="text-gray-400" />}
                            <button
                                onClick={() => handleBreadcrumbClick(crumb.id as string | null)}
                                className={`hover:text-indigo-600 font-medium ${idx === getBreadcrumbs().length - 1 ? 'text-indigo-600 font-bold' : ''}`}
                            >
                                {crumb.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 uppercase font-bold">Avance Carpeta</span>
                        <span className="text-2xl font-extrabold text-indigo-600">{overallProgress}%</span>
                    </div>
                    {/* Mini Pie Chart could go here */}
                </div>
            </div>

            {/* FOLDER CONTENT */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Nombre</th>
                            <th className="px-6 py-3 font-semibold w-32">Tipo</th>
                            <th className="px-6 py-3 font-semibold w-40">Estado</th>
                            <th className="px-6 py-3 font-semibold w-32">Avance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {visibleItems.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400 italic">
                                    Carpeta Vacía
                                </td>
                            </tr>
                        ) : (
                            visibleItems.map(item => {
                                const calculatedProgress = getItemProgress(item.id);
                                return (
                                    <tr
                                        key={item.id}
                                        onDoubleClick={() => handleDoubleClick(item)}
                                        className="hover:bg-indigo-50/50 cursor-pointer transition-colors group select-none"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getTypeIcon(item.type)}
                                                <span className="font-medium text-gray-900 group-hover:text-indigo-700">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.type === 'FOLDER' ? 'Carpeta' : item.type}
                                        </td>
                                        <td className="px-6 py-4" onClick={() => item.type !== 'FOLDER' && toggleStatus(item.id)}>
                                            {item.type === 'FOLDER' ? (
                                                <span className="text-xs text-gray-400 font-mono">---</span>
                                            ) : (
                                                getStatusBadge(item.status)
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${calculatedProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                        style={{ width: `${calculatedProgress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 w-8 text-right">
                                                    {calculatedProgress}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-center text-xs text-gray-400 mt-4">
                💡 Tip: Haz <span className="font-bold text-gray-600">doble click</span> para abrir carpetas.
            </div>

        </div>
    );
}
