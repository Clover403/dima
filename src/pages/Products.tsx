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
      'Préstamo a plazo fijo con pagos predecibles para financiar proyectos específicos sin afectar su flujo de caja.',
      'El retorno de inversión supera estructuralmente el costo de capital — trae el futuro al presente.',
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
      'Crédito especializado para proyectos inmobiliarios: los desembolsos se alinean con el avance físico de la obra.',
      'Transforma el servicio de deuda en un motor de progreso, sincronizando costos con los ciclos de comercialización.',
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
      'Línea revolvente para operaciones diarias: al reembolsar el principal, los fondos quedan disponibles nuevamente.',
      'Elimina brechas de flujo de caja a corto plazo manteniendo la agilidad operativa de su empresa.',
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
      'Capital diseñado para el sector agrícola: inversión, capital de trabajo y modernización con pagos alineados a las cosechas.',
      'Estructura financiera yang respeta los ciclos biológicos, reduciendo la presión de liquidez en temporadas de menor ingreso.',
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
      'Use y adquiera activos productivos mediante pagos periódicos, preservando su capital de trabajo y con beneficios fiscales.',
      'El activo se autofinancia con la riqueza que genera — acceda a tecnología sin agotar su liquidez.',
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
      'Obtenga liquidez inmediata cediendo sus facturas — sin esperar a que sus clientes paguen.',
      'Acelere su ciclo de cobro y convierta cuentas por cobrar en capital estratégico hoy mismo.',
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
      
      {/* Showcase pinned — user scroll through all 6 products */}
      <ProductosShowcase products={products} />

      {/* SPACER: extra scroll space biar product 06 kebaca dulu sebelum ketutup */}
      <div className="h-[60vh] bg-[#030035] relative z-0" />

      {/* Overview naik menutupi dengan efek slideup/zoom */}
      <div className="relative z-10" style={{ marginTop: '-100vh' }}>
        <ProductosOverview />
      </div>

      {/* <ProductosCTA /> */}
    </PageTransition>
  )
}