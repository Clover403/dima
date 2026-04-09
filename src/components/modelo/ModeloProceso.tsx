import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const phases = [
  {
    num: '01',
    title: 'Diagnóstico e Ideación',
    subtitle: 'Arquitectura Inicial',
    nodes: [
      { title: 'Diagnóstico de Prospección', desc: 'Revisión integral del perfil corporativo y requerimientos. Se analiza escalabilidad dan mapeo preliminar.' },
      { title: 'Diseño de Vehículo', desc: 'Se determina el producto financiero preliminar y sus componentes estructurales base.' },
      { title: 'Sincronización Técnica', desc: 'Intercambio de métricas: avalúos, tasas, plazos y garantías. Reglas de gobernanza.' }
    ]
  },
  {
    num: '02',
    title: 'Due Diligence y Riesgo',
    subtitle: 'El Corazón del Proceso',
    nodes: [
      { title: 'Filtros Excluyentes', desc: 'Evaluación de integridad reputacional y buró de crédito para determinar viabilidad de base.' },
      { title: 'Evaluación Macroeconómica', desc: 'Due diligence multidisciplinario (legal, fiscal, contable y financiero) con modelo DIMA.' },
      { title: 'Protocolo de Reconfiguración', desc: 'Intervención estratégica para transformar el balance hasta alcanzar la solvencia necesaria.', isIterate: true }
    ]
  },
  {
    num: '03',
    title: 'Modelación y Despliegue',
    subtitle: 'Ejecución Matemática',
    nodes: [
      { title: 'Ingeniería Financiera Absoluta', desc: 'Definición de variables crediticias. Sincronización de amortización con flujo de caja libre.' },
      { title: 'Protección Fiduciaria', desc: 'Estructuración jurídica integral. Garantías y fideicomisos en un marco legal robusto.' },
      { title: 'Desembolso Productivo', desc: 'Inyección de liquidez como anticipo estratégico del gasto para máxima productividad.' }
    ]
  }
]

export default function UltimateHorizontalProcess() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !sliderRef.current) return

    const totalWidth = sliderRef.current.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      // 1. PIN & HORIZONTAL LOGIC (Tetap Sama)
      gsap.to(sliderRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      })

      // 2. ENTRY ANIMATION (Tetap Sama)
      gsap.utils.toArray('.process-card').forEach((card: any) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.to(sliderRef.current, { x: -totalWidth, ease: 'none' }),
            start: 'left 95%',
            toggleActions: 'play none none reverse'
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="bg-white overflow-hidden">

      {/* Progress Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-50 z-50">
        <div className="progress-fill h-full bg-bronze origin-left scale-x-0" />
      </div>

      <div ref={sliderRef} className="flex h-screen w-max items-center">

        {/* ── INTRO SLIDE (Heading diperkecil sedikit) ── */}
        <section className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 border-r border-gray-100">
          <div className="max-w-[90%]">
            <span className="text-bronze font-body text-[12px] md:text-[14px] tracking-[0.6em] uppercase font-black mb-8 block">Metodología de Élite</span>
            <h2 className="font-display text-[6vw] md:text-[8.5vw] text-navy leading-[0.85] tracking-tighter mb-16">
              The Process <br />
              <span className="text-bronze italic">Architecture.</span>
            </h2>
            <div className="flex items-center gap-8">
              <div className="w-32 h-[2px] bg-bronze" />
              <p className="text-navy/40 font-body text-lg uppercase tracking-widest font-bold italic">Scroll to navigate the framework</p>
            </div>
          </div>
        </section>

        {/* ── PHASE SLIDES ── */}
        {phases.map((phase) => (
          <section key={phase.num} className="h-full flex items-center px-32 md:px-56 border-r border-gray-100 relative">

            <div className="absolute top-[12%] left-32">
              <div className="flex items-end gap-6 mb-4">
                <span className="font-display text-[150px] text-navy/[0.04] leading-[0.7] select-none">{phase.num}</span>
                <div className="mb-4">
                  <h3 className="font-display text-5xl md:text-7xl text-navy leading-none mb-3">{phase.title}</h3>
                  <p className="text-bronze font-body text-xs tracking-[0.5em] uppercase font-black">{phase.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-12 mt-24">
              {phase.nodes.map((node, i) => (
                <div
                  key={i}
                  className={`process-card group relative w-[420px] h-[520px] p-12 flex flex-col justify-between transition-all duration-700 rounded-[2.5rem] border-2 overflow-hidden
                    hover:-translate-y-4 hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.15)]
                    ${node.isIterate
                      ? 'bg-[#FFFAF8] border-bronze/20 hover:border-bronze'
                      : 'bg-white border-gray-100 hover:border-bronze/40'
                    }`}
                >
                  {/* Glass Decorative Glow on Hover */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-bronze/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                  <div className="flex justify-between items-center z-10">
                    <span className="font-display text-lg text-bronze/40 font-bold italic group-hover:text-bronze group-hover:translate-x-2 transition-all duration-500">
                      Step 0{i + 1}
                    </span>
                    {node.isIterate && (
                      <div className="px-4 py-1 bg-bronze text-white text-[9px] font-black uppercase tracking-tighter rounded-full shadow-lg shadow-bronze/30 group-hover:scale-110 transition-transform duration-500">
                        Critical Loop
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h4 className={`font-display text-4xl leading-[1.1] mb-8 transition-all duration-700 group-hover:-translate-y-4 ${node.isIterate ? 'text-bronze' : 'text-navy group-hover:text-navy'}`}>
                      {node.title}
                    </h4>

                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]">
                      <div className="overflow-hidden">
                        <p className="font-body text-navy/50 text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
                          {node.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 flex items-center gap-4 transition-all duration-500">
                      <div className="h-[2px] bg-bronze w-10 group-hover:w-20 transition-all duration-700 ease-in-out" />
                      <span className="text-bronze font-body text-[10px] tracking-[0.3em] uppercase font-black opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-700 delay-100">
                        Explore Insight
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── FINAL SLIDE (Heading diperkecil sedikit) ── */}
        <section className="w-[100vw] h-full flex items-center justify-center bg-[#FAFAFA]">
          <div className="text-center px-10">
            <span className="text-bronze font-body text-sm tracking-[0.8em] uppercase font-black mb-8 block">Conclusion</span>
            <h2 className="font-display text-[7vw] md:text-[8vw] text-navy mb-16 leading-none tracking-tighter">
              Ready to <br />
              <span className="text-bronze italic text-[8.5vw] md:text-[9.5vw]">Execute?</span>
            </h2>
            <button className="group relative px-20 py-8 bg-navy text-white font-body text-xs tracking-[0.6em] uppercase overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(3,0,53,0.2)]">
              <span className="relative z-10">Solicitar Diagnóstico</span>
              <div className="absolute inset-0 bg-bronze translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}