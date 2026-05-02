import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedGridEdge from '../AnimatedGridEdge'

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
  const [activePrinciple, setActivePrinciple] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. KINETIC MARQUEE
      gsap.to('.dalио-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 45,
        ease: 'none',
      })

      // 2. SCROLL ANIMATION — trigger ke wrapperRef (bukan section)
      //    Wrapper height: 500vh = 100vh section + 400vh scroll distance
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

      // 3. MOVING GRID
      gsap.to('.dalио-grid', {
        backgroundPosition: '0 100px',
        scrollTrigger: {
          trigger: wrapperRef.current,
          scrub: true,
        },
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    /**
     * KEY — sama persis pattern ProductsToPhotoSection:
     * - height: 500vh  → 100vh (section visible) + 400vh (scroll room for slides)
     * - marginTop: -100vh → overlap ke atas CreditModelSection (paper stack effect)
     * - zIndex: 25  → pastiin di atas CreditModelSection (zIndex: 1)
     */
    <div
      ref={wrapperRef}
      style={{
        height: '500vh',
        marginTop: '-100vh',
        position: 'relative',
        zIndex: 25,
      }}
    >
      {/* STICKY — ini yang nempel di viewport selama user scroll 400vh */}
      <div
        ref={sectionRef}
        className="sticky top-0 h-screen bg-lightgray overflow-hidden"
      >
        <AnimatedGridEdge cellSize={60} color="3,0,53" />

        {/* GRID BACKGROUND */}
        <div
          className="dalио-grid absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(to right, #001F3F 1px, transparent 1px), linear-gradient(to bottom, #001F3F 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* KINETIC MARQUEE */}
        <div className="absolute top-[15%] left-0 flex whitespace-nowrap opacity-[0.04] select-none pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="dalио-marquee font-display text-[15vw] leading-none uppercase pr-20 text-navy"
            >
              Dima Finance • Principles • Engineering • Balance •
            </span>
          ))}
        </div>

        {/* SIDE COUNTER */}
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

        {/* SLIDES */}
        <div ref={containerRef} className="relative w-full h-full z-10">
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

        {/* PROGRESS BAR */}
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
  )
}