import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AnimatedGrid from '../AnimatedGrid'
import DimaGeometric from '../DimaGeometric'

export const HERO_LINE_LENGTH = 3000

export function HeroTitleSVG() {
  return (
    <svg
      viewBox="0 0 1000 310"
      preserveAspectRatio="xMinYMid meet"
      className="w-full h-auto select-none"
      style={{ overflow: 'visible' }}
      aria-label="Deuda que genera valor"
    >
      {/* Line 0: DEUDA QUE — stroke layer */}
      <text
        x="0" y="148"
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        fontSize="155"
        letterSpacing="-6"
        fill="none"
        stroke="white"
        strokeWidth="0.6"
        style={{ strokeDasharray: HERO_LINE_LENGTH, strokeDashoffset: HERO_LINE_LENGTH }}
        data-hero-stroke data-hero-line="0"
      >DEUDA QUE</text>
      {/* Line 0: fill layer */}
      <text
        x="0" y="148"
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        fontSize="155"
        letterSpacing="-6"
        fill="white"
        fillOpacity="0"
        data-hero-fill data-hero-line="0"
      >DEUDA QUE</text>

      {/* Line 1: GENERA VALOR. — stroke layer */}
      <text
        x="0" y="296"
        fontFamily="'Playfair Display', serif"
        fontWeight="400"
        fontStyle="italic"
        fontSize="155"
        letterSpacing="-6"
        fill="none"
        stroke="#E5997B"
        strokeWidth="0.6"
        style={{ strokeDasharray: HERO_LINE_LENGTH, strokeDashoffset: HERO_LINE_LENGTH }}
        data-hero-stroke data-hero-line="1"
      >GENERA VALOR.</text>
      {/* Line 1: fill layer */}
      <text
        x="0" y="296"
        fontFamily="'Playfair Display', serif"
        fontWeight="400"
        fontStyle="italic"
        fontSize="155"
        letterSpacing="-6"
        fill="#E5997B"
        fillOpacity="0"
        data-hero-fill data-hero-line="1"
      >GENERA VALOR.</text>
    </svg>
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 })

  const maskWebkit = useTransform([springX, springY], ([x, y]) =>
    `radial-gradient(650px at ${x}px ${y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 80%)`
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hanya reveal-item (subtitle, CTA, dll) — stroke dihandle HeroCurtain
      gsap.from('.reveal-item', {
        y: 40, opacity: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out', delay: 0.5,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ background: 'linear-gradient(105deg, #05051a 0%, #020111 40%, #010010 85%)' }}
      className="relative w-full h-screen overflow-hidden"
    >
      <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none">
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </div>

      <motion.div
        style={{ WebkitMaskImage: maskWebkit, maskImage: maskWebkit }}
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.3]"
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      <div className="absolute inset-y-0 right-0 w-[60%] z-[3] pointer-events-none select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#05051a] via-transparent to-transparent z-10" />
        <div className="w-full h-full flex items-center justify-end pr-0">
          <div style={{ width: '85%', height: '85%', transform: 'translateX(9%)' }}>
            <DimaGeometric />
          </div>
        </div>
      </div>

      <div className="relative z-[10] w-full h-full flex flex-col justify-between p-10 md:p-16 lg:p-24">
        <div className="invisible flex flex-col gap-1">
          <span className="font-mono text-[9px]">x</span>
          <span className="font-mono text-[8px]">x</span>
        </div>

        <div className="max-w-4xl select-none">
          <div className="reveal-item overflow-hidden mb-8">
            <p className="text-[#E5997B] font-mono text-[11px] tracking-[1em] uppercase flex items-center gap-6">
              <span className="w-16 h-[1px] bg-[#E5997B]/30" />
              Ingeniería de Capital
            </p>
          </div>

          {/* SVG title — dihandle animasinya oleh HeroCurtain */}
          <HeroTitleSVG />

          <div className="reveal-item mt-14 flex items-start gap-10">
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#E5997B] to-transparent opacity-40" />
            <p className="text-white/40 font-body text-base lg:text-lg max-w-[380px] leading-relaxed">
              Diseñamos arquitecturas financieras que transforman el balance corporativo en una plataforma de crecimiento estratégico.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="reveal-item hidden md:block">
            <div className="flex flex-col gap-1 opacity-30">
              <span className="font-mono text-[8px] text-white tracking-[0.8em] uppercase">Crédito Empresarial</span>
              <span className="font-mono text-[10px] text-white tracking-[0.2em]">Todos los sectores · Todas las escalas</span>
            </div>
          </div>

          <div className="reveal-item flex items-center gap-6 w-full md:w-auto">
            <Link to="/contacto" className="flex-1 md:flex-none text-center px-8 py-5 font-mono text-[10px] tracking-[0.5em] uppercase text-white/40 hover:text-white transition-all border border-white/0 hover:border-white/10">
              Contacto
            </Link>
            <Link to="/modelo-crediticio" className="group relative flex-1 md:flex-none flex items-center justify-center gap-6 px-12 py-5 bg-white/[0.03] backdrop-blur-3xl border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-[#E5997B] translate-y-full group-hover:translate-y-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)]" />
              <span className="relative z-10 font-body text-[10px] tracking-[0.6em] uppercase text-white group-hover:text-[#000000] transition-colors duration-[900ms] font-bold">Ver Modelo</span>
              <svg className="relative z-10 w-4 h-4 text-[#E5997B] group-hover:text-[#000000] transition-all duration-[900ms] group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-10 pointer-events-none opacity-20 z-[20]">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#E5997B]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#E5997B]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#E5997B]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#E5997B]" />
      </div>
    </section>
  )
}