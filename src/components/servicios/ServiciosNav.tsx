import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// ─── Helper: dynamic script loader ───
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
function IconCore() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 text-[#1A2540]">
      <path d="M32 2L62 32L32 62L2 32Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="8" fill="#E5997B" />
      <path d="M20 32H44M32 20V44" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

function Icon01() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M18 32C18 22 26 14 36 14" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M46 32C46 42 38 50 28 50" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 9L36 14L32 19" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 55L28 50L32 45" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 27L37 32L32 37L27 32Z" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

function Icon02() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M8 32C14 32 16 18 22 18S30 46 36 46 44 18 50 18S56 32 56 32" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="8" y1="50" x2="56" y2="50" stroke="#E5997B" strokeWidth="0.6" opacity="0.4" />
      <circle cx="56" cy="18" r="2.5" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

function Icon03() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <path d="M32 10L54 32L32 54L10 32Z" stroke="#E5997B" strokeWidth="1.2" />
      <path d="M22 32L42 32" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M36 26L42 32L36 38" stroke="#E5997B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="4" stroke="#E5997B" strokeWidth="0.8" />
    </svg>
  )
}

function Icon04() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <line x1="32" y1="12" x2="32" y2="52" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="52" x2="44" y2="52" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="14" y2="30" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="22" x2="50" y2="30" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 30L14 36H18L14 30Z" stroke="#E5997B" strokeWidth="1" />
      <path d="M46 30L50 36H54L50 30Z" stroke="#E5997B" strokeWidth="1" />
      <circle cx="32" cy="14" r="3" stroke="#E5997B" strokeWidth="1" />
    </svg>
  )
}

function Icon05() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
      <rect x="10" y="36" width="44" height="16" rx="1" stroke="#E5997B" strokeWidth="1.2" />
      <rect x="22" y="24" width="20" height="12" rx="1" stroke="#E5997B" strokeWidth="1.2" />
      <line x1="32" y1="12" x2="32" y2="24" stroke="#E5997B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="10" r="3" stroke="#E5997B" strokeWidth="1" />
      <line x1="18" y1="44" x2="18" y2="52" stroke="#E5997B" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="44" x2="32" y2="52" stroke="#E5997B" strokeWidth="1" strokeLinecap="round" />
      <line x1="46" y1="44" x2="46" y2="52" stroke="#E5997B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// Data Array Tunggal — Ukuran card derivatives disamakan semua (1x1)
const allServices = [
  {
    id: 'core',
    number: '00',
    name: 'Correduría Financiera',
    descriptor: 'Servicio Núcleo e Intermediación Estructural',
    Icon: IconCore,
    details: 'Ejecutamos operaciones de intermediación financiera con una ventaja estructural única: nuestro modelo macroeconómico — fundamentado en los principios de Ray Dalio — nos permite leer el ciclo económico antes de actuar. Todo nace de aquí.',
    className: 'lg:col-span-2 lg:row-span-2' // Menguasai Kiri Atas (Slot 2x2)
  },
  { 
    id: 's1',
    number: '01', 
    name: 'Reingeniería de Deuda', 
    descriptor: 'Estructura óptima de capital', 
    Icon: Icon01,
    className: 'lg:col-span-1 lg:row-span-1' // Kolom 3, Baris 1
  },
  { 
    id: 's2',
    number: '02', 
    name: 'Estrategia Financiera Cíclica', 
    descriptor: 'Anticipación de ciclos económicos', 
    Icon: Icon02,
    className: 'lg:col-span-1 lg:row-span-1' // Kolom 3, Baris 2
  },
  { 
    id: 's3',
    number: '03', 
    name: 'Tesorería Avanzada', 
    descriptor: 'Maximización de liquidez operativa', 
    Icon: Icon03,
    className: 'lg:col-span-1 lg:row-span-1' // Kolom 1, Baris 3
  },
  { 
    id: 's4',
    number: '04', 
    name: 'Valuación Estratégica', 
    descriptor: 'Determinación del valor real', 
    Icon: Icon04,
    className: 'lg:col-span-1 lg:row-span-1' // Kolom 2, Baris 3
  },
  { 
    id: 's5',
    number: '05', 
    name: 'Gobernanza Financiera', 
    descriptor: 'Institucionalización de decisiones', 
    Icon: Icon05,
    className: 'lg:col-span-1 lg:row-span-1' // PAS DI SUDUT: Kolom 3, Baris 3
  },
]

