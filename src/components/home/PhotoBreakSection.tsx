import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PhotoBreakSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const photoRef    = useRef<HTMLImageElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef= useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      // Photo parallax
      if (photoRef.current) {
        gsap.fromTo(photoRef.current,
          { y: '-8%' },
          {
            y: '8%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // Horizontal lines expand from center
      if (lineLeftRef.current && lineRightRef.current) {
        gsap.fromTo([lineLeftRef.current, lineRightRef.current],
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: 'power3.out',
            stagger: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
            },
          }
        )
      }

      // Quote lines — each line staggers in from bottom
      const lines = sectionRef.current.querySelectorAll('.quote-line')
      gsap.fromTo(lines,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      )

      // Attribution fade
      gsap.fromTo('.photo-attribution',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      )

      // Metadata bars slide in
      gsap.fromTo('.photo-meta',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
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
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Full-bleed photo */}
      <img
        ref={photoRef}
        src="/foto/brand-nature.jpg"
        alt=""
        className="absolute inset-0 w-full h-[116%] object-cover will-change-transform"
        loading="lazy"
      />

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-[#030035]/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030035]/80 via-transparent to-[#030035]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030035]/30 via-transparent to-[#030035]/30" />

      {/* Bronze grid overlay — DIMA signature */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(229,153,123,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229,153,123,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner brackets */}
      {(['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'] as const).map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none`} viewBox="0 0 40 40" fill="none">
          <path
            d={['M0 20 L0 0 L20 0','M40 20 L40 0 L20 0','M0 20 L0 40 L20 40','M40 20 L40 40 L20 40'][i]}
            stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.35"
          />
        </svg>
      ))}

      {/* Left metadata column */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5">
        {[
          'DIMA Finance — México',
          '19°26\'N 99°08\'O',
          'SOFOM E.N.R.',
        ].map((text, i) => (
          <div key={i} className="photo-meta flex items-center gap-3">
            <div className="w-4 h-px bg-[#E5997B]/40" />
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/25">
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Right metadata column */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 items-end">
        {[
          'Arquitectura de Equilibrio',
          'Ingeniería Crediticia',
          'Est. MMXXIV',
        ].map((text, i) => (
          <div key={i} className="photo-meta flex items-center gap-3">
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/25">
              {text}
            </span>
            <div className="w-4 h-px bg-[#E5997B]/40" />
          </div>
        ))}
      </div>

      {/* Main content — centered */}
      <div
        ref={textRef}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 md:px-24 lg:px-40"
      >

        {/* Top ornament line */}
        <div className="flex items-center gap-6 mb-14">
          <div
            ref={lineLeftRef}
            className="w-24 md:w-40 h-px bg-[#E5997B]/50 origin-right"
          />
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
            <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#E5997B" fillOpacity="0.5" />
          </svg>
          <div
            ref={lineRightRef}
            className="w-24 md:w-40 h-px bg-[#E5997B]/50 origin-left"
          />
        </div>

        {/* Quote — split into animatable lines */}
        <blockquote className="max-w-4xl mb-10">
          <p className="quote-line font-display text-[clamp(2.2rem,5vw,5.5rem)] text-[#F4F4F5] italic leading-[1.1] tracking-tight">
            "Donde otros ven deuda,
          </p>
          <p className="quote-line font-display text-[clamp(2.2rem,5vw,5.5rem)] leading-[1.1] tracking-tight">
            <span className="text-[#E5997B] italic">nosotros diseñamos</span>
            <span className="text-[#F4F4F5] italic"> productividad."</span>
          </p>
        </blockquote>

        {/* Attribution */}
        <div className="photo-attribution flex items-center gap-5">
          <div className="w-8 h-px bg-[#E5997B]/40" />
          <span className="font-mono text-[#E5997B]/70 text-[9px] tracking-[0.6em] uppercase">
            DIMA Finance — Principio Fundacional
          </span>
          <div className="w-8 h-px bg-[#E5997B]/40" />
        </div>

      </div>

      {/* Bottom metadata bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-16 flex items-center justify-between">
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/15">
          Sociedad Financiera de Objeto Múltiple
        </span>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-[#E5997B]/20" style={{ opacity: 0.1 + i * 0.15 }} />
          ))}
        </div>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/15">
          Arquitectos de Equilibrio
        </span>
      </div>

    </section>
  )
}