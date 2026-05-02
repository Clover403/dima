import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const phases = [
  {
    num: '01',
    title: 'Diagnóstico e Ideación',
    subtitle: 'Fase de Identificación',
    nodes: [
      {
        title: 'Diagnóstico',
        desc: 'Revisión integral del perfil corporativo. Análisis de la situación financiera actual, requerimientos de capital y viabilidad estructural preliminar.'
      },
      {
        title: 'Alineación',
        desc: 'Determinación del producto financiero preliminar y sus componentes estructurales base. Sincronización de expectativas entre las partes.'
      },
      {
        title: 'Sincronización',
        desc: 'Intercambio de métricas clave: avalúos, tasas, plazos y garantías. Establecimiento de reglas de gobernanza y marcos de referencia.'
      }
    ]
  },
  {
    num: '02',
    title: 'Due Diligence y Riesgos',
    subtitle: 'Reingeniería de Riesgos',
    nodes: [
      {
        title: 'Recopilación y Validación',
        desc: 'Due diligence multidisciplinario: legal, fiscal, contable y financiero. Evaluación profunda con el modelo macroeconómico DIMA.'
      },
      {
        title: 'Evaluación',
        desc: 'Análisis de integridad reputacional, buró de crédito y solvencia estructural. Determinación de viabilidad de base y condiciones de intervención.'
      },
      {
        title: 'ITERAR',
        desc: 'Protocolo de reconfiguración estratégica. Intervención activa para transformar el balance corporativo hasta alcanzar la solvencia y estructura óptima requerida.',
        isIterate: true
      }
    ]
  },
  {
    num: '03',
    title: 'Modelado y Despliegue',
    subtitle: 'Implementación y Escalabilidad',
    nodes: [
      {
        title: 'Integración',
        desc: 'Ingeniería financiera absoluta. Definición de variables crediticias y sincronización de la amortización con el flujo de caja libre operativo.'
      },
      {
        title: 'Formalización',
        desc: 'Estructuración jurídica integral. Constitución de garantías, fideicomisos y blindaje contractual dentro de un marco legal robusto.'
      },
      {
        title: 'Dispersión',
        desc: 'Inyección de liquidez como anticipo estratégico del gasto. Desembolso productivo diseñado para maximizar el rendimiento del capital desde el primer día.'
      }
    ]
  },
  {
    num: '04',
    title: 'Gobernanza y Escalabilidad',
    subtitle: 'Consolidación Institucional',
    nodes: [
      {
        title: 'Gobernanza y Escalabilidad',
        desc: 'Establecimiento de métricas de control, políticas de capital y comités internos. Profesionalización de la toma de decisiones financieras a largo plazo.'
      },
      {
        title: 'Disciplina de Capital',
        desc: 'Implementación de reglas estructurales para la asignación eficiente del capital. Creación de políticas de dividendos y reinversión alineadas al ciclo económico.'
      },
      {
        title: 'Sucesión Financiera',
        desc: 'Diseño de continuidad institucional. Transferencia ordenada de conocimiento financiero y estructuras de gobierno para garantizar la sostenibilidad del modelo.'
      }
    ]
  }
]

// ─── Intro Title SVG ──────────────────────────────────────────────────────────
function IntroTitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 275"
      preserveAspectRatio="xMinYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible', opacity: 0 }}
    >
      <text x="0" y="130" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="130" fontWeight="400" fill="none" stroke="#030035" strokeWidth="1" data-stroke-line="0">The Process</text>
      <text x="0" y="130" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="normal" fontSize="130" fontWeight="400" fill="#030035" fillOpacity="0" data-fill-line="0">The Process</text>
      <text x="0" y="243" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="130" fontWeight="400" fill="none" stroke="#E5997B" strokeWidth="1" data-stroke-line="1">Architecture.</text>
      <text x="0" y="243" textAnchor="start" fontFamily="'Playfair Display', serif" fontStyle="italic" fontSize="130" fontWeight="400" fill="#E5997B" fillOpacity="0" data-fill-line="1">Architecture.</text>
    </svg>
  )
}

// ─── Final Title SVG ──────────────────────────────────────────────────────────
function FinalTitleSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 900 228"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      style={{ overflow: 'visible', opacity: 0 }}
    >
      <text
        x="450" y="105"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontStyle="normal"
        fontSize="115"
        fontWeight="400"
        fill="none"
        stroke="#030035"
        strokeWidth="1"
        data-stroke-line="0"
      >Ready to</text>
      <text
        x="450" y="105"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontStyle="normal"
        fontSize="115"
        fontWeight="400"
        fill="#030035"
        fillOpacity="0"
        data-fill-line="0"
      >Ready to</text>
      <text
        x="450" y="215"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontStyle="italic"
        fontSize="145"
        fontWeight="400"
        fill="none"
        stroke="#E5997B"
        strokeWidth="1"
        data-stroke-line="1"
      >Execute?</text>
      <text
        x="450" y="215"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontStyle="italic"
        fontSize="145"
        fontWeight="400"
        fill="#E5997B"
        fillOpacity="0"
        data-fill-line="1"
      >Execute?</text>
    </svg>
  )
}

