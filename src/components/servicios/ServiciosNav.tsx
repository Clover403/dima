import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/* ─── Service-specific SVG icons ─── */
function IconCore({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-700 ${isActive ? 'text-[#030035]' : 'text-[#F4F4F5]'}`}>
      <path d="M32 2L62 32L32 62L2 32Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="8" fill={isActive ? '#E5997B' : '#030035'} />
      <path d="M20 32H44M32 20V44" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function Icon01({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-700 ${isActive ? 'text-[#030035]' : 'text-[#F4F4F5]'}`}>
      <path d="M18 32C18 22 26 14 36 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M46 32C46 42 38 50 28 50" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 9L36 14L32 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 55L28 50L32 45" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 27L37 32L32 37L27 32Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function Icon02({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-700 ${isActive ? 'text-[#030035]' : 'text-[#F4F4F5]'}`}>
      <path d="M8 32C14 32 16 18 22 18S30 46 36 46 44 18 50 18S56 32 56 32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="50" x2="56" y2="50" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx="56" cy="18" r="2.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function Icon03({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-700 ${isActive ? 'text-[#030035]' : 'text-[#F4F4F5]'}`}>
      <path d="M32 10L54 32L32 54L10 32Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M22 32L42 32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M36 26L42 32L36 38" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

function Icon04({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-700 ${isActive ? 'text-[#030035]' : 'text-[#F4F4F5]'}`}>
      <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="52" x2="44" y2="52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="14" y2="30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="50" y2="30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 30L14 36H18L14 30Z" stroke="currentColor" strokeWidth="1" />
      <path d="M46 30L50 36H54L50 30Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="32" cy="14" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function Icon05({ isActive }: { isActive: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-700 ${isActive ? 'text-[#030035]' : 'text-[#F4F4F5]'}`}>
      <rect x="10" y="36" width="44" height="16" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="22" y="24" width="20" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <line x1="32" y1="12" x2="32" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="10" r="3" stroke="currentColor" strokeWidth="1" />
      <line x1="18" y1="44" x2="18" y2="52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="44" x2="32" y2="52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="46" y1="44" x2="46" y2="52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

const allServices = [
  {
    id: 'core',
    number: '00',
    name: 'Correduría Financiera',
    descriptor: 'Servicio Núcleo e Intermediación Estructural',
    Icon: IconCore,
    details: 'Ejecutamos operaciones de intermediación financiera con una ventaja estructural única: nuestro modelo macroeconómico — fundamentado en los principios de Ray Dalio — nos permite leer el ciclo económico antes de actuar. Todo nace de aquí.',
  },
  { 
    id: 's1',
    number: '01', 
    name: 'Reingeniería de Deuda', 
    descriptor: 'Estructura óptima de capital', 
    Icon: Icon01,
    details: 'Rediseñamos la arquitectura de deuda corporativa para sincronizarla con los ciclos macroeconómicos actuales. Posicionamos estratégicamente cada instrumento en el momento correcto del ciclo.',
  },
  { 
    id: 's2',
    number: '02', 
    name: 'Estrategia Financiera Cíclica', 
    descriptor: 'Anticipación de ciclos económicos', 
    Icon: Icon02,
    details: 'Diseñamos estrategias financieras que anticipan los movimientos del ciclo económico. Cada decisión se calibra contra el estado actual del ciclo para maximizar rentabilidad.',
  },
  { 
    id: 's3',
    number: '03', 
    name: 'Tesorería Avanzada', 
    descriptor: 'Maximización de liquidez operativa', 
    Icon: Icon03,
    details: 'Optimizamos la gestión de tesorería empresarial integrando visión macroeconómica con las necesidades operativas específicas. Liquidez inteligente, no solo disponible.',
  },
  { 
    id: 's4',
    number: '04', 
    name: 'Valuación Estratégica', 
    descriptor: 'Determinación del valor real', 
    Icon: Icon04,
    details: 'Determinamos el valor real de activos, empresas e instrumentos con metodologías que integran contexto macroeconómico. El valor no es estático — depende del ciclo.',
  },
  { 
    id: 's5',
    number: '05', 
    name: 'Gobernanza Financiera', 
    descriptor: 'Institucionalización de decisiones', 
    Icon: Icon05,
    details: 'Diseñamos estructuras que institucionalizan la toma de decisiones financieras. Instalamos mentalidad analítica como cultura dentro de la organización.',
  },
]

const sequencedLayoutTransition: any = {
  layout: { type: "spring", bounce: 0, duration: 1, delay: 0.1 },
  backgroundColor: { duration: 1, delay: 0.1 },
  borderColor: { duration: 1, delay: 0.1 }
}

const engraveVariants = {
  hidden: { opacity: 0, filter: 'blur(8px)', scale: 1.05, y: 15 },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)', 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0 } 
  }
}

