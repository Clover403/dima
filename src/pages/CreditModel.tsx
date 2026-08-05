import { useLayoutEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/layout/PageTransition'
import ModeloHero from '../components/modelo/ModeloHero'
import ModeloFuerzas from '../components/modelo/ModeloFuerzas'
import ModeloPrincipios from '../components/modelo/PrincipiosHero'
import CTA from "../components/layout/CTA";


export default function CreditModel() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <PageTransition>
      <ModeloHero />

      {/* Fuerzas and Principios - normal flow without sticky effects */}
      <ModeloFuerzas />
      <ModeloPrincipios />

      <CTA theme="light" />
    </PageTransition>
  )
}


