"use client";
import React, { useState } from 'react';
import { Plus, Search, MapPin, User, FileText, Building2, Save, X, Trash2, Edit } from 'lucide-react';

interface Client {
    id: number;
    name: string;
    rut: string;
    legalRep: string;
    location: string;
    info: string;
}

export function ClientManager() {
    // Mock Initial Data based on context
    const [clients, setClients] = useState<Client[]>([
        {
            id: 1,
            name: 'Minera Doña Inés de Collahuasi (CMDIC)',
            rut: '76.123.456-7',
            legalRep: 'Juan Pérez Soto',
            location: 'Iquique, Tarapacá',
            info: '**Estrategia 2026**: Foco en energías renovables y optimización hídrica. \n\n**Requisitos Clave**: Acreditación 4x3 estricta.'
        },
        {
            id: 2,
            name: 'Minera Escondida (MEL)',
            rut: '96.888.777-K',
            legalRep: 'María González L.',
            location: 'Antofagasta',
            info: '**Estándar HSEC**: Nivel VP (Very Priority). \n\n**Logística**: Todo vuelo debe ser vía Aeropuerto Andrés Sabella (ANF).'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Client>>({});

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({});
        setIsModalOpen(true);
    };

    const handleEdit = (client: Client) => {
        setEditingId(client.id);
        setFormData(client);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.rut) return;

        if (editingId) {
            // Update existing
            setClients(clients.map(c => c.id === editingId ? { ...c, ...formData } as Client : c));
        } else {
            // Create new
            const newClient: Client = {
                id: Date.now(),
                name: formData.name!,
                rut: formData.rut!,
                legalRep: formData.legalRep || '',
                location: formData.location || '',
                info: formData.info || ''
            };
            setClients([...clients, newClient]);
        }
        setIsModalOpen(false);
        setFormData({});
        setEditingId(null);
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rut.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Gestión de Clientes</h2>
                    <p className="text-slate-500 mt-1">Directorio de Mandantes y Contexto Estratégico</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                    <Plus size={20} /> Nuevo Cliente
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o RUT..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Client List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
                        {/* Action Buttons */}
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(client)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Editar Cliente"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar Cliente"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between gap-6">

                            {/* Header Info */}
                            <div className="flex-1 pr-12">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{client.name}</h3>
                                        <p className="text-sm font-mono text-slate-400">{client.rut}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <User size={16} className="text-slate-400" />
                                        <span className="font-semibold">Rep. Legal:</span> {client.legalRep}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span className="font-semibold">Hub:</span> {client.location}
                                    </div>
                                </div>
                            </div>

                            {/* Context Info Box */}
                            <div className="w-full md:w-1/3 bg-slate-50 rounded-lg p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                                    <FileText size={12} />
                                    Información Relevante
                                </div>
                                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                    {client.info}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-black text-slate-900">
                                {editingId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Razón Social</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ej: Minera X"
                                        value={formData.name || ''}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">RUT Empresa</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ej: 76.xxx.xxx-x"
                                        value={formData.rut || ''}
                                        onChange={e => setFormData({ ...formData, rut: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Representante Legal</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Nombre Completo"
                                        value={formData.legalRep || ''}
                                        onChange={e => setFormData({ ...formData, legalRep: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500">Ubicación Clave (Hub)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ciudad / Región"
                                        value={formData.location || ''}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">Información Relevante (Notas)</label>
                                <textarea
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    placeholder="Detalles sobre acreditaciones, cultura, pagos, etc..."
                                    value={formData.info || ''}
                                    onChange={e => setFormData({ ...formData, info: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-indigo-600 transition-colors shadow-lg flex items-center gap-2"
                            >
                                <Save size={18} /> {editingId ? 'Guardar Cambios' : 'Crear Cliente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
