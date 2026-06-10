import { Client } from '@/types/client';

const createDefaultCostParams = (semester: string): any => ({
    id: `cost-${semester}`,
    semester,
    isActive: true,
    personnel: [
        { id: 'p1', roleName: 'Administrador de Contrato', baseSalary: 2500000, totalCompanyCost: 3800000, shiftSystem: '5x2' },
        { id: 'p2', roleName: 'Operador Camión Pluma', baseSalary: 1200000, totalCompanyCost: 1950000, shiftSystem: '7x7' },
        { id: 'p3', roleName: 'Prevencionista de Riesgos (SNS)', baseSalary: 1800000, totalCompanyCost: 2700000, shiftSystem: '5x2' }
    ],
    logistics: [
        { id: 'l1', category: 'Estadía', item: 'Alojamiento Hotel Ciudad', unit: 'Día', unitCost: 45000 },
        { id: 'l2', category: 'Traslado', item: 'Arriendo Camioneta 4x4 Minera', unit: 'Mes', unitCost: 1200000 }
    ],
    epp: [
        { id: 'e1', roleTarget: 'Todo Personal', itemName: 'Kit Ropa Corporativa (Invierno)', unitCost: 150000, renewalPeriodMonths: 12 },
        { id: 'e2', roleTarget: 'Operativo', itemName: 'Zapatos de Seguridad Certificados', unitCost: 65000, renewalPeriodMonths: 6 }
    ],
    exams: [
        { id: 'ex1', name: 'Batería Exámenes Altura Geográfica', roleTarget: 'Todo Personal', unitCost: 85000, validityMonths: 12 },
        { id: 'ex2', name: 'Psicosensotécnico Riguroso', roleTarget: 'Conductores', unitCost: 45000, validityMonths: 12 }
    ],
    training: [
        { id: 't1', courseName: 'Inducción Hombre Nuevo', unitCost: 0, validityMonths: 48, requiredForRoles: ['Todos'] },
        { id: 't2', courseName: 'Manejo a la Defensiva 4x4', unitCost: 120000, validityMonths: 24, requiredForRoles: ['Conductores', 'Supervisores'] }
    ]
});

