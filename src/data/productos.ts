export interface ProductLayer {
  content: string;
  details: string[];
}

export const PRODUCTOS_CTA_LINK = '/contacto';

export interface ProductData {
  slug: string;
  number: string;
  label: string;
  tagline: string;
  heading: string;
  sector: string;
  desc: string;
  solution: ProductLayer;
  instrument: ProductLayer;
  structure: ProductLayer;
}

export const productsData: ProductData[] = [
  {
    slug: 'credito-simple',
    number: '01',
    label: 'Crédito Simple',
    tagline: 'Anticipo del gasto enfocado en expandir la capacidad instalada',
    heading: 'Capital para crecer',
    sector: 'Adquisición de activos · Expansión',
    solution: {
      content: 'Financiar un proyecto o activo específico con pagos predecibles que no comprometan el capital operativo de la empresa.',
      details: [
        'Expansión de capacidad productiva',
        'Adquisición de activos fijos',
        'Proyectos de crecimiento con ROI definido',
      ],
    },
    instrument: {
      content: 'Crédito Simple — Disposición única de capital a plazo fijo con tabla de amortización predefinida y tasa acordada.',
      details: [
        'Monto fijo en una sola disposición',
        'Tasa fija o variable según perfil',
        'Plazo determinado desde el inicio',
      ],
    },
    structure: {
      content: 'Diseño de amortización, garantías y condiciones adaptadas al flujo de caja y ciclo operativo del acreditado.',
      details: [
        'Amortización: nivelada, creciente o bullet',
        'Garantías: hipotecaria, prendaria o fiduciaria',
        'Periodo de gracia según arranque del proyecto',
      ],
    },
    desc: 'Obtén capital para proyectos específicos sin afectar tu flujo de caja. Monto definido, tasa fija, amortizaciones estructuradas.',
  },
  {
    slug: 'credito-puente',
    number: '02',
    label: 'Crédito Puente',
    tagline: 'Sincronización del flujo de efectivo con el avance de obra',
    heading: 'Financiamiento al ritmo de obra',
    sector: 'Desarrollos inmobiliarios',
    solution: {
      content: 'Cubrir los costos de desarrollo de un proyecto inmobiliario mientras se materializa la fuente de pago: ventas, rentas o refinanciamiento.',
      details: [
        'Construcción residencial o comercial',
        'Proyectos con preventas como fuente de pago',
        'Desarrollos en etapas con ingresos diferidos',
      ],
    },
    instrument: {
      content: 'Crédito Puente — Financiamiento vinculado al avance de obra con ministraciones progresivas conforme al calendario de construcción.',
      details: [
        'Ministraciones alineadas al avance físico',
        'Pago final con fuente de repago predefinida',
        'Supervisión técnica del avance de obra',
      ],
    },
    structure: {
      content: 'Estructura con garantía hipotecaria sobre el inmueble en desarrollo, aforo de preventas y esquema de salida mediante escrituración o refinanciamiento.',
      details: [
        'Garantía: hipoteca sobre el inmueble',
        'Aforo: preventas como colateral adicional',
        'Salida: escrituración individual o take-out',
      ],
    },
    desc: 'Diseñado para cubrir costos de un proyecto inmobiliario mientras se materializa la fuente de pago esperada.',
  },
  {
    slug: 'cuenta-corriente',
    number: '03',
    label: 'Crédito en Cuenta Corriente',
    tagline: 'Mitigación táctica en el ciclo de conversión de efectivo',
    heading: 'Liquidez que se adapta',
    sector: 'Capital de trabajo recurrente',
    solution: {
      content: 'Gestionar los ciclos operativos recurrentes de la empresa sin comprometer liquidez ni depender de nuevas aprobaciones de crédito.',
      details: [
        'Desfases entre cobranza y pagos',
        'Ciclos operativos cortos y repetitivos',
        'Necesidades de liquidez variables mes a mes',
      ],
    },
    instrument: {
      content: 'Cuenta Corriente — Línea de crédito revolvente. Una vez liquidada, la disponibilidad se restablece automáticamente mientras el contrato esté activo.',
      details: [
        'Disposiciones y liquidaciones múltiples',
        'Línea preaprobada sin nuevas gestiones',
        'Control centralizado de operaciones',
      ],
    },
    structure: {
      content: 'Línea con límite global, subcuotas por disposición y tasas sobre saldo insoluto. Renovación anual sujeta a revisión del comportamiento crediticio.',
      details: [
        'Tasa sobre saldo insoluto diario',
        'Sublímites por disposición si aplica',
        'Renovación anual con revisión de perfil',
      ],
    },
    desc: 'Una vez liquidado, el crédito vuelve a estar disponible mientras el contrato esté activo. Control centralizado de operaciones.',
  },
  {
    slug: 'credito-agroindustrial',
    number: '04',
    label: 'Crédito Agroindustrial',
    tagline: 'Calibración del financiamiento a la maduración de activos biológicos',
    heading: 'Respeta los ciclos de la tierra',
    sector: 'Sector agropecuario',
    solution: {
      content: 'Financiar el ciclo productivo agrícola o ganadero con pagos estructurados según los ingresos estacionales de la cosecha o la venta del ganado.',
      details: [
        'Ciclos de siembra, cultivo y cosecha',
        'Actividades ganaderas con estacionalidad',
        'Agroindustria con flujos diferidos',
      ],
    },
    instrument: {
      content: 'Crédito Agroindustrial — Financiamiento calibrado al ciclo de producción con amortizaciones alineadas a la temporada de ingresos.',
      details: [
        'Disposición al inicio del ciclo productivo',
        'Pago único o escalonado post-cosecha',
        'Renovable ciclo a ciclo con buen historial',
      ],
    },
    structure: {
      content: 'Evaluación técnica del proyecto productivo, garantías sobre cosecha futura (warrant) o prendaria sobre activos agropecuarios, con aforo según ciclo.',
      details: [
        'Garantía: warrant, prenda o hipoteca',
        'Plazo: alineado al ciclo de la cosecha',
        'Seguro agrícola como condición habitual',
      ],
    },
    desc: 'Pagos estructurados según ciclos de producción agrícola. Evaluación del proyecto, aprobación y disposición de recursos.',
  },
  {
    slug: 'arrendamiento-financiero',
    number: '05',
    label: 'Arrendamiento Financiero',
    tagline: 'Uso de activos productivos con máxima eficiencia de capital',
    heading: 'El activo se paga solo',
    sector: 'Maquinaria · Tecnología · Flota',
    solution: {
      content: 'Incorporar activos productivos de alto valor al balance sin descapitalizar la empresa, con ventajas fiscales y opción de adquisición al final.',
      details: [
        'Renovación tecnológica sin desembolso total',
        'Optimización fiscal por deducción de rentas',
        'Preservación de capital para operaciones',
      ],
    },
    instrument: {
      content: 'Arrendamiento Financiero — El arrendador adquiere el bien y lo cede al arrendatario a cambio de rentas periódicas con opción a compra al vencimiento.',
      details: [
        'Opción de compra al final del contrato',
        'El bien se registra en balance del arrendatario',
        'Deducción fiscal de intereses y depreciación',
      ],
    },
    structure: {
      content: 'Renta calculada sobre el valor del activo, tasa y plazo acordados. Valor residual (opción de compra) negociado desde el inicio.',
      details: [
        'Plazo: 12 a 60 meses según vida útil',
        'Valor residual: simbólico o de mercado',
        'Tasa fija en rentas; sin sorpresas de flujo',
      ],
    },
    desc: 'Uso y adquisición final del activo mediante pagos periódicos. El bien se registra en balance con deducción fiscal de intereses y depreciación.',
  },
  {
    slug: 'factoring',
    number: '06',
    label: 'Factoring',
    tagline: 'Aceleración estratégica del ciclo de conversión de efectivo',
    heading: 'Cuentas por cobrar hoy',
    sector: 'Cadena de valor · Flujo de efectivo',
    solution: {
      content: 'Convertir cuentas por cobrar a futuro en liquidez inmediata sin generar deuda, para no depender del plazo de pago de los clientes.',
      details: [
        'Necesidad de liquidez sin endeudamiento',
        'Clientes con plazos largos de pago (30–120 días)',
        'Crecimiento que supera el ciclo de cobranza',
      ],
    },
    instrument: {
      content: 'Factoring — Cesión de derechos de cobro sobre facturas emitidas a cambio de un anticipo inmediato. La institución gestiona la cobranza con el deudor.',
      details: [
        'Anticipo sobre el valor nominal de la factura',
        'Con o sin recurso según perfil del deudor',
        'La institución absorbe la gestión de cobranza',
      ],
    },
    structure: {
      content: 'Aforo sobre el valor de la factura (80–95%), descuento por días de financiamiento y análisis crediticio del deudor cedido, no del cedente.',
      details: [
        'Aforo: 80%–95% del valor de la factura',
        'Costo: tasa de descuento por día financiado',
        'Análisis: perfil crediticio del deudor cedido',
      ],
    },
    desc: 'Anticipo sobre el valor de tus facturas. La institución gestiona la cobranza. No esperes a que tus clientes paguen.',
  }
];
