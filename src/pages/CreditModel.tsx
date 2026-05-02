import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import CurtainScene from '../components/CurtainScene'
import ModeloHero from '../components/modelo/ModeloHero'
import ModeloFundamento from '../components/modelo/ModeloFundamento'
import ModeloProtagonistas from '../components/modelo/ModeloProtagonistas'
import ModeloFuerzas from '../components/modelo/ModeloFuerzas'
import ModeloPrincipios from '../components/modelo/ModeloPrincipios'
import ModeloCTA from '../components/modelo/ModeloCTA'

export default function CreditModel() {
  const fuerzasStickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Set sticky top = viewport_height - fuerzas_height (negative for tall sections).
    // This makes the sticky element anchor its BOTTOM to the viewport bottom,
    // so the user scrolls all of Fuerzas into view before it freezes.
    const updateStickyTop = () => {
      const el = fuerzasStickyRef.current
      if (!el) return
      const offset = Math.min(0, window.innerHeight - el.offsetHeight)
      el.style.top = `${offset}px`
    }

    updateStickyTop()
    window.addEventListener('resize', updateStickyTop)

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      window.removeEventListener('resize', updateStickyTop)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <PageTransition>
      {/*
        CurtainScene handles the hero → fundamento reveal.
        Hero acts as a curtain that slides upward, exposing
        ModeloFundamento which waits silently behind it.
      */}
      <CurtainScene
        hero={<ModeloHero />}
        reveal={(
          <div style={{ height: '200vh', position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0 }}>
              <ModeloFundamento />
            </div>
          </div>
        )}
      />

      {/* Rest of sections scroll normally after the curtain drops */}
      <ModeloProtagonistas />

      {/*
        Card-over-card: Fuerzas scrolls fully into view (top → bottom),
        then its bottom anchors at viewport bottom via dynamic sticky top.
        Principios follows immediately in normal flow with z-index 2,
        so it enters from viewport bottom and slides up over Fuerzas.
      */}
      <div style={{ position: 'relative' }}>
        <div ref={fuerzasStickyRef} style={{ position: 'sticky', zIndex: 1 }}>
          <ModeloFuerzas />
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ModeloPrincipios />
        </div>
      </div>

      <ModeloCTA />
    </PageTransition>
  )
}