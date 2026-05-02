import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProductosIntroImmersive() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      // Pin and reveal text line by line
      const lines = el.querySelectorAll('.reveal-line')

      gsap.set(lines, { opacity: 0, y: 50, filter: 'blur(4px)' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      })

      lines.forEach((line, i) => {
        tl.to(line, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
        }, i * 0.8)

        // Fade out previous lines slightly
        if (i > 0) {
          tl.to(lines[i - 1], {
            opacity: 0.3,
            y: -20,
            duration: 0.6,
            ease: 'power2.in',
          }, i * 0.8)
        }
      })

      // Bronze accent line draw
      gsap.fromTo(
        el.querySelector('.accent-line'),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 60%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(3,0,53,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-8">
        <p className="reveal-line font-body text-bronze text-sm tracking-[0.4em] uppercase mb-12">
          Nuestros Productos
        </p>

        <h2 className="reveal-line font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.15] mb-8">
          No vendemos créditos.
        </h2>

        <h2 className="reveal-line font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.15] mb-8">
          <span className="text-bronze italic">Estructuramos crecimiento.</span>
        </h2>

        <p className="reveal-line font-body text-navy/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mt-12">
          Cada producto está diseñado como una pieza de ingeniería financiera.
          La mayoría de los créditos pueden adaptarse a las circunstancias y
          necesidades de cada cliente.
        </p>

        <div className="accent-line w-24 h-px bg-bronze/50 mx-auto mt-12 origin-center" />
      </div>
    </section>
  )
}
