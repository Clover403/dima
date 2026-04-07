import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import ServiciosHero from '../components/servicios/ServiciosHero'
import ServiciosNav from '../components/servicios/ServiciosNav'
import ServicesShowcase from '../components/servicios/ServicesShowcase'
import ServiciosValues from '../components/servicios/ServiciosValues'
import ServiciosCTA from '../components/servicios/ServiciosCTA'

/* ═══════════════════════════════════════════
   SERVICE DATA — 6 Services
═══════════════════════════════════════════ */

const services = [
  {
    number: '01',
    label: 'REINGENIERÍA DE DEUDA',
    heading: [
      'Optimización de la relación',
      'deuda-ingreso',
    ],
    descriptor:
      'Análisis de la deuda actual y diseño integral de la estructura óptima de capital',
    paragraphs: [
      'Realizamos un análisis exhaustivo de la deuda actual de la empresa y diseñamos integralmente la estructura óptima de capital — equilibrando deuda y patrimonio — incluyendo vencimientos, monedas, tasas y covenants, todo alineado con el ciclo operativo y el ciclo de deuda de nuestro modelo crediticio.',
      'Identificamos préstamos costosos, vencimientos desalineados — financiamiento a corto plazo para necesidades de largo plazo — y garantías desperdiciadas. Esto incluye refinanciamiento, consolidación y reingeniería completa de pasivos.',
    ],
    deliverables: [
      'Estructura óptima de capital',
      'Refinanciamiento y consolidación',
      'Alineación de vencimientos',
      'Maximización de garantías',
    ],
    image: '/foto/brand-corporate.jpg',
    layout: 'photo-left' as const,
    theme: 'dark' as const,
    ctaLink: '/contacto',
  },
  {
    number: '02',
    label: 'ESTRATEGIA FINANCIERA CÍCLICA',
    heading: [
      'Gobernanza de fuerzas económicas',
      'para estabilidad intertemporal',
    ],
    descriptor:
      'Diagnosticar el negocio dentro del ciclo económico, crediticio y sectorial para anticipar decisiones financieras, no reaccionar a ellas',
    paragraphs: [
      'Aplicamos modelos de ciclos de deuda a corto y largo plazo para anticipar variaciones en el poder adquisitivo. Este enfoque permite sincronizar el gasto con ingresos impulsados por la productividad, evitando la expansión artificial de deuda.',
      'Mantenemos la competitividad estructural de los activos financieros de su empresa, asegurando que cada decisión de financiamiento esté calibrada al momento exacto del ciclo económico en que se encuentra.',
    ],
    deliverables: [
      'Diagnóstico de ciclo económico',
      'Sincronización gasto-productividad',
      'Anticipación de decisiones',
      'Estabilidad estructural',
    ],
    image: '/foto/illust-piechart.jpg',
    layout: 'photo-right' as const,
    theme: 'light' as const,
    ctaLink: '/contacto',
  },
  {
    number: '03',
    label: 'TESORERÍA AVANZADA',
    heading: [
      'Eficiencia en flujo operativo',
      'y mitigación de choques',
    ],
    descriptor:
      'Modelación dinámica del flujo de caja operativo, financiero y estratégico para maximizar la liquidez disponible sin sacrificar rentabilidad',
    paragraphs: [
      'Intervenimos en el ciclo de conversión de efectivo para acelerar la creación de valor real. Implementamos estrategias de gestión de tesorería que priorizan la liquidez inmediata, minimizando el arbitraje ineficiente de tasas de interés.',
      'Desarrollamos estrategias para acelerar cobranzas y optimizar pagos a proveedores e inventario, asegurando que el gasto permanezca alineado con la tasa de retorno operativa de su empresa.',
    ],
    deliverables: [
      'Aceleración del ciclo de conversión',
      'Optimización de cobranzas',
      'Gestión de pagos a proveedores',
      'Maximización de liquidez',
    ],
    image: '/foto/brand-documents.jpg',
    layout: 'photo-left' as const,
    theme: 'dark' as const,
    ctaLink: '/contacto',
  },
  {
    number: '04',
    label: 'VALUACIÓN ESTRATÉGICA',
    heading: [
      'Determinación del valor presente',
      'y potencial de expansión',
    ],
    descriptor:
      'Determinar el valor real de la empresa para fines de venta, fusión, entrada de socios inversionistas, o decisiones internas de financiamiento, expansión o reestructuración',
    paragraphs: [
      'Realizamos un análisis técnico basado en la capacidad de generación de ingresos a través de la productividad marginal del capital. Evaluamos la solvencia fundamental y la salud de los activos financieros de su empresa.',
      'Proporcionamos una visión cuantitativa del valor real de la empresa como un negocio vivo, equilibrado y en crecimiento — no solo números en un balance, sino una evaluación integral de su capacidad de generar valor sostenible.',
    ],
    deliverables: [
      'Valuación integral de empresa',
      'Análisis de productividad marginal',
      'Evaluación de solvencia fundamental',
      'Potencial de expansión cuantificado',
    ],
    image: '/foto/illust-buildings.jpg',
    layout: 'photo-right' as const,
    theme: 'light' as const,
    ctaLink: '/contacto',
  },
  {
    number: '05',
    label: 'AUDITORÍA CAPEX',
    heading: [
      'Maximización del rendimiento',
      'operativo por inversión',
    ],
    descriptor:
      'Evaluamos matemáticamente si la maquinaria o expansión que el cliente desea adquirir es viable — no usamos intuiciones, usamos cálculos',
    paragraphs: [
      'Evaluamos la productividad de los activos actuales contra las necesidades de gasto de capital (CapEx). Garantizamos que todo financiamiento se canalice hacia la productividad, asegurando que las adquisiciones de activos generen suficiente flujo de caja para el servicio autónomo de la deuda.',
      'Esto evita el \'Riesgo de Inversión Improductiva\' — comprar máquinas o realizar expansiones que no pagan su propia deuda. Cada decisión de inversión se respalda con ingeniería financiera, no con corazonadas.',
    ],
    deliverables: [
      'Evaluación de viabilidad de CapEx',
      'Análisis de productividad de activos',
      'Prevención de inversión improductiva',
      'Flujo de caja proyectado por activo',
    ],
    image: '/foto/illust-truck.jpg',
    layout: 'photo-left' as const,
    theme: 'dark' as const,
    ctaLink: '/contacto',
  },
  {
    number: '06',
    label: 'GOBERNANZA FINANCIERA',
    heading: [
      'Institucionalización de',
      'la toma de decisiones',
    ],
    descriptor:
      'Acompañamiento continuo como arquitecto financiero externo — estableciendo reglas, métricas y decisiones de capital como un CFO estratégico externo',
    paragraphs: [
      'Establecemos una política de disciplina financiera y transparencia educativa dentro de la organización. Profesionalizamos la toma de decisiones financieras mediante la creación de comités internos y políticas de dividendos.',
      'Esta gestión externa asegura que los ingresos no superen la productividad sistémica, consolidando el patrimonio y protegiendo a la empresa de los riesgos inherentes a la naturaleza humana del crédito. Es como tener un CFO estratégico sin el costo de una contratación permanente.',
    ],
    deliverables: [
      'CFO estratégico externo',
      'Comités internos y políticas',
      'Disciplina de capital institucional',
      'Planificación de sucesión financiera',
    ],
    image: '/foto/brand-stationery.jpg',
    layout: 'photo-right' as const,
    theme: 'light' as const,
    ctaLink: '/contacto',
  },
]

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <PageTransition>
      <ServiciosHero />
      <ServiciosNav />

      <ServicesShowcase services={services} />

      <ServiciosValues />
      <ServiciosCTA />
    </PageTransition>
  )
}