export default function ServiciosNav() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)
  
  // 1. Ubah initial state menjadi null agar semua tertutup di awal
  const [activeIndex, setActiveIndex] = useState<number | null>(null) 

  useEffect(() => {
    let destroyed = false
    async function initVanta() {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js')
        
        if (destroyed || !sectionRef.current) return
        if (!(window as any).VANTA?.BIRDS) return

        vantaRef.current = (window as any).VANTA.BIRDS({
          el: sectionRef.current,
          THREE: (window as any).THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 600.0,
          minWidth: 600.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x030035,
          color1: 0xF4F4F5,
          color2: 0xE5997B,
          colorMode: 'lerp',
          birdSize: 1.1,
          wingSpan: 16,
          speedLimit: 2.5,
          separation: 40,
          alignment: 40,
          cohesion: 45,
          quantity: 3,
        })
      } catch (err) {
        console.error('Vanta BIRDS init failed:', err)
      }
    }
    initVanta()
    return () => {
      destroyed = true
      vantaRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const el = sectionRef.current!
      gsap.fromTo(
        el.querySelector('.section-header'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        el.querySelector('.accordion-container'),
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1, ease: 'power4.out', delay: 0.2,
          scrollTrigger: { trigger: el, start: 'top 75%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 bg-[#030035] min-h-screen flex flex-col justify-center">
      
      <div className="section-header relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-12 mb-12 text-center">
        <p className="text-[#E5997B] font-body text-xs tracking-[0.4em] uppercase mb-4 font-bold">
          Arquitectura del Valor
        </p>
        <h2 className="font-display text-[#F4F4F5] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
          Ecosistema de <em className="text-[#E5997B] italic">Servicios</em>
        </h2>
      </div>

      <div className="accordion-container relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row h-auto lg:h-[650px] w-full gap-4 lg:gap-2">
          
          {allServices.map((svc, index) => {
            const isActive = activeIndex === index
            const isCore = index === 0 // Variabel untuk mengecek card pertama
            const SvcIcon = svc.Icon

            return (
              <motion.div
                key={svc.id}
                layout
                // 2. Logika Toggle: Kalau sudah aktif, jadikan null (tutup). Kalau tidak, buka index-nya.
                onClick={() => setActiveIndex(isActive ? null : index)}
                animate={{
                  backgroundColor: isActive ? 'rgba(244, 244, 245, 0.85)' : 'rgba(229, 153, 123, 0.85)',
                  borderColor: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)',
                }}
                transition={sequencedLayoutTransition}
                style={{ 
                  minHeight: isActive ? '500px' : '150px',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 2.5rem), 50% 100%, 0 calc(100% - 2.5rem))'
                }}
                className={`relative rounded-t-2xl border cursor-pointer flex flex-col overflow-hidden backdrop-blur-md
                  ${isActive ? 'lg:flex-[2.5]' : 'lg:flex-[1]'}`}
              >
                
                {/* 3. Hiasan Elegan Khusus untuk Card Pertama (Core) */}
                {isCore && (
                  <>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-t-2xl z-0">
                       {/* Subtle gradient glow di pojok kiri atas */}
                       <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#030035] opacity-20 blur-3xl rounded-full mix-blend-overlay"></div>
                       {/* Border emas tipis di dalam card */}
                       <div className="absolute inset-0 border-[1.5px] border-[#030035]/10 rounded-t-2xl"></div>
                    </div>
                  </>
                )}

                <div className="relative z-10 w-full h-full p-6 lg:p-10 pb-20 flex flex-col items-center text-center mt-2">
                  
                  <div className="flex flex-col items-center w-full z-20">
                    <motion.div 
                      layout
                      transition={sequencedLayoutTransition}
                      // Berikan sedikit sentuhan warna border berbeda jika dia core tapi tidak aktif
                      className={`rounded-xl border shadow-sm backdrop-blur-sm p-2 transition-colors duration-700
                        ${isActive ? 'bg-[#030035]/10 border-[#030035]/20' : isCore ? 'bg-white/30 border-white/40' : 'bg-white/20 border-white/30'}`}
                    >
                      <SvcIcon isActive={isActive} />
                    </motion.div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }} 
                          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const } }}
                          exit={{ opacity: 0, transition: { duration: 0 } }}
                          className={`mt-4 font-body text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full text-[#F4F4F5] bg-[#030035] shadow-md`}>
                          {svc.number}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={engraveVariants}
                        className="flex flex-col items-center mt-10 w-full z-10 absolute top-32 px-8 md:px-16"
                      >
                        <h3 
                          className="font-display text-center text-[#030035] font-bold leading-tight mb-2 text-2xl md:text-4xl"
                          style={{ textShadow: '0px -1px 1px rgba(0,0,0,0.15), 0px 1px 1px rgba(255,255,255,1)' }}
                        >
                          {svc.name}
                        </h3>
                        
                        <p className={`font-body mb-6 max-w-lg font-bold uppercase tracking-widest text-[#E5997B] drop-shadow-sm text-sm md:text-base`}>
                          {svc.descriptor}
                        </p>

                        <p className="font-body text-[#030035]/90 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                          {svc.details}
                        </p>
                        
                        <button className="mt-8 px-6 py-3 bg-[#030035] text-[#F4F4F5] font-body text-xs font-bold uppercase tracking-widest rounded-md hover:bg-[#E5997B] hover:text-[#030035] transition-colors duration-300 shadow-lg">
                          Explorar Detalle
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {!isActive && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9, transition: { duration: 0.8, delay: 1.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0 } }}
                        className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none mt-20"
                      >
                        <span className={`font-display whitespace-nowrap text-2xl font-bold -rotate-90 tracking-widest drop-shadow-sm ${isCore ? 'text-[#030035]/70' : 'text-[#F4F4F5]'}`}>
                          {svc.name}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )
          })}

        </div>
      </div>

    </section>
  )
}