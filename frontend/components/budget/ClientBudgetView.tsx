import React from 'react';
import { FileText, Download, ExternalLink, Edit, Save, X, Trash, Plus } from 'lucide-react';
import { PDFImportModal } from './PDFImportModal';

// Mock Data Structure for Client Budget
// This should match the structure expected from the "Client" perspective
interface BudgetRow {
    id: string;
    description: string;
    unit: string;
    qty: number;
    unitPrice: number;
    totalPrice: number;
    type: 'DIRECT' | 'INDIRECT' | 'SUBTOTAL';
}

// Data based on "Oferta económica de STN" (Exact extraction from Excel)
const MOCK_CLIENT_BUDGET: BudgetRow[] = [
    { id: '1', description: 'MOVILIZACION E INSTALACION DE FAENAS', unit: 'gl', qty: 1, unitPrice: 7345008, totalPrice: 7345008, type: 'DIRECT' },
    { id: '2', description: 'INGENIERIA DE DETALLES', unit: 'gl', qty: 1, unitPrice: 40923992, totalPrice: 40923992, type: 'DIRECT' },
    { id: '3', description: 'OBRAS CIVILES', unit: 'gl', qty: 1, unitPrice: 46123080, totalPrice: 46123080, type: 'DIRECT' },
    { id: '4', description: 'SUMINISTRO EQUIPOS (GIS, ETC)', unit: 'u', qty: 3, unitPrice: 53110997, totalPrice: 159332992, type: 'DIRECT' },
    { id: '5', description: 'MONTAJE ELECTROMECANICO', unit: 'gl', qty: 1, unitPrice: 84358997, totalPrice: 84358997, type: 'DIRECT' },
    { id: '6', description: 'PRUEBAS Y PUESTA EN SERVICIO / OTROS', unit: 'gl', qty: 1, unitPrice: 6924476, totalPrice: 6924476, type: 'INDIRECT' },
];

interface ClientBudgetViewProps {
    pdfPath?: string;
}

