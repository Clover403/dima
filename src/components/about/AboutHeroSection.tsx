import { type RefObject } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AnimatedGrid from '../AnimatedGrid'
import InteractiveConstellationText from '../InteractiveConstellationText'

type Props = {
  heroRef: RefObject<HTMLDivElement | null>
}

export default function AboutHeroSection({ heroRef }: Props) {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 })

  const maskWebkit = useTransform([springX, springY], ([x, y]) =>
    `radial-gradient(700px at ${x}px ${y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 80%)`
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
  }

  const handleMouseLeave = () => {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
    >
      {/* ── Grid base — redup selalu ─────────────────────────── */}
      <div className="absolute inset-0 z-[1] opacity-[0.06] pointer-events-none">
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </div>

      {/* ── Grid spotlight — muncul di area kursor ───────────── */}
      <motion.div
        style={{ WebkitMaskImage: maskWebkit, maskImage: maskWebkit }}
        className="absolute inset-0 z-[2] pointer-events-none opacity-[0.7]"
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      {/* ── Static CSS grid overlay ──────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          zIndex: 3,
          backgroundImage:
            'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div
        className="absolute top-[18%] w-full overflow-hidden opacity-[0.04] pointer-events-none select-none"
        style={{ zIndex: 4 }}
      >
        <div
          className="hero-marquee-text flex whitespace-nowrap font-display text-[14vw] text-[#F4F4F5] uppercase"
          style={{ WebkitTextStroke: '2px #F4F4F5' }}
        >
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
        </div>
      </div>

      {/* ── Hero content ─────────────────────────────────────── */}
      <div
        className="hero-content relative text-center max-w-6xl px-8 pointer-events-none flex flex-col items-center"
        style={{ zIndex: 5 }}
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-8 h-px bg-[#E5997B]/50" />
          <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
            Nosotros — DIMA Finance
          </p>
          <div className="w-8 h-px bg-[#E5997B]/50" />
        </div>
        <InteractiveConstellationText
  lines={[
    { text: 'Arquitectos del', y: 155, color: '#F4F4F5' },
    { text: 'equilibrio', y: 285, fontStyle: 'italic', color: '#E5997B' },
  ]}
  viewBox="0 0 900 320"
  defaultFontSize={150}
  fontFamily="'Playfair Display', serif"
  containerClassName="pointer-events-auto mb-10 w-full"
/>
        <p className="hero-subtext text-[#F4F4F5]/40 max-w-xl text-lg md:text-xl font-light leading-relaxed">
          Somos una Institución de Ingeniería Financiera fundada sobre la ideología
          y filosofía del economista filantrópico Raymond Thomas Dalio.
        </p>
        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}