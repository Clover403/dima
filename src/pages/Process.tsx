import { useEffect, useRef, type ReactElement } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import ModeloProceso from '../components/modelo/ModeloProceso'
import ProcessDiagramSVG from '../components/illustrations/ProcessDiagramSVG'
import DiamondGeometricSVG from '../components/illustrations/DiamondGeometricSVG'
import BalanceScaleSVG from '../components/illustrations/BalanceScaleSVG'
import ArchitecturalColumnSVG from '../components/illustrations/ArchitecturalColumnSVG'

gsap.registerPlugin(ScrollTrigger)

type PhaseNarrative = {
  label: string
  title: string
  subtitle: string
  description: string
  Illustration: (props: { className?: string }) => ReactElement
}

const phases: PhaseNarrative[] = [
  {
    label: 'Fase 01',
    title: 'Diagnóstico e Ideación Estructural',
    subtitle: 'Empatía financiera y mapeo preliminar',
    description:
      'Partimos de una revisión integral del perfil corporativo. Analizamos escalabilidad, contexto operativo y determinamos el producto financiero preliminar. Sincronizamos condiciones técnicas con fondeadores institucionales para alinear eligibilidad con factibilidad estructural.',
    Illustration: ({ className }) => <ArchitecturalColumnSVG className={className} />,
  },
  {
    label: 'Fase 02',
    title: 'Due Diligence y Reingeniería del Riesgo',
    subtitle: 'Filtros de exclusión y evaluación macroeconómica',
    description:
      'Aplicamos filtros críticos de integridad reputacional y buró de crédito, seguidos de una due diligence multidisciplinaria integral (legal, fiscal, contable, financiera). Aplicamos el modelo de ingeniería económica derivado de Ray Dalio para determinar viabilidad estructural y solvencia.',
    Illustration: ({ className }) => <BalanceScaleSVG className={className} />,
  },
  {
    label: 'Itera',
    title: 'Protocolo de Reconfiguración y Alineación',
    subtitle: 'El filtro de solvencia — no un rechazo, una intervención',
    description:
      'Cuando la Evaluación de Causalidad Productiva indica solvencia subóptima, ejecutamos una transformación estructurada del balance hasta que la entidad alcance la solvencia y resiliencia operativa necesarias. Ninguna entidad avanza a la Fase 3 sin superar esta evaluación.',
    Illustration: ({ className }) => <DiamondGeometricSVG className={className} />,
  },
  {
    label: 'Fase 03',
    title: 'Modelado, Despliegue y Escalabilidad',
    subtitle: 'Organización documental y mapeo financiero',
    description:
      'Formalizamos el expediente crediticio auditable. Aplicamos el Modelo de Ingeniería Económica y Financiera para el mapeo integral de la genética financiera del negocio — validando solvencia y determinando el qué, cómo, cuánto, dónde y por qué de la generación de valor.',
    Illustration: ({ className }) => <ArchitecturalColumnSVG className={className} />,
  },
]

const principles = [
  'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.',
  'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tiempo perderás competitividad.',
  'Haz todo lo posible por aumentar tu productividad, porque en el largo plazo, es lo que más importa.',
]

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
          <div
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

          {/* Hero wireframe diagram */}
          <svg
            ref={heroIllusRef}
            viewBox="0 0 1000 500"
            className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            {/* Three rough nodes + iterate center */}
            <circle className="draw-path" cx="200" cy="250" r="80" stroke="#F4F4F5" strokeWidth="0.6" strokeOpacity="0.5" />
            <circle className="draw-path" cx="450" cy="250" r="80" stroke="#E5997B" strokeWidth="0.6" />
            <circle className="draw-path" cx="700" cy="250" r="80" stroke="#F4F4F5" strokeWidth="0.6" strokeOpacity="0.5" />
            <circle className="draw-path" cx="575" cy="250" r="110" stroke="#E5997B" strokeWidth="0.5" strokeOpacity="0.6" strokeDasharray="2 4" />
            <path className="draw-path" d="M280 250 L370 250" stroke="#F4F4F5" strokeOpacity="0.4" strokeWidth="0.6" />
            <path className="draw-path" d="M530 250 L620 250" stroke="#F4F4F5" strokeOpacity="0.4" strokeWidth="0.6" />
            <path className="draw-path" d="M180 200 Q 440 100 700 200" stroke="#E5997B" strokeOpacity="0.4" strokeWidth="0.5" />
            <path className="draw-path" d="M180 300 Q 440 400 700 300" stroke="#E5997B" strokeOpacity="0.4" strokeWidth="0.5" />
          </svg>

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
    <div className="text-center mb-16 md:mb-20">
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

        {/* ═══════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-navy overflow-hidden border-t border-lightgray/5">
          <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
            <h2 className="cta-reveal font-display text-3xl md:text-4xl lg:text-5xl text-lightgray leading-tight mb-6">
              ¿Listo para estructurar
              <span className="text-bronze italic"> su crecimiento?</span>
            </h2>
            <p className="cta-reveal font-body text-lightgray/55 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Iniciemos con un diagnóstico estructural. Cada conversación es el
              primer nodo del proceso.
            </p>
            <div className="cta-reveal flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contacto" className="btn-bronze-fill">
                Agendar Consulta
              </Link>
              <Link to="/productos" className="btn-bronze">
                Ver Productos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
