import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    quote: 'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.',
    principle: 'CAUSALIDAD PRODUCTIVA',
  },
  {
    quote: 'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tiempo perderás competitividad.',
    principle: 'EFICIENCIA OPERATIVA',
  },
  {
    quote: 'Haz todo lo posible por aumentar tu productividad, porque en el largo plazo es lo que más importa.',
    principle: 'FINANCIAMIENTO TRACTOR',
  },
]

export default function DalioPrinciplesSection() {
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const sectionRef   = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const topPathRef   = useRef<SVGPathElement>(null)
  const bottomPathRef = useRef<SVGPathElement>(null)
  const vantaRef     = useRef<any>(null)
  const [activePrinciple, setActivePrinciple] = useState(0)

  useEffect(() => {
    const loadVanta = () => {
      if (!(window as any).VANTA || !(window as any).THREE) return
      if (vantaRef.current) return

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
        birdSize: 1.2,
        wingSpan: 18,
        speedLimit: 3,
        separation: 35,
        alignment: 40,
        cohesion: 50,
        quantity: 4,
      })
    }

    if ((window as any).VANTA && (window as any).THREE) {
      loadVanta()
    } else {
      const checkInterval = setInterval(() => {
        if ((window as any).VANTA && (window as any).THREE) {
          loadVanta()
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }

    const ctx = gsap.context(() => {
      // Marquee animation
      gsap.to('.dalио-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 45,
        ease: 'none',
      })

      // Slides animation
      const slides = gsap.utils.toArray<HTMLElement>('.principle-slide')

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress
            if (p < 0.3)      setActivePrinciple(0)
            else if (p < 0.7) setActivePrinciple(1)
            else              setActivePrinciple(2)
          },
        },
      })

      slides.forEach((slide, i) => {
        if (i !== 0) {
          tl.fromTo(
            slide,
            { yPercent: 100, opacity: 0, filter: 'blur(10px)' },
            { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power4.out' },
            i * 3
          )
        }
        if (i !== slides.length - 1) {
          tl.to(
            slide,
            { yPercent: -100, opacity: 0, filter: 'blur(10px)', duration: 2, ease: 'power4.in' },
            (i + 1) * 3 - 1
          )
        }
      })

      // ═══════════════════════════════════════════════════════════════════
      // ANIMASI CEKUNGAN DINAMIS
      // ═══════════════════════════════════════════════════════════════════
      const maxCurve = 70 // Batas maksimal kedalaman kurva (agak turun supaya tidak over)

      // 1. Cekungan Atas: Mulai melurus saat section masuk layar dari bawah
      gsap.to({}, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top 85%',
          end: 'top 5%',
          scrub: 1,
          onUpdate: (self) => {
            if (!topPathRef.current) return
            const y = gsap.utils.interpolate(maxCurve, 0, self.progress)
            topPathRef.current.setAttribute(
              'd',
              `M0,0 L1440,0 C1100,0 950,${y} 720,${y} C490,${y} 340,0 0,0 Z`
            )
          },
        },
      })

      // 2. Cekungan Bawah: Mencekung tepat saat mau ganti ke section berikutnya
      gsap.to({}, {
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'bottom 115%', // Mulai sebelum section habis persis
          end: 'bottom 100%',   // Cekung sempurna saat menyentuh batas bawah section
          scrub: 1,
          onUpdate: (self) => {
            if (!bottomPathRef.current) return
            const y = gsap.utils.interpolate(0, maxCurve, self.progress)
            bottomPathRef.current.setAttribute(
              'd',
              `M0,0 L1440,0 C1100,0 950,${y} 720,${y} C490,${y} 340,0 0,0 Z`
            )
          },
        },
      })
    }, wrapperRef)

    return () => {
      ctx.revert()
      if (vantaRef.current) {
        vantaRef.current.destroy()
        vantaRef.current = null
      }
    }
  }, [])

  return (
    <div
    ref={wrapperRef}
    className="relative"
    style={{
      height: '500vh',
      zIndex: 25,
    }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <div ref={sectionRef} className="absolute inset-0 w-full h-full bg-transparent">
          
          <div className="absolute top-[15%] left-0 flex whitespace-nowrap opacity-[0.02] select-none pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="dalио-marquee font-display text-[15vw] leading-none uppercase pr-20 text-navy"
              >
                Dima Finance • Principles • Engineering • Balance •
              </span>
            ))}
          </div>

          <div
            className="absolute inset-0 z-20 flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px) saturate(1.1)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
            }}
          >
            <div className="relative w-full h-full flex flex-col">
              
              <div className="absolute left-10 bottom-10 z-30">
                <div className="overflow-hidden h-[120px]">
                  <div
                    className="transition-transform duration-700 ease-out"
                    style={{ transform: `translateY(-${activePrinciple * 120}px)` }}
                  >
                    {principles.map((_, i) => (
                      <span key={i} className="block font-display text-9xl text-bronze leading-[120px]">
                        0{i + 1}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-navy/40 font-body text-xs tracking-[0.5em] mt-4 uppercase">
                  Principles of Wealth
                </p>
              </div>

              <div ref={containerRef} className="relative w-full h-full flex-1">
                {principles.map((p, i) => (
                  <div
                    key={i}
                    className="principle-slide absolute inset-0 flex flex-col items-center justify-center px-8 md:px-24 lg:px-48"
                  >
                    <div className="max-w-6xl w-full">
                      <div className="w-24 h-2 bg-bronze mb-12" />
                      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-navy leading-[1.1] mb-12">
                        <span className="text-bronze italic">"</span>
                        {p.quote}
                        <span className="text-bronze italic">"</span>
                      </h2>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                          <p className="text-navy font-body text-xl md:text-2xl font-bold">— Ray Dalio</p>
                          <p className="text-navy/50 font-body text-sm tracking-widest uppercase mt-2">
                            The Arc of Productivity
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-bronze font-body text-xs md:text-sm tracking-[0.6em] uppercase font-bold">
                            {p.principle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute right-12 top-0 h-full flex flex-col justify-center items-center gap-4 z-40">
                <div className="h-[200px] w-[2px] bg-navy/10 relative">
                  <div
                    className="absolute top-0 left-0 w-full bg-bronze transition-all duration-500"
                    style={{ height: `${((activePrinciple + 1) / principles.length) * 100}%` }}
                  />
                </div>
                <span className="text-navy font-body text-[10px] [writing-mode:vertical-lr] uppercase tracking-widest opacity-50">
                  Scroll to explore
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CEKUNGAN ATAS (Awalnya cekung di 90, melurus saat dimuat) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute top-0 left-0 w-full z-50 pointer-events-none text-navy">
          <div className="relative w-full h-24 md:h-32">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <path
                ref={topPathRef}
                d="M0,0 L1440,0 C1100,0 950,90 720,90 C490,90 340,0 0,0 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CEKUNGAN BAWAH (Awalnya lurus di 0, mencekung saat ganti section) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-none text-navy">
          <div className="relative w-full h-24 md:h-32">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
              style={{ transform: 'scaleY(-1)' }}
            >
              <path
                ref={bottomPathRef}
                d="M0,0 L1440,0 C1100,0 950,0 720,0 C490,0 340,0 0,0 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

      </div>
    </div>
  )
}