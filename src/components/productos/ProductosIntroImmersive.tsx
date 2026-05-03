import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

// ─── SVG Stroke Reveal — HEADLINES ONLY ──────────────────────────────────
// pathLength="1000" → path length dipaksa jadi 1000 unit, jadi strokeDash 
// ga perlu tebak-tebakan panjang path. Konsisten & smooth.
function HeadlineSVG({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1800 700"
      preserveAspectRatio="xMidYMid meet"
      className="w-full mx-auto"
      style={{ overflow: 'visible', maxWidth: '1200px' }}
    >
      {/* Line 1: No vendemos créditos. */}
      <g>
        <text
          x="900" y="220"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="200"
          fontWeight="400"
          letterSpacing="-2"
          fill="none"
          stroke="#1a1a4e"
          strokeWidth="3"
          pathLength="1000"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          data-stroke-line="0"
        >
          No vendemos créditos.
        </text>
        <text
          x="900" y="220"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="200"
          fontWeight="400"
          letterSpacing="-2"
          fill="#1a1a4e"
          stroke="none"
          fillOpacity={0}
          data-fill-line="0"
        >
          No vendemos créditos.
        </text>
      </g>

      {/* Line 2: Estructuramos crecimiento. */}
      <g>
        <text
          x="900" y="480"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          fontSize="200"
          fontWeight="400"
          letterSpacing="-2"
          fill="none"
          stroke="#E5997B"
          strokeWidth="3"
          pathLength="1000"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          data-stroke-line="1"
        >
          Estructuramos crecimiento.
        </text>
        <text
          x="900" y="480"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          fontSize="200"
          fontWeight="400"
          letterSpacing="-2"
          fill="#E5997B"
          stroke="none"
          fillOpacity={0}
          data-fill-line="1"
        >
          Estructuramos crecimiento.
        </text>
      </g>
    </svg>
  )
}

export default function ProductosIntroImmersive() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)
  const svgRef = useRef<SVGSVGElement>(null)

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
          backgroundColor: 0xFAFAFA,
          color1: 0x1a1a4e,
          color2: 0xE5997B,
          colorMode: 'lerp',
          birdSize: 0.9,
          wingSpan: 14,
          speedLimit: 3,
          separation: 35,
          alignment: 40,
          cohesion: 50,
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

  // ── GSAP SVG Stroke Reveal ────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || !svgRef.current) return

    const ctx = gsap.context(() => {
      const svg = svgRef.current!
      const strokeLines = Array.from(svg.querySelectorAll<SVGTextElement>('[data-stroke-line]'))
      const fillLines   = Array.from(svg.querySelectorAll<SVGTextElement>('[data-fill-line]'))

      // pathLength="1000" → dasharray & offset cukup 1000, konsisten
      const PATH_LEN = 1000

      // Reset ke hidden state
      gsap.set(strokeLines, { strokeDashoffset: PATH_LEN, opacity: 1 })
      gsap.set(fillLines, { fillOpacity: 0 })

      const STROKE_DUR  = 8.0   // sangat lambat
      const STROKE_GAP  = 2.5
      const FILL_OFFSET = 2.0

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',     // scroll lebih panjang = lebih lambat
          pin: true,
          scrub: 1,          // scrub lebih responsif
        },
      })

      strokeLines.forEach((strokeEl, li) => {
        const fillEl = fillLines[li]
        const tStart = li * (STROKE_DUR + STROKE_GAP)
        const fStart = tStart + STROKE_DUR + FILL_OFFSET

        // 1. Stroke draws in — smooth power2.inOut
        tl.fromTo(
          strokeEl,
          { strokeDashoffset: PATH_LEN },
          { strokeDashoffset: 0, duration: STROKE_DUR, ease: 'power2.inOut' },
          tStart
        )

        // 2. Fill fades in
        tl.to(
          fillEl,
          { fillOpacity: 1, duration: 2.0, ease: 'power2.out' },
          fStart
        )

        // 3. Stroke fades out — biar bersih, ga overlap
        tl.to(
          strokeEl,
          { opacity: 0, duration: 1.5, ease: 'power2.in' },
          fStart + 0.5
        )
      })

      // Accent line
      const accentLine = sectionRef.current!.querySelector('.accent-line')
      if (accentLine) {
        const lastEnd = strokeLines.length * (STROKE_DUR + STROKE_GAP) + 1.0
        tl.fromTo(
          accentLine,
          { scaleX: 0 },
          { scaleX: 1, duration: 2.0, ease: 'expo.out' },
          lastEnd
        )
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#FAFAFA' }}
    >
      {/* Konten di atas Vanta */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-8">
        <p className="font-body text-bronze text-sm tracking-[0.4em] uppercase mb-12">
          Nuestros Productos
        </p>

        <HeadlineSVG svgRef={svgRef} />

        <p className="font-body text-navy/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mt-12">
          Cada producto está diseñado como una pieza de ingeniería financiera.
          La mayoría de los créditos pueden adaptarse a las circunstancias y
          necesidades de cada cliente.
        </p>

        <div className="accent-line w-24 h-px bg-bronze/50 mx-auto mt-12 origin-center" />
      </div>
    </section>
  )
}
