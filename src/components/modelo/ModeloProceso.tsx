import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

/* ─── Phase / Node Data ─── */
interface ProcessNode {
  id: string
  title: string
  description: string
  isIterate?: boolean
}

interface Phase {
  num: string
  title: string
  accent: string
  nodes: ProcessNode[]
}

const phases: Phase[] = [
  {
    num: '01',
    title: 'Diagnóstico e Ideación Estructural',
    accent: 'border-bronze/40',
    nodes: [
      {
        id: 'n1',
        title: 'Diagnóstico Estructural de Prospección',
        description:
          'Revisión integral del perfil corporativo y requerimientos de la entidad. Se analiza escalabilidad, contexto y mapeo preliminar para alinear necesidades con factibilidad técnica inicial.',
      },
      {
        id: 'n2',
        title: 'Diseño de Vehículo Financiero',
        description:
          'Se determina el producto financiero preliminar y sus componentes estructurales con base en la evaluación del primer nodo.',
      },
      {
        id: 'n3',
        title: 'Sincronización de Condiciones Técnicas',
        description:
          'Intercambio directo de métricas detalladas: avalúos fiduciarios, tasas, plazos y garantías. Se establecen reglas de gobernanza antes de proceder con el análisis de riesgo.',
      },
    ],
  },
  {
    num: '02',
    title: 'Due Diligence y Reingeniería de Riesgo',
    accent: 'border-bronze',
    nodes: [
      {
        id: 'n4',
        title: 'Ejecución de Filtros Excluyentes',
        description:
          'Evaluación crítica de criterios de exclusión. Se realizan validaciones de integridad reputacional y buró de crédito para determinar la viabilidad de la base, bloqueando el avance ante factores de riesgo sistémico insuperables.',
      },
      {
        id: 'n5',
        title: 'Integración y Evaluación Macroeconómica',
        description:
          'Recopilación integral de información y documentación para due diligence multidisciplinario (legal, fiscal, contable y financiero) y aplicación del modelo de ingeniería económica financiera.',
      },
      {
        id: 'iterate',
        title: 'Protocolo de Reconfiguración y Alineación',
        description:
          'Mecanismo de ajuste técnico para entidades con indicadores de solvencia subóptimos. No representa un rechazo, sino una Intervención Estratégica. DIMA ejecuta una transformación del balance y estructura hasta que la entidad alcanza la solvencia y resiliencia operativa necesaria.',
        isIterate: true,
      },
    ],
  },
  {
    num: '03',
    title: 'Modelación, Despliegue y Escalabilidad',
    accent: 'border-bronze/60',
    nodes: [
      {
        id: 'n6',
        title: 'Ingeniería Financiera Absoluta',
        description:
          'Definición precisa de variables crediticias. El calendario de amortización se cruza con estados financieros proyectados, sincronizando matemáticamente el servicio de deuda con la generación sostenida de flujo de caja libre.',
      },
      {
        id: 'n7',
        title: 'Formalización y Protección Fiduciaria',
        description:
          'Estructuración jurídica integral de la operación. Se establecen las garantías y fideicomisos requeridos, creando un marco legal robusto.',
      },
      {
        id: 'n8',
        title: 'Desembolso de Capital Productivo',
        description:
          'Despliegue técnico de recursos financieros. La inyección de liquidez se ejecuta como anticipo estratégico del gasto.',
      },
      {
        id: 'n9',
        title: 'Gobernanza y Consultoría de Ciclo',
        description:
          'Monitoreo post-otorgamiento del cumplimiento de covenants y eficiencia del capital. Se asegura que la deuda incremente la productividad marginal y fortalezca la resiliencia sistémica del negocio.',
      },
    ],
  },
]

