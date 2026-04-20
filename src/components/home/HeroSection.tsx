import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import AnimatedGrid from '../AnimatedGrid'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef   = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const magnetRef  = useRef<HTMLDivElement>(null)

  // ── Magnetic effect ───────────────────────────────────────
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.5 })
  const springY = useSpring(my, { stiffness: 200, damping: 20, mass: 0.5 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetRef.current) return
    const r = magnetRef.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width  / 2)) * 0.35)
    my.set((e.clientY - (r.top  + r.height / 2)) * 0.35)
  }
  const onMouseLeave = () => { mx.set(0); my.set(0) }

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: -80,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '40% top',
            end: '80% top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        })
      }

      if (photoRef.current) {
        gsap.fromTo(photoRef.current,
          { x: -60 },
          {
            x: 60,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-navy">

      {/* Photo */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          ref={photoRef}
          src="/foto/brand-stationery.jpg"
          alt=""
          className="w-[120vh] h-[125vw] rotate-90 object-cover will-change-transform shrink-0"
          loading="eager"
        />
      </div>

      {/* Heavy navy overlay */}
      <div className="absolute inset-0 bg-navy/85 z-[1]" />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(3,0,53,0.6) 100%)' }}
      />

      {/* AnimatedGrid */}
      <div className="absolute inset-0 z-[3]">
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </div>

      {/* Radial bronze glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(229,153,123,0.06) 0%, transparent 70%)' }}
      />

      {/* Corner brackets */}
      {(['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'] as const).map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none z-[5]`} viewBox="0 0 40 40" fill="none">
          <path
            d={['M0 20 L0 0 L20 0','M40 20 L40 0 L20 0','M0 20 L0 40 L20 40','M40 20 L40 40 L20 40'][i]}
            stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3"
          />
        </svg>
      ))}

      {/* Top metadata bar */}
      <div className="absolute top-0 left-0 right-0 border-b border-[#F4F4F5]/5 py-5 px-8 md:px-16 flex items-center justify-between z-10 pointer-events-none">
        <span className="font-mono text-[8px] tracking-[0.5em] uppercase text-[#F4F4F5]/20">SOFOM E.N.R. — México</span>
        <span className="font-mono text-[8px] tracking-[0.5em] uppercase text-[#E5997B]/25">Ingeniería Financiera</span>
        <span className="font-mono text-[8px] tracking-[0.5em] uppercase text-[#F4F4F5]/20">Est. MMXXIV</span>
      </div>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 md:px-16 will-change-transform pointer-events-none"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-5 mb-6"
        >
          <div className="w-10 h-px bg-[#E5997B]/40" />
          <p className="text-bronze font-mono text-[10px] tracking-[0.7em] uppercase">DIMA FINANCE</p>
          <div className="w-10 h-px bg-[#E5997B]/40" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5 }}
          className="font-display text-[clamp(2.6rem,5.5vw,6.5rem)] text-white leading-[1.0] tracking-tight mb-4 whitespace-nowrap"
        >
          Deuda que genera <em className="text-bronze not-italic">valor.</em>
        </motion.h1>

        {/* Divider ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="w-16 h-px bg-[#E5997B]/25" />
          <svg className="w-2 h-2 shrink-0" viewBox="0 0 8 8" fill="none">
            <path d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3Z" fill="#E5997B" fillOpacity="0.4" />
          </svg>
          <div className="w-16 h-px bg-[#E5997B]/25" />
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-white/40 font-body text-xl max-w-lg leading-relaxed mb-8"
        >
          Estructuramos soluciones crediticias basadas en equilibrio macroeconómico.
          Donde otros ven deuda, nosotros diseñamos productividad.
        </motion.p>

        {/* CTA — magnetic + bottom-to-top fill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="pointer-events-auto"
        >
          {/* Magnetic area — larger hit zone */}
          <div
            ref={magnetRef}
            className="p-8 -m-8"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            {/* Spring-animated wrapper */}
            <motion.div style={{ x: springX, y: springY }}>
              {/*
                ── KEY: group + overflow-hidden on the wrapper div, NOT on Link
                   This ensures the sliding div is properly clipped
              */}
              <div
                className="group relative overflow-hidden"
                style={{ display: 'inline-block' }}
              >
                {/* Bronze fill — slides up from bottom, elegant ease */}
                <div className="absolute inset-0 bg-[#E5997B] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />

                {/* Button */}
                <Link
                  to="/modelo-crediticio"
                  className="relative flex items-center px-10 py-4 border border-[#E5997B]/50 group-hover:border-[#E5997B] transition-colors duration-500"
                  style={{ zIndex: 2 }}
                >
                  <span className="font-body text-[10px] tracking-[0.45em] uppercase text-[#E5997B] group-hover:text-[#030035] transition-colors duration-500">
                    CONOCE NUESTRO MODELO
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent" />
        </div>
      </motion.div>

      {/* Bottom metadata bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-16 flex items-center justify-between z-10 pointer-events-none">
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">
          Sociedad Financiera de Objeto Múltiple
        </span>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-bronze" style={{ opacity: 0.08 + i * 0.06 }} />
          ))}
        </div>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">
          Arquitectos de Equilibrio
        </span>
      </div>

    </section>
  )
}