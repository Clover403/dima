import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const overview = [
  { num: '01', name: 'Crédito Simple', hook: 'Capital a plazo fijo para expandir capacidad instalada.', use: 'Adquisición de activos y expansión' },
  { num: '02', name: 'Crédito Puente', hook: 'Financiamiento alineado al avance de obra inmobiliaria.', use: 'Desarrollos inmobiliarios' },
  { num: '03', name: 'Cuenta Corriente', hook: 'Línea revolvente para gestionar ciclos operativos.', use: 'Capital de trabajo recurrente' },
  { num: '04', name: 'Crédito Agroindustrial', hook: 'Financiamiento calibrado a ciclos de cosecha.', use: 'Sector agropecuario' },
  { num: '05', name: 'Arrendamiento Financiero', hook: 'Activos productivos sin descapitalización.', use: 'Maquinaria y tecnología' },
  { num: '06', name: 'Factoring', hook: 'Liquidez inmediata sobre cuentas por cobrar.', use: 'Cadena de valor y flujo de efectivo' },
]

export default function ProductosOverview() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const el = sectionRef.current

    const ctx = gsap.context(() => {
      // Title mask reveal
      gsap.from('.reveal-text', {
        y: 100,
        skewY: 5,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 80%' },
      })

      // Decorative line draw
      gsap.from('.decorative-line', {
        scaleX: 0,
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 75%' },
      })

      // Cards stagger
      const cards = el.querySelectorAll('.overview-card')
      const grid = el.querySelector('.overview-grid')

      gsap.set(cards, { autoAlpha: 1, y: 0 })

      if (cards.length && grid) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.08,
            immediateRender: false,
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName('overview-card')
    for (const card of cards as any) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden py-32 md:py-52"
      style={{ background: '#F4F4F5' }}
    >
      {/* ── Subtle dot texture ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.45]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(3,0,53,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Ambient navy glow — top center ─────────────────────────────── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-navy/[0.04] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="mb-14 md:mb-16 flex flex-col items-start">
          <div className="overflow-hidden mb-4">
            <p className="reveal-text font-body text-[11px] tracking-[0.5em] uppercase text-bronze font-medium">
              Portafolio de Soluciones
            </p>
          </div>
          <div className="overflow-hidden mb-3">
            <h2 className="reveal-text font-display text-[clamp(48px,7vw,96px)] text-navy leading-[0.9] tracking-tighter">
              Productos
            </h2>
          </div>
          <div className="overflow-hidden mb-10">
            <h2 className="reveal-text font-display text-[clamp(48px,7vw,96px)] text-navy leading-[0.9] tracking-tighter">
              <em className="text-bronze italic">Estratégicos.</em>
            </h2>
          </div>
          <div className="decorative-line w-20 h-px bg-bronze/50 origin-left" />
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        <div className="overview-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {overview.map((item) => (
            <div
              key={item.num}
              className="overview-card group relative overflow-hidden transition-all duration-500"
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid rgba(3,0,53,0.07)',
                padding: '40px',
              }}
            >
              {/* Spotlight on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(229,153,123,0.1), transparent 60%)',
                  borderRadius: '20px',
                }}
              />

              {/* Top border accent — slides in on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-bronze origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" style={{ borderRadius: '20px 20px 0 0' }} />

              {/* Ghost number */}
              <span className="absolute -top-3 -right-2 font-display text-[80px] leading-none select-none text-navy/[0.04] group-hover:text-bronze/[0.07] transition-colors duration-500">
                {item.num}
              </span>

              <div className="relative z-10 h-full flex flex-col">
                {/* Number tag */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase text-navy/30 font-medium">
                    {item.num}
                  </span>
                  <div className="flex-1 h-px bg-navy/10 group-hover:bg-bronze/30 transition-colors duration-500" />
                </div>

                {/* Title */}
                <h3 className="font-display text-[clamp(20px,1.8vw,26px)] text-navy leading-tight mb-4 group-hover:text-bronze transition-colors duration-400 tracking-tight">
                  {item.name}
                </h3>

                {/* Hook */}
                <p className="font-body text-[15px] text-navy/50 leading-relaxed mb-auto group-hover:text-navy/70 transition-colors duration-400 min-h-[64px]">
                  {item.hook}
                </p>

                {/* Use case tag */}
                <div className="flex items-center gap-2 mt-8 pt-6 border-t border-navy/[0.06] group-hover:border-bronze/20 transition-colors duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-bronze flex-shrink-0" />
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-bronze font-medium">
                    {item.use}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="flex justify-center mt-20 md:mt-28">
          <Link
            to="/contacto"
            className="group relative inline-flex items-center gap-4 overflow-hidden"
            style={{
              background: '#030035',
              borderRadius: '4px',
              padding: '20px 48px',
            }}
          >
            {/* Bronze wipe on hover */}
            <div className="absolute inset-0 bg-bronze translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

            <span className="relative z-10 font-body text-[11px] tracking-[0.35em] uppercase text-white group-hover:text-navy transition-colors duration-300 font-medium">
              Solicitar Asesoría Personalizada
            </span>
            <svg
              className="relative z-10 transition-all duration-300 group-hover:translate-x-1"
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white group-hover:text-navy transition-colors duration-300"
              />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}