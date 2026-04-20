import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import ModeloProceso from '../components/modelo/ModeloProceso'
import ProcessDiagramSVG from '../components/illustrations/ProcessDiagramSVG'
import AnimatedGrid from '../components/AnimatedGrid'
import ProcessCTASection from '../components/ProcessCTASection'

gsap.registerPlugin(ScrollTrigger)

function runStrokeDraw(
  root: Element,
  opts: { scrub?: boolean; start?: string; end?: string; duration?: number; stagger?: number } = {}
) {
  const paths = root.querySelectorAll<SVGGeometryElement>('.draw-path')
  paths.forEach((p) => {
    const len = p.getTotalLength?.() ?? 1000
    ;(p as unknown as SVGPathElement).style.strokeDasharray = `${len}`
    ;(p as unknown as SVGPathElement).style.strokeDashoffset = `${len}`
  })
  return gsap.to(paths, {
    strokeDashoffset: 0,
    duration: opts.duration ?? 2,
    ease: 'power2.inOut',
    stagger: opts.stagger ?? 0.03,
    scrollTrigger: {
      trigger: root,
      start: opts.start ?? 'top 75%',
      end: opts.end,
      scrub: opts.scrub ?? false,
    },
  })
}

export default function Process() {
  const pageRef = useRef<HTMLDivElement>(null)
  const heroIllusRef = useRef<SVGSVGElement>(null)
  const narrativeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!pageRef.current) return
    const ctx = gsap.context(() => {
      // Marquee
      gsap.to('.proceso-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 55,
        ease: 'none',
      })

      // Hero wireframe slow draw on load
      if (heroIllusRef.current) {
        runStrokeDraw(heroIllusRef.current, { duration: 4, stagger: 0.08 })
      }

      // Grid drift
      gsap.to('.proceso-grid-bg', {
        backgroundPosition: '0 120px',
        scrollTrigger: { trigger: pageRef.current, scrub: true },
      })

      // Hero content reveals
      gsap.utils.toArray<HTMLElement>('.hero-reveal').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 + i * 0.12 }
        )
      })

      // NARRATIVE — pinned sequential phase reveal
      if (narrativeRef.current) {
        const phaseEls = narrativeRef.current.querySelectorAll('.phase-frame')

        phaseEls.forEach((frame) => {
          const text = frame.querySelectorAll('.phase-text > *')
          const illus = frame.querySelector('.phase-illus')

          gsap.from(text, {
            opacity: 0,
            y: 40,
            filter: 'blur(4px)',
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: frame, start: 'top 70%' },
          })

          if (illus) {
            gsap.fromTo(
              illus,
              { opacity: 0, scale: 0.96 },
              {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: frame, start: 'top 70%' },
              }
            )
            runStrokeDraw(illus, { start: 'top 75%', duration: 2.5 })
          }
        })
      }

      // Principles reveals
      gsap.utils.toArray<HTMLElement>('.principle-block').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 80%' },
          }
        )
      })

      // Principles ornamental dividers
      gsap.utils.toArray<SVGSVGElement>('.principle-divider').forEach((svg) => {
        runStrokeDraw(svg, { start: 'top 85%', duration: 2 })
      })

      // CTA reveals
      gsap.utils.toArray<HTMLElement>('.cta-reveal').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        )
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <PageTransition>
      <div ref={pageRef} className="bg-navy text-lightgray">
        {/* ═══════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-navy">
<AnimatedGrid cellSize={60} color="229,153,123" />          <div
            className="proceso-grid-bg absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute top-[12%] left-0 flex whitespace-nowrap opacity-[0.04] select-none pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="proceso-marquee font-display text-[14vw] leading-none uppercase pr-20 text-lightgray"
              >
                Proceso &bull; Ingeniería &bull; Crédito &bull; Iteración &bull;
              </span>
            ))}
          </div>

          <div className="relative z-10 text-center max-w-4xl px-8">
            <p className="hero-reveal font-body text-bronze text-sm tracking-[0.5em] uppercase mb-8">
              El Proceso
            </p>
            <h1 className="hero-reveal font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-lightgray leading-[1.05] mb-8">
              Proceso de Ingeniería
              <br />
              <span className="text-bronze italic">Crediticia</span>
            </h1>
            <p className="hero-reveal font-body text-lightgray/55 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Un sistema de tres fases y un protocolo de iteración —
              sistemático, predecible y construido para transformar cada balance
              en una estructura de equilibrio sostenible.
            </p>
            <div className="hero-reveal mt-16 flex flex-col items-center gap-2">
              <span className="text-lightgray/30 text-xs tracking-widest uppercase font-body">
                Explorar el Modelo
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-bronze/60 to-transparent" />
            </div>
          </div>
        </section>

        <ModeloProceso />

       <section className="relative py-24 md:py-32 bg-lightgray overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 md:px-12">
    <div className="text-center mb-2 md:mb-4">
      <p className="font-body text-bronze text-xs tracking-[0.5em] uppercase mb-4">
        Arquitectura del Modelo
      </p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight max-w-3xl mx-auto">
        Tres fases. Un protocolo de
        <span className="text-bronze italic"> iteración</span>.
      </h2>
      <p className="font-body text-navy/50 text-base md:text-lg leading-relaxed mt-8 max-w-2xl mx-auto">
        Cada nodo representa un punto de evaluación estructural.
        El núcleo bronce — Itera — es el filtro de solvencia.
      </p>
    </div>

    {/* Komponen Baru */}
    <ProcessDiagramSVG />
  </div>
</section>

        <ProcessCTASection />
      </div>
    </PageTransition>
  )
}
