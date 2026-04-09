import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PhotoBreakSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      // Photo parallax — slow y shift
      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
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

      // Text fades in on scroll
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
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
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Full-bleed cinematic photo */}
      <img
        ref={photoRef}
        src="/foto/brand-nature.jpg"
        alt=""
        className="absolute inset-0 w-full h-[116%] object-cover will-change-transform"
        loading="lazy"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/70" />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-navy/30" />

      {/* Centered statement */}
      <div
        ref={textRef}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 md:px-16 lg:px-32 will-change-transform"
      >
        <div className="w-16 h-px bg-bronze/40 mb-12" />
        <blockquote className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white italic leading-tight max-w-5xl mb-8">
          "Donde otros ven deuda,
          <br />
          nosotros diseñamos productividad."
        </blockquote>
        <p className="font-body text-bronze text-sm tracking-[0.3em] uppercase">
          — DIMA Finance
        </p>
        <div className="w-16 h-px bg-bronze/40 mt-12" />
      </div>
    </section>
  )
}
