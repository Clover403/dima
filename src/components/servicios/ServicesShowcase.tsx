import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// ─── CDN SCRIPT LOADER ────────────────────────────────────────────────────────
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROTAGONIST = {
  eyebrow: 'Servicio Núcleo',
  title: ['CORREDURÍA', 'FINANCIERA'],
  description:
    'Ejecutamos operaciones de intermediación financiera con una ventaja estructural única: nuestro modelo macroeconómico — fundamentado en los principios de Ray Dalio — nos permite leer el ciclo económico antes de actuar. No somos un banco. Somos arquitectos de equilibrio.',
  model:
    'El Modelo Ray Dalio nos permite anticipar la posición de la economía en su ciclo de deuda a largo plazo y en el ciclo de productividad. Esa lectura es el cimiento de cada operación que ejecutamos.',
  tagline: 'Todo nace de aquí.',
}

const DERIVATIVES = [
  {
    id: '01',
    name: 'Reingeniería de Deuda',
    short: 'Estructura óptima de capital',
    description:
      'Rediseñamos la arquitectura de deuda corporativa para sincronizarla con los ciclos macroeconómicos actuales. No se trata solo de refinanciar — se trata de posicionar estratégicamente cada instrumento en el momento correcto del ciclo.',
    connection:
      'Nuestra capacidad de reestructurar deuda con precisión nace directamente del modelo macroeconómico que empleamos en correduría: entendemos cuándo los ciclos favorecen la renegociación y cuándo representan riesgo sistémico.',
    deliverables: [
      'Diagnóstico de estructura de deuda actual',
      'Modelado de escenarios de refinanciamiento',
      'Negociación estratégica con contraparte',
    ],
  },
  {
    id: '02',
    name: 'Estrategia Financiera Cíclica',
    short: 'Anticipación de ciclos económicos',
    description:
      'Diseñamos estrategias financieras que anticipan los movimientos del ciclo económico. La diferencia entre rentabilidad y pérdida está en la anticipación — no en la reacción. Cada decisión se calibra contra el estado actual del ciclo.',
    connection:
      'La anticipación de ciclos es el núcleo operativo de nuestra correduría. Esta capacidad analítica se extiende naturalmente al asesoramiento estratégico de cada cliente que lo necesite.',
    deliverables: [
      'Análisis de posición en el ciclo actual',
      'Estrategia de asignación de capital',
      'Monitoreo y ajuste continuo',
    ],
  },
  {
    id: '03',
    name: 'Tesorería Avanzada',
    short: 'Maximización de liquidez operativa',
    description:
      'Optimizamos la gestión de tesorería empresarial integrando visión macroeconómica con las necesidades operativas específicas de cada organización. Liquidez inteligente, no solo disponible.',
    connection:
      'La visibilidad que tenemos sobre flujos de mercado como corredores nos permite diseñar estructuras de tesorería que el análisis interno puro no puede alcanzar. Conocemos el ciclo desde adentro.',
    deliverables: [
      'Diagnóstico de flujos de caja',
      'Optimización de posiciones de liquidez',
      'Estructura de inversión de excedentes',
    ],
  },
  {
    id: '04',
    name: 'Valuación Estratégica',
    short: 'Determinación del valor real',
    description:
      'Determinamos el valor real de activos, empresas e instrumentos financieros con metodologías que integran contexto macroeconómico y ciclo de mercado. El valor no es estático — depende del momento del ciclo.',
    connection:
      'Valuar correctamente requiere entender el ciclo en el que se encuentra el activo. Nuestra posición como corredores nos da acceso a información de mercado que enriquece cada valuación más allá del análisis de escritorio.',
    deliverables: [
      'Valuación de empresas y activos financieros',
      'Due diligence de valor',
      'Informes para decisiones de inversión',
    ],
  },
  {
    id: '05',
    name: 'Gobernanza Financiera',
    short: 'Institucionalización de decisiones',
    description:
      'Diseñamos estructuras de gobernanza que institucionalizan la toma de decisiones financieras y crean organizaciones financieramente resilientes. La disciplina analítica como cultura, no solo como consultoría.',
    connection:
      'La gobernanza que diseñamos incorpora los principios macroeconómicos de nuestra correduría, trasladando esa disciplina al ADN de la organización. No enseñamos metodología — instalamos mentalidad.',
    deliverables: [
      'Diseño de comités financieros',
      'Políticas y procedimientos financieros',
      'Implementación de KPIs estratégicos',
    ],
  },
]

