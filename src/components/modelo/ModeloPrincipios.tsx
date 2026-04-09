import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    num: '01',
    quote: 'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.',
    subtitle: 'Causalidad Productiva',
    explanation: 'El crédito se considera legítimo únicamente cuando la productividad futura generada es suficiente para amortizar el pasivo de forma independiente.',
  },
  {
    num: '02',
    quote: 'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tiempo perderás competitividad.',
    subtitle: 'Eficiencia Operativa',
    explanation: 'El modelo evalúa la Productividad del Capital más allá del crecimiento nominal de ingresos. Un aumento de ingresos derivado únicamente de indexación de precios erosionan la competitividad.',
  },
  {
    num: '03',
    quote: 'Haz todo lo posible por aumentar tu productividad, porque, a largo plazo, eso es lo que más importa.',
    subtitle: 'Financiamiento "Tractor"',
    explanation: 'La asignación de recursos se canaliza hacia la productividad — activos que optimizan procesos — y no hacia consumo improductivo.',
  },
]

export default function ModeloPrincipios() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const dotRefs    = useRef<(HTMLDivElement | null)[]>([])
  const innerRefs  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current || !wrapRef.current || !lineRef.current) return

    const ctx = gsap.context(() => {
      const wrap   = wrapRef.current!
      const line   = lineRef.current!
      const blocks = Array.from(sectionRef.current!.querySelectorAll<HTMLElement>('.principle'))

      // ── Content reveal per block ────────────────────────────────────────
      innerRefs.current.forEach((inner) => {
        if (!inner) return
        gsap.from(inner, {
          y: 48,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: inner,
            start: 'top 82%',
          },
        })
      })

      // ── Line draw + dot sync ─────────────────────────────────────────────
      // Satu ScrollTrigger mengontrol semuanya via onUpdate
      // sehingga line progress dan dot activation SELALU sinkron
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top 20%',   // line mulai bergerak pas wrap masuk 20% dari atas
        end: 'bottom 80%',  // selesai pas wrap hampir keluar bawah
        scrub: 2,           // angka lebih tinggi = lebih lambat / smooth
        onUpdate: (self) => {
          const prog  = self.progress              // 0.0 → 1.0
          const wrapH = wrap.offsetHeight
          const lineH = wrapH * prog               // sudah berapa px line berjalan

          // Terapkan ke line
          line.style.transform = `scaleY(${prog})`

          // Check tiap dot — dot nyala kalau line sudah mencapai posisinya
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return
            const block     = blocks[i]
            // Posisi dot = offsetTop block + offset kecil (titik dot di dalam block)
            const dotOffset = block.offsetTop + 8
            const reached   = lineH >= dotOffset

            const inner = dot.querySelector<HTMLElement>('.dot-inner')

            if (reached) {
              dot.style.background  = '#E5997B'
              dot.style.borderColor = '#E5997B'
              dot.style.transform   = 'scale(1.25)'
              dot.style.boxShadow   = '0 0 20px rgba(229,153,123,0.6)'
              if (inner) inner.style.background = '#030035'
            } else {
              dot.style.background  = '#030035'
              dot.style.borderColor = 'rgba(255,255,255,0.2)'
              dot.style.transform   = 'scale(1)'
              dot.style.boxShadow   = 'none'
              if (inner) inner.style.background = 'rgba(255,255,255,0.2)'
            }
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#030035] overflow-hidden py-32 md:py-56 px-6 lg:px-24">

      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-bronze/10 rounded-full blur-[150px]" />
      </div>

      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-32 relative z-10">
        <h2 className="font-display text-[clamp(40px,7vw,80px)] text-white tracking-tighter leading-none">
          Tres principios,{' '}
          <span className="text-bronze italic">una arquitectura</span>
        </h2>
      </div>

      {/* Principles wrap */}
      <div ref={wrapRef} className="principles-wrap relative max-w-6xl mx-auto z-10">

        {/* Vertical line track */}
        <div className="absolute left-[15px] md:left-[40px] top-0 bottom-0 w-[2px] bg-white/10">
          <div
            ref={lineRef}
            className="absolute top-0 left-0 w-full h-full bg-bronze"
            style={{ transform: 'scaleY(0)', transformOrigin: 'top' }}
          />
        </div>

        <div className="space-y-48">
          {principles.map((p, i) => (
            <div key={i} className="principle relative pl-16 md:pl-24">

              {/* Dot */}
              <div className="absolute left-[-11px] md:left-[14px] top-2 z-20">
                <div
                  ref={(el) => { dotRefs.current[i] = el }}
                  className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                  style={{
                    background:   '#030035',
                    borderColor:  'rgba(255,255,255,0.2)',
                    transition:   'background 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                  }}
                >
                  <div
                    className="dot-inner w-1.5 h-1.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      transition: 'background 0.3s',
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div
                ref={(el) => { innerRefs.current[i] = el }}
                className="content-inner grid lg:grid-cols-[1fr_2fr] gap-8"
              >
                <div className="relative">
                  <span className="font-display text-8xl text-white/[0.03] leading-none absolute -top-10 -left-10 select-none">
                    {p.num}
                  </span>
                  <p className="relative z-10 text-bronze font-body text-xs tracking-[0.4em] uppercase font-bold pt-4">
                    {p.subtitle}
                  </p>
                </div>

                <div className="max-w-2xl">
                  <blockquote className="font-display text-2xl md:text-4xl text-white/90 leading-tight mb-8 italic">
                    "{p.quote}"
                  </blockquote>
                  <p className="font-body text-white/30 text-base md:text-lg leading-relaxed font-light">
                    {p.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <PremiumCTA />

    </section>
  )
}

// ── Premium CTA ───────────────────────────────────────────────────────────────
function PremiumCTA() {
  const cardRef   = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const { left, top } = cardRef.current.getBoundingClientRect()
    setCoords({ x: e.clientX - left, y: e.clientY - top })

    if (buttonRef.current) {
      const btn  = buttonRef.current.getBoundingClientRect()
      const btnX = e.clientX - (btn.left + btn.width  / 2)
      const btnY = e.clientY - (btn.top  + btn.height / 2)
      const dist = Math.sqrt(btnX * btnX + btnY * btnY)

      if (dist < 150) {
        gsap.to(buttonRef.current, { x: btnX * 0.35, y: btnY * 0.35, duration: 0.4, ease: 'power2.out' })
      } else {
        gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-48 mb-20 px-6 relative z-10">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.6 })}
        className="group relative overflow-hidden rounded-[2rem] border border-navy/10 bg-[#F4F4F5] transition-all duration-500 hover:border-navy/40"
      >
        {/* Spotlight radial — blue glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, rgba(59,130,246,0.15), transparent 50%)` }}
        />

        {/* ── Abstract flowing lines ────────────────────────────────────── */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[60%] flex items-center justify-end opacity-[0.22] group-hover:opacity-[0.42] transition-opacity duration-700 z-[1]">
          <svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[520px] h-auto">

            {/* ── Primary flowing curves — large sweeping paths ─────────── */}
            <path d="M -20 380 C 80 320, 160 80, 300 60 C 420 42, 480 180, 580 140"
              stroke="#030035" strokeWidth="1.2" strokeOpacity="0.7" fill="none"/>
            <path d="M -20 340 C 100 290, 180 100, 320 85 C 440 68, 490 200, 580 165"
              stroke="#030035" strokeWidth="0.6" strokeOpacity="0.4" fill="none"/>
            <path d="M -20 300 C 120 260, 200 120, 340 110 C 460 95, 500 220, 580 190"
              stroke="#030035" strokeWidth="0.3" strokeOpacity="0.25" fill="none"/>

            {/* ── Secondary wave — opposite direction ───────────────────── */}
            <path d="M -20 40 C 80 100, 200 340, 340 350 C 460 358, 510 240, 580 280"
              stroke="#030035" strokeWidth="1" strokeOpacity="0.6" fill="none"/>
            <path d="M -20 70 C 100 120, 210 340, 350 352 C 470 362, 515 250, 580 295"
              stroke="#030035" strokeWidth="0.5" strokeOpacity="0.35" fill="none"/>
            <path d="M -20 100 C 110 140, 220 340, 360 354 C 480 364, 520 260, 580 310"
              stroke="#030035" strokeWidth="0.25" strokeOpacity="0.2" fill="none"/>

            {/* ── Crossing flow — middle tension ────────────────────────── */}
            <path d="M -20 210 C 140 210, 200 80, 340 200 C 460 300, 500 160, 580 210"
              stroke="#030035" strokeWidth="1.4" strokeOpacity="0.8" fill="none"/>
            <path d="M -20 225 C 140 225, 200 95, 340 215 C 460 315, 500 175, 580 225"
              stroke="#030035" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>

            {/* ── Bronze accent lines — thinner, warmer ─────────────────── */}
            <path d="M 60 420 C 120 340, 240 120, 380 80 C 480 50, 530 160, 580 120"
              stroke="#E5997B" strokeWidth="1.5" strokeOpacity="0.9" fill="none"/>
            <path d="M 80 420 C 140 350, 250 130, 390 90 C 490 60, 535 170, 580 130"
              stroke="#E5997B" strokeWidth="0.6" strokeOpacity="0.5" fill="none"/>

            <path d="M 40 0 C 100 80, 220 300, 360 330 C 470 352, 520 230, 580 265"
              stroke="#E5997B" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
            <path d="M 60 0 C 115 85, 230 305, 370 335 C 478 356, 524 236, 580 272"
              stroke="#E5997B" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>

            {/* ── Fine parallel detail lines — texture ──────────────────── */}
            {[0, 6, 12, 18, 24].map((offset) => (
              <path
                key={offset}
                d={`M -20 ${195 + offset} C 140 ${195 + offset}, 200 ${65 + offset}, 340 ${185 + offset} C 460 ${285 + offset}, 500 ${145 + offset}, 580 ${195 + offset}`}
                stroke="#030035"
                strokeWidth="0.2"
                strokeOpacity="0.15"
                fill="none"
              />
            ))}

          </svg>
        </div>

        <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h3 className="font-display text-4xl md:text-6xl text-navy leading-tight mb-4">
              Ready to architect <br />
              <span className="text-bronze italic">growth?</span>
            </h3>
            <p className="text-navy/40 font-body text-xs tracking-[0.4em] uppercase">
              Request structural diagnostics
            </p>
          </div>

          {/* Magnetic button */}
          <button
            ref={buttonRef}
            className="group/btn relative px-12 py-6 bg-bronze text-navy font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(3,0,53,0.25)]"
          >
            <span className="relative z-10">Request Diagnostics</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          </button>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-bronze/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 z-10" />
      </div>
    </div>
  )
}