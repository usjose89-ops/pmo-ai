import React, { useState } from 'react';
import { Info, AlertCircle } from 'lucide-react';

interface SmartResourceRowProps {
    name: string;
    unitPrice: number;
    quantity: number;
    benchmark: number;
}

// Simulating the backend call directly in the component for the MVP demo
// In real app, this would use the python service response
const checkPrice = (resource: string, price: number, benchmark: number) => {
    // Mocking logic: if price is > 10% above benchmark, warn
    if (price > benchmark * 1.1) {
        return {
            status: 'HIGH_PRICE_WARNING',
            tooltip: `El precio está un ${Math.round(((price - benchmark) / benchmark) * 100)}% por sobre el benchmark de mercado.`
        };
    }
    return { status: 'OK', tooltip: '' };
};

export const SmartResourceRow: React.FC<SmartResourceRowProps> = ({ name, unitPrice, quantity, benchmark }) => {
    const [price, setPrice] = useState(unitPrice);
    const validation = checkPrice(name, price, benchmark);
    const isWarning = validation.status === 'HIGH_PRICE_WARNING';

    const formatMoney = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

    return (
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 font-sans items-center hover:bg-slate-50 transition-colors px-4">
            <div className="col-span-4 text-sm text-gray-700 font-bold">
                {name}
            </div>
            <div className="col-span-2 text-right relative group">
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className={`w-full p-2 rounded-md border text-right font-mono text-sm transition-all outline-none
                        ${isWarning
                            ? 'border-amber-400 bg-amber-50 text-amber-900 focus:ring-2 focus:ring-amber-500'
                            : 'border-transparent hover:border-slate-200 text-slate-600 focus:text-slate-900 focus:bg-white focus:border-indigo-200'
                        }`}
                />
                {isWarning && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                        <AlertCircle size={14} />
                    </div>
                )}
                {/* Intelligent Tooltip */}
                {isWarning && (
                    <div className="absolute z-50 hidden group-hover:block w-64 p-3 mt-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl left-0 text-left">
                        <div className="flex gap-2 items-start opacity-90">
                            <Info size={14} className="mt-0.5 shrink-0 text-amber-400" />
                            <p>{validation.tooltip}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="col-span-2 text-right text-xs text-slate-500 font-mono pt-2">
                {quantity} un.
            </div>
            <div className="col-span-2 text-right text-xs font-bold text-slate-700 font-mono pt-2">
                {formatMoney(price * quantity)}
            </div>
            <div className="col-span-2 text-center text-xs text-slate-400 font-mono pt-2">
                {formatMoney(benchmark)}
            </div>
        </div>
    );
};
