
export interface Role {
    id: string;
    name: string;
    reportTo?: string | null; // ID of the supervisor
    level: 'STRATEGIC' | 'TACTICAL' | 'OPERATIONAL' | 'SUPPORT';
    category: 'INDIRECT' | 'DIRECT' | 'STAFF';
    salary?: number;
}

export const STAFFING_HIERARCHY: Role[] = [
    // Nivel 1: Admin Contrato
    { id: 'adm-contrato', name: 'Administrador de Contrato', reportTo: null, level: 'STRATEGIC', category: 'INDIRECT', salary: 3500000 },

    // Nivel 2: Jefaturas
    { id: 'jefe-terreno', name: 'Jefe de Terreno', reportTo: 'adm-contrato', level: 'TACTICAL', category: 'INDIRECT', salary: 2800000 },
    { id: 'jefe-of-tecnica', name: 'Jefe Oficina Técnica', reportTo: 'adm-contrato', level: 'TACTICAL', category: 'INDIRECT', salary: 2600000 },
    { id: 'jefe-rrll', name: 'Jefe RRLL', reportTo: 'adm-contrato', level: 'TACTICAL', category: 'INDIRECT', salary: 2400000 },
    { id: 'prevencionista', name: 'Encargado QAQC / Prevención', reportTo: 'adm-contrato', level: 'TACTICAL', category: 'INDIRECT', salary: 2200000 },

    // Nivel 3: Supervisión y Oficina Técnica
    { id: 'sup-terreno', name: 'Supervisor de Terreno', reportTo: 'jefe-terreno', level: 'TACTICAL', category: 'INDIRECT', salary: 1800000 },
    { id: 'topografo', name: 'Topógrafo', reportTo: 'jefe-terreno', level: 'OPERATIONAL', category: 'INDIRECT', salary: 1600000 },

    // Nivel 3: Bajo Jefe Oficina Técnica
    { id: 'programador', name: 'Programador', reportTo: 'jefe-of-tecnica', level: 'TACTICAL', category: 'INDIRECT', salary: 1900000 },
    { id: 'control-doc', name: 'Control Document', reportTo: 'jefe-of-tecnica', level: 'SUPPORT', category: 'INDIRECT', salary: 1200000 },
    { id: 'abastecimiento', name: 'Encargado Abastecimiento y Bodega', reportTo: 'jefe-of-tecnica', level: 'SUPPORT', category: 'INDIRECT', salary: 1100000 },

    // Nivel 3: Bajo Jefe RRLL
    { id: 'enc-rrll-1', name: 'Encargado de RRLL 1', reportTo: 'jefe-rrll', level: 'SUPPORT', category: 'INDIRECT', salary: 1100000 },
    { id: 'enc-rrll-2', name: 'Encargado de RRLL 2', reportTo: 'jefe-rrll', level: 'SUPPORT', category: 'INDIRECT', salary: 1100000 },

    // Nivel 4: Operacionales
    { id: 'm1-oocc', name: 'Maestro M1 OOCC', reportTo: 'sup-terreno', level: 'OPERATIONAL', category: 'DIRECT', salary: 950000 },
    { id: 'm2-oocc', name: 'Maestro M2 OOCC', reportTo: 'sup-terreno', level: 'OPERATIONAL', category: 'DIRECT', salary: 850000 },
    { id: 'm1-montaje', name: 'Maestro M1 Montaje', reportTo: 'sup-terreno', level: 'OPERATIONAL', category: 'DIRECT', salary: 980000 },
    { id: 'm2-montaje', name: 'Maestro M2 Montaje', reportTo: 'sup-terreno', level: 'OPERATIONAL', category: 'DIRECT', salary: 880000 },
    { id: 'op-camion', name: 'Operador Camión Pluma / Retro', reportTo: 'sup-terreno', level: 'OPERATIONAL', category: 'DIRECT', salary: 1200000 },
    { id: 'rigger', name: 'Rigger', reportTo: 'sup-terreno', level: 'OPERATIONAL', category: 'DIRECT', salary: 850000 },

    // Nivel 4: Bajo Topógrafo
    { id: 'alarife', name: 'Alarife', reportTo: 'topografo', level: 'OPERATIONAL', category: 'INDIRECT', salary: 750000 },
];
