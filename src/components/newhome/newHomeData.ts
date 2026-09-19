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
    title: 'La Sincronización Estratégica entre Crédito y Productividad',
    subtitle: 'Alineación de los ciclos de deuda con la verdadera fuente de riqueza.',
    body: [
      'Para que el crédito tenga una verdadera oportunidad de impulsar el crecimiento y desarrollo sostenible, es indispensable alinear sus Ciclos de Deuda con la verdadera fuente de riqueza: los Ingresos por Productividad.',
      'Para ello, contamos con un modelo analítico que traslada estos principios macroeconómicos al ámbito empresarial, mediante el cual, además de diagnosticar la salud financiera, evaluamos profundamente la genética financiera para identificar los factores que generan valor, y así, forjar una estructura invulnerable a sus propios ciclos.'
    ],
    linkText: 'Conoce más sobre nuestro Modelo',
    linkTo: '/modelo-crediticio',
    videoIndices: [3], // home3_intra.mp4 (Agro-industrial & farming tractors)
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
    title: 'Metodología para transformar',
    subtitle: 'Protocolo Iterar: transformando indicadores subóptimos en acreditabilidad institucional.',
    body: [
      'Entendemos que el éxito requiere de la integración de otras variables que van más allá de las financieras. Correlacionado a esto, sabemos que el acceso a crédito está fragmentado, obstaculizado por la burocracia, y, como consecuencia, carece por completo de empatía técnica.',
      'Distinguido por nuestro protocolo Iterar —si una empresa presenta indicadores subóptimos durante su evaluación inicial, el proceso no concluye con un rechazo. En su lugar alineamos con las variables técnicas que requiere cualquier financiamiento con el fin de otorgarle a la entidad la acreditabilidad que exigen los comités institucionales—, nuestro proceso busca, a través de una combinación entre tecnología y metodología, potenciar la gestión con velocidad, fluidez y precisión analítica que un proceso convencional difícilmente puede alcanzar.'
    ],
    linkText: 'Conoce más sobre nuestro Proceso',
    linkTo: '/proceso',
    videoIndices: [4, 5], // home4_intra.mp4 (excavation/crane) + home5_intra.mp4 (building frame)
    telemetry: {
      code: 'STRUC.02-ITERAR',
      metric: 'ACREDITABILIDAD INSTITUCIONAL',
      variable: 'INGENIERÍA CREDITICIA'
    }
  },
  {
    id: 'filosofia',
    number: '03',
    sectorName: 'Expansión Urbana & Corporativa',
    tag: 'SECTOR 03 // FILOSOFÍA DE EXPANSIÓN & URBANISMO',
    title: 'La filosofía detrás del crecimiento y desarrollo',
    subtitle: 'El crédito como habilitador de tiempo y catalizador intertemporal.',
    body: [
      'Sostener este ecosistema exige mucho más que ingeniería económica, infraestructura tecnológica y arquitectura operativa; requiere una filosofía fundamentada en dominar la mecánica estructural del crecimiento. La expansión no obedece a la intuición, sino a leyes que dictan la interacción exacta entre endeudamiento, tiempo y productividad.',
      'Por ello, definimos cualquier crédito como un “adelanto de gasto”. Al gestionarlo, no solo habilitamos capital; habilitamos tiempo. Esta anticipación de poder adquisitivo, que permite traer el futuro al presente, invirtiendo hoy en lo que multiplicará la productividad mañana, debe ser estratégica. El crédito es una herramienta de crecimiento intertemporal, no un paliativo.',
      'Bajo esta visión, permitir que el crédito aumente más rápido que el ingreso, provocará que la carga financiera termine por colapsar el equilibrio. Permitir que los ingresos aumenten más rápido que la productividad, hará que con el tiempo se pierda competitividad, entrando en un ciclo artificial de expansión. Aumentar la productividad garantizará la verdadera generación de riqueza. Y a largo plazo, eso es lo que más importa. Solo cuando la deuda generará suficiente productividad futura para pagarse a sí misma, el crédito se convierte en un legítimo motor de crecimiento y desarrollo.'
    ],
    linkText: 'Conoce más sobre Nosotros',
    linkTo: '/nosotros',
    videoIndices: [6], // home6_intra.mp4 (Completed high-rise & commercial city)
    telemetry: {
      code: 'PHIL.03-EQUILIBRIUM',
      metric: 'INTERTEMPORAL PRODUCTIVITY',
      variable: 'ADELANTO DE GASTO'
    }
  },
  {
    id: 'productos',
    number: '04',
    sectorName: 'Energía & Capital Estratégico',
    tag: 'SECTOR 04 // ENERGÍA, INFRAESTRUCTURA & ESTABILIDAD',
    title: 'El conocimiento financiero es un derecho y una herramienta de estabilidad.',
    subtitle: 'La tríada del crédito: Solución, Instrumento y Estructura.',
    body: [
      'Parte de nuestra filosofía operativa, y como política organizacional, promovemos la educación financiera tanto interna y como externa. La confusión y falta de entendimiento sobre los productos financieros lleva a subestimar las variables que determinan su viabilidad, no solo afectando la planeación estratégica y la toma de decisiones financieras internas de alto impacto, sino que genera un riesgo de insolvencia irreversible al adquirir financiamiento.',
      'Por ello, exponemos los elementos que componen un crédito. La solidez de una entidad no depende únicamente de tener acceso al capital, sino del entendimiento y la arquitectura con la que este se integra: la Solución correcta, ejecutada a través del Instrumento idóneo y blindada bajo la Estructura precisa.'
    ],
    linkText: 'Conoce más sobre los créditos',
    linkTo: '/productos',
    videoIndices: [7], // home7_intra.mp4 (Solar and wind energy infrastructure)
    hasDiagram: true,
    telemetry: {
      code: 'SOLV.04-STRUCTURE',
      metric: 'RISK NEUTRALIZATION',
      variable: 'ARQUITECTURA DE CAPITAL'
    }
  },
  {
    id: 'servicios',
    number: '05',
    sectorName: 'Logística, Distribución & Comercio Global',
    tag: 'SECTOR 05 & 06 // LOGÍSTICA & FLOTA GLOBAL',
    title: 'Capacidad que impulsa soluciones estratégicas',
    subtitle: 'Erradicando vulnerabilidades y liberando liquidez operativa.',
    body: [
      'La profundidad de nuestra labor principal nos permite ofrecer un portafolio de servicios, independientemente de una gestión crediticia de por medio.',
      'Erradicamos vulnerabilidades derivadas de estructuras financieras desalineadas, neutralizamos la toxicidad de pasivos ineficientes para restaurar equilibrio estructural, transformamos fragilidad en perfiles de alta resiliencia, otorgamos certeza matemática ante decisiones críticas de inversión o expansión, dotamos a la organización de una arquitectura directiva, liberamos la liquidez atrapada en la operación maximizando el flujo de caja libre sin sacrificar rentabilidad, entre otros.'
    ],
    linkText: 'Descubre nuestros Servicios',
    linkTo: '/servicios',
    videoIndices: [8, 9, 10], // home8_intra.mp4 (loading docks) + home9_intra.mp4 (warehouse interior) + home10_intra.mp4 (container trade fleet)
    telemetry: {
      code: 'LOGIS.05-TRADE',
      metric: 'FREE CASH FLOW OPTIMIZATION',
      variable: 'RESILIENCIA CORPORATIVA'
    }
  }
];

