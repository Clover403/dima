import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import ProductosHero from '../components/productos/ProductosHero'
import ProductosIntroImmersive from '../components/productos/ProductosIntroImmersive'
import ProductosShowcase from '../components/productos/ProductosShowcase'
import ProductosOverview from '../components/productos/ProductosOverview'
import ProductosCTA from '../components/productos/ProductosCTA'

/* ═══════════════════════════════════════════
   PRODUCT DATA — 6 Products
═══════════════════════════════════════════ */

const products = [
  {
    number: '01',
    label: 'Crédito Simple',
    tagline: 'Anticipo del gasto enfocado en expandir la capacidad instalada',
    heading: 'Capital para crecer hoy con la productividad de mañana',
    description: [
      'Es un préstamo a plazo fijo con tasa de interés definida, montos establecidos y pagos predecibles. Le permite obtener capital para proyectos específicos sin afectar su flujo de caja.',
      'Estructuración de capital para adquisición de diversos activos y expansión de infraestructura. Trae el futuro al presente, asegurando que el retorno de inversión supere estructuralmente el costo de capital a lo largo del tiempo.',
    ],
    features: [
      'Plazo fijo definido',
      'Tasa de interés establecida',
      'Pagos predecibles',
      'Expansión de capacidad instalada',
    ],
    image: '/foto/brand-corporate.jpg',
    illustration: '/foto/illust-growth.jpg',
    ctaLink: '/contacto',
  },
  {
    number: '02',
    label: 'Crédito Puente',
    tagline: 'Sincronización del flujo de efectivo con el avance de obra',
    heading: 'Financiamiento que avanza al ritmo de su proyecto',
    description: [
      'Es un tipo de crédito simple diseñado para cubrir los costos de un proyecto inmobiliario (construcción, desarrollo, etc.) y los ingresos esperados.',
      'Financiamiento especializado para desarrollos inmobiliarios. Diseñado para alinear los desembolsos con el avance físico de la construcción, transformando el servicio de deuda en un motor de progreso.',
    ],
    features: [
      'Alineado con avance de obra',
      'Desembolsos progresivos',
      'Ciclos de comercialización',
      'Proyectos inmobiliarios',
    ],
    image: '/foto/brand-nature.jpg',
    illustration: '/foto/illust-buildings.jpg',
    ctaLink: '/contacto',
  },
  {
    number: '03',
    label: 'Crédito en Cuenta Corriente',
    tagline: 'Mitigación táctica en el ciclo de conversión de efectivo',
    heading: 'Liquidez que se adapta a su ritmo operativo',
    description: [
      'Diseñado para facilitar la gestión diaria de las operaciones de una empresa. A diferencia de otros créditos, una vez que se reembolsa el principal, puede volver a acceder a los fondos mientras el contrato esté activo.',
      'Línea de crédito revolvente para ciclos operativos. Un mecanismo de equilibrio para gestionar brechas de flujo de efectivo a corto plazo, manteniendo la agilidad necesaria para que su gasto siempre se traduzca en ingresos.',
    ],
    features: [
      'Línea revolvente',
      'Acceso continuo a fondos',
      'Gestión de capital de trabajo',
      'Oportunidades de negocio',
    ],
    image: '/foto/brand-documents.jpg',
    illustration: '/foto/illust-piechart.jpg',
    ctaLink: '/contacto',
  },
  {
    number: '04',
    label: 'Crédito Agroindustrial',
    tagline: 'Calibración del financiamiento a la maduración de activos biológicos',
    heading: 'Financiamiento que respeta los ciclos de la tierra',
    description: [
      'Diseñado específicamente para el sector agrícola, este programa permite a productores y empresas del sector acceder a capital para inversiones, capital de trabajo y proyectos de modernización.',
      'Financiamiento especializado para el sector agropecuario, estructurado para respetar rigurosamente los ciclos de activos biológicos y cosechas.',
    ],
    features: [
      'Pagos alineados a cosechas',
      'Capital de trabajo agrícola',
      'Modernización del sector',
      'Ciclos biológicos respetados',
    ],
    image: '/foto/brand-nature.jpg',
    illustration: '/foto/illust-house.jpg',
    ctaLink: '/contacto',
  },
  {
    number: '05',
    label: 'Arrendamiento Financiero',
    tagline: 'Uso de activos productivos con máxima eficiencia de capital',
    heading: 'El activo se paga con la riqueza que genera',
    description: [
      'Producto diseñado para que el acreditado use y finalmente adquiera un activo mediante pagos periódicos que incluyen capital e intereses. El objetivo es la transferencia de propiedad al término del contrato.',
      'Acceda a tecnología y maquinaria sin agotar su capital. Un esquema diseñado para que el activo productivo pague su propia amortización mediante la riqueza generada por su uso.',
    ],
    features: [
      'Transferencia de propiedad',
      'Beneficios fiscales',
      'Preservación de capital de trabajo',
      'Productividad del activo',
    ],
    image: '/foto/brand-stationery.jpg',
    illustration: '/foto/illust-shipping.jpg',
    ctaLink: '/contacto',
  },
  {
    number: '06',
    label: 'Factoring',
    tagline: 'Aceleración estratégica del ciclo de conversión de efectivo',
    heading: 'Convierta sus cuentas por cobrar en poder de compra',
    description: [
      'Le permite obtener liquidez inmediata mediante la cesión de sus cuentas por cobrar a una institución financiera. Recibe un anticipo sobre el valor de sus facturas, obteniendo capital de trabajo sin esperar a que sus clientes paguen.',
      'Acelere su ciclo de conversión de efectivo anticipando cuentas por cobrar para convertirlas en poder de compra estratégico hoy.',
    ],
    features: [
      'Liquidez inmediata',
      'Sin esperar cobros',
      'Reinversión en cadena de valor',
      'Fortalecimiento patrimonial',
    ],
    image: '/foto/brand-documents.jpg',
    illustration: '/foto/illust-truck.jpg',
    ctaLink: '/contacto',
  },
]

export default function Products() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <PageTransition>
      <ProductosHero />
      <ProductosIntroImmersive />
      <ProductosShowcase products={products} />
      <ProductosOverview />
      <ProductosCTA />
    </PageTransition>
  )
}