// ─── Helper: stroke timeline ──────────────────────────────────────────────────
function buildStrokeTl(svg: SVGSVGElement) {
  const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
  const fillLines   = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))

  const lengths = strokeLines.map((line) => {
    let len = line.getComputedTextLength()
    if (!len || len < 10) len = 800
    line.style.strokeDasharray  = `${len}`
    line.style.strokeDashoffset = `${len}`
    return len
  })

  gsap.set(strokeLines, { strokeDashoffset: (i) => lengths[i] })
  gsap.set(fillLines,   { fillOpacity: 0 })
  gsap.set(svg,         { opacity: 1 })

  const tl = gsap.timeline({ paused: true })
  tl
    .to(strokeLines, { strokeDashoffset: 0,  duration: 1.6, stagger: 0.2,  ease: 'power2.inOut' }, 0)
    .to(fillLines,   { fillOpacity: 1,        duration: 0.8, stagger: 0.1,  ease: 'power2.out'   }, 1.2)
    .to(strokeLines, { opacity: 0,            duration: 0.6, stagger: 0.06, ease: 'power1.in'    }, 1.7)

  return tl
}

// ─── 3D Process Card ──────────────────────────────────────────────────────────
function ProcessCard({
  node,
  index,
}: {
  node: { title: string; desc: string; isIterate?: boolean }
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !glowRef.current) return

    const rect    = cardRef.current.getBoundingClientRect()
    const x       = e.clientX - rect.left
    const y       = e.clientY - rect.top

    const nx = (x / rect.width  - 0.5) * 2
    const ny = (y / rect.height - 0.5) * 2

    const edgeX = Math.sign(nx) * Math.pow(Math.abs(nx), 2.2)
    const edgeY = Math.sign(ny) * Math.pow(Math.abs(ny), 2.2)

    const MAX_DEG = 14
    const rotateY =  edgeX * MAX_DEG
    const rotateX = -edgeY * MAX_DEG

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1 - Math.max(Math.abs(edgeX), Math.abs(edgeY)) * 0.018,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 900,
    })

    gsap.to(glowRef.current, {
      opacity: 1,
      x: x - 250,
      y: y - 250,
      duration: 0.2,
      ease: 'none',
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.85,
      ease: 'elastic.out(1, 0.45)',
    })

    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.45,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`process-card group relative w-[420px] h-[480px] p-12 flex flex-col justify-between
        rounded-[2.5rem] border-2 overflow-hidden
        transition-[border-color,box-shadow,background-color] duration-700
        hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)]
        ${node.isIterate
          ? 'bg-bronze/[0.04] border-bronze/30 hover:bg-[#FFFAF8]/95 hover:border-bronze'
          : 'bg-white/10 border-navy/5 hover:bg-white/95 hover:border-bronze/40'
        }`}
      style={{
        backdropFilter: 'blur(16px)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <div
        ref={glowRef}
        className="absolute pointer-events-none opacity-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(229,153,123,0.18) 0%, transparent 65%)',
          filter: 'blur(45px)',
          zIndex: 0,
        }}
      />

      <div className="absolute top-0 right-0 w-40 h-40 bg-bronze/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div
        className="relative z-10 flex justify-between items-center"
        style={{ transform: 'translateZ(30px)' }}
      >
        <span className="font-display text-lg text-bronze/40 font-bold italic group-hover:text-bronze transition-all duration-500">
          Step 0{index + 1}
        </span>
        {node.isIterate && (
          <div className="px-4 py-1 bg-bronze text-white text-[9px] font-black uppercase tracking-tighter rounded-full shadow-lg shadow-bronze/30">
            Critical Loop
          </div>
        )}
      </div>

      <div
        className="relative z-10"
        style={{ transform: 'translateZ(55px)' }}
      >
        <h4
          className={`font-display text-4xl leading-[1.1] mb-8 transition-all duration-700
            group-hover:-translate-y-4
            ${node.isIterate ? 'text-bronze' : 'text-navy/80 group-hover:text-navy'}`}
        >
          {node.title}
        </h4>

        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]">
          <div className="overflow-hidden">
            <p className="font-body text-navy/60 text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
              {node.desc}
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 transition-all duration-500">
          <div className="h-[2px] bg-bronze w-10 group-hover:w-20 transition-all duration-700 ease-in-out" />
          <span className="text-bronze font-body text-[10px] tracking-[0.3em] uppercase font-black opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
            Explore Insight
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UltimateHorizontalProcess() {
  const containerRef    = useRef<HTMLDivElement>(null)
  const sliderRef       = useRef<HTMLDivElement>(null)
  const introSvgRef     = useRef<SVGSVGElement>(null)
  const finalSvgRef     = useRef<SVGSVGElement>(null)
  const finalSectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (sliderRef.current) gsap.set(sliderRef.current, { x: 0 })
  }, [])

  useEffect(() => {
    if (!containerRef.current || !sliderRef.current) return

    const totalWidth = sliderRef.current.scrollWidth - window.innerWidth
    const dissolveContainer = containerRef.current.closest('[data-dissolve-container="true"]') ?? undefined

    const ctx = gsap.context(() => {

      const horizontalTween = gsap.to(sliderRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pinnedContainer: dissolveContainer,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      })

      gsap.utils.toArray('.process-card').forEach((card: any) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left 98%',
            toggleActions: 'play none none reverse'
          }
        })
      })

      if (introSvgRef.current) {
        const introTl = buildStrokeTl(introSvgRef.current)
        ScrollTrigger.create({
          trigger:     containerRef.current,
          start:       'top 85%',
          onEnter:     () => introTl.play(),
          onLeaveBack: () => introTl.reverse(),
        })
      }

      if (finalSvgRef.current && finalSectionRef.current) {
        const finalTl = buildStrokeTl(finalSvgRef.current)
        ScrollTrigger.create({
          trigger:            finalSectionRef.current,
          containerAnimation: horizontalTween,
          start:              'left 80%',
          onEnter:            () => finalTl.play(),
          onLeaveBack:        () => finalTl.reverse(),
        })
      }

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div ref={containerRef} className="bg-white overflow-hidden relative">

        <div className="fixed top-0 left-0 w-full h-1 bg-gray-50 z-50">
          <div className="progress-fill h-full bg-bronze origin-left scale-x-0" />
        </div>

        <div ref={sliderRef} className="flex h-screen w-max items-center relative z-10">

          {/* ══ INTRO SLIDE ══════════════════════════════════════════════════ */}
          <section className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 border-r border-gray-100 bg-white relative z-20">
            <div className="max-w-[90%]">
              <span className="text-bronze font-body text-[12px] md:text-[14px] tracking-[0.6em] uppercase font-black mb-8 block">
                Metodología de Élite
              </span>
              <div className="mb-16 w-full">
                <IntroTitleSVG svgRef={introSvgRef} />
              </div>
              <div className="flex items-center gap-8">
                <div className="w-32 h-[2px] bg-bronze" />
                <p className="text-navy/40 font-body text-lg uppercase tracking-widest font-bold italic">
                  Scroll to navigate the framework
                </p>
              </div>
            </div>
          </section>

          {/* ══ PHASE SLIDES ═════════════════════════════════════════════════ */}
          {phases.map((phase) => (
            <section
              key={phase.num}
              className="h-full flex flex-col justify-center px-32 md:px-56 border-r border-gray-100 bg-white relative overflow-hidden"
            >
              <div className="absolute bottom-[8%] left-0 w-full overflow-hidden opacity-[0.045] select-none pointer-events-none z-0">
                <div
                  style={{
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    animation: 'marqueeScroll 35s linear infinite',
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <span className="font-display text-[17vw] leading-none uppercase pr-40 text-navy flex-shrink-0">
                    Dima Finance • Methodology • Architecture • Excellence •
                  </span>
                  <span className="font-display text-[17vw] leading-none uppercase pr-40 text-navy flex-shrink-0">
                    Dima Finance • Methodology • Architecture • Excellence •
                  </span>
                </div>
              </div>

              <div className="absolute top-[12%] left-32 z-10">
                <div className="flex items-end gap-6 mb-4">
                  <span className="font-display text-[130px] text-navy/[0.04] leading-[0.7] select-none">
                    {phase.num}
                  </span>
                  <div className="mb-4">
                    <h3 className="font-display text-5xl md:text-7xl text-navy leading-none mb-3">
                      {phase.title}
                    </h3>
                    <p className="text-bronze font-body text-xs tracking-[0.5em] uppercase font-black">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-12 mt-24 z-10 relative">
                {phase.nodes.map((node, i) => (
                  <ProcessCard key={i} node={node} index={i} />
                ))}
              </div>
            </section>
          ))}

          {/* ══ FINAL SLIDE ══════════════════════════════════════════════════ */}
          <section
            ref={finalSectionRef}
            className="w-[100vw] h-full flex items-center justify-center bg-lightgray relative z-20"
          >
            <div className="text-center px-10">
              <span className="text-bronze font-body text-sm tracking-[0.8em] uppercase font-black mb-8 block">
                Conclusion
              </span>
              {/* SATU-SATUNYA PERUBAHAN dari original: max-w-3xl → w-[60vw] */}
              <div className="mb-14 w-[60vw] mx-auto">
                <FinalTitleSVG svgRef={finalSvgRef} />
              </div>
              <button className="group relative px-20 py-8 bg-navy text-white font-body text-xs tracking-[0.6em] uppercase overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(3,0,53,0.2)]">
                <span className="relative z-10">Solicitar Diagnóstico</span>
                <div className="absolute inset-0 bg-bronze translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}