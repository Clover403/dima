export interface ServiceData {
  id: string
  slug: string
  name: string
  short: string
  description: string
  connection: string
  deliverables: string[]
  image1: string
  image2: string
}

export const servicesData: ServiceData[] = [
  {
    id: '01',
    slug: 'reingenieria-de-deuda',
    name: 'Reingeniería de Deuda',
    short: 'Estructura óptima de capital',
    description:
      'Rediseñamos la arquitectura de deuda corporativa para sincronizarla con los ciclos macroeconómicos actuales. No se trata solo de refinanciar — se trata de posicionar estratégicamente cada instrumento en el momento correcto del ciclo.',
    connection:
      'Nuestra capacidad de reestructurar deuda con precisión nace directamente del modelo macroeconómico que empleamos en correduría: entendemos cuándo los ciclos favorecen la renegociación y cuándo representan riesgo sistémico.',
    deliverables: [
      'Diagnóstico de estructura de deuda actual',
      'Modelado de escenarios de refinanciamiento',
      'Negociación estratégica con contraparte',
    ],
    image1: '/illustration-compressed/services/1a.webp',
    image2: '/illustration-compressed/services/1b.webp',
  },
  {
    id: '02',
    slug: 'estrategia-financiera-ciclica',
    name: 'Estrategia Financiera Cíclica',
    short: 'Anticipación de ciclos económicos',
    description:
      'Diseñamos estrategias financieras que anticipan los movimientos del ciclo económico. La diferencia entre rentabilidad y pérdida está en la anticipación — no en la reacción. Cada decisión se calibra contra el estado actual del ciclo.',
    connection:
      'La anticipación de ciclos es el núcleo operativo de nuestra correduría. Esta capacidad analítica se extiende naturalmente al asesoramiento estratégico de cada cliente que lo necesite.',
    deliverables: [
      'Análisis de posición en el ciclo actual',
      'Estrategia de asignación de capital',
      'Monitoreo y ajuste continuo',
    ],
    image1: '/illustration-compressed/services/2a.webp',
    image2: '/illustration-compressed/services/2b.webp',
  },
  {
    id: '03',
    slug: 'tesoreria-avanzada',
    name: 'Tesorería Avanzada',
    short: 'Maximización de liquidez operativa',
    description:
      'Optimizamos la gestión de tesorería empresarial integrando visión macroeconómica con las necesidades operativas específicas de cada organización. Liquidez inteligente, no solo disponible.',
    connection:
      'La visibilidad que tenemos sobre flujos de mercado como corredores nos permite diseñar estructuras de tesorería que el análisis interno puro no puede alcanzar. Conocemos el ciclo desde adentro.',
    deliverables: [
      'Diagnóstico de flujos de caja',
      'Optimización de posiciones de liquidez',
      'Estructura de inversión de excedentes',
    ],
    image1: '/illustration-compressed/services/3a.webp',
    image2: '/illustration-compressed/services/3b.webp',
  },
  {
    id: '04',
    slug: 'valuacion-estrategica',
    name: 'Valuación Estratégica',
    short: 'Determinación del valor real',
    description:
      'Determinamos el valor real de activos, empresas e instrumentos financieros con metodologías que integran contexto macroeconómico y ciclo de mercado. El valor no es estático — depende del momento del ciclo.',
    connection:
      'Valuar correctamente requiere entender el ciclo en el que se encuentra el activo. Nuestra posición como corredores nos da acceso a información de mercado que enriquece cada valuación más allá del análisis de escritorio.',
    deliverables: [
      'Valuación de empresas y activos financieros',
      'Due diligence de valor',
      'Informes para decisiones de inversión',
    ],
    image1: '/illustration-compressed/services/4a.webp',
    image2: '/illustration-compressed/services/4b.webp',
  },
  {
    id: '05',
    slug: 'gobernanza-financiera',
    name: 'Gobernanza Financiera',
    short: 'Institucionalización de decisiones',
    description:
      'Diseñamos estructuras de gobernanza que institucionalizan la toma de decisiones financieras y crean organizaciones financieramente resilientes. La disciplina analítica como cultura, no solo como consultoría.',
    connection:
      'La gobernanza que diseñamos incorpora los principios macroeconómicos de nuestra correduría, trasladando esa disciplina al ADN de la organización. No enseñamos metodología — instalamos mentalidad.',
    deliverables: [
      'Diseño de comités financieros',
      'Políticas y procedimientos financieros',
      'Implementación de KPIs estratégicos',
    ],
    image1: '/illustration-compressed/services/5a.webp',
    image2: '/illustration-compressed/services/5b.webp',
  },
]
