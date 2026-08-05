import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import InteractiveConstellationText from '../InteractiveConstellationText'
import SpotlightGridBackground from './SpotlightGridBackground'

type SharedHeroSectionProps = {
  heroRef?: RefObject<HTMLDivElement | null>
  eyebrowText?: string
  titleTop: string
  titleBottom: string
  description: string
  titleClassName?: string
}

export default function SharedHeroSection({
  heroRef,
  eyebrowText = 'Nosotros — DIMA Finance',
  titleTop,
  titleBottom,
  description,
  titleClassName = '',
}: SharedHeroSectionProps) {
  const internalRef = useRef<HTMLDivElement>(null)
  const sectionRef = heroRef || internalRef

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-marquee-text",
        { xPercent: 0 },
        { xPercent: -50, repeat: -1, duration: 40, ease: "none" }
      )
      gsap.fromTo(".hero-word",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1.5, ease: "power4.out", delay: 0.2 }
      )
      gsap.fromTo(".hero-subtext",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.6 }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
    >
      <SpotlightGridBackground />

      <div className="absolute top-[18%] w-full overflow-hidden opacity-[0.04] pointer-events-none select-none z-[6]">
        <div
          className="hero-marquee-text flex whitespace-nowrap font-display text-[14vw] text-[#F4F4F5] uppercase"
          style={{ WebkitTextStroke: '2px #F4F4F5' }}
        >
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
        </div>
      </div>

      <div className="hero-content relative text-center max-w-6xl px-8 pointer-events-none flex flex-col items-center z-[20]">
        <div className="flex items-center justify-center gap-4 mb-20">
          <div className="w-8 h-px bg-[#E5997B]/50" />
          <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
            {eyebrowText}
          </p>
          <div className="w-8 h-px bg-[#E5997B]/50" />
        </div>

      <InteractiveConstellationText
          lines={[
            { text: titleTop, y: 50, color: '#F4F4F5' },
            { text: titleBottom, y: 140, fontStyle: 'normal', color: '#E5997B' }, 
          ]}
          defaultFontSize={150} 
          fontFamily="'Playfair Display', serif"
          className={`hero-word w-full ${titleClassName}`.trim()}
          containerClassName="pointer-events-auto w-full h-[220px] shrink-0" 
        />

        {/* --- BALOK SPACER ABSOLUT (Mengakali gap supaya fix di semua environment) --- */}
        <div className="h-3 md:h-4 w-full shrink-0 pointer-events-none" />

        {/* Pastikan margin-top di tag p dihapus (mt-0) agar murni mengandalkan spacer di atas */}
        <p className="hero-subtext text-[#F4F4F5]/50 max-w-2xl text-xl md:text-2xl font-light leading-relaxed relative z-10 mt-0">
          {description}
        </p>

        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}