export const MOCK_CLIENTS: Client[] = [
    // BHP Group
    {
        id: 'bhp-escondida',
        name: 'Minera Escondida',
        holding: 'BHP',
        region: 'Antofagasta',
        logoUrl: '/logos/escondida.svg',
        contacts: [
            { id: 'bhpe-1', role: 'Presidente Operaciones Chile', name: 'Ragner Udd', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-2', role: 'Directora Asuntos Externos', name: 'Caroline Cox', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-3', role: 'Vicepresidente Asuntos Corporativos', name: 'René Muga', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-4', role: 'Vicepresidente Recursos Humanos', name: 'Carlos Ávila', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-5', role: 'Vicepresidente Planificación y Tecnología', name: 'Devesh Baijnath', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-6', role: 'Vicepresidente Proyectos Mayores', name: 'Marcos Bastías', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-7', role: 'Vicepresidente Exploración Cobre', name: 'Jean Des Rivieres', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-8', role: 'Gerente Estudios Técnica y Planificación', name: 'Sandro Rebolledo del Valle', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-9', role: 'Vicepresidente Seguridad Ocupacional', name: 'Cristián Sandoval González', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-10', role: 'Vicepresidente Contratos y Adquisiciones', name: 'Sally Hancock', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-11', role: 'Gerente Recursos Humanos', name: 'Lisa Álvarez-Calderón', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-12', role: 'Gerente Operaciones Mina', name: 'Fernando Romero Espinosa', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-13', role: 'Gerente Relaciones Gubernamentales', name: 'Osvaldo Urzúa', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-14', role: 'Gerente Abastecimiento Logística', name: 'Andrés Felipe Daneri Armstrong', phone: '+56 2 2207 6509', email: 'recepcion.santiago@bhpbilliton.com' },
            { id: 'bhpe-15', role: 'Superintendente Metalurgia', name: 'Leiva Jorge JP', phone: '+56 55 220 3000', email: 'Sin Información' }
        ],
        siteDetails: {
            location: 'Ruta B-475, Km 150',
            nearestCity: 'Antofagasta',
            averageAltitude: 3100
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'bhp-cerro-colorado',
        name: 'Cerro Colorado',
        holding: 'BHP',
        region: 'Tarapacá',
        logoUrl: '/logos/cerro_colorado.svg',
        contacts: [
            { id: 'bhpcc-1', role: 'Gerente General Cerro Colorado', name: 'Alejandro Heilbron Batista', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' },
            { id: 'bhpcc-2', role: 'Superintendente HSE', name: 'Álvaro Lay', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' },
            { id: 'bhpcc-3', role: 'Gerente de Producción', name: 'Felipe Rau', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' },
            { id: 'bhpcc-4', role: 'Gerente de Mantención', name: 'Sergio López', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' },
            { id: 'bhpcc-5', role: 'Gerente Operacional Readiness', name: 'César Gaete', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' },
            { id: 'bhpcc-6', role: 'Gerente de Ingeniería', name: 'Paula Tartari', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' },
            { id: 'bhpcc-7', role: 'Gerente de Desarrollo', name: 'Sandra Moreira', phone: '+56 57 240 4000', email: 'comunicaciones.spence@bhp.com' }
        ],
        siteDetails: {
            location: 'Pozo Almonte',
            nearestCity: 'Iquique',
            averageAltitude: 1000
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    // Codelco Group
    {
        id: 'codelco-chuqui',
        name: 'Codelco Chuquicamata',
        holding: 'Codelco',
        region: 'Antofagasta',
        logoUrl: '/logos/codelco.jpg',
        contacts: [
            { id: 'codc-1', role: 'Gerente General', name: 'René Galleguillos Pallauta', phone: '+56 55 232 2100', email: 'comunicaciones_dmh@codelco.cl' },
            { id: 'codc-2', role: 'Gerente de Mina', name: 'Sin Información', phone: '+56 55 232 2100', email: 'Sin Información' }
        ],
        siteDetails: {
            location: 'Calama',
            nearestCity: 'Calama',
            averageAltitude: 2800
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'codelco-teniente',
        name: 'Codelco El Teniente',
        holding: 'Codelco',
        region: 'O\'Higgins',
        logoUrl: '/logos/codelco.jpg',
        contacts: [
            { id: 'codt-1', role: 'Gerente General', name: 'Andrés Music Garrido', phone: '+56 72 229 2000', email: 'comunica@codelco.cl' },
            { id: 'codt-2', role: 'Gerente Sustentabilidad Asuntos Externos', name: 'Valentina Satelices Riquelme', phone: '+56 72 229 2000', email: 'comunica@codelco.cl' },
            { id: 'codt-3', role: 'Gerente de Administración', name: 'Luis Donoso Oñate', phone: '+56 72 229 2000', email: 'comunica@codelco.cl' },
            { id: 'codt-4', role: 'Gerente de Proyectos', name: 'Gerardo Sánchez Sepúlveda', phone: '+56 72 229 2000', email: 'comunica@codelco.cl' },
            { id: 'codt-5', role: 'Gerente Mantenimiento Planta', name: 'Erwin Schmidt', phone: '+56 72 229 2000', email: 'comunica@codelco.cl' },
            { id: 'codt-6', role: 'Gerente Tranques y Relaves', name: 'Omar Medina', phone: '+56 72 229 2000', email: 'comunica@codelco.cl' }
        ],
        siteDetails: {
            location: 'Machalí',
            nearestCity: 'Rancagua',
            averageAltitude: 2200
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'codelco-ministro-hales',
        name: 'Codelco Ministro Hales',
        holding: 'Codelco',
        region: 'Antofagasta',
        logoUrl: '/logos/codelco.jpg',
        contacts: [
            { id: 'codmh-1', role: 'Gerente General', name: 'Gonzalo Lara S.', phone: '+56 55 232 1345', email: 'comunicaciones_dmh@codelco.cl' },
            { id: 'codmh-2', role: 'Gerente de Mina', name: 'Daniel Ignacio Cavada Vera', phone: '+56 55 232 1345', email: 'comunicaciones_dmh@codelco.cl' },
            { id: 'codmh-3', role: 'Gerente de Administración', name: 'Sin Información', phone: '+56 55 232 1345', email: 'comunicaciones_dmh@codelco.cl' }
        ],
        siteDetails: {
            location: 'Calama',
            nearestCity: 'Calama',
            averageAltitude: 3000
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    // Collahuasi
    {
        id: 'collahuasi',
        name: 'Collahuasi',
        rating: 'AAA',
        region: 'Tarapacá',
        logoUrl: '/logos/collahuasi.jpg',
        contacts: [
            { id: 'col-1', role: 'Presidente Ejecutivo', name: 'Jorge Gómez Díaz', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-2', role: 'Vicepresidente Ejecutivo Operaciones', name: 'Dalibor Dragicevic Pizarro', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-3', role: 'Vicepresidente Desarrollo y Sustentabilidad', name: 'Mario Quiñones', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-4', role: 'Vicepresidente Finanzas y Administración', name: 'Trevor John Dyer', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-5', role: 'Vicepresidente Proyectos', name: 'Alejandro Verdugo', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-6', role: 'Vicepresidente Procesos', name: 'Marcos Guerrero', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-7', role: 'Vicepresidente Mina', name: 'Carlos Núñez', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-8', role: 'Vicepresidente Recursos Humanos', name: 'Fernando Hernández', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-9', role: 'Gerente Legal', name: 'María Soledad Martínez', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-10', role: 'Gerente Seguridad y Salud Ocupacional', name: 'Javier Cantuarias Bozzo', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-11', role: 'Gerente Recursos Humanos', name: 'Gaetano Manniello Guagama', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-12', role: 'Gerente Contratos y Abastecimiento', name: 'Katherinne Pulgar', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-13', role: 'Superintendente Abastecimiento', name: 'Wladimir Carquin', phone: '+56 2 2362 6435', email: 'Sin Información' },
            { id: 'col-14', role: 'Superintendente Gestión Abastecimiento', name: 'Daniel Munoz Loo', phone: '+56 2 2362 6435', email: 'd***@collahuasi.cl' }
        ],
        siteDetails: {
            location: 'Comuna de Pica',
            nearestCity: 'Iquique',
            averageAltitude: 4400
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    } as any,
    // Antofagasta Minerals
    {
        id: 'mlp',
        name: 'Minera Los Pelambres',
        holding: 'Antofagasta Minerals',
        region: 'Coquimbo',
        logoUrl: '/logos/pelambres.jpg',
        contacts: [
            { id: 'mlp-1', role: 'Gerente General', name: 'Patricio Chacana', phone: '+56 2 2798 7000', email: 'Sin Información' },
            { id: 'mlp-2', role: 'COO Antofagasta Minerals', name: 'Octavio Araneda', phone: '+56 2 2798 7000', email: 'Sin Información' }
        ],
        siteDetails: {
            location: 'Salamanca',
            nearestCity: 'Illapel',
            averageAltitude: 3200
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'zaldivar',
        name: 'Minera Zaldívar',
        holding: 'Antofagasta Minerals',
        region: 'Antofagasta',
        logoUrl: '/logos/zaldivar.jpg',
        contacts: [
            { id: 'zal-1', role: 'Gerente General', name: 'María de la Luz Osses', phone: '+56 55 243 3400', email: 'Sin Información' },
            { id: 'zal-2', role: 'Gerente Asuntos Externos Sustentabilidad', name: 'Víctor Espinoza Marambio', phone: '+56 55 243 3400', email: 'Sin Información' }
        ],
        siteDetails: {
            location: 'Precordillera Antofagasta',
            nearestCity: 'Antofagasta',
            averageAltitude: 3300
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    // Others
    {
        id: 'anglo',
        name: 'Anglo American',
        holding: 'Anglo American',
        region: 'Metropolitana/Valparaíso',
        logoUrl: '/logos/anglo.jpg',
        contacts: [
            { id: 'ang-1', role: 'Presidente Ejecutivo Chile', name: 'Patricio Hidalgo Zapata', phone: '+56 2 2230 6000', email: 'Sin Información' },
            { id: 'ang-2', role: 'Gerente General Los Bronces', name: 'Carlos Espinoza', phone: '+56 2 2230 6000', email: 'Sin Información' },
            { id: 'ang-3', role: 'Gerente General El Soldado', name: 'Paulina Jaramillo', phone: '+56 2 2230 6000', email: 'Sin Información' },
            { id: 'ang-4', role: 'Gerente General Chagres', name: 'Benjamín Martinich', phone: '+56 2 2230 6000', email: 'Sin Información' }
        ],
        siteDetails: {
            location: 'Los Bronces',
            nearestCity: 'Santiago',
            averageAltitude: 3500
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'caserones',
        name: 'Caserones',
        holding: 'Lundin Mining',
        region: 'Atacama',
        logoUrl: '/logos/caserones.jpg',
        contacts: [
            { id: 'cas-1', role: 'Presidente Ejecutivo (CEO)', name: 'Motohiro Kuroiwa', phone: '+56 2 2628 5000', email: 'informaciones@caserones.cl' },
            { id: 'cas-2', role: 'Managing Director', name: 'Marcelo Maccioni Quezada', phone: '+56 2 2628 5000', email: 'informaciones@caserones.cl' },
            { id: 'cas-3', role: 'Gerente General Operaciones (COO)', name: 'Gonzalo Araujo Alonso', phone: '+56 2 2628 5000', email: 'informaciones@caserones.cl' },
            { id: 'cas-4', role: 'Gerente Relaciones Comunitarias', name: 'Sin Información', phone: '+56 52 248 5050', email: 'comunicaciones@caserones.cl' }
        ],
        siteDetails: {
            location: 'Tierra Amarilla',
            nearestCity: 'Copiapó',
            averageAltitude: 4000
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'teck-qb',
        name: 'Teck Quebrada Blanca',
        holding: 'Teck',
        region: 'Tarapacá',
        logoUrl: '/logos/teck_qb.jpg',
        contacts: [
            { id: 'tqb-1', role: 'Gerente General', name: 'Enrique Castro', phone: '+56 57 252 8100', email: 'exploration@teck.com' },
            { id: 'tqb-2', role: 'Gerente de Operaciones', name: 'Jaime Ferrada', phone: '+56 57 252 8100', email: 'exploration@teck.com' },
            { id: 'tqb-3', role: 'Gerente Recursos Humanos', name: 'Patricio Marabolí', phone: '+56 57 252 8100', email: 'exploration@teck.com' },
            { id: 'tqb-4', role: 'Gerente Mantenimiento', name: 'José Miguel Ríos', phone: '+56 57 252 8100', email: 'exploration@teck.com' },
            { id: 'tqb-5', role: 'Gerente Medio Ambiente', name: 'Claudia Garcés', phone: '+56 57 252 8100', email: 'exploration@teck.com' },
            { id: 'tqb-6', role: 'Gerente Servicios Técnicos', name: 'Cristian Rojas', phone: '+56 57 252 8100', email: 'exploration@teck.com' }
        ],
        siteDetails: {
            location: 'Pica',
            nearestCity: 'Iquique',
            averageAltitude: 4400
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'lomas-bayas',
        name: 'Lomas Bayas',
        holding: 'Glencore',
        region: 'Antofagasta',
        logoUrl: '/logos/lomas_bayas.jpg',
        contacts: [
            { id: 'lom-1', role: 'Gerente General', name: 'Pablo Carvallo Quezada', phone: '+56 55 262 8500', email: 'claudia.zazzali@glencore.cl' },
            { id: 'lom-2', role: 'Gerente de Minería', name: 'Rodrigo Andrés Hiplán Olivares', phone: '+56 55 262 8500', email: 'claudia.zazzali@glencore.cl' },
            { id: 'lom-3', role: 'Gerente de Procesos', name: 'Jorge Barbosa Pastén', phone: '+56 55 262 8500', email: 'claudia.zazzali@glencore.cl' },
            { id: 'lom-4', role: 'Jefe de Proyectos', name: 'Cristian Oneto', phone: '+56 55 262 8500', email: 'claudia.zazzali@glencore.cl' },
            { id: 'lom-5', role: 'Jefa Asuntos Externos y Comunicaciones', name: 'Claudia Zazzali', phone: '+56 55 262 8500', email: 'claudia.zazzali@glencore.cl' }
        ],
        siteDetails: {
            location: 'Sierra Gorda',
            nearestCity: 'Antofagasta',
            averageAltitude: 1500
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    },
    {
        id: 'capstone',
        name: 'Capstone Copper',
        holding: 'Capstone',
        region: 'Atacama',
        logoUrl: '/logos/capstone.jpg',
        contacts: [
            { id: 'cap-1', role: 'Director General y CEO', name: 'John Mackenzie', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-2', role: 'Presidente y Director Operaciones', name: 'Cashel Meagher', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-3', role: 'Vicepresidente Senior CFO', name: 'Raman Randhawa', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-4', role: 'Vicepresidente Senior Desarrollo', name: 'Chris Richter', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-5', role: 'Vicepresidente Servicios Técnicos', name: 'Pedro Amelunxen', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-6', role: 'Gerente Recursos Humanos', name: 'Roberto Camila Landeros', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-7', role: 'Gerente Operaciones', name: 'Danitza Fuentes', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-8', role: 'VP Senior Jefe de Chile', name: 'Giancarlo Bruno', phone: '+56 2 2428 3400', email: 'contacto@scmsd.cl' },
            { id: 'cap-9', role: 'Gerente General Mantos Blancos', name: 'Juan Ochoa Matulic', phone: '+56 55 269 3001', email: 'contacto@mantoscopper.com' },
            { id: 'cap-10', role: 'Gerente General Mantoverde', name: 'Pablo Asiain Rojas', phone: '+56 55 269 3001', email: 'contacto@mantoscopper.com' }
        ],
        siteDetails: {
            location: 'Mantos Blancos / Mantoverde',
            nearestCity: 'Antofagasta / Chañaral',
            averageAltitude: 800
        },
        costParameters: [createDefaultCostParams('2026-S1')]
    }
];
