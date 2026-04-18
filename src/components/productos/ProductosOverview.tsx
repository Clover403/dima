import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import AnimatedGrid from '../AnimatedGrid'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    num: '01',
    name: 'Crédito Simple',
    hook: 'Capital a plazo fijo, pagos predecibles.',
    desc: 'Obtén capital para proyectos específicos sin afectar tu flujo de caja. Monto definido, tasa fija, amortizaciones estructuradas.',
    use: 'Adquisición de activos y expansión',
  },
  {
    num: '02',
    name: 'Crédito Puente',
    hook: 'Financiamiento alineado al avance de obra.',
    desc: 'Diseñado para cubrir costos de un proyecto inmobiliario mientras se materializa la fuente de pago esperada.',
    use: 'Desarrollos inmobiliarios',
  },
  {
    num: '03',
    name: 'Cuenta Corriente',
    hook: 'Línea revolvente para ciclos operativos.',
    desc: 'Una vez liquidado, el crédito vuelve a estar disponible mientras el contrato esté activo. Control centralizado de operaciones.',
    use: 'Capital de trabajo recurrente',
  },
  {
    num: '04',
    name: 'Crédito Agroindustrial',
    hook: 'Financiamiento calibrado a ciclos de cosecha.',
    desc: 'Pagos estructurados según ciclos de producción agrícola. Evaluación del proyecto, aprobación y disposición de recursos.',
    use: 'Sector agropecuario',
  },
  {
    num: '05',
    name: 'Arrendamiento Financiero',
    hook: 'Activos productivos sin descapitalización.',
    desc: 'Uso y adquisición final del activo mediante pagos periódicos. El bien se registra en balance con deducción fiscal de intereses y depreciación.',
    use: 'Maquinaria y tecnología',
  },
  {
    num: '06',
    name: 'Factoring',
    hook: 'Liquidez inmediata sobre cuentas por cobrar.',
    desc: 'Anticipo sobre el valor de tus facturas. La institución gestiona la cobranza. No esperes a que tus clientes paguen.',
    use: 'Cadena de valor y flujo de efectivo',
  },
]

// Total scroll budget:
// zoom phase:   0 → 3.5  (3.5 units)
// gap/hold:     3.5 → 4  (0.5 units)
// slides phase: 4 → 4 + (N-1)*3 = 4 + 15 = 19 units
// Total: ~20 units → end = +=2000%
const ZOOM_END   = 3.5
const SLIDES_START = 4
const SLIDE_DUR  = 3     // units per slide transition

