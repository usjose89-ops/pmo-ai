
export interface RoleStandard {
    nombre: string;
    rentaLiquida: number; // Sueldo Líquido Base
    turno: '4x3' | '7x7' | '14x14';
}

export const ESTANDARES_CARGOS: RoleStandard[] = [
    { nombre: "Gerente Proyecto", rentaLiquida: 6000000, turno: "4x3" },
    { nombre: "PM", rentaLiquida: 3500000, turno: "4x3" },
    { nombre: "Administrador de Contrato", rentaLiquida: 4000000, turno: "4x3" },
    { nombre: "Jefe Oficina Técnica", rentaLiquida: 3200000, turno: "4x3" },
    { nombre: "Jefe Terreno", rentaLiquida: 3100000, turno: "4x3" },
    { nombre: "Prevencionista SNGM(B)", rentaLiquida: 2800000, turno: "4x3" },
    { nombre: "Sup. Montaje y Tendido", rentaLiquida: 2800000, turno: "14x14" },
    { nombre: "Capataz de Linieros", rentaLiquida: 2500000, turno: "14x14" },
    { nombre: "Maestro 1° Eléctrico", rentaLiquida: 1900000, turno: "14x14" },
    { nombre: "Rigger Calificado", rentaLiquida: 1300000, turno: "14x14" },
    { nombre: "Operador Camión Pluma", rentaLiquida: 1800000, turno: "14x14" },
    { nombre: "Asistente Administrativo", rentaLiquida: 900000, turno: "14x14" }
];


export const CONSTANTES_COSTOS = {
    UF: 39727.96,
    UTM: 69542,
    IMM: 539000,
    COLACION: 90000,
    MOVILIZACION: 77000,
    PASAJE_AEREO: 270000,
    PASAJE_TERRESTRE: 50000,
    EPP_ANUAL_BASE: 1060000,
    EPP_ANUAL_MEL: 2120000,
    CURSOS_MEL_ANUAL: 142000,
    BONO_IMPONIBLE_DEFAULT: 0,
    COSTO_ESTADIA_DIARIO: 0, // Will be passed in opts
    PCT_LEYES_SOCIALES: 12.5, // %
    PCT_COT_ADICIONAL: 0.4, // %
    PCT_FINIQUITO: 14, // % (IAS + Vac)
    PCT_FINIQUITO_OP: 8, // % (If Sinergia is OFF, cost uses full, but HH Op calc uses partial? HTML uses full for Monthly Total)
    BASE_ADJUSTMENT: 167000,
    FACTOR_IMPONIBLE: 0.78
};

export interface CalculoHHOpts {
    rentaLiquida: number;
    hoursPerMonth: number;
    durationMonths: number;
    isMel: boolean;
    includeLodging: boolean;
    lodgingCostDaily?: number;
    applySinergia?: boolean;
    bonoImponible?: number;
    // Overrides
    passThroughCosts?: {
        colacion?: number;
        movilizacion?: number;
        pasajeAereo?: number;
        pasajeTerrestre?: number;
        eppBase?: number;
    }
}

export function calcularCostoMensual(opts: CalculoHHOpts) {
    const {
        rentaLiquida,
        hoursPerMonth,
        durationMonths,
        isMel,
        includeLodging,
        lodgingCostDaily = 0,
        applySinergia = false,
        bonoImponible = 0,
        passThroughCosts = {}
    } = opts;

    // --- 1. Haberes & Imponible Rule (Reverse Calculation from Liquid) ---
    // Formula: (Liq + BonoImp - 167000) / 0.78
    const adjBase = CONSTANTES_COSTOS.BASE_ADJUSTMENT;
    const factorImp = CONSTANTES_COSTOS.FACTOR_IMPONIBLE;
    const imponible = (rentaLiquida + bonoImponible - adjBase) / factorImp;

    // --- 2. Leyes Sociales ---
    // 12.5% Base + Cotización Adicional (0.4% default)
    const pctLeyes = (CONSTANTES_COSTOS.PCT_LEYES_SOCIALES + CONSTANTES_COSTOS.PCT_COT_ADICIONAL) / 100;
    const leyesSociales = imponible * pctLeyes;

    // --- 3. Provisiones (Finiquito) ---
    // IAS + Vacaciones = 14% of Imponible
    const finiquitoFull = imponible * (CONSTANTES_COSTOS.PCT_FINIQUITO / 100);

    // For "Operational HH Cost" (internal metric), HTML calculates a different finiquito if Sinergia is applied.
    // However, for "Mensual Total Empresa", it strictly sums finiquitoFull.
    const finiquitoOp = applySinergia ? 0 : (imponible * (CONSTANTES_COSTOS.PCT_FINIQUITO_OP / 100));

    // --- 4. No Imponibles Fijos ---
    const colacion = passThroughCosts.colacion ?? CONSTANTES_COSTOS.COLACION;
    const movilizacion = passThroughCosts.movilizacion ?? CONSTANTES_COSTOS.MOVILIZACION;

    // --- 5. Logistica Prorrateada (Divided by Duration) ---
    // EPP
    const eppBaseAnual = passThroughCosts.eppBase ?? (isMel ? CONSTANTES_COSTOS.EPP_ANUAL_MEL : CONSTANTES_COSTOS.EPP_ANUAL_BASE);
    const eppProrr = eppBaseAnual / durationMonths;

    // Cursos
    const coursesAnual = isMel ? CONSTANTES_COSTOS.CURSOS_MEL_ANUAL : 0;
    const coursesProrr = coursesAnual / durationMonths;

    // Pasajes (One-time spread)
    const pAereo = passThroughCosts.pasajeAereo ?? CONSTANTES_COSTOS.PASAJE_AEREO;
    const pBus = passThroughCosts.pasajeTerrestre ?? CONSTANTES_COSTOS.PASAJE_TERRESTRE;
    const pasajesProrr = (pAereo + pBus) / durationMonths;
    // NOTE: HTML adds pasajesProrr ("pasajeA + pasajeT") where pasajeA = safeNum/dur. Correct.

    // --- 6. Estadía ---
    // HTML: includeLodging ? (lodgingDaily * 15) : 0
    const estadiaTotal = includeLodging ? (lodgingCostDaily * 15) : 0;

    // --- TOTAL CALCULATION ---
    // HTML: liq + leyes + finiquitoFull + col + mov + eppProrr + scosts + pasajeA + pasajeT + estadia + hExtras(0) + otros(0) + bonoTermino(0) + 167000
    const totalMensual = rentaLiquida
        + leyesSociales
        + finiquitoFull
        + colacion
        + movilizacion
        + eppProrr
        + coursesProrr
        + pasajesProrr
        + estadiaTotal
        + adjBase; // Add back the 167000 adjustment factor

    const costoHH = totalMensual / hoursPerMonth;

    // Operational Cost (for comparison, excludes full provision if Sinergia)
    // HTML: (mensualTotal - finiquitoFull + finiquitoOp) / hrs
    const costoHH_Operacional = (totalMensual - finiquitoFull + finiquitoOp) / hoursPerMonth;

    return {
        totalMensual,
        costoHH,
        costoHH_Operacional,
        detalles: {
            imponible,
            leyesSociales,
            finiquitoFull,
            colacion,
            movilizacion,
            logistica: eppProrr + coursesProrr + pasajesProrr + estadiaTotal,
            estadiaTotal
        }
    };
}