export const HERO_STAGE_DATA = {
  openingPhrases: [
    'La economía no es caos.',
    'Es un mecanismo — predecible, medible, replicable.',
    'Adaptamos esa misma lógica a la escala de tu empresa.',
    'Arquitectos de equilibrio.'
  ],
  title: 'El Financiamiento Dictado por la Mecánica del Crecimiento.',
  subtitle: 'Donde la ingeniería del crédito y los fundamentos económicos convergen para transformar el crédito en desarrollo sostenible.',
  body: [
    'Concebidos bajo la misma lógica de equilibrio y sostenibilidad que mantiene estable a la economía global, somos una organización de brokeraje financiero especializada en crédito.',
    'Trasladamos los principios macroeconómicos que rigen a las naciones a nivel microeconómico fundacional; individuos, negocios y empresas, fusionando teoría económica, análisis de riesgo y práctica crediticia en un mismo sistema operativo.',
    'No operamos bajo el modelo de corretaje tradicional. Más allá de gestionar y asesorar, nos enfocamos en impulsar el crecimiento y desarrollo sostenible, demostrando día a día que el crédito bien estructurado no genera deuda, genera progreso.'
  ],
  videoIndices: [1, 2] // home1_intra.mp4 (Hourglass & money hook) + home2_intra.mp4 (Structural blueprint)
};
