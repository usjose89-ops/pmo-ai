import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertTriangle, Loader2, Trash } from 'lucide-react';

interface ImportedItem {
    description: string;
    unit: string;
    qty: number;
    unit_price: number;
    total_price: number;
    category?: string;
}

interface PDFImportModalProps {
    onClose: () => void;
    onImport: (items: ImportedItem[]) => void;
}

export const PDFImportModal: React.FC<PDFImportModalProps> = ({ onClose, onImport }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<ImportedItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleParse = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Assuming API is running on port 8000 or proxied
            const response = await fetch(`${API_URL}/documents/parse-budget`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al procesar el archivo');

            const data = await response.json();
            setItems(data.items);
            if (data.items.length === 0) {
                setError("No se encontraron ítems válidos. Verifica el formato del PDF.");
            }
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleUpdate = (index: number, field: keyof ImportedItem, value: string | number) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;

        // Auto-calc total if prices change
        if (field === 'qty' || field === 'unit_price') {
            const qty = Number(newItems[index].qty) || 0;
            const price = Number(newItems[index].unit_price) || 0;
            newItems[index].total_price = qty * price;
        }

        setItems(newItems);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="text-indigo-600" />
                            Importar Presupuesto PDF
                        </h2>
                        <p className="text-sm text-slate-500">Sube tu PDF para extracción automática inteligente</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {!items.length ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50/50">
                            <input
                                type="file"
                                accept=".pdf, .png, .jpg, .jpeg, .xlsx, .xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pdf-upload"
                            />
                            <label htmlFor="pdf-upload" className="cursor-pointer block">
                                <div className="bg-white mx-auto w-16 h-16 rounded-full shadow-sm flex items-center justify-center mb-4 text-indigo-500">
                                    <Upload size={32} />
                                </div>
                                <p className="text-slate-900 font-medium mb-1">Haz clic para subir tu archivo</p>
                                <p className="text-xs text-slate-400">PDF, Imagen o Excel</p>
                            </label>

                            {file && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                                    <FileText size={16} />
                                    {file.name}
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 text-rose-600 text-sm bg-rose-50 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                    <AlertTriangle size={16} /> {error}
                                </div>
                            )}

                            {file && !loading && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleParse}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-100 transition-all"
                                    >
                                        Procesar Documento
                                    </button>
                                </div>
                            )}

                            {loading && (
                                <div className="mt-6 flex flex-col items-center">
                                    <Loader2 className="animate-spin text-indigo-600 mb-2" />
                                    <span className="text-sm text-slate-500">Analizando estructura del documento...</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
                                <span className="text-sm font-bold text-indigo-900">
                                    <CheckCircle className="inline w-4 h-4 mr-1 text-emerald-500" />
                                    {items.length} Ítems Detectados
                                </span>
                                <button onClick={() => setItems([])} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                                    Subir otro archivo
                                </button>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="p-3">Descripción</th>
                                            <th className="p-3 w-20">Unid.</th>
                                            <th className="p-3 text-right">Cant.</th>
                                            <th className="p-3 text-right">P. Unit</th>
                                            <th className="p-3 text-right">Total</th>
                                            <th className="p-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 group">
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => handleUpdate(idx, 'description', e.target.value)}
                                                        className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none px-2 py-1 text-slate-700"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={item.unit}
                                                        onChange={(e) => handleUpdate(idx, 'unit', e.target.value)}
                                                        className="w-full text-center bg-transparent border-b border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none px-1 py-1 text-slate-500"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        value={item.qty}
                                                        onChange={(e) => handleUpdate(idx, 'qty', Number(e.target.value))}
                                                        className="w-full text-right bg-transparent border-b border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none px-2 py-1 text-slate-600"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) => handleUpdate(idx, 'unit_price', Number(e.target.value))}
                                                        className="w-full text-right bg-transparent border-b border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none px-2 py-1 text-slate-600 font-mono"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="number"
                                                        value={item.total_price}
                                                        onChange={(e) => handleUpdate(idx, 'total_price', Number(e.target.value))}
                                                        className="w-full text-right bg-transparent border-b border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none px-2 py-1 text-slate-800 font-bold font-mono"
                                                    />
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        onClick={() => handleDelete(idx)}
                                                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Eliminar fila"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-lg">
                            Cancelar
                        </button>
                        <button
                            onClick={() => onImport(items)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-emerald-100 transition-all"
                        >
                            Confirmar Importación
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
