import { useEffect, useRef, useState } from 'react'
import HoverTrailOverlay from '../HoverTrailOverlay'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GeometryParticles from '../GeometryParticles'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloFuerzas() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [showTextA, setShowTextA] = useState(false)
  const [showTextB, setShowTextB] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) 
    }
    
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Label clip reveal */
      gsap.fromTo(
        el.querySelector('.section-label'),
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      /* Block A — text slide up (only run on desktop) */
      if (!isMobile) {
          const blockA = el.querySelector('.block-a')
          if (blockA) {
            gsap.fromTo(
              blockA.querySelectorAll('.reveal-el'),
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: { trigger: blockA, start: 'top 75%' },
              }
            )
          }
      }

      /* Block B — text slide up (only run on desktop) */
      if (!isMobile) {
          const blockB = el.querySelector('.block-b')
          if (blockB) {
            gsap.fromTo(
              blockB.querySelectorAll('.reveal-el'),
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: { trigger: blockB, start: 'top 75%' },
              }
            )
          }
      }

      /* Callout — clip-path reveal from left */
      const callout = el.querySelector('.callout-box')
      if (callout) {
        gsap.fromTo(
          callout,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: callout, start: 'top 80%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile]) 

  return (
    <section ref={sectionRef} className="relative w-full bg-[#F4F1F5] py-24 md:py-36 section-padding overflow-hidden" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GeometryParticles particleCount={140} opacity={0.05} />
      </div>
      <div className="relative z-10 max-w-[85rem] mx-auto w-full">
        <p className="section-label text-bronze font-body text-sm md:text-base tracking-[0.3em] uppercase mb-12 md:mb-16 font-semibold">
          Las Fuerzas Económicas
        </p>

        {/* ─── Block A: Ingreso por Productividad ─── */}
        <div className="block-a grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-28 md:mb-40">
          
          {/* PERBAIKAN: Tambah relative z-30 agar teks & tombol mutlak berada di atas canvas */}
          <div className="relative z-30">
            <h3 className="reveal-el font-display text-4xl md:text-5xl lg:text-[4.5rem] text-navy leading-[1.1] tracking-tight mb-6">
              Ingreso por Productividad
            </h3>
            
            <div className={`reveal-el overflow-hidden transition-all duration-500 ease-in-out ${isMobile && !showTextA ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                <p className="font-body text-navy/75 text-xl md:text-2xl leading-relaxed">
                  En una transacción, algo debe darse para recibir algo, y lo que se recibe
                  depende de cuánto se produce a lo largo del tiempo. Quienes son ingeniosos
                  y trabajadores producen más, por lo tanto ganan más, lo que les da la
                  oportunidad de gastar más. Y dado que el gasto de una persona es siempre
                  el ingreso de otra, la economía crece cuando alguien se vuelve más productivo.
                </p>
            </div>
            
            {isMobile && (
                <button 
                    onClick={() => setShowTextA(!showTextA)}
                    className="mt-4 text-bronze font-semibold uppercase tracking-wider text-sm flex items-center gap-2 hover:opacity-80 transition-opacity relative z-50 pointer-events-auto"
                >
                    {showTextA ? 'Leer menos' : 'Leer más'}
                    <svg 
                        className={`w-4 h-4 transform transition-transform duration-300 ${showTextA ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
          </div>

          {/* PERBAIKAN: overflow-hidden z-10 agar efek hover kepotong di dalam kotak ini saja */}
          <div className="reveal-el flex items-center justify-center relative cursor-auto lg:cursor-none overflow-hidden rounded-3xl z-10">
            <img 
              src="/illustration-compressed/models/penggiling.webp" 
              alt="Ingreso por Productividad" 
              className="w-full max-w-xl aspect-square object-contain hover:scale-105 transition-transform duration-700 ease-out relative z-10"
            />
            {/* Tambah pointer-events-none agar overlay tidak block klik */}
            <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
              <HoverTrailOverlay theme="lightgray" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* ─── Block B: Los Ciclos de Deuda ─── */}
        <div className="block-b grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-24 md:mb-36">
          
          {/* PERBAIKAN: overflow-hidden z-10 agar efek hover kepotong di dalam kotak ini saja */}
          <div className="reveal-el flex items-center justify-center order-2 lg:order-1 relative cursor-auto lg:cursor-none overflow-hidden rounded-3xl z-10">
            <img 
              src="/illustration-compressed/models/balon2.webp" 
              alt="Los Ciclos de Deuda" 
              className="w-full max-w-xl aspect-square object-contain hover:scale-105 transition-transform duration-700 ease-out relative z-10"
            />
            <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
              <HoverTrailOverlay theme="lightgray" className="w-full h-full" />
            </div>
          </div>

          {/* PERBAIKAN: Tambah relative z-30 agar teks & tombol mutlak berada di atas canvas */}
          <div className="order-1 lg:order-2 relative z-30">
            <h3 className="reveal-el font-display text-4xl md:text-5xl lg:text-[4.5rem] text-navy leading-[1.1] tracking-tight mb-6">
              Los Ciclos de Deuda
            </h3>
            
            <div className={`reveal-el overflow-hidden transition-all duration-500 ease-in-out ${isMobile && !showTextB ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
                <p className="font-body text-navy/75 text-xl md:text-2xl leading-relaxed">
                  Existen dos tipos: Ciclos de Deuda a Largo Plazo y Ciclos de Deuda a
                  Corto Plazo. Cada vez que pedimos prestado, creamos un ciclo. Esto no
                  se debe a ninguna ley o regulación, sino a la naturaleza humana y al
                  funcionamiento del crédito. El crédito nos permite consumir más de lo
                  que producimos al adquirirlo, y nos obliga a consumir menos de lo que
                  producimos al pagarlo. Pedir prestado es una forma de adelantar el
                  gasto — esencialmente estás tomando prestado de tu yo futuro.
                </p>
            </div>
            
            {isMobile && (
                <button 
                    onClick={() => setShowTextB(!showTextB)}
                    className="mt-4 text-bronze font-semibold uppercase tracking-wider text-sm flex items-center gap-2 hover:opacity-80 transition-opacity relative z-50 pointer-events-auto"
                >
                    {showTextB ? 'Leer menos' : 'Leer más'}
                    <svg 
                        className={`w-4 h-4 transform transition-transform duration-300 ${showTextB ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
          </div>
        </div>

        {/* ─── Callout Box ─── */}
        <div className="callout-box relative border-l-[5px] border-bronze bg-white/50 backdrop-blur-md shadow-xl shadow-navy/5 px-6 md:px-10 py-6 md:py-8 max-w-3xl mx-auto rounded-xl">
          <p className="font-display text-lg md:text-xl lg:text-2xl text-navy/90 leading-relaxed italic">
            &ldquo;El crédito no es necesariamente algo malo. Es malo cuando financia
            consumo que no puede ser pagado. Cuando los recursos se asignan de manera
            eficiente y estratégica, generando suficiente ingreso para cubrir la
            deuda — ahí es donde ocurre el verdadero crecimiento y desarrollo.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}