// ─── Componente Icono ─────────────────────────────────────────────────────────
function DiamondIcon({ size = 16, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={{ width: size, height: size, flexShrink: 0 }} aria-hidden>
      <path d="M10 1L19 10L10 19L1 10Z" stroke="#030035" strokeWidth="1.5" opacity={opacity} />
    </svg>
  )
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function ServicesShowcase(_props?: { services?: any }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(0)
  // Note: component uses internal DERIVATIVES data, param is accepted for page compatibility

  // ── Setup Vanta Globe Full Background ───────────────────────────────────
  useEffect(() => {
    let mounted = true
    let attempts = 0
    let effect: any = null

    async function initVanta() {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js')

        const checkVanta = () => {
          if (!mounted) return
          attempts++
          if ((window as any).VANTA?.GLOBE && vantaRef.current) {
            effect = (window as any).VANTA.GLOBE({
              el: vantaRef.current,
              THREE: (window as any).THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0x030035,
              color2: 0xe5997b,
              size: 1.30,
              backgroundColor: 0xf5f5f5 
            })
          } else if (attempts < 50) {
            setTimeout(checkVanta, 100)
          }
        }
        checkVanta()
      } catch (error) {
        console.warn('Vanta failed to load:', error)
      }
    }

    initVanta()

    return () => {
      mounted = false
      if (effect) effect.destroy()
    }
  }, [])

  // ── Setup Animasi ScrollTrigger (Sticky & Transisi) ─────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
        },
      })

      tl.to('.protagonist-content', { opacity: 0, y: -50, scale: 0.98, duration: 1 })
        .to('.vanta-bg', { opacity: 0, duration: 1 }, '<')
        .fromTo(
          '.derivatives-section',
          { opacity: 0, y: 50, pointerEvents: 'none' },
          { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1 },
          '<0.2'
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.prot-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      id="servicios" 
      className="relative h-screen w-full overflow-hidden bg-[#F5F5F5]"
    >
      <div className="vanta-bg absolute inset-0 z-0 w-full h-full" ref={vantaRef} />

      {/* ════════════════════════════════════════════════════
          BAGIAN 1: PROTAGONISTA 
          (Dipindah ke kiri sejajar dengan padding Services)
      ════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-10 flex items-center w-full h-full pointer-events-none">
        {/* Diganti menjadi justify-start agar sejajar kiri */}
        <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20 flex justify-start pointer-events-auto">
          <div className="w-full lg:w-[65%] xl:w-[55%] protagonist-content">
            
            <div className="prot-anim flex items-center gap-5 mb-8">
              <DiamondIcon size={24} opacity={1} />
              <span className="font-body text-[#030035] uppercase tracking-[0.5em] text-sm md:text-base lg:text-lg font-bold">
                {PROTAGONIST.eyebrow}
              </span>
              <div className="flex-1 h-px max-w-[150px]" style={{ background: 'rgba(3,0,53,0.3)' }} />
            </div>

            <h2 className="prot-anim mb-8 font-display text-[#030035] leading-[0.95] text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight">
              {PROTAGONIST.title[0]}
              <br />
              <em className="italic text-[#E5997B]">
                {PROTAGONIST.title[1]}
              </em>
            </h2>

            <p className="prot-anim font-body mb-10 text-[#030035]/80 uppercase tracking-[0.4em] text-sm md:text-base lg:text-lg font-bold">
              {PROTAGONIST.tagline}
            </p>

            <p className="prot-anim font-body mb-12 leading-relaxed text-[#030035]/80 text-xl md:text-2xl lg:text-[1.75rem]">
              {PROTAGONIST.description}
            </p>

            <div className="prot-anim relative pl-8 mb-12 border-l-4 border-[#030035]/20">
              <p className="font-body italic leading-relaxed text-[#030035]/70 text-lg md:text-xl lg:text-2xl">
                "{PROTAGONIST.model}"
              </p>
            </div>
            
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="protagonist-content absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-auto"
        >
          <span className="font-body uppercase text-[#030035]/60 text-xs md:text-sm tracking-[0.5em] font-extrabold">Scroll</span>
          <div className="w-px h-20 bg-gradient-to-b from-[#030035]/40 to-transparent" />
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════
          BAGIAN 2: SERVICIOS DERIVADOS 
      ════════════════════════════════════════════════════ */}
      <div className="derivatives-section absolute inset-0 z-20 flex items-center w-full h-full pt-10">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="w-full">

            <div className="mb-12 lg:mb-16">
              <div className="flex items-center gap-5 mb-6">
                <DiamondIcon size={24} opacity={1} />
                <span className="font-body text-[#030035] uppercase text-sm md:text-base lg:text-lg font-bold tracking-[0.5em]">
                  Capacidades Derivadas
                </span>
              </div>
              <h3 className="font-display text-[#030035] leading-[0.95] text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight">
                Servicios que nacen de
                <br />
                <em className="italic text-[#E5997B]">nuestro núcleo</em>
              </h3>
            </div>

            {/* Navigasi Tab (Ukuran font diperkecil) */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 border-b border-[#030035]/10 pb-2" role="tablist">
              {DERIVATIVES.map((svc, i) => (
                <button
                  key={svc.id}
                  role="tab"
                  onClick={() => setSelected(i)}
                  className="relative group text-left py-3 transition-colors duration-300 focus:outline-none"
                  style={{ color: selected === i ? '#030035' : 'rgba(3,0,53,0.4)' }}
                >
                  {/* Nomor diperkecil */}
                  <span className="font-body block mb-2 text-xs md:text-sm font-bold tracking-[0.3em] uppercase"
                    style={{ color: selected === i ? '#E5997B' : undefined }}>
                    {svc.id}
                  </span>
                  {/* Nama Tab diperkecil menyesuaikan dengan list image */}
                  <span className="font-display block text-lg md:text-xl lg:text-2xl font-semibold">
                    {svc.name}
                  </span>
                  <motion.div
                    className="absolute bottom-[-9px] left-0 h-[2px] bg-[#E5997B]"
                    initial={false}
                    animate={{ width: selected === i ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>

            <div className="relative min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="pt-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
                    <div className="lg:col-span-8">
                      <p className="font-body text-[#030035] uppercase mb-6 text-sm md:text-base lg:text-lg font-bold tracking-[0.3em]">
                        {DERIVATIVES[selected].short}
                      </p>
                      <p className="font-body leading-relaxed text-[#030035]/80 text-xl md:text-2xl lg:text-[1.75rem] mb-10">
                        {DERIVATIVES[selected].description}
                      </p>
                      
                      <div className="space-y-6">
                        {DERIVATIVES[selected].deliverables.map((d, idx) => (
                          <motion.div
                            key={d}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.3 }}
                            className="flex items-center gap-5"
                          >
                            <DiamondIcon size={16} opacity={0.8} />
                            <span className="font-body text-lg md:text-xl lg:text-2xl text-[#030035] font-semibold">
                              {d}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 lg:pl-12 xl:pl-16 lg:border-l-2 border-[#030035]/10 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-8">
                        <DiamondIcon size={18} opacity={1} />
                        <span className="font-body uppercase text-[#030035] text-sm md:text-base lg:text-lg font-bold tracking-widest">
                          Por qué es posible
                        </span>
                      </div>
                      <p className="font-body italic leading-relaxed text-[#030035]/70 text-lg md:text-xl lg:text-2xl mb-12">
                        {DERIVATIVES[selected].connection}
                      </p>

                      <div className="flex items-center gap-6 pt-8 border-t-2 border-[#030035]/10">
                        <div className="w-16 h-16 flex items-center justify-center border-2 border-[#030035]/30 rounded-md">
                          <svg viewBox="0 0 20 20" fill="none" style={{ width: 24, height: 24 }}>
                            <path d="M10 2L18 10L10 18L2 10Z" stroke="#030035" strokeWidth="1.5" />
                            <circle cx="10" cy="10" r="3" fill="#030035" opacity="0.8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-body uppercase mb-2 text-[#030035]/60 text-xs md:text-sm font-bold tracking-widest">
                            Habilitado por
                          </p>
                          <p className="font-display text-[#030035] text-xl md:text-2xl font-bold">
                            Correduría Financiera
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}