export default function ServiciosNav() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)
  const [activeModal, setActiveModal] = useState<any>(null)

  // ── Vanta BIRDS init ──────────────────────────────────────
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
          backgroundColor: 0xF5F5F5,
          color1: 0x1a1a4e,
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

  // ── GSAP Animations ─────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Heading reveal */
      gsap.fromTo(
        el.querySelector('.section-heading'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      /* Bento Staggered reveal */
      const cards = el.querySelectorAll('.bento-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 70%' },
        }
      )

      /* Parallax effect on inner numbers */
      const bgNums = el.querySelectorAll('.card-bg-num')
      bgNums.forEach((num) => {
        gsap.fromTo(
          num,
          { y: 15 },
          {
            y: -15,
            ease: 'none',
            scrollTrigger: {
              trigger: num.closest('.bento-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 bg-[#F5F5F5]">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <svg viewBox="0 0 1000 1000" fill="none" className="w-[1000px] h-[1000px] opacity-[0.03]">
          <path d="M500 50L950 500L500 950L50 500Z" stroke="#1A2540" strokeWidth="0.6" />
        </svg>
      </div>

      {/* BLURRED MESH GRADIENT BLOBS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[15%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#1A2540]/25 to-transparent filter blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#E5997B]/20 to-transparent filter blur-[120px]" />
      </div>

      {/* HEADER SECTION */}
      <div className="section-heading relative z-10 text-center mb-24 max-w-7xl mx-auto px-4">
        <p className="text-[#E5997B] font-body text-xs tracking-[0.4em] uppercase mb-4 font-bold">
          Arquitectura del Valor
        </p>
        <h2 className="font-display text-[#1A2540] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
          Ecosistema de Servicios
          <br />
          <em className="text-[#E5997B] italic">y capacidades core</em>
        </h2>
      </div>

      {/* 3x3 PERFECT BALANCED GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-6 items-stretch">
        {allServices.map((svc) => {
          const SvcIcon = svc.Icon
          const isCore = svc.id === 'core'

          return (
            <motion.div 
              key={svc.id} 
              className={`bento-card group perspective-1000 ${svc.className}`}
              whileHover={{ y: -4 }}
            >
              <button
                onClick={() => setActiveModal(svc)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative w-full text-left rounded-2xl p-8 overflow-hidden transition-all duration-300 ease-out border border-white/50 backdrop-blur-xl h-full flex flex-col justify-between
                           ${isCore ? 'bg-white/30 shadow-xl md:p-10' : 'bg-white/20 shadow-md min-h-[240px]'}`}
                style={{ 
                  boxShadow: isCore ? '0 30px 60px -15px rgba(26,37,64,0.12)' : '0 20px 45px -10px rgba(26,37,64,0.05)',
                }}
              >
                {/* Background Number (Untuk kartu turunan) */}
                {!isCore && (
                  <span className="card-bg-num absolute -bottom-6 -right-2 font-display leading-none select-none pointer-events-none text-[#1A2540]/[0.03] group-hover:text-[#1A2540]/[0.07] transition-all duration-700 text-8xl font-black">
                    {svc.number}
                  </span>
                )}

                <div className="relative z-10 w-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`rounded-xl border shadow-sm backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-3
                                    ${isCore ? 'p-4 bg-white/80 border-white' : 'p-3 bg-white/50 border-white/80'}`}>
                      <SvcIcon />
                    </div>
                    <span className={`font-body text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full
                                    ${isCore ? 'text-[#E5997B] bg-[#E5997B]/10' : 'text-[#1A2540]/40 group-hover:text-[#E5997B] transition-colors'}`}>
                      {isCore ? 'NÚCLEO' : svc.number}
                    </span>
                  </div>

                  <h3 className={`font-display text-[#1A2540] font-bold leading-tight mb-3
                                  ${isCore ? 'text-3xl md:text-4xl lg:text-5xl mb-4' : 'text-xl md:text-2xl'}`}>
                    {svc.name}
                  </h3>
                  
                  <p className={`font-body text-[#1A2540]/60 leading-relaxed
                                ${isCore ? 'text-base md:text-lg uppercase tracking-wide mb-6 font-semibold' : 'text-sm'}`}>
                    {svc.descriptor}
                  </p>

                  {isCore && svc.details && (
                    <p className="font-body text-[#1A2540]/80 text-base md:text-lg leading-relaxed max-w-xl mt-4">
                      {svc.details}
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className={`relative z-10 flex items-center gap-2 mt-8 w-full
                                ${isCore ? 'pt-6 border-t border-[#1A2540]/10' : 'opacity-60 group-hover:opacity-100 transition-opacity'}`}>
                  <span className="font-body text-[#E5997B] text-[10px] font-bold tracking-widest uppercase">
                    {isCore ? 'Ver matriz de impacto' : 'Explorar'}
                  </span>
                  <div className={`h-px bg-[#E5997B] transition-all duration-500
                                  ${isCore ? 'w-12 group-hover:w-20' : 'w-6 group-hover:w-10'}`} />
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* DETAIL MODAL DIALOGUE */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2540]/40 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#F5F5F5] border border-white w-full max-w-2xl rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[#E5997B] font-body text-xs font-bold tracking-widest block mb-1">
                    SERVICIO {activeModal.number}
                  </span>
                  <h4 className="font-display text-[#1A2540] text-2xl md:text-3xl font-bold">
                    {activeModal.name}
                  </h4>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-2 text-[#1A2540]/40 hover:text-[#1A2540] font-bold">✕</button>
              </div>
              <p className="font-body text-[#1A2540]/80 text-lg leading-relaxed mb-6">
                {activeModal.details || activeModal.descriptor}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}