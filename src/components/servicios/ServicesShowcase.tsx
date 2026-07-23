import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { servicesData as DERIVATIVES } from '../../data/servicios'

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
    'El Modelo Ray Dalio nos permite anticipar la posición de la economía en su ciclo de deuda a largo plazo y en el ciclo de productividad. Esa lectura es el cimiento de cada operation que ejecutamos.',
  tagline: 'Todo nace de aquí.',
}

// Data DERIVATIVES moved to src/data/servicios.ts

function DiamondIcon({ size = 16, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={{ width: size, height: size, flexShrink: 0 }} aria-hidden>
      <path d="M10 1L19 10L10 19L1 10Z" stroke="#F4F4F5" strokeWidth="1.5" opacity={opacity} />
    </svg>
  )
}

export default function ServicesShowcase(_props?: { services?: any }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<any>(null)
  const [selected, setSelected] = useState(0)

  // ── Setup Vanta Globe Full Background ───────────────────────────────────
  useEffect(() => {
    let mounted = true
    let attempts = 0

    async function initVanta() {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js')

        const checkVanta = () => {
          if (!mounted) return
          attempts++
          if ((window as any).VANTA?.GLOBE && vantaRef.current) {
            effectRef.current = (window as any).VANTA.GLOBE({
              el: vantaRef.current,
              THREE: (window as any).THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0xF4F4F5,
              color2: 0xe5997b,
              size: 1.30,
              backgroundColor: 0x030035 
            })
            
            // Paksa kalkulasi ulang ukuran canvas setelah inisialisasi awal berhasil
            setTimeout(() => {
              if (effectRef.current?.resize) effectRef.current.resize()
            }, 500)
            
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
      if (effectRef.current) effectRef.current.destroy()
    }
  }, [])

  // ── Setup Animasi ScrollTrigger (Sticky & Transisi) ─────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // 1. Timeline untuk memudarkan Protagonist (Globe + Text) saat scroll melewati 50vh extra
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.protagonist-wrapper',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onRefresh: () => {
            if (effectRef.current?.resize) effectRef.current.resize()
          }
        },
      })

      tl.to('.protagonist-content', { opacity: 0, y: -50, scale: 0.98, duration: 1 })
        .to('.vanta-bg', { opacity: 0, duration: 1 }, '<')

      // 2. Efek fade-in halus saat section derivatif mulai masuk ke layar
      gsap.fromTo(
        '.derivatives-section',
        { opacity: 0, y: 80 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.derivatives-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
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

  // ── Reset Globe ke Tengah secara Langsung ────────────────────────────────
  const handleMouseLeave = () => {
    if (effectRef.current) {
      effectRef.current.mouseX = 0;
      effectRef.current.mouseY = 0;
      // Memastikan ukuran canvas tidak mengecil/terpotong saat kursor keluar
      if (effectRef.current.resize) effectRef.current.resize()
    }

    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
        bubbles: true,
      })
    );
  };

  return (
    <section 
      ref={containerRef} 
      id="servicios" 
      className="relative w-full bg-[#030035]"
      onMouseLeave={handleMouseLeave} 
    >

      {/* ════════════════════════════════════════════════════
          BAGIAN 1: PROTAGONISTA 
      ════════════════════════════════════════════════════ */}
      <div className="protagonist-wrapper relative w-full h-[150vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="vanta-bg absolute inset-0 z-0 w-full h-full" ref={vantaRef} />

          <div className="absolute inset-0 z-10 flex items-center w-full h-full pointer-events-none">
            <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20 flex justify-start pointer-events-auto">
              <div className="w-full lg:w-[65%] xl:w-[55%] protagonist-content">
                
                <div className="prot-anim flex items-center gap-5 mb-8">
                  <DiamondIcon size={24} opacity={1} />
                  <span className="font-body text-[#F4F4F5] uppercase tracking-[0.5em] text-sm md:text-base lg:text-lg font-bold">
                    {PROTAGONIST.eyebrow}
                  </span>
                  <div className="flex-1 h-px max-w-[150px]" style={{ background: 'rgba(244,244,245,0.3)' }} />
                </div>

                <h2 className="prot-anim mb-8 font-display text-[#F4F4F5] leading-[0.95] text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight">
                  {PROTAGONIST.title[0]}
                  <br />
                  <em className="italic text-[#E5997B]">
                    {PROTAGONIST.title[1]}
                  </em>
                </h2>

                <p className="prot-anim font-body mb-10 text-[#F4F4F5]/80 uppercase tracking-[0.4em] text-sm md:text-base lg:text-lg font-bold">
                  {PROTAGONIST.tagline}
                </p>

                <p className="prot-anim font-body mb-12 leading-relaxed text-[#F4F4F5]/80 text-xl md:text-2xl lg:text-[1.75rem]">
                  {PROTAGONIST.description}
                </p>

                <div className="prot-anim relative pl-8 mb-12 border-l-4 border-[#F4F4F5]/20">
                  <p className="font-body italic leading-relaxed text-[#F4F4F5]/70 text-lg md:text-xl lg:text-2xl">
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
              <span className="font-body uppercase text-[#F4F4F5]/60 text-xs md:text-sm tracking-[0.5em] font-extrabold">Scroll</span>
              <div className="w-px h-20 bg-gradient-to-b from-[#F4F4F5]/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          BAGIAN 2: SERVICIOS DERIVADOS (Natural Scroll Flow)
      ════════════════════════════════════════════════════ */}
      <div className="derivatives-section relative z-20 w-full bg-[#030035] pt-12 pb-32">
        {/* <SpotlightGridBackground /> */}
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
          
          {/* Header area */}
          <div className="mb-6 lg:mb-10">
            <div className="flex items-center gap-5 mb-6">
              <DiamondIcon size={20} opacity={1} />
              <span className="font-body text-[#F4F4F5] uppercase text-[10px] font-bold tracking-[0.5em]">
                Capacidades Derivadas
              </span>
            </div>
            <h3 className="font-display text-[#F4F4F5] leading-[0.95] text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] tracking-tight">
              Servicios que nacen de
              <br />
              <em className="italic text-[#E5997B]">nuestro núcleo</em>
            </h3>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-4 border-b border-[#F4F4F5]/10 pb-2" role="tablist">
            {DERIVATIVES.map((svc, i) => (
              <button
                key={svc.id}
                role="tab"
                onClick={() => setSelected(i)}
                className="relative group text-left py-2 transition-colors duration-300 focus:outline-none"
                style={{ color: selected === i ? '#F4F4F5' : 'rgba(244,244,245,0.4)' }}
              >
                <span className="font-body block mb-1 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase"
                  style={{ color: selected === i ? '#E5997B' : undefined }}>
                  {svc.id}
                </span>
                <span className="font-display block text-base md:text-lg lg:text-xl font-semibold">
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

          <div className="relative pt-12 lg:pt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col gap-16 lg:gap-24">
                  {/* Top Section: Text Left, Image Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-7">
                      <p className="font-body text-[#F4F4F5] uppercase mb-6 text-sm md:text-base lg:text-lg font-bold tracking-[0.3em]">
                        {DERIVATIVES[selected].short}
                      </p>
                      <p className="font-body leading-relaxed text-[#F4F4F5]/80 text-xl md:text-2xl lg:text-[1.75rem] mb-10">
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
                            <span className="font-body text-lg md:text-xl lg:text-2xl text-[#F4F4F5] font-semibold">
                              {d}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex items-start justify-center lg:-mt-12">
                      <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl">
                        <img 
                          src={DERIVATIVES[selected].image1} 
                          alt={DERIVATIVES[selected].name} 
                          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-[#030035]/10 mix-blend-multiply" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Image Left, Text Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center">
                      <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl">
                        <img 
                          src={DERIVATIVES[selected].image2} 
                          alt={DERIVATIVES[selected].name} 
                          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-[#030035]/10 mix-blend-multiply" />
                      </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-16 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-8">
                        <DiamondIcon size={18} opacity={1} />
                        <span className="font-body uppercase text-[#F4F4F5] text-sm md:text-base lg:text-lg font-bold tracking-widest">
                          Por qué es posible
                        </span>
                      </div>
                      <p className="font-body italic leading-relaxed text-[#F4F4F5]/70 text-lg md:text-xl lg:text-2xl mb-12">
                        {DERIVATIVES[selected].connection}
                      </p>

                      <div className="flex items-center gap-6 pt-8 border-t-2 border-[#F4F4F5]/10">
                        <div className="w-16 h-16 flex items-center justify-center border-2 border-[#F4F4F5]/30 rounded-md shrink-0">
                          <svg viewBox="0 0 20 20" fill="none" style={{ width: 24, height: 24 }}>
                            <path d="M10 2L18 10L10 18L2 10Z" stroke="#F4F4F5" strokeWidth="1.5" />
                            <circle cx="10" cy="10" r="3" fill="#F4F4F5" opacity="0.8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-body uppercase mb-2 text-[#F4F4F5]/60 text-xs md:text-sm font-bold tracking-widest">
                            Habilitado por
                          </p>
                          <p className="font-display text-[#F4F4F5] text-xl md:text-2xl font-bold">
                            Correduría Financiera
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}