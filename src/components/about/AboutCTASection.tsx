import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutCTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef      = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      // Background parallax
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { y: 30, scale: 1.1 },
          {
            y: -30, scale: 1.05, ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', end: 'bottom top', scrub: true,
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
      className="cta-section relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
    >

      {/* ── Background photo ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src="/foto/brand-nature.jpg"
          alt=""
          className="w-full h-full object-cover will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#030035]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030035]/50 via-[#030035]/60 to-[#030035]/90" />
      </div>

      {/* ── Engineering grid ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(229,153,123,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229,153,123,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Radial bronze halo ───────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(229,153,123,0.07) 0%, transparent 60%)',
        }}
      />

      {/* ── Corner brackets ──────────────────────────────────── */}
      <svg className="absolute top-10 left-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M0 20 L0 0 L20 0" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>
      <svg className="absolute top-10 right-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M40 20 L40 0 L20 0" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>
      <svg className="absolute bottom-10 left-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M0 20 L0 40 L20 40" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>
      <svg className="absolute bottom-10 right-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M40 20 L40 40 L20 40" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>

      {/* ── Horizontal rules ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5997B]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5997B]/15 to-transparent" />

      {/* ── CTA content ──────────────────────────────────────── */}
      <div className="cta-content relative z-10 w-full max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center gap-10">

        {/* Eyebrow */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-px bg-[#E5997B]/40" />
          <span className="font-mono text-[9px] tracking-[0.6em] uppercase text-[#E5997B]/55">
            Siguiente Paso
          </span>
          <div className="w-8 h-px bg-[#E5997B]/40" />
        </div>

        {/* Main heading */}
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-[clamp(3rem,7vw,6.5rem)] text-[#F4F4F5] font-light leading-[1.0] tracking-tight">
            Hablemos de
          </h2>
          <h2 className="font-display italic text-[clamp(3rem,7vw,6.5rem)] text-[#E5997B] font-light leading-[1.0] tracking-tight">
            su empresa.
          </h2>
        </div>

        {/* Descriptor */}
        <div className="flex flex-col items-center gap-4 max-w-md">
          <div className="w-8 h-px bg-[#E5997B]/25" />
          <p className="text-[#F4F4F5]/50 text-sm md:text-base leading-[1.9] font-light"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}>
            Agende una sesión de 30 minutos con nuestro equipo. Diagnóstico preliminar sin costo — sin compromiso.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            to="/contacto"
            className="flex-1 px-8 py-4 bg-[#E5997B] text-[#030035] font-medium text-xs uppercase tracking-[0.2em] hover:bg-[#d4856a] transition-colors duration-300 text-center"
          >
            Agendar Consulta
          </Link>
          <Link
            to="/modelo-crediticio"
            className="flex-1 px-8 py-4 bg-transparent border border-[#F4F4F5]/15 text-[#F4F4F5]/60 font-light text-xs uppercase tracking-[0.2em] hover:border-[#E5997B]/50 hover:text-[#E5997B]/80 transition-all duration-300 text-center"
          >
            Nuestro Modelo
          </Link>
        </div>

        {/* Fine print */}
        <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#F4F4F5]/15">
          Sesión de 30 minutos · Sin compromiso · Video conferencia
        </p>

        {/* Balance SVG ornament */}
        <div className="mt-4 opacity-[0.07]">
          <svg viewBox="0 0 200 60" fill="none" className="w-48 h-auto">
            <line x1="100" y1="5" x2="100" y2="55" stroke="#E5997B" strokeWidth="1"/>
            <line x1="20" y1="5" x2="180" y2="5" stroke="#E5997B" strokeWidth="1.2"/>
            <line x1="20" y1="5" x2="5" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <line x1="20" y1="5" x2="35" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <path d="M2 40 C 2 55, 38 55, 38 40 Z" stroke="#E5997B" strokeWidth="0.8"/>
            <line x1="180" y1="5" x2="165" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <line x1="180" y1="5" x2="195" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <path d="M162 40 C 162 55, 198 55, 198 40 Z" stroke="#E5997B" strokeWidth="0.8"/>
            <rect x="94" y="53" width="12" height="6" stroke="#E5997B" strokeWidth="0.6"/>
          </svg>
        </div>
      </div>

      {/* ── Bottom metadata ──────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 py-4 px-8 md:px-16 flex items-center justify-between border-t border-[#F4F4F5]/5">
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">
          DIMA Finance — SOFOM E.N.R.
        </span>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">
          México — MMXXIV
        </span>
      </div>
    </section>
  )
}