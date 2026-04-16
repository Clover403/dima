import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import ModeloHero from '../components/modelo/ModeloHero'
import ModeloFundamento from '../components/modelo/ModeloFundamento'
import ModeloProtagonistas from '../components/modelo/ModeloProtagonistas'
import ModeloFuerzas from '../components/modelo/ModeloFuerzas'
import ModeloPrincipios from '../components/modelo/ModeloPrincipios'
import ModeloCTA from '../components/modelo/ModeloCTA'

export default function CreditModel() {
  useEffect(() => {
    /* Scroll to top on mount */
    window.scrollTo(0, 0)

    /* Refresh ScrollTrigger after all sections mount */
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
      <ModeloFundamento />
      <ModeloProtagonistas />
      <ModeloFuerzas />
      <ModeloPrincipios />
      <ModeloCTA />
    </PageTransition>
  )
}
