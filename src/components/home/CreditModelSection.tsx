import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CreditModelSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const chartRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const waveRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      // Content fade in
      gsap.fromTo(
        sectionRef.current.querySelector('.model-text'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      // Grid lines draw in first
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.grid-line'),
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      )

      // SVG chart paths draw on scroll
      ;[pathRef.current, waveRef.current].forEach((path) => {
        if (!path) return
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.5,
          },
        })
      })

      // Labels fade in after paths draw
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.chart-label'),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      )

      // Equilibrium zone pulse once
      const eqZone = sectionRef.current.querySelector('.eq-zone')
      if (eqZone) {
        gsap.fromTo(
          eqZone,
          { fillOpacity: 0.02 },
          {
            fillOpacity: 0.07,
            yoyo: true,
            repeat: 1,
            duration: 0.8,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 45%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-lightgray overflow-hidden flex items-center"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] items-center px-0 lg:px-0">
        {/* LEFT — Animated SVG chart, fills 55-60% of viewport */}
        <div className="flex flex-col items-center justify-center py-16 lg:py-0 px-8 md:px-16 lg:pl-24 lg:pr-8">
          <svg
            ref={chartRef}
            viewBox="0 0 520 380"
            fill="none"
            className="w-full max-w-2xl"
          >
            {/* Grid lines — draw in first */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                className="grid-line"
                x1="60"
                y1={55 + i * 58}
                x2="490"
                y2={55 + i * 58}
                stroke="#030035"
                strokeWidth="0.4"
                opacity="0.06"
              />
            ))}
            {/* Axes */}
            <line x1="60" y1="315" x2="490" y2="315" stroke="#030035" strokeWidth="0.8" opacity="0.12" />
            <line x1="60" y1="30" x2="60" y2="315" stroke="#030035" strokeWidth="0.8" opacity="0.12" />

            {/* Productivity curve */}
            <path
              ref={pathRef}
              d="M60 290 Q130 275 185 250 T300 195 T400 118 T490 60"
              stroke="#D97E5A"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              className="chart-label"
              d="M488 58L494 64L488 70L482 64Z"
              fill="#D97E5A"
              fillOpacity="0.7"
            />

            {/* Debt cycle wave */}
            <path
              ref={waveRef}
              d="M60 250 C100 250 115 185 155 185 S205 250 245 250 S295 315 335 308 S385 250 425 232 S465 210 490 195"
              stroke="#E5997B"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="7 4"
            />

            {/* Equilibrium zone */}
            <rect
              className="eq-zone chart-label"
              x="60"
              y="108"
              width="430"
              height="88"
              fill="#E5997B"
              fillOpacity="0.03"
            />
            <text
              className="chart-label"
              x="275"
              y="155"
              textAnchor="middle"
              fill="#E5997B"
              fontSize="9.5"
              opacity="0.4"
              letterSpacing="0.15em"
              style={{ fontFamily: 'Inter Tight, sans-serif' }}
            >
              ZONA DE EQUILIBRIO DIMA
            </text>

            {/* Axis labels */}
            <text className="chart-label" x="60" y="335" fill="#030035" fontSize="10" opacity="0.3" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              Tiempo →
            </text>
            <text className="chart-label" x="14" y="175" fill="#030035" fontSize="10" opacity="0.3" transform="rotate(-90, 14, 175)" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              Crecimiento ↑
            </text>

            {/* Legend */}
            <g className="chart-label">
              <line x1="315" y1="30" x2="338" y2="30" stroke="#D97E5A" strokeWidth="2.5" />
              <text x="343" y="34" fill="#D97E5A" fontSize="10" opacity="0.9" style={{ fontFamily: 'Inter Tight, sans-serif' }}>Productividad</text>
            </g>
            <g className="chart-label">
              <line x1="315" y1="50" x2="338" y2="50" stroke="#E5997B" strokeWidth="2" strokeDasharray="5 3" />
              <text x="343" y="54" fill="#E5997B" fontSize="10" opacity="0.75" style={{ fontFamily: 'Inter Tight, sans-serif' }}>Deuda (ciclo)</text>
            </g>

            <text
              className="chart-label"
              x="275"
              y="20"
              textAnchor="middle"
              fill="#030035"
              fontSize="8.5"
              opacity="0.2"
              letterSpacing="0.18em"
              style={{ fontFamily: 'Inter Tight, sans-serif' }}
            >
              MODELO MACROECONÓMICO — RAY DALIO
            </text>
          </svg>
          <p className="text-navy/20 font-body text-[10px] tracking-[0.2em] uppercase mt-4">
            Basado en "How the Economic Machine Works" — Ray Dalio
          </p>
        </div>

        {/* RIGHT — Text */}
        <div className="model-text px-8 md:px-12 lg:px-16 xl:px-20 py-20 lg:py-0">
          <p className="text-bronze font-body text-xs tracking-[0.3em] uppercase mb-8">
            MODELO CREDITICIO
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-tight mb-10">
            Fundamentado en el equilibrio de{' '}
            <em className="text-bronze">Ray Dalio</em>
          </h2>
          <p className="font-body text-navy/50 text-lg leading-relaxed mb-12 max-w-lg">
            La productividad debe crecer más rápido que la deuda. Este principio,
            extraído del modelo macroeconómico de Ray Dalio, guía cada estructura
            crediticia que diseñamos. No financiamos — equilibramos.
          </p>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-bronze/30" />
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M12 2L22 12L12 22L2 12Z" stroke="#E5997B" strokeWidth="1" />
            </svg>
            <div className="w-12 h-px bg-bronze/30" />
          </div>
          <Link to="/modelo-crediticio" className="btn-bronze">
            DESCUBRE EL MODELO
          </Link>
        </div>
      </div>
    </section>
  )
}
