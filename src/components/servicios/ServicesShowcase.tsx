import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  number: string
  label: string
  heading: string[]
  descriptor: string
  paragraphs: string[]
  deliverables: string[]
  image: string
  layout: 'photo-left' | 'photo-right'
  theme: 'dark' | 'light'
  ctaLink: string
}

export default function ServicesShowcase({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const total = services.length

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      const q = (sel: string, i: number) => el.querySelectorAll(`[data-${sel}="${i}"]`)

      /* ── Floating ornament parallax ── */
      const ornaments = el.querySelectorAll('.ornament-float')
      ornaments.forEach((orn, idx) => {
        gsap.to(orn, {
          y: idx % 2 === 0 ? -60 : 40,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        })
      })

      /* ── Geometric decoration parallax ── */
      const geoDeco = el.querySelector('.geo-deco')
      if (geoDeco) {
        gsap.to(geoDeco, {
          y: -80,
          rotation: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.5,
          },
        })
      }

      /* ── Desktop: full pinned showcase ── */
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        /* Much longer scroll = slower, more satisfying transitions */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: `+=${(total - 1) * 180}vh`,
            pin: true,
            scrub: 2.5,
            pinSpacing: true,
          },
        })

        for (let i = 1; i < total; i++) {
          /* ── Image cross-fade (slow & smooth) ── */
          tl.to(q('img', i - 1), {
            opacity: 0,
            scale: 1.06,
            duration: 1.2,
            ease: 'power2.inOut',
          })
          tl.fromTo(q('img', i),
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.inOut' },
            '<'
          )

          /* ── Background number swap ── */
          tl.to(q('bgnum', i - 1), { opacity: 0, y: -20, duration: 0.8, ease: 'power2.out' }, '<')
          tl.fromTo(q('bgnum', i),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '<+=0.2'
          )

          /* ── Counter number swap ── */
          tl.to(q('counter', i - 1), { opacity: 0, y: -12, duration: 0.6, ease: 'power3.out' }, '<')
          tl.fromTo(q('counter', i),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '<+=0.1'
          )

          /* ── Content panel: fade out up → pause → fade in from below ── */
          tl.to(q('panel', i - 1), {
            opacity: 0,
            y: -60,
            duration: 0.9,
            ease: 'power3.in',
          }, '<')

          /* Small breathing pause between exit and enter */
          tl.to({}, { duration: 0.3 })

          tl.fromTo(q('panel', i),
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          )

          /* ── Progress dots ── */
          tl.to(q('dot', i - 1), { scale: 0.6, opacity: 0.2, duration: 0.5 }, '<')
          tl.fromTo(q('dot', i),
            { scale: 0.6, opacity: 0.2 },
            { scale: 1, opacity: 1, duration: 0.5 },
            '<'
          )

          /* ── Progress connecting line ── */
          const line = el.querySelector(`[data-line="${i - 1}"]`)
          if (line) {
            tl.fromTo(line,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.6, ease: 'power2.out' },
              '<'
            )
          }

          /* Long hold so user can read before next transition */
          tl.to({}, { duration: 1.2 })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [total])

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="relative min-h-screen bg-navy overflow-hidden"
    >
      {/* ══════════════════════════════════
          BACKGROUND DECORATIONS
      ══════════════════════════════════ */}

      {/* Diamond grid pattern (like ServiciosValues) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]">
        <svg className="w-full h-full" viewBox="0 0 900 700" preserveAspectRatio="xMidYMid slice" fill="none">
          {Array.from({ length: 7 }).map((_, row) =>
            Array.from({ length: 9 }).map((_, col) => (
              <path
                key={`${row}-${col}`}
                d={`M${col * 120 + 60} ${row * 105 + 25}
                    L${col * 120 + 82} ${row * 105 + 52.5}
                    L${col * 120 + 60} ${row * 105 + 80}
                    L${col * 120 + 38} ${row * 105 + 52.5} Z`}
                stroke="#E5997B"
                strokeWidth="0.4"
              />
            ))
          )}
        </svg>
      </div>

      {/* Large geometric ornament (like ModeloHero) */}
      <div className="geo-deco absolute inset-0 pointer-events-none select-none overflow-hidden will-change-transform">
        <svg
          className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.03]"
          viewBox="0 0 700 700"
          fill="none"
        >
          <path d="M350 30L670 350L350 670L30 350Z" stroke="#E5997B" strokeWidth="0.8" />
          <path d="M350 130L570 350L350 570L130 350Z" stroke="#E5997B" strokeWidth="0.5" />
          <line x1="350" y1="30" x2="350" y2="670" stroke="#E5997B" strokeWidth="0.2" />
          <line x1="30" y1="350" x2="670" y2="350" stroke="#E5997B" strokeWidth="0.2" />
        </svg>
      </div>

      {/* Floating diamond ornaments (like ModeloHero) */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="ornament-float absolute top-24 right-[38%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10 opacity-[0.08]">
          <path d="M30 5L55 30L30 55L5 30Z" stroke="#E5997B" strokeWidth="0.7" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="ornament-float absolute bottom-40 left-[52%] pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 opacity-[0.06]">
          <path d="M20 3L37 20L20 37L3 20Z" stroke="#E5997B" strokeWidth="0.6" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [-6, 6, -6], x: [3, -3, 3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="ornament-float absolute top-[60%] right-16 pointer-events-none hidden lg:block"
      >
        <svg viewBox="0 0 50 50" fill="none" className="w-8 h-8 opacity-[0.05]">
          <path d="M25 4L46 25L25 46L4 25Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M25 14L36 25L25 36L14 25Z" stroke="#E5997B" strokeWidth="0.3" />
        </svg>
      </motion.div>

      {/* Vertical bronze accent line (left edge of content area) */}
      <div
        className="absolute hidden lg:block pointer-events-none z-10"
        style={{
          left: '54%',
          top: '15%',
          bottom: '15%',
          width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(229,153,123,0.15) 30%, rgba(229,153,123,0.15) 70%, transparent)',
        }}
      />

      {/* ══════════════════════════════════
          IMAGE LAYER — left 52%, diagonal clip
      ══════════════════════════════════ */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: '54%',
          clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
        }}
      >
        {services.map((svc, i) => (
          <div
            key={svc.number}
            data-img={i}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <img
              src={svc.image}
              alt={svc.label}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {/* Dark gradient toward content side */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(100deg, rgba(13,19,33,0.08) 30%, rgba(13,19,33,0.7) 100%)',
              }}
            />
            {/* Top/bottom vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(13,19,33,0.35) 0%, transparent 18%, transparent 82%, rgba(13,19,33,0.35) 100%)',
              }}
            />
          </div>
        ))}

        {/* Bronze accent line on diagonal edge */}
        <div
          className="absolute inset-y-0 right-0 w-px opacity-15"
          style={{ background: 'linear-gradient(to bottom, transparent, #E5997B 25%, #E5997B 75%, transparent)' }}
        />
      </div>

      {/* ══════════════════════════════════
          BACKGROUND NUMBERS — decorative
      ══════════════════════════════════ */}
      <div
        className="absolute pointer-events-none select-none font-display"
        style={{
          fontSize: 'clamp(12rem, 24vw, 28rem)',
          lineHeight: 0.85,
          bottom: '-0.05em',
          left: '0.08em',
        }}
      >
        {services.map((svc, i) => (
          <span
            key={svc.number}
            data-bgnum={i}
            className="absolute bottom-0 left-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0, color: 'rgba(229,153,123,0.05)' }}
          >
            {svc.number}
          </span>
        ))}
        <span className="invisible" aria-hidden>{services[0].number}</span>
      </div>

      {/* ══════════════════════════════════
          SERVICE COUNTER — below navbar
      ══════════════════════════════════ */}
      <div className="absolute top-28 right-12 z-30 flex items-center gap-2">
        <div className="relative overflow-hidden" style={{ height: '1.4em' }}>
          {services.map((svc, i) => (
            <span
              key={svc.number}
              data-counter={i}
              className="absolute right-0 font-display text-sm tracking-[0.3em] text-bronze will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, transform: 'translateY(0)' }}
            >
              {svc.number}
            </span>
          ))}
          <span className="invisible font-display text-sm tracking-[0.3em]" aria-hidden>
            {services[0].number}
          </span>
        </div>
        <span className="font-display text-sm text-bronze/25 mx-1">/</span>
        <span className="font-display text-sm tracking-[0.3em] text-bronze/30">
          {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* ══════════════════════════════════
          CONTENT PANELS — right side
      ══════════════════════════════════ */}
      <div className="relative z-10 min-h-screen flex items-stretch">
        {/* Left spacer — push content clear of image */}
        <div className="hidden md:block flex-shrink-0" style={{ width: '56%' }} />

        {/* Panel container */}
        <div className="flex-1 relative min-h-screen flex items-center">
          {services.map((svc, i) => (
            <div
              key={svc.number}
              data-panel={i}
              className="absolute inset-0 flex flex-col justify-center will-change-transform"
              style={{
                opacity: i === 0 ? 1 : 0,
                paddingTop: 'clamp(3rem, 6vh, 7rem)',
                paddingBottom: 'clamp(3rem, 6vh, 7rem)',
                paddingLeft: 'clamp(1.5rem, 2vw, 2.5rem)',
                paddingRight: 'clamp(2rem, 4vw, 5rem)',
              }}
            >
              {/* ─── Number + Label ─── */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="font-display uppercase"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.45em', color: 'rgba(229,153,123,0.5)' }}
                >
                  {svc.number}
                </span>
                <span className="block h-px bg-bronze/25" style={{ width: 28 }} />
                <span
                  className="font-body uppercase"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(229,153,123,0.9)' }}
                >
                  {svc.label}
                </span>
              </div>

              {/* ─── Heading (larger) ─── */}
              <h2
                className="font-display text-white leading-[1.12] mb-5"
                style={{ fontSize: 'clamp(2rem, 2.8vw, 3.4rem)' }}
              >
                {svc.heading[0]}
                <br />
                <em style={{ color: '#E5997B', fontStyle: 'italic' }}>{svc.heading[1]}</em>
              </h2>

              {/* ─── Descriptor quote (larger) ─── */}
              <p
                className="font-display italic leading-relaxed mb-7"
                style={{
                  color: 'rgba(229,153,123,0.6)',
                  fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
                  maxWidth: '38ch',
                }}
              >
                &ldquo;{svc.descriptor}&rdquo;
              </p>

              {/* ─── Thin divider ─── */}
              <div
                className="mb-6"
                style={{ width: 40, height: 1, background: 'rgba(229,153,123,0.3)' }}
              />

              {/* ─── First paragraph (larger) ─── */}
              <p
                className="font-body leading-[1.8] mb-8"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 'clamp(0.88rem, 1.05vw, 1rem)',
                  maxWidth: '44ch',
                }}
              >
                {svc.paragraphs[0]}
              </p>

              {/* ─── Deliverables (larger) ─── */}
              <div className="space-y-3 mb-10">
                {svc.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-3">
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 flex-shrink-0 opacity-50">
                      <path d="M6 1L11 6L6 11L1 6Z" stroke="#E5997B" strokeWidth="1" />
                    </svg>
                    <span
                      className="font-body uppercase"
                      style={{
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        color: 'rgba(229,153,123,0.75)',
                      }}
                    >
                      {d}
                    </span>
                  </div>
                ))}
              </div>

              {/* ─── CTA ─── */}
              <div>
                <Link to={svc.ctaLink} className="btn-bronze">
                  Solicitar Consulta
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          PROGRESS INDICATOR — bottom center
      ══════════════════════════════════ */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {services.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              data-dot={i}
              className="rounded-full will-change-transform bg-bronze"
              style={{
                width: i === 0 ? 10 : 6,
                height: i === 0 ? 10 : 6,
                opacity: i === 0 ? 1 : 0.2,
                transform: i === 0 ? 'scale(1)' : 'scale(0.6)',
              }}
            />
            {i < total - 1 && (
              <div
                data-line={i}
                className="h-px bg-bronze origin-left"
                style={{ width: 20, transform: 'scaleX(0)', opacity: 0.4 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-12 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[0.6rem] tracking-[0.25em] uppercase font-body">
          Scroll
        </span>
        <div className="w-px h-6 bg-gradient-to-b from-bronze/40 to-transparent" />
      </motion.div>

      {/* ── Thin bottom accent line ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(229,153,123,0.2), transparent)' }}
      />
    </section>
  )
}
