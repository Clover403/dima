import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface DimaDiamond3DRef {
  morphTo: (variant: DiamondVariant) => void
  setProgress: (progress: number) => void
}

export type DiamondVariant =
  | 'idle'
  | 'rotate'
  | 'explode'
  | 'balance'
  | 'chart'
  | 'orbit'
  | 'converge'

interface Props {
  variant?: DiamondVariant
  color?: string
  className?: string
}

const DimaDiamond3D = forwardRef<DimaDiamond3DRef, Props>(function DimaDiamond3D(
  { variant = 'idle', color: _color = '#030035', className = '' }, // color default diubah ke warna tinta gelap
  ref
) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const svgRef        = useRef<SVGSVGElement>(null)
  const gemGroupRef   = useRef<SVGGElement>(null)
  const glowRef       = useRef<SVGGElement>(null)
  const ringsRef      = useRef<SVGGElement>(null)
  const kawungRef     = useRef<SVGGElement>(null)
  const tlRef         = useRef<gsap.core.Timeline | null>(null)
  const variantRef    = useRef<DiamondVariant>('idle')

  // ── Expose imperative API ─────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    morphTo: (newVariant: DiamondVariant) => {
      if (variantRef.current === newVariant) return
      variantRef.current = newVariant
      playVariant(newVariant)
    },
    setProgress: (progress: number) => {
      tlRef.current?.progress(progress)
    },
  }))

  // ── Variant animations ────────────────────────────────────────────────────
  void _color
  const playVariant = (v: DiamondVariant) => {
    const container = containerRef.current
    const gem       = gemGroupRef.current
    const glow      = glowRef.current
    const rings     = ringsRef.current
    const kawung    = kawungRef.current
    if (!container || !gem || !glow) return

    tlRef.current?.kill()

    // Smooth reset
    gsap.to([gem, glow, rings, kawung], {
      x: 0, y: 0, scale: 1, rotation: 0, scaleX: 1, scaleY: 1,
      opacity: 1, duration: 0.5, ease: 'power2.inOut', overwrite: true,
    })

    const tl = gsap.timeline()

    switch (v) {
      case 'idle':
      case 'rotate':
        // Cukup animasi bernapas (naik turun & glow), HAPUS SEMUA ROTASI.
        tl.to(gem, { y: -10, scale: 1.03, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        tl.to(glow, { opacity: 0.5, scale: 1.1, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, '<')
        break

      case 'explode':
        tl.to(gem, { scale: 1.35, duration: 1, ease: 'power3.out' })
        tl.to(glow, { scale: 1.8, opacity: 0.3, duration: 1, ease: 'power3.out' }, '<')
        if (kawung) tl.to(kawung, { scale: 1.6, opacity: 0, duration: 1, ease: 'power3.out' }, '<')
        tl.to({}, { duration: 0.8 })
        tl.to(gem, { scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.45)' })
        tl.to(glow, { scale: 1, opacity: 0.84, duration: 1, ease: 'power2.out' }, '<')
        if (kawung) tl.to(kawung, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, '<')
        break

      case 'balance':
        tl.to(gem, { rotation: -14, x: -36, duration: 1.4, ease: 'power2.inOut' })
        tl.to(glow, { x: -20, duration: 1.4, ease: 'power2.inOut' }, '<')
        tl.to(gem, { rotation: 14, x: 36, duration: 2.8, ease: 'power2.inOut', yoyo: true, repeat: 1 })
        tl.to(glow, { x: 20, duration: 2.8, ease: 'power2.inOut', yoyo: true, repeat: 1 }, '<')
        tl.to(gem, { rotation: 0, x: 0, duration: 1.4, ease: 'power2.inOut' })
        tl.to(glow, { x: 0, duration: 1.4, ease: 'power2.inOut' }, '<')
        break

      case 'chart':
        tl.to(gem, { scaleY: 0.2, scaleX: 1.5, rotation: 0, duration: 0.9, ease: 'power3.inOut' })
        tl.to(glow, { scaleY: 0.4, scaleX: 1.3, opacity: 0.5, duration: 0.9, ease: 'power3.inOut' }, '<')
        tl.to(gem, { scaleY: 0.26, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: 4 })
        tl.to(gem, { scaleY: 1, scaleX: 1, duration: 1.1, ease: 'elastic.out(1, 0.5)' })
        tl.to(glow, { scaleY: 1, scaleX: 1, opacity: 0.84, duration: 1, ease: 'power2.out' }, '<')
        break

      case 'orbit':
        tl.to(container, {
          keyframes: [
            { x: 0,   y: 0,   duration: 0 },
            { x: 50,  y: -35, duration: 1, ease: 'sine.inOut' },
            { x: 0,   y: -70, duration: 1, ease: 'sine.inOut' },
            { x: -50, y: -35, duration: 1, ease: 'sine.inOut' },
            { x: 0,   y: 0,   duration: 1, ease: 'sine.inOut' },
          ],
          repeat: -1, ease: 'none',
        })
        tl.to(rings, { rotation: 360, transformOrigin: '400 400', duration: 4, ease: 'none', repeat: -1 }, '<')
        break

      case 'converge':
        tl.to(gem, { scale: 0.55, duration: 1.2, ease: 'power3.inOut' })
        tl.to(glow, { scale: 2.5, opacity: 1, duration: 1.2, ease: 'power2.out' }, '<')
        if (kawung) tl.to(kawung, { scale: 1.3, opacity: 0.25, duration: 1.2, ease: 'power2.out' }, '<')
        tl.to(glow, { opacity: 0.5, scale: 2.2, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        break
    }

    tlRef.current = tl
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    const gem       = gemGroupRef.current
    if (!container || !gem) return

    gsap.set(container, { transformPerspective: 1400 })
    gsap.set(gem, { transformOrigin: 'center center' })
    playVariant(variant)

    return () => { tlRef.current?.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    playVariant(variant)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square w-[min(80vw,34rem)] max-w-full ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 800 800"
        className="relative z-10 h-full w-full drop-shadow-[0_20px_40px_rgba(3,0,53,0.15)]"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* ── ENGRAVING PATTERNS (Arsiran Silang ala Uang Kertas) ── */}
          <pattern id="hatch-light" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#030035" strokeWidth="0.6" opacity="0.4" />
          </pattern>
          <pattern id="hatch-med" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#030035" strokeWidth="0.8" opacity="0.6" />
            <line x1="0" y1="0" x2="6" y2="0" stroke="#030035" strokeWidth="0.4" opacity="0.3" />
          </pattern>
          <pattern id="hatch-heavy" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#030035" strokeWidth="1" opacity="0.8" />
            <line x1="0" y1="0" x2="5" y2="0" stroke="#030035" strokeWidth="1" opacity="0.8" />
          </pattern>

          {/* ── Ink Wash Glow (Background bayangan tinta) ── */}
          <radialGradient id="inkGlow" cx="400" cy="400" r="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#030035" stopOpacity="0.12" />
            <stop offset="40%"  stopColor="#030035" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#030035" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background Ink Glow ── */}
        <g ref={glowRef}>
          <circle cx="400" cy="420" r="350" fill="url(#inkGlow)" />
        </g>

        {/* ── Kawung rings (outermost, slowest) - Diubah jadi garis putus-putus tinta ── */}
        <g ref={kawungRef} opacity="0.4">
          <circle cx="400" cy="400" r="320" fill="none" stroke="#030035" strokeWidth="1" strokeDasharray="4 8" />
          <ellipse cx="400" cy="90"  rx="28" ry="52" fill="none" stroke="#030035" strokeWidth="0.8" />
          <ellipse cx="400" cy="710" rx="28" ry="52" fill="none" stroke="#030035" strokeWidth="0.8" />
          <ellipse cx="90"  cy="400" rx="52" ry="28" fill="none" stroke="#030035" strokeWidth="0.8" />
          <ellipse cx="710" cy="400" rx="52" ry="28" fill="none" stroke="#030035" strokeWidth="0.8" />
          <line x1="400" y1="80"  x2="400" y2="145" stroke="#030035" strokeWidth="0.8" />
          <line x1="400" y1="655" x2="400" y2="720" stroke="#030035" strokeWidth="0.8" />
          <line x1="80"  y1="400" x2="145" y2="400" stroke="#030035" strokeWidth="0.8" />
          <line x1="655" y1="400" x2="720" y2="400" stroke="#030035" strokeWidth="0.8" />
        </g>

        {/* ── Decorative rings (rotate on orbit) ── */}
        <g ref={ringsRef} opacity="0.5">
          <circle cx="400" cy="400" r="220" fill="none" stroke="#030035" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="400" cy="400" r="258" fill="none" stroke="#030035" strokeWidth="0.5" />
          <ellipse cx="400" cy="183" rx="15" ry="28" fill="none" stroke="#030035" strokeWidth="0.8" />
          <ellipse cx="400" cy="617" rx="15" ry="28" fill="none" stroke="#030035" strokeWidth="0.8" />
          <ellipse cx="183" cy="400" rx="28" ry="15" fill="none" stroke="#030035" strokeWidth="0.8" />
          <ellipse cx="617" cy="400" rx="28" ry="15" fill="none" stroke="#030035" strokeWidth="0.8" />
        </g>

        {/* ── Main Diamond (Brilliant Cut - Engraving Style) ── */}
        {/* Titik Berlian: Top(260,200 ke 540,200), Girdle(100,340 ke 700,340), Culet/Bawah(400,700) */}
        <g ref={gemGroupRef}>
          
          {/* Base Background (Warna Kertas) agar tidak transparan ke rings */}
          <polygon
            points="260,200 540,200 700,340 400,700 100,340"
            fill="#FDFBF9" 
            stroke="#030035" 
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Facet 1: Crown Kiri (Medium Hatch) */}
          <polygon 
            points="260,200 320,340 100,340" 
            fill="url(#hatch-med)" 
            stroke="#030035" 
            strokeWidth="1.5" strokeLinejoin="round" 
          />
          
          {/* Facet 2: Crown Kanan (Light Hatch - Kena Cahaya) */}
          <polygon 
            points="540,200 700,340 480,340" 
            fill="none" 
            stroke="#030035" 
            strokeWidth="1.5" strokeLinejoin="round" 
          />

          {/* Facet 3: Table (Tengah Atas - Light Hatch) */}
          <polygon 
            points="260,200 540,200 480,340 320,340" 
            fill="url(#hatch-light)" 
            stroke="#030035" 
            strokeWidth="1.5" strokeLinejoin="round" 
          />

          {/* Facet 4: Pavilion Kiri (Shadow - Heavy Hatch) */}
          <polygon 
            points="100,340 320,340 400,700" 
            fill="url(#hatch-heavy)" 
            stroke="#030035" 
            strokeWidth="1.5" strokeLinejoin="round" 
          />

          {/* Facet 5: Pavilion Kanan (Refleksi - Light Hatch) */}
          <polygon 
            points="700,340 400,700 480,340" 
            fill="url(#hatch-light)" 
            stroke="#030035" 
            strokeWidth="1.5" strokeLinejoin="round" 
          />

          {/* Facet 6: Pavilion Tengah (Medium Hatch) */}
          <polygon 
            points="320,340 480,340 400,700" 
            fill="url(#hatch-med)" 
            stroke="#030035" 
            strokeWidth="1.5" strokeLinejoin="round" 
          />

          {/* Garis Ekstra untuk detail Engraving Girdle */}
          <line x1="100" y1="340" x2="700" y2="340" stroke="#030035" strokeWidth="2" />
        </g>
      </svg>
    </div>
  )
})

export default DimaDiamond3D