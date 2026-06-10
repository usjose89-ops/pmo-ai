export interface Contact {
    id: string;
    role: string; // Flexible para cargos específicos (e.g. "Vicepresidente Operaciones")
    name: string;
    email: string;
    phone: string;
    department?: string;
}

export interface PersonnelCost {
    id: string;
    roleName: string; // e.g., "Operador Camión Pluma"
    baseSalary: number; // Sueldo Base Real
    totalCompanyCost: number; // Costo Empresa (incluye leyes sociales)
    shiftSystem: string; // e.g., "7x7", "5x2"
    comments?: string;
}

export interface LogisticCost {
    id: string;
    category: 'Estadía' | 'Traslado' | 'Maquinaria' | 'Equipos Menores';
    item: string; // e.g., "Alojamiento Campamento", "Camioneta 4x4"
    unit: 'Día' | 'Mes' | 'Global';
    unitCost: number;
}

export interface EPPCost {
    id: string;
    roleTarget: string; // e.g., "Todo Personal", "Soldador"
    itemName: string; // e.g., "Casco Seguridad", "Kit Ropa Invierno"
    unitCost: number;
    renewalPeriodMonths: number; // Frecuencia de renovación
}

export interface ExamCost {
    id: string;
    name: string; // e.g., "Batería de Exámenes Altura Geográfica"
    roleTarget: string; // "Conductores", "Todo Personal"
    unitCost: number;
    validityMonths: number; // Vigencia del examen
}

export interface TrainingCost {
    id: string;
    courseName: string; // e.g., "Manejo a la Defensiva", "Aislación y Bloqueo"
    unitCost: number;
    validityMonths: number;
    requiredForRoles: string[]; // Roles que requieren este curso
}

export interface CostParameters {
    id: string;
    semester: string; // e.g., "2026-S1"
    isActive: boolean;
    personnel: PersonnelCost[];
    logistics: LogisticCost[];
    epp: EPPCost[];
    exams: ExamCost[];
    training: TrainingCost[];
}

export interface Client {
    id: string;
    name: string;
    logoUrl: string; // Path to logo image
    region: string;
    holding?: string; // e.g., "BHP", "Codelco", "Antofagasta Minerals"
    contacts: Contact[];
    siteDetails: {
        location: string;
        nearestCity: string;
        averageAltitude: number; // meters above sea level
    };
    costParameters: CostParameters[]; // Historial de parámetros
}
