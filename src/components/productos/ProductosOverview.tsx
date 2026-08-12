import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { productsData } from '../../data/productos'
import RippleGrid from '../../components/RippleGrid'

gsap.registerPlugin(ScrollTrigger)

// ─── Konfigurasi timing ───
const TEXT_HIDE_DURATION   = 1.5
const GAP                  = 0.3
const LINE_WIDEN_DURATION  = 1.2
const CURVE_APPEAR_DURATION= 0.8
const CURTAIN_DURATION     = 2.5
const CURVE_MAX_DEPTH      = 120 
const SLIDE_DUR            = 3

const LINE_WIDEN_START   = TEXT_HIDE_DURATION + GAP
const CURVE_APPEAR_START = LINE_WIDEN_START + LINE_WIDEN_DURATION * 0.55
const VERTICAL_START     = CURVE_APPEAR_START + CURVE_APPEAR_DURATION + 0.2
const SLIDES_START       = VERTICAL_START + CURTAIN_DURATION + GAP

export default function ProductosOverview() {
  const wrapperRef            = useRef<HTMLDivElement>(null)
  const slidesRef             = useRef<HTMLDivElement>(null)
  const topCurveWrapRef       = useRef<HTMLDivElement>(null)
  const bottomCurveWrapRef    = useRef<HTMLDivElement>(null)
  const topCurveRef           = useRef<SVGPathElement>(null)
  const bottomCurveRef        = useRef<SVGPathElement>(null)
  const sectionBottomCurveRef = useRef<SVGPathElement>(null)
  
  const spotlightGridRef   = useRef<HTMLDivElement>(null)
  const spotlightDotsRef   = useRef<HTMLDivElement>(null)
  
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapperRef.current) return

      gsap.set('.producto-char',     { opacity: 1 }) 
      gsap.set('.product-slide',     { opacity: 0, yPercent: 0 })
      gsap.set('.product-slide:first-child', { opacity: 1 })

      gsap.to('.productos-marquee', {
        xPercent: -50,
        repeat: -1,
        duration: 60,
        ease: 'none',
      })

      const gridAngleProxy = { angle: 0 }
      const dotsAngleProxy = { angle: 0 }

      gsap.set(spotlightGridRef.current, { '--grid-angle': '0deg' })
      gsap.set(spotlightDotsRef.current, { '--dots-angle': '0deg' })

      gsap.to(gridAngleProxy, {
        angle: "+=360",
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (spotlightGridRef.current) {
            spotlightGridRef.current.style.setProperty('--grid-angle', `${gridAngleProxy.angle}deg`)
          }
        }
      })

      gsap.to(dotsAngleProxy, {
        angle: "-=360",
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (spotlightDotsRef.current) {
            spotlightDotsRef.current.style.setProperty('--dots-angle', `${dotsAngleProxy.angle}deg`)
          }
        }
      })

      const band = { insetX: 50, insetY: 49.9, depth: 0 }

      // ─── UPDATE SVG PATH SECARA DINAMIS AGAR LANCIP ───
      const updateBand = () => {
        if (slidesRef.current) {
          slidesRef.current.style.clipPath =
            `inset(${band.insetY}% ${band.insetX}% ${band.insetY}% ${band.insetX}%)`
        }

        const depth = band.depth
        
        // Konversi persentase insetX ke koordinat viewBox SVG (1440px)
        const xStart  = 1440 * (band.insetX / 100)
        const xEnd    = 1440 * (1 - band.insetX / 100)
        const xCenter = 720

        // Kalkulasi handle/control point Bezier agar transisi kurva smooth dari ujung lancip
        const cp1X = xStart + (xCenter - xStart) * 0.35
        const cp2X = xCenter - (xCenter - xStart) * 0.35
        const cp3X = xCenter + (xEnd - xCenter) * 0.35
        const cp4X = xEnd - (xEnd - xCenter) * 0.35
        
        // Path dibuat menggantung dinamis dari xStart menuju xEnd
        const dTop = `M${xStart},120 C${cp1X},120 ${cp2X},${120 - depth} ${xCenter},${120 - depth} C${cp3X},${120 - depth} ${cp4X},120 ${xEnd},120 Z`
        const dBottom = `M${xStart},0 C${cp1X},0 ${cp2X},${depth} ${xCenter},${depth} C${cp3X},${depth} ${cp4X},0 ${xEnd},0 Z`

        if (topCurveRef.current) topCurveRef.current.setAttribute('d', dTop)
        if (bottomCurveRef.current) bottomCurveRef.current.setAttribute('d', dBottom)
        
        if (topCurveWrapRef.current) {
          topCurveWrapRef.current.style.top = `${band.insetY}%`
          topCurveWrapRef.current.style.clipPath = 'none' // Lepas clip kotak
        }
        if (bottomCurveWrapRef.current) {
          bottomCurveWrapRef.current.style.top = `${100 - band.insetY}%`
          bottomCurveWrapRef.current.style.clipPath = 'none' // Lepas clip kotak
        } 
      }
      
      updateBand()

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=1150%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const total = self.animation?.duration() ?? 1
            const slidesPhaseStart = SLIDES_START / total
            const p = self.progress
            if (p >= slidesPhaseStart) {
              const slidesProgress = (p - slidesPhaseStart) / (1 - slidesPhaseStart)
              const idx = Math.min(
                Math.floor(slidesProgress * productsData.length),
                productsData.length - 1
              )
              setActive(idx)
            }
          },
        },
      })

      tl.to('.producto-char', {
        opacity: 0,
        ease: 'power2.inOut',
        duration: 0.6,
        stagger: {
          each: 0.1,
          from: 'end'
        }
      }, 0)

      tl.to(band, {
        insetX: 0,
        duration: LINE_WIDEN_DURATION,
        ease: 'power2.inOut',
        onUpdate: updateBand,
      }, LINE_WIDEN_START)

      tl.to(band, {
        depth: CURVE_MAX_DEPTH, 
        duration: CURVE_APPEAR_DURATION,
        ease: 'power2.inOut',
        onUpdate: updateBand,
      }, CURVE_APPEAR_START)

      tl.to(band, {
        insetY: 0,
        depth: 0, 
        duration: CURTAIN_DURATION,
        ease: 'power2.inOut',
        onUpdate: updateBand,
      }, VERTICAL_START)

      const slides = gsap.utils.toArray<HTMLElement>('.product-slide')

      slides.forEach((slide, i) => {
        const base = SLIDES_START + i * SLIDE_DUR
        if (i !== 0) {
          tl.fromTo(
            slide,
            { yPercent: 100, opacity: 0, filter: 'blur(12px)' },
            { yPercent: 0,   opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power4.out' },
            base
          )
        }
        if (i !== slides.length - 1) {
          tl.to(
            slide,
            { yPercent: -100, opacity: 0, filter: 'blur(12px)', duration: 2, ease: 'power4.in' },
            base + SLIDE_DUR - 1
          )
        }
      })

      const bottomSectionCurve = { depth: 0 }
      const maxCurve = 90
      const END_OF_SLIDES = SLIDES_START + productsData.length * SLIDE_DUR

      tl.to(bottomSectionCurve, {
        depth: maxCurve,
        duration: 2,
        ease: 'none',
        onUpdate: () => {
          if (sectionBottomCurveRef.current) {
            sectionBottomCurveRef.current.setAttribute(
              'd',
              // Kita tambahkan M0,-50 L1440,-50 agar bentuknya "lubèr" ke bawah
              `M0,-50 L1440,-50 L1440,0 C1100,0 950,${bottomSectionCurve.depth} 720,${bottomSectionCurve.depth} C490,${bottomSectionCurve.depth} 340,0 0,0 Z`
            )
          }
        }
      }, END_OF_SLIDES - 1)
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  return (
    <div>
      <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden bg-[#030035] border-b-[2px] border-[#030035] box-content">

       {/* ── LAYER 0: Overlay Navy dengan Ripple Grid ── */}
        <div className="productos-overlay absolute inset-0 z-0 bg-[#030035]">
          <RippleGrid 
            baseColor="rgba(229, 229, 229, 0.05)" 
            accentColor="rgba(229, 229, 229, 0.25)" 
          />
        </div>

        {/* ── LAYER 1: Product Slides (Light Background) ── */}
        <div
          ref={slidesRef}
          className="productos-slides absolute inset-0 z-10"
          style={{ background: '#E5E5E5', clipPath: 'inset(49.9% 50% 49.9% 50%)' }}
        >
          {/* Spotlight Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
            <div
              ref={spotlightGridRef}
              className="absolute inset-0 w-full h-full"
              style={{
                maskImage: 'radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%), conic-gradient(from calc(var(--grid-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%), conic-gradient(from calc(var(--grid-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'intersect',
                '--grid-angle': '0deg',
              } as React.CSSProperties}
            >
              <div
                className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-screen h-screen"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(3, 0, 53, 0.5) 1px, transparent 1px), 
                    linear-gradient(to bottom, rgba(3, 0, 53, 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '72px 72px',
                  backgroundPosition: '36px 36px',
                  maskImage: 'radial-gradient(circle at center, transparent 8px, black 12px)',
                  WebkitMaskImage: 'radial-gradient(circle at center, transparent 8px, black 12px)',
                  maskSize: '72px 72px',
                  WebkitMaskSize: '72px 72px',
                }}
              />
            </div>
            <div
              ref={spotlightDotsRef}
              className="absolute inset-0 w-full h-full"
              style={{
                maskImage: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%), conic-gradient(from calc(var(--dots-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%), conic-gradient(from calc(var(--dots-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'intersect',
                '--dots-angle': '0deg',
              } as React.CSSProperties}
            >
              <div
                className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-screen h-screen"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 36px 36px, rgba(3, 0, 53, 0.7) 1.5px, transparent 1.5px)
                  `,
                  backgroundSize: '72px 72px',
                  backgroundPosition: '0px 0px',
                }}
              />
            </div>
          </div>

          <div className="absolute top-[15%] left-0 overflow-hidden opacity-[0.05] select-none pointer-events-none whitespace-nowrap flex">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="productos-marquee font-display text-[15vw] leading-none uppercase pr-20 text-[#030035]">
                Dima Finance • Crédito • Capital • Liquidez •
              </span>
            ))}
          </div>

          {/* ── Perbaikan Slider Angka: Dinamis sesuai ukuran layar ── */}
          <div className="absolute left-6 md:left-16 bottom-8 md:bottom-10 z-30 pointer-events-none">
            <div className="overflow-hidden h-[70px] md:h-[140px] [--slide-h:70px] md:[--slide-h:140px]">
              <div 
                className="transition-transform duration-700 ease-out" 
                style={{ transform: `translateY(calc(-1 * ${active} * var(--slide-h)))` }}
              >
                {productsData.map((p, i) => (
                  <span
                    key={i}
                    className="block font-display text-[70px] md:text-[120px] leading-[70px] md:leading-[140px] transition-colors duration-500"
                    style={{ color: active === i ? '#E5997B' : 'rgba(3, 0, 53, 0.12)' }}
                  >
                    {p.number}
                  </span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[#030035]/50 text-[8px] md:text-[10px] tracking-[0.5em] uppercase mt-2 font-bold hidden md:block">
              Portafolio DIMA
            </p>
          </div>

          {/* ── Perbaikan Bar Pagination di Kanan ── */}
          <div className="absolute right-4 md:right-16 top-0 h-full flex flex-col justify-center items-center gap-3 z-30 pointer-events-none">
            <div className="h-[120px] md:h-[180px] w-px bg-[#030035]/10 relative">
              <div 
                className="absolute top-0 left-0 w-full bg-[#E5997B] transition-all duration-700 ease-out" 
                style={{ height: `${((active + 1) / productsData.length) * 100}%` }} 
              />
            </div>
            <span className="font-mono text-[#030035]/40 text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold" style={{ writingMode: 'vertical-rl' }}>
              {String(active + 1).padStart(2, '0')} / {String(productsData.length).padStart(2, '0')}
            </span>
          </div>

          {/* ── Perbaikan Konten Slide Utama ── */}
          <div className="relative w-full h-full z-10 pointer-events-none">
            {productsData.map((p) => (
              <div key={p.number} className="product-slide absolute inset-0 flex flex-col items-center justify-center px-6 md:px-20 lg:px-36">
                <div className="max-w-6xl w-full pt-6 md:pt-0 pointer-events-auto">
                  <div className="w-16 md:w-28 h-[2px] md:h-[3px] bg-[#E5997B] mb-6 md:mb-10" />
                  <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#030035] leading-[1.05] mb-4 md:mb-8 tracking-tight">
                    <span className="text-[#E5997B] italic">"</span>{p.label}<span className="text-[#E5997B] italic">"</span>
                  </h2>
                  <p className="font-body text-xl sm:text-2xl md:text-3xl text-[#030035]/70 leading-relaxed mb-4 md:mb-6 max-w-3xl">
                    {p.tagline}
                  </p>
                  <p className="font-body text-sm sm:text-base md:text-xl text-[#030035]/50 leading-relaxed max-w-2xl mb-8 md:mb-10">
                    {p.desc}
                  </p>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 pt-6 md:pt-8 border-t border-[#030035]/10">
                    <div>
                      <p className="font-body text-[#030035] text-lg md:text-2xl font-semibold">— {p.label}</p>
                      <p className="text-[#030035]/40 font-mono text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] uppercase mt-1 font-bold">DIMA Finance — Portafolio</p>
                    </div>
                    <p className="font-mono text-[#E5997B] text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.6em] uppercase font-bold mt-2 md:mt-0">
                      {p.sector}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

       {/* ... scroll para explorar ... */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none">
            <span className="font-mono text-[#030035]/30 text-[8px] md:text-[9px] tracking-[0.5em] uppercase font-bold">Scroll para explorar</span>
            <div className="w-px h-4 md:h-6 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
          </div>

        </div> 
        {/* ⇧⇧⇧ INI PENUTUP DARI DIV "productos-slides", JANGAN DIHAPUS ⇧⇧⇧ */}


        {/* ── PASTE CEKUNGAN BAWAH DI SINI (DI LUAR SLIDES) ── */}
        <div className="absolute -bottom-[2px] left-0 w-full z-[60] pointer-events-none text-[#030035]">
          <div className="relative w-full h-16 md:h-32 scale-x-110">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
              style={{ transform: 'scaleY(-1)', overflow: 'visible' }}
            >
              <path
                ref={sectionBottomCurveRef}
                d="M0,-50 L1440,-50 L1440,0 C1100,0 950,0 720,0 C490,0 340,0 0,0 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        {/* ─────────────────────────────────────────────────── */}


        <div
          ref={topCurveWrapRef}
          className="absolute left-0 w-full z-[15] pointer-events-none text-[#E5E5E5]"
          style={{ top: '49.9%', height: '120px', transform: 'translateY(-100%)' }}
        >
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-full" style={{ overflow: 'visible' }}>
            <path ref={topCurveRef} fill="currentColor" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        
        <div
          ref={bottomCurveWrapRef}
          className="absolute left-0 w-full z-[15] pointer-events-none text-[#E5E5E5]"
          style={{ top: '50.1%', height: '120px' }}
        >
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-full" style={{ overflow: 'visible' }}>
           <path ref={bottomCurveRef} fill="currentColor" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* ── LAYER 2: Teks Tunggal "Productos" ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="overflow-hidden py-4 px-4 flex items-center justify-center">
            <div
              className="block select-none font-display font-light tracking-tight leading-none text-[#F4F4F5] whitespace-nowrap"
              style={{
                fontSize: 'clamp(3rem, 18vw, 18rem)',
                willChange: 'transform, opacity',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              {"Productos".split('').map((char, index) => (
                <span key={index} className="producto-char inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}