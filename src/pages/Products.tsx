import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/layout/PageTransition'
import SharedHeroSection from '../components/layout/SharedHeroSection'
import ProductosIntroImmersive from '../components/productos/ProductosIntroImmersive'
import ProductosShowcase from '../components/productos/ProductosShowcase'
import ProductosOverview from '../components/productos/ProductosOverview'
import CTA from '../components/layout/CTA'

import { productsData } from '../data/productos'

export default function Products() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <PageTransition>
      <SharedHeroSection
        eyebrowText="Productos"
        titleTop="Soluciones que"
        titleBottom="construyen"
        description="Cada producto está diseñado como una pieza de ingeniería financiera. No vendemos créditos — estructuramos crecimiento."
      />
      <ProductosIntroImmersive />
      <ProductosShowcase products={productsData} />
      <div className="relative z-10">
        <ProductosOverview />
        <CTA />
      </div>
    </PageTransition>
  )
}