export const ClientBudgetView: React.FC<ClientBudgetViewProps> = ({ pdfPath }) => {
    const [showImportModal, setShowImportModal] = React.useState(false);
    const [budgetItems, setBudgetItems] = React.useState<BudgetRow[]>(MOCK_CLIENT_BUDGET);

    // Recalculate total based on current items
    const totalBudget = budgetItems.reduce((acc, row) => acc + row.totalPrice, 0);

    const handleImport = (importedItems: any[]) => {
        // Map imported items to BudgetRow structure
        const mappedItems = importedItems.map((item, idx) => ({
            id: String(idx + 1),
            description: item.description,
            unit: item.unit,
            qty: item.qty,
            unitPrice: item.unit_price,
            totalPrice: item.total_price,
            type: (item.category?.toLowerCase() === 'indirect') ? 'INDIRECT' as 'DIRECT' | 'INDIRECT' : 'DIRECT' as 'DIRECT' | 'INDIRECT'
        }));
        setBudgetItems(mappedItems);
        setShowImportModal(false);
    };

    const [isEditing, setIsEditing] = React.useState(false);
    const [utilityPercent, setUtilityPercent] = React.useState(10); // Default 10%
    const [imprevistosPercent, setImprevistosPercent] = React.useState(3); // Default 3%

    // Calculations
    const totalDirect = budgetItems.filter(i => i.type === 'DIRECT' || i.type === 'SUBTOTAL' && i.description === 'SUBTOTAL_DIRECT').reduce((acc, row) => {
        // Only count DIRECT types, ignore SUBTOTAL rows to avoid double counting unless purely organizing
        // Actually, previous logic was: filter(i => i.type === 'DIRECT').reduce(...)
        // My previous logic was safe because SUBTOTAL rows have type 'SUBTOTAL'.
        return (row.type === 'DIRECT') ? acc + row.totalPrice : acc;
    }, 0);

    // Actually, let's keep it simple and robust.
    // The previous code: const totalDirect = budgetItems.filter(i => i.type === 'DIRECT').reduce(...)
    // This correctly ignores SUBTOTAL rows.

    const totalDirectCost = budgetItems.filter(i => i.type === 'DIRECT').reduce((acc, row) => acc + row.totalPrice, 0);
    const totalIndirectCost = budgetItems.filter(i => i.type === 'INDIRECT').reduce((acc, row) => acc + row.totalPrice, 0);

    const subtotalCost = totalDirectCost + totalIndirectCost;
    const imprevistosAmount = Math.round(subtotalCost * (imprevistosPercent / 100));
    const utilityAmount = Math.round(subtotalCost * (utilityPercent / 100));

    const totalNeto = subtotalCost + imprevistosAmount + utilityAmount;

    const handleUpdateRow = (index: number, field: keyof BudgetRow, value: string | number) => {
        const newItems = [...budgetItems];
        // @ts-ignore
        newItems[index][field] = value;

        // Auto-calc total
        if (field === 'qty' || field === 'unitPrice') {
            const qty = Number(newItems[index].qty) || 0;
            const price = Number(newItems[index].unitPrice) || 0;
            newItems[index].totalPrice = qty * price;
        }

        // Recalculate subtotals if values changed
        const calculatedItems = recalculateSubtotals(newItems);
        setBudgetItems(calculatedItems);
    };

    const recalculateSubtotals = (items: BudgetRow[]) => {
        let currentSum = 0;
        return items.map(item => {
            if (item.type === 'SUBTOTAL') {
                const subtotalRow = { ...item, totalPrice: currentSum };
                currentSum = 0; // Reset for next section
                return subtotalRow;
            } else {
                currentSum += item.totalPrice;
                return item;
            }
        });
    };

    const handleDeleteRow = (index: number) => {
        const newItems = [...budgetItems];
        newItems.splice(index, 1);
        setBudgetItems(newItems);
    };

    const addNewRow = () => {
        const newId = String(budgetItems.length + 1);
        const newItem: BudgetRow = {
            id: newId,
            description: 'Nuevo Ítem',
            unit: 'gl',
            qty: 1,
            unitPrice: 0,
            totalPrice: 0,
            type: 'DIRECT'
        };
        // Recalculate will handle adding it to the flow, but usually new item doesn't trigger subtotal update immediately unless it changes sum
        // But we should run it through just in case logic depends on order
        const newItems = [...budgetItems, newItem];
        setBudgetItems(recalculateSubtotals(newItems));
    };

    const addSubtotalRow = () => {
        const newId = String(budgetItems.length + 1);
        // Calculate sum of preceding items that haven't been summed yet
        let currentSum = 0;
        let lastSubtotalIndex = -1;

        // Find last subtotal
        for (let i = budgetItems.length - 1; i >= 0; i--) {
            if (budgetItems[i].type === 'SUBTOTAL') {
                lastSubtotalIndex = i;
                break;
            }
        }

        // Sum items after last subtotal
        for (let i = lastSubtotalIndex + 1; i < budgetItems.length; i++) {
            currentSum += budgetItems[i].totalPrice;
        }

        const newRow: BudgetRow = {
            id: newId,
            description: 'SUBTOTAL',
            unit: '',
            qty: 0,
            unitPrice: 0,
            totalPrice: currentSum,
            type: 'SUBTOTAL'
        };

        setBudgetItems([...budgetItems, newRow]);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {showImportModal && (
                <PDFImportModal
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImport}
                />
            )}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <h3 className="text-indigo-900 font-bold text-lg mb-1">Presupuesto Adjudicado (Cliente)</h3>
                    <p className="text-indigo-700/80 text-sm">
                        Valores contractuales fijos. Base para facturación y estados de pago.
                    </p>
                </div>

                <div className="flex gap-2 items-start mt-2 md:mt-0">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Edit size={16} />
                            Editar Presupuesto
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-200"
                            >
                                <Save size={16} />
                                Guardar Cambios
                            </button>
                        </div>
                    )}
                </div>

                {/* PDF Reference Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center shadow-sm min-w-[300px]">
                    <div className="bg-rose-100 p-2 rounded-lg mr-3">
                        <FileText className="text-rose-600" size={24} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Documento Fuente</p>
                        <p className="text-sm font-bold text-slate-800 truncate" title="Oferta económica de STN actualizado al 30.09.2025.pdf">
                            Oferta económica STN...
                        </p>
                        <p className="text-xs text-slate-500">PDF • Actualizado 30.09.2025</p>
                    </div>
                    {/* Simulated visual action */}
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="p-2 hover:bg-slate-100 rounded-full text-indigo-600 tooltip flex items-center gap-2"
                        title="Re-Importar con IA"
                    >
                        <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded text-xs font-bold">
                            <Download size={14} /> IA
                        </div>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                            <th className="py-4 px-6 font-semibold">Ítem / Descripción</th>
                            <th className="py-4 px-6 text-center w-24">Unidad</th>
                            <th className="py-4 px-6 text-right w-32">Cantidad</th>
                            <th className="py-4 px-6 text-right w-40">P. Unitario</th>
                            <th className="py-4 px-6 text-right w-40">Total</th>
                            <th className="py-4 px-6 w-24 text-center">Tipo</th>
                            {isEditing && <th className="py-4 px-6 w-10"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {budgetItems.map((row, idx) => (
                            <tr key={row.id} className={`hover:bg-gray-50 transition-colors group ${row.type === 'SUBTOTAL' ? 'bg-slate-50 font-bold' : ''}`}>
                                {row.type === 'SUBTOTAL' ? (
                                    <>
                                        <td className="py-3 px-6 text-sm text-slate-800 font-bold tracking-wider">
                                            {isEditing ? (
                                                <input
                                                    value={row.description}
                                                    onChange={(e) => handleUpdateRow(idx, 'description', e.target.value)}
                                                    className="w-full bg-slate-100 border-b border-indigo-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
                                                />
                                            ) : row.description}
                                        </td>
                                        <td colSpan={3} className="py-3 px-6 text-right font-bold text-slate-400 text-xs uppercase tracking-widest bg-slate-50">
                                            Subtotal Sección
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-3 px-6 text-sm font-medium text-slate-700">
                                            {isEditing ? (
                                                <input
                                                    value={row.description}
                                                    onChange={(e) => handleUpdateRow(idx, 'description', e.target.value)}
                                                    className="w-full bg-slate-50 border-b border-indigo-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
                                                />
                                            ) : row.description}
                                        </td>
                                        <td className="py-3 px-6 text-sm text-center text-gray-500">
                                            {isEditing ? (
                                                <input
                                                    value={row.unit}
                                                    onChange={(e) => handleUpdateRow(idx, 'unit', e.target.value)}
                                                    className="w-full text-center bg-slate-50 border-b border-indigo-200 focus:border-indigo-500 focus:outline-none py-1"
                                                />
                                            ) : row.unit}
                                        </td>
                                        <td className="py-3 px-6 text-sm text-right text-slate-600 font-mono">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={row.qty}
                                                    onChange={(e) => handleUpdateRow(idx, 'qty', Number(e.target.value))}
                                                    className="w-full text-right bg-slate-50 border-b border-indigo-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
                                                />
                                            ) : row.qty.toLocaleString('es-CL')}
                                        </td>
                                        <td className="py-3 px-6 text-sm text-right text-slate-600 font-mono">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={row.unitPrice}
                                                    onChange={(e) => handleUpdateRow(idx, 'unitPrice', Number(e.target.value))}
                                                    className="w-full text-right bg-slate-50 border-b border-indigo-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
                                                />
                                            ) : `$ ${row.unitPrice.toLocaleString('es-CL')}`}
                                        </td>
                                    </>
                                )}

                                <td className="py-3 px-6 text-sm text-right font-bold text-slate-800 font-mono">
                                    {row.type === 'SUBTOTAL' ? (
                                        <span className="text-base text-indigo-700 border-t-2 border-indigo-200 pt-1 block">
                                            $ {row.totalPrice.toLocaleString('es-CL')}
                                        </span>
                                    ) : (
                                        `$ ${row.totalPrice.toLocaleString('es-CL')}`
                                    )}
                                </td>

                                <td className="py-3 px-6 text-center">
                                    {isEditing ? (
                                        <select
                                            value={row.type}
                                            // @ts-ignore
                                            onChange={(e) => handleUpdateRow(idx, 'type', e.target.value)}
                                            className="bg-slate-50 border-b border-indigo-200 focus:border-indigo-500 text-xs py-1 rounded"
                                        >
                                            <option value="DIRECT">Directo</option>
                                            <option value="INDIRECT">Indirecto</option>
                                            <option value="SUBTOTAL">Subtotal</option>
                                        </select>
                                    ) : (
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full 
                                            ${row.type === 'DIRECT' ? 'bg-blue-100 text-blue-700' :
                                                row.type === 'INDIRECT' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-slate-200 text-slate-700'}`}>
                                            {row.type === 'DIRECT' ? 'CD' : row.type === 'INDIRECT' ? 'CI' : 'SUB'}
                                        </span>
                                    )}
                                </td>

                                {isEditing && (
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleDeleteRow(idx)}
                                            className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    {isEditing && (
                        <tbody>
                            <tr>
                                <td colSpan={6} className="p-2 flex gap-4">
                                    <button
                                        onClick={addNewRow}
                                        className="flex-1 py-2 border-2 border-dashed border-indigo-200 rounded-lg text-indigo-500 font-bold hover:bg-indigo-50 hover:border-indigo-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Agregar Nuevo Ítem
                                    </button>
                                    <button
                                        onClick={addSubtotalRow}
                                        className="flex-1 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Agregar Subtotal
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    )}
                    <tbody className="bg-slate-50 border-t-2 border-slate-200">
                        {/* Summary Rows */}
                        <tr>
                            <td colSpan={4} className="py-3 px-6 text-right text-sm font-medium text-slate-600">Total Costos Directos</td>
                            <td className="py-3 px-6 text-right text-sm font-bold text-slate-800 font-mono">$ {totalDirectCost.toLocaleString('es-CL')}</td>
                            <td colSpan={2}></td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="py-3 px-6 text-right text-sm font-medium text-slate-600">Total Costos Indirectos</td>
                            <td className="py-3 px-6 text-right text-sm font-bold text-slate-800 font-mono">$ {totalIndirectCost.toLocaleString('es-CL')}</td>
                            <td colSpan={2}></td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="py-3 px-6 text-right text-sm font-medium text-slate-600">
                                <div className="flex items-center justify-end gap-2">
                                    <span>Imprevistos</span>
                                    <div className="flex items-center bg-white border border-slate-200 rounded px-2 overflow-hidden w-20">
                                        <input
                                            type="number"
                                            value={imprevistosPercent}
                                            onChange={(e) => setImprevistosPercent(Number(e.target.value))}
                                            className="w-full text-right text-xs outline-none font-medium text-slate-600"
                                            disabled={!isEditing}
                                        />
                                        <span className="text-xs text-slate-400 font-medium ml-1">%</span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-6 text-right text-sm font-bold text-slate-700 font-mono">
                                $ {imprevistosAmount.toLocaleString('es-CL')}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="py-3 px-6 text-right text-sm font-medium text-slate-600 bg-indigo-50/50">
                                <div className="flex items-center justify-end gap-2">
                                    <span>Utilidad</span>
                                    <div className="flex items-center bg-white border border-indigo-200 rounded px-2 overflow-hidden w-20">
                                        <input
                                            type="number"
                                            value={utilityPercent}
                                            onChange={(e) => setUtilityPercent(Number(e.target.value))}
                                            className="w-full text-right text-xs outline-none font-bold text-indigo-600"
                                            disabled={!isEditing}
                                        />
                                        <span className="text-xs text-indigo-400 font-medium ml-1">%</span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-6 text-right text-sm font-bold text-indigo-600 font-mono bg-indigo-50/50">
                                $ {utilityAmount.toLocaleString('es-CL')}
                            </td>
                            <td colSpan={2} className="bg-indigo-50/50"></td>
                        </tr>
                        <tr className="bg-slate-900 text-white">
                            <td colSpan={4} className="py-4 px-6 text-right text-base font-bold uppercase tracking-wide">Total Presupuesto Neto</td>
                            <td className="py-4 px-6 text-right text-lg font-black text-white font-mono">
                                $ {totalNeto.toLocaleString('es-CL')}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    </tbody>
                </table>
            </div >
        </div >
    );
};
