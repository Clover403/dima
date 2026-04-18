import { type RefObject } from 'react'
import AnimatedGrid from '../AnimatedGrid'

type Props = {
  heroRef: RefObject<HTMLDivElement | null>
}

export default function AboutHeroSection({ heroRef }: Props) {
  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
    >
      {/* ── Animated snake grid ─────────────────────────────── */}
      <AnimatedGrid cellSize={60} color="229,153,123" />

      {/* ── Static CSS grid overlay ──────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div className="absolute top-[18%] w-full overflow-hidden opacity-[0.04] pointer-events-none select-none">
        <div
          className="hero-marquee-text flex whitespace-nowrap font-display text-[14vw] text-[#F4F4F5] uppercase"
          style={{ WebkitTextStroke: '2px #F4F4F5' }}
        >
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
        </div>
      </div>

      {/* ── Hero content ─────────────────────────────────────── */}
      <div className="hero-content-layer relative z-10 flex flex-col items-center text-center px-6 pointer-events-none">
        <div className="text-[#E5997B] tracking-[0.5em] uppercase text-sm mb-6 font-medium hero-fade-in">
          Nosotros
        </div>

        <h1 className="font-display text-5xl md:text-8xl leading-none tracking-tight flex flex-col items-center gap-2 text-[#F4F4F5]">
          <div className="flex overflow-hidden">
            <span className="hero-word">Arquitectos</span>&nbsp;<span className="hero-word">del</span>
          </div>
          <div className="flex overflow-hidden">
            <span className="hero-word italic text-[#E5997B]">equilibrio</span>
          </div>
        </h1>

        <p className="hero-subtext mt-8 text-[#F4F4F5]/40 max-w-xl text-lg md:text-xl font-light leading-relaxed">
          Somos una Institución de Ingeniería Financiera fundada sobre la ideología
          y filosofía del economista filantrópico Raymond Thomas Dalio.
        </p>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
        <span className="text-[10px] tracking-widest text-[#F4F4F5]/30 uppercase">Scroll</span>
        <div className="w-px h-16 bg-[#E5997B]/40 animate-pulse origin-top" />
      </div>
    </section>
  )
}