export default function ProductosOverview() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [slidesVisible, setSlidesVisible] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!wrapperRef.current) return

      // Initial states
      gsap.set('.productos-overlay', { opacity: 1 })
      gsap.set('.productos-word',    { scale: 1, opacity: 1 })
      gsap.set('.productos-slides',  { opacity: 0 })
      gsap.set('.product-slide',     { opacity: 0, yPercent: 0 })
      gsap.set('.product-slide:first-child', { opacity: 1 })

      // Marquee
      gsap.to('.productos-marquee', {
        xPercent: -50,
        repeat: -1,
        duration: 60,
        ease: 'none',
      })

      // ── ONE master timeline ──────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          // zoom 350% + hold 50% + slides 5×150% = 350+50+750 = 1150%
          end: `+=1150%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            // Slides phase starts at ~30% of total progress (3.5/~20)
            const slidesPhaseStart = SLIDES_START / 19
            if (p >= slidesPhaseStart) {
              const slidesProgress = (p - slidesPhaseStart) / (1 - slidesPhaseStart)
              const idx = Math.min(
                Math.floor(slidesProgress * products.length),
                products.length - 1
              )
              setActive(idx)
            }
          },
        },
      })

      // ── ZOOM PHASE (t=0 → 3.5) ──────────────────────────────────────

      // Word scales up — more left (44%) and more down (62%)
      tl.to('.productos-word', {
        scale: 80,
        ease: 'power2.inOut',
        duration: ZOOM_END,
      }, 0)

      // Overlay fades late — deep inside letter fill, no curves
      tl.to('.productos-overlay', {
        opacity: 0,
        ease: 'power3.in',
        duration: 0.4,
      }, 2.9)

      // Word fades out
      tl.to('.productos-word', {
        opacity: 0,
        ease: 'power2.in',
        duration: 0.3,
      }, 3.1)

      // Slides layer fades in as word disappears
      tl.to('.productos-slides', {
        opacity: 1,
        ease: 'power2.out',
        duration: 0.5,
      }, 3.2)

      // ── SLIDES PHASE (t=4 → 19) ──────────────────────────────────────
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

    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  return (
    <div>
      {/* ══════════════════════════════════════════════════════
          SINGLE PINNED WRAPPER
          Layer 0: slides content (lightgray) — always rendered
          Layer 1: lightgray overlay
          Layer 2: "Productos" word
      ══════════════════════════════════════════════════════ */}
      <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden">
        <AnimatedGrid cellSize={60} color="229,153,123" />

        {/* ── LAYER 0: Product slides (lightgray bg) ── */}
        <div className="productos-slides absolute inset-0 z-0" style={{ background: '#F4F4F5' }}>

          {/* Dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.45]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(3,0,53,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #030035 1px, transparent 1px), linear-gradient(to bottom, #030035 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Background marquee — top, like DalioPrinciples */}
          <div className="absolute top-[15%] left-0 overflow-hidden opacity-[0.04] select-none pointer-events-none whitespace-nowrap flex">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="productos-marquee font-display text-[15vw] leading-none uppercase pr-20 text-[#030035]"
              >
                Dima Finance • Crédito • Capital • Liquidez •
              </span>
            ))}
          </div>

          {/* Left: animated counter */}
          <div className="absolute left-8 md:left-16 bottom-10 z-30">
            <div className="overflow-hidden" style={{ height: '120px' }}>
              <div
                className="transition-transform duration-700 ease-out"
                style={{ transform: `translateY(-${active * 120}px)` }}
              >
                {products.map((p, i) => (
                  <span
                    key={i}
                    className="block font-display text-[100px] leading-[120px] transition-colors duration-500"
                    style={{ color: active === i ? '#E5997B' : 'rgba(3,0,53,0.12)' }}
                  >
                    {p.num}
                  </span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[#030035]/25 text-[8px] tracking-[0.5em] uppercase mt-2">
              Portafolio DIMA
            </p>
          </div>

          {/* Right: progress bar */}
          <div className="absolute right-8 md:right-16 top-0 h-full flex flex-col justify-center items-center gap-3 z-30">
            <div className="h-[180px] w-px bg-[#030035]/10 relative">
              <div
                className="absolute top-0 left-0 w-full bg-[#E5997B] transition-all duration-700 ease-out"
                style={{ height: `${((active + 1) / products.length) * 100}%` }}
              />
            </div>
            <span
              className="font-mono text-[#030035]/25 text-[8px] tracking-[0.5em] uppercase"
              style={{ writingMode: 'vertical-rl' }}
            >
              {String(active + 1).padStart(2, '0')} / 06
            </span>
          </div>

          {/* Slides */}
          <div className="relative w-full h-full z-10">
            {products.map((p, i) => (
              <div
                key={p.num}
                className="product-slide absolute inset-0 flex flex-col items-center justify-center px-8 md:px-24 lg:px-48"
              >
                <div className="max-w-6xl w-full">

                  {/* Bronze bar */}
                  <div className="w-24 h-2 bg-[#E5997B] mb-10" />

                  {/* Product name */}
                  <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#030035] leading-[1.1] mb-8 tracking-tight">
                    <span className="text-[#E5997B] italic">"</span>{p.name}<span className="text-[#E5997B] italic">"</span>
                  </h2>

                  {/* Hook */}
                  <p className="font-body text-xl md:text-2xl text-[#030035]/55 leading-relaxed mb-6 max-w-3xl">
                    {p.hook}
                  </p>

                  {/* Description */}
                  <p className="font-body text-sm md:text-base text-[#030035]/40 leading-relaxed max-w-2xl mb-10">
                    {p.desc}
                  </p>

                  {/* Bottom attribution row */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-8 border-t border-[#030035]/8">
                    <div>
                      <p className="font-body text-[#030035] text-lg md:text-xl font-semibold">
                        — {p.name}
                      </p>
                      <p className="text-[#030035]/30 font-mono text-[9px] tracking-[0.4em] uppercase mt-1">
                        DIMA Finance — Portafolio Crediticio
                      </p>
                    </div>
                    <p className="font-mono text-[#E5997B] text-[10px] md:text-xs tracking-[0.6em] uppercase font-bold">
                      {p.use}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Bottom scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none">
            <span className="font-mono text-[#030035]/20 text-[8px] tracking-[0.5em] uppercase">
              Scroll para explorar
            </span>
            <div className="w-px h-6 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
          </div>
        </div>

        {/* ── LAYER 1: Lightgray overlay ── */}
        <div className="productos-overlay absolute inset-0 z-10 pointer-events-none" style={{ background: '#F4F4F5' }} />

        {/* ── LAYER 2: Scaling word ──
            transformOrigin: '54% 62%'
            44% = slightly left of center (toward "P")
            62% = below center (more downward zoom point)
            Overlay fades at scale ~34 → deep inside letter fill, no curves
        ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <span
            className="productos-word select-none font-display font-light tracking-tight leading-none text-[#030035]"
            style={{
              fontSize: 'clamp(6rem, 22vw, 18rem)',
              transformOrigin: '54% 62%',
              willChange: 'transform, opacity',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            Productos
          </span>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════
          CTA strip after all slides are done
      ══════════════════════════════════════════════════════ */}
      <div className="relative py-24 bg-[#F4F4F5] border-t border-[#030035]/5 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.45]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(3,0,53,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-[#030035]/20" />
            <span className="font-mono text-[#030035]/35 text-[9px] tracking-[0.6em] uppercase">
              ¿Cuál es el adecuado para su empresa?
            </span>
            <div className="w-8 h-px bg-[#030035]/20" />
          </div>
          <Link
            to="/contacto"
            className="group relative inline-flex items-center gap-4 overflow-hidden px-12 py-5 bg-[#030035]"
          >
            <div className="absolute inset-0 bg-[#E5997B] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 font-mono text-[10px] tracking-[0.3em] uppercase text-[#F4F4F5] group-hover:text-[#030035] transition-colors duration-300">
              Solicitar Asesoría Personalizada
            </span>
            <svg className="relative z-10 w-4 h-4 text-[#F4F4F5] group-hover:text-[#030035] group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#030035]/20">
            Sesión de 30 min · Sin compromiso
          </p>
        </div>
      </div>
    </div>
  )
}