/* ─── Node Component (Desktop: hover-to-reveal, Mobile: tap-to-expand) ─── */
function NodeCard({ node, phaseAccent }: { node: ProcessNode; phaseAccent: string }) {
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const isOpen = hovered || tapped

  return (
    <div
      className={`relative group ${node.isIterate ? 'col-span-full' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setTapped(!tapped)}
    >
      <div
        className={`relative p-6 border-l-2 ${
          node.isIterate
            ? 'border-bronze bg-bronze/10'
            : phaseAccent + ' bg-white/70'
        } transition-all duration-500 cursor-pointer ${
          isOpen ? '!bg-white' : ''
        }`}
      >
        {/* Iterate badge */}
        {node.isIterate && (
          <div className="flex items-center gap-2 mb-3">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3v4l3 2"
                stroke="#E5997B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-bronze font-body text-xs tracking-widest uppercase">
              Iteración Estratégica
            </span>
          </div>
        )}

        {/* Title */}
        <h4 className={`font-display text-lg md:text-xl leading-snug transition-colors duration-300 ${
          node.isIterate ? 'text-bronze' : 'text-navy/80 group-hover:text-bronze'
        }`}>
          {node.title}
        </h4>

        {/* Expand indicator */}
        <div className={`mt-3 flex items-center gap-2 transition-opacity duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-60'
        }`}>
          <div className="w-4 h-px bg-bronze" />
          <span className="text-bronze font-body text-xs">Ver más</span>
        </div>

        {/* Description — animate in on hover/tap */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="overflow-hidden"
            >
              <p className="font-body text-navy/55 text-sm leading-relaxed mt-4 pr-4">
                {node.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Flow Path SVG ─── */
function FlowPath() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current) return
    const length = pathRef.current.getTotalLength()
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })
  }, [])

  return (
    <svg className="flow-svg absolute inset-0 w-full h-full pointer-events-none hidden lg:block" preserveAspectRatio="none">
      <path
        ref={pathRef}
        className="flow-path"
        d="M50,0 L50,33 L50,66 L50,100"
        stroke="#E5997B"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* ─── Main Component ─── */
export default function ModeloProceso() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Header reveal */
      gsap.fromTo(
        el.querySelectorAll('.section-head'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: el, start: 'top 75%' },
        }
      )

      /* Phase blocks stagger in */
      const phaseBlocks = el.querySelectorAll('.phase-block')
      phaseBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 80%' },
          }
        )
      })

      /* Flow path draw */
      const flowPath = el.querySelector('.flow-path') as SVGPathElement | null
      if (flowPath) {
        gsap.to(flowPath, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el.querySelector('.phases-container'),
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-cream py-32 md:py-48 section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <p className="section-head text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
            Proceso Crediticio
          </p>
          <h2 className="section-head font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-tight">
            De la visión
            <br />
            <span className="text-bronze italic">a la estructura</span>
          </h2>
          <p className="section-head font-body text-navy/50 text-lg leading-relaxed max-w-3xl mx-auto mt-8">
            Nuestro proceso integral de otorgamiento crediticio fusiona la comprensión
            macroeconómica de Ray Dalio con la práctica crediticia, a través de tres
            fases iterativas de diagnóstico, ingeniería y despliegue.
          </p>
        </div>

        {/* Phases */}
        <div className="phases-container relative">
          {/* Vertical flow line — desktop */}
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px">
            <FlowPath />
          </div>

          <div className="space-y-16 md:space-y-24">
            {phases.map((phase) => (
              <div key={phase.num} className="phase-block relative lg:pl-20">
                {/* Phase dot on flow line */}
                <div className="hidden lg:block absolute left-[29px] top-2 w-3 h-3 rounded-full border-2 border-bronze bg-cream z-10" />

                {/* Phase header */}
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-bronze/30 font-display text-5xl md:text-6xl leading-none select-none">
                    {phase.num}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl text-navy leading-tight">
                      {phase.title}
                    </h3>
                    {phase.num === '02' && (
                      <p className="font-body text-bronze text-xs tracking-widest uppercase mt-2">
                        El corazón del proceso
                      </p>
                    )}
                  </div>
                </div>

                {/* Nodes grid */}
                <div className={`grid gap-4 ${
                  phase.nodes.length <= 3
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}>
                  {phase.nodes.map((node) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      phaseAccent={phase.accent}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
