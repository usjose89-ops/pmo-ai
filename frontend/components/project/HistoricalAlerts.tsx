import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface HistoricalAlertsProps {
    client: string;
    location: string;
}

export const HistoricalAlerts: React.FC<HistoricalAlertsProps> = ({ client, location }) => {
    const [visible, setVisible] = useState(true);

    // In a real app, fetch this from the backend service
    // Simulating the backend response for "Cordillera" + "Inmobiliaria Santiago"
    const warnings = location === 'Cordillera' && client === 'Inmobiliaria Santiago' ? [
        "Alerta de Rotación: En proyectos previos en Cordillera con Inmobiliaria Santiago, la rotación promedió 20.5%. Considere ajustar viáticos.",
        "Clima: Históricamente se pierden 15 días por clima en esta zona."
    ] : [];

    if (!visible || warnings.length === 0) return null;

    return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg relative animate-in slide-in-from-top-2">
            <button
                onClick={() => setVisible(false)}
                className="absolute top-2 right-2 text-amber-400 hover:text-amber-600"
            >
                <X size={16} />
            </button>

            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold text-amber-800">
                        Inteligencia Histórica Detectada
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 space-y-1">
                        {warnings.map((warning, idx) => (
                            <p key={idx}>• {warning}</p>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-amber-600 font-medium">
                        * Sugerencia basada en 3 proyectos similares cerrados.
                    </p>
                </div>
            </div>
        </div>
    );
};
