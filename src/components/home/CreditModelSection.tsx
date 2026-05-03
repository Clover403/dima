import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

export default function CreditModelSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const chartRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const waveRef = useRef<SVGPathElement>(null)
  const vantaRef = useRef<any>(null)

  useEffect(() => {
    let destroyed = false

    async function initVanta() {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js')
      if (destroyed || !sectionRef.current) return

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

    initVanta()

    return () => {
      destroyed = true
      vantaRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      gsap.fromTo(
        sectionRef.current.querySelector('.model-text'),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelectorAll('.grid-line'),
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      )

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

      gsap.fromTo(
        sectionRef.current.querySelectorAll('.chart-label'),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-lightgray overflow-hidden flex items-center py-24"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="relative z-10 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center gap-16 xl:gap-24">
        
        {/* LEFT — Animated SVG chart */}
        <div className="flex flex-col items-center justify-center px-8 md:px-16 lg:pl-24">
          <svg
            ref={chartRef}
            viewBox="0 0 520 380"
            fill="none"
            className="w-full h-auto drop-shadow-2xl"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                className="grid-line"
                x1="60"
                y1={55 + i * 58}
                x2="490"
                y2={55 + i * 58}
                stroke="#030035"
                strokeWidth="0.5"
                opacity="0.08"
              />
            ))}
            <line x1="60" y1="315" x2="490" y2="315" stroke="#030035" strokeWidth="1" opacity="0.15" />
            <line x1="60" y1="30" x2="60" y2="315" stroke="#030035" strokeWidth="1" opacity="0.15" />

            <path
              ref={pathRef}
              d="M60 290 Q130 275 185 250 T300 195 T400 118 T490 60"
              stroke="#D97E5A"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            <path
              ref={waveRef}
              d="M60 250 C100 250 115 185 155 185 S205 250 245 250 S295 315 335 308 S385 250 425 232 S465 210 490 195"
              stroke="#E5997B"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 5"
            />

            <rect className="eq-zone chart-label" x="60" y="108" width="430" height="88" fill="#E5997B" fillOpacity="0.03" />
            
            <text className="chart-label" x="275" y="155" textAnchor="middle" fill="#E5997B" fontSize="11" fontWeight="600" opacity="0.6" letterSpacing="0.2em" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              ZONA DE EQUILIBRIO DIMA
            </text>

            <text className="chart-label" x="60" y="340" fill="#030035" fontSize="12" fontWeight="500" opacity="0.4" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              Tiempo →
            </text>
            <text className="chart-label" x="14" y="175" fill="#030035" fontSize="12" fontWeight="500" opacity="0.4" transform="rotate(-90, 14, 175)" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              Crecimiento ↑
            </text>

            <g className="chart-label">
              <line x1="315" y1="30" x2="340" y2="30" stroke="#D97E5A" strokeWidth="3" />
              <text x="348" y="34" fill="#D97E5A" fontSize="12" fontWeight="600" style={{ fontFamily: 'Inter Tight, sans-serif' }}>Productividad</text>
            </g>
            <g className="chart-label">
              <line x1="315" y1="55" x2="340" y2="55" stroke="#E5997B" strokeWidth="2.5" strokeDasharray="6 3" />
              <text x="348" y="59" fill="#E5997B" fontSize="12" fontWeight="600" style={{ fontFamily: 'Inter Tight, sans-serif' }}>Deuda (ciclo)</text>
            </g>

            <text className="chart-label" x="275" y="15" textAnchor="middle" fill="#030035" fontSize="10" fontWeight="700" opacity="0.25" letterSpacing="0.25em" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
              MODELO MACROECONÓMICO — RAY DALIO
            </text>
          </svg>
          <p className="text-navy/30 font-body text-[12px] tracking-[0.3em] font-bold uppercase mt-8 text-center">
            Basado en "How the Economic Machine Works" — Ray Dalio
          </p>
        </div>

        {/* RIGHT — Text Content */}
        <div className="model-text px-8 md:px-16 lg:pr-24 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-px bg-bronze/50" />
            <p className="text-bronze font-body text-sm md:text-base tracking-[0.5em] font-bold uppercase">
              MODELO CREDITICIO
            </p>
          </div>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-navy leading-[1.1] mb-12">
            Fundamentado en el equilibrio de{' '}
            <span className="relative inline-block">
              <em className="text-bronze not-italic italic">Ray Dalio</em>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-bronze/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>

          <p className="font-body text-navy/60 text-xl md:text-2xl leading-relaxed mb-16 max-w-2xl">
            La productividad debe crecer más rápido que la deuda. Este principio,
            extraído del modelo macroeconómico de Ray Dalio, guía cada estructura
            crediticia que diseñamos. <span className="text-navy font-bold">No financiamos — equilibramos.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
            <Link 
              to="/modelo-crediticio" 
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-navy text-white font-body text-sm tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-bronze hover:pl-14"
            >
              <span className="relative z-10">DESCUBRE EL MODELO</span>
              <svg className="absolute left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-bronze/10 flex items-center justify-center">
                    <div className="w-1 h-1 bg-bronze rounded-full" />
                  </div>
                ))}
              </div>
              <p className="text-navy/40 font-body text-xs tracking-widest uppercase font-bold">
                Estructura <br /> Institucional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}