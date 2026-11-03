export interface SectorData {
  id: string;
  number: string;
  sectorName: string;
  tag: string;
  title: string;
  subtitle?: string;
  body: string[];
  linkText: string;
  linkTo: string;
  videoIndices: number[]; // 1-based index in intra folder (e.g. [3] or [4, 5])
  telemetry: {
    code: string;
    metric: string;
    variable: string;
  };
  hasDiagram?: boolean;
}

export const NEW_HOME_SECTORS: SectorData[] = [
  {
    id: 'modelo',
    number: '01',
    sectorName: 'Agroindustria & Producción',
    tag: 'SECTOR 01 // AGROINDUSTRIA & ESCALA PRODUCTIVA',
    title: 'La Sincronización\nEstratégica entre\nCrédito y Productividad.',
    body: [
      'Para que el crédito tenga una verdadera oportunidad de impulsar el crecimiento y desarrollo sostenible, es indispensable alinear sus Ciclos de Deuda con la verdadera fuente de riqueza: los Ingresos por Productividad. Para ello, contamos con un modelo analítico que traslada estos principios macroeconómicos al ámbito empresarial, mediante el cual, además de diagnosticar la salud financiera, evaluamos profundamente su genética, para así, forjar una estructura invulnerable a sus propios ciclos.'
    ],
    linkText: 'Conoce nuestro Modelo',
    linkTo: '/modelo-crediticio',
    videoIndices: [5, 6], // Slot 5: video5 (bulir gandum) + Slot 6: video6 (traktor panen)
    telemetry: {
      code: 'AGRO.01-SYNCH',
      metric: 'PRODUCTIVITY / DEBT CYCLE',
      variable: 'GENÉTICA FINANCIERA'
    }
  },
  {
    id: 'proceso',
    number: '02',
    sectorName: 'Construcción & Infraestructura',
    tag: 'SECTOR 02 // CONSTRUCCIÓN & ERECCIÓN ESTRUCTURAL',
    title: 'Metodología para transformar.',
    body: [
      'Entendemos que el éxito requiere de la integración de otras variables que van más allá de las financieras. Correlacionado a esto, sabemos que el acceso a crédito está fragmentado, obstaculizado por la burocracia, y, como consecuencia, carece por completo de empatía técnica.',
      'Distinguido por nuestro protocolo Iterar —si una empresa presenta indicadores subóptimos durante su evaluación inicial, el proceso no concluye con un rechazo. En su lugar alineamos con las variables técnicas que requiere cualquier financiamiento con el fin de otorgarle a la entidad la acreditabilidad que exigen los comités institucionales—, nuestro proceso busca, a través de una combinación entre tecnología y metodología, potenciar la gestión con velocidad, fluidez y precisión analítica que un proceso convencional difícilmente puede alcanzar.'
    ],
    linkText: 'Conoce nuestro Proceso',
    linkTo: '/proceso',
    videoIndices: [7, 8, 9], // Slot 7: video7 (excavator), Slot 8: video8 (rangka luar), Slot 9: video9 (gedung & solar panel)
    telemetry: {
      code: 'STRUC.02-ITERAR',
      metric: 'ACREDITABILIDAD INSTITUCIONAL',
      variable: 'EMPATÍA TÉCNICA'
    }
  },
  {
    id: 'filosofia',
    number: '03',
    sectorName: 'Energía & Sostenibilidad',
    tag: 'SECTOR 03 // ENERGÍA & SOSTENIBILIDAD INTERTEMPORAL',
    title: 'La filosofía detrás del crecimiento dan desarrollo',
    body: [
      'Sostener este ecosistema exige mucho más que ingeniería económica financiera, infraestructura tecnológica y arquitectura operativa; requiere una filosofía fundamentada en dominar la mecánica estructural del crecimiento. La expansión no obedece a la intuición, sino a leyes que dictan la interacción exacta entre endeudamiento, tiempo y productividad.',
      'Por ello, definimos cualquier crédito como un “adelanto de gasto”. Al gestionarlo, no solo habilitamos capital; habilitamos tiempo. Esta anticipación de poder adquisitivo, que permite traer el futuro al presente, invirtiendo hoy en lo que multiplicará la productividad mañana, debe ser estratégica.',
      'El crédito es una herramienta de crecimiento intertemporal, no un paliativo.'
    ],
    linkText: 'Conoce más sobre nosotros',
    linkTo: '/nosotros',
    videoIndices: [10], // Slot 10: video10 (Turbinas eólicas y parques solares)
    telemetry: {
      code: 'SOLV.03-ENERGY',
      metric: 'INTERTEMPORAL PRODUCTIVITY',
      variable: 'ADELANTO DE GASTO'
    }
  },
  {
    id: 'productos',
    number: '04',
    sectorName: 'Comercio & Mercados Globales',
    tag: 'SECTOR 04 // COMERCIO, PUERTO & RETAIL',
    title: 'El conocimiento financiero es un derecho y una herramienta de estabilidad.',
    body: [
      'Como parte de nuestra filosofía operativa promovemos la educación financiera tanto interna y como externa.',
      'La confusión y falta de entendimiento sobre los productos financieros lleva a subestimar las variables que determinan su viabilidad, no solo afectando la planeación estratégica y la toma de decisiones financieras internas de alto impacto, sino que genera un riesgo de insolvencia irreversible al adquirir financiamiento.',
      'Por ello, exponemos los elementos que componen un crédito. La solidez de una entidad no depende únicamente de tener acceso al capital, sino del entendimiento y la arquitectura con la que este se integra: la Solución correcta, ejecutada a través del Instrumento idóneo y blindada bajo la Estructura precisa.'
    ],
    linkText: 'Descubre cómo se conforman un crédito',
    linkTo: '/productos',
    videoIndices: [11, 12], // Slot 11: video11 (docks de puerto marítimo) + Slot 12: video12 (supermarket retail)
    hasDiagram: true,
    telemetry: {
      code: 'TRADE.04-STRUCTURE',
      metric: 'RISK NEUTRALIZATION',
      variable: 'ARQUITECTURA DE CAPITAL'
    }
  },
  {
    id: 'servicios',
    number: '05',
    sectorName: 'Logística & Distribución Global',
    tag: 'SECTOR 05 // LOGÍSTICA & FLOTA GLOBAL',
    title: 'Capacidad que impulsa soluciones estratégicas',
    body: [
      'La profundidad de nuestra labor principal nos permite ofrecer un portafolio de servicios independientemente de una gestión crediticia de por medio.',
      'Erradicamos vulnerabilidades derivadas de estructuras financieras desalineadas, neutralizamos la toxicidad de pasivos ineficientes para restaurar equilibrio structural, transformamos fragilidad en perfiles de alta resiliencia, otorgamos certeza matemática ante decisiones críticas de inversión o expansión, dotamos a la organización de una arquitectura directiva, liberamos la liquidez atrapada en la operación maximizando el flujo de caja libre sin sacrificar rentabilidad, entre otros.'
    ],
    linkText: 'Conoce nuestros servicios',
    linkTo: '/servicios',
    videoIndices: [13, 14], // Slot 13: video13 (warehouse logístico) + Slot 14: video14 (armada de camiones contenedores)
    telemetry: {
      code: 'LOGIS.05-TRADE',
      metric: 'FREE CASH FLOW OPTIMIZATION',
      variable: 'RESILIENCIA CORPORATIVA'
    }
  }
];

export const HERO_STAGE_DATA = {
  openingPhrases: [
    'La economía\nno es caos.',
    'Es un\nmecanismo\npredecible,\nmedible,\nreplicable.',
    'Adaptamos esa\nmisma lógica a la\nescala de tu\nempresa.',
    'Arquitectos de equilibrio.'
  ],
  title: 'El Financiamiento Dictado por la Mecánica del Crecimiento.',
  subtitle: 'Donde la ingeniería financiera y los fundamentos económicos convergen para transformar el financiamiento en crecimiento sostenible.',
  body: [
    'Concebidos bajo la misma lógica de equilibrio y sostenibilidad que mantiene estable a la economía global, somos una organización de brokeraje financiero especializada en crédito.',
    'Trasladamos los principios macroeconómicos que rigen a las naciones a nivel microeconómico fundacional; individuos, negocios y empresas, fusionando teoría económica, análisis de riesgo y práctica crediticia en un mismo sistema operativo.',
    'No operamos bajo el modelo de corretaje tradicional. Más allá de gestionar y asesorar, nos enfocamos en impulsar el desarrollo, demostrando día a día que el crédito bien estructurado no genera deuda, genera progreso'
  ],
  videoIndices: [1, 2, 3, 4]
};
