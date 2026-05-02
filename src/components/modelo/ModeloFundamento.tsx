import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloFundamento() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Label clip-path reveal */
      gsap.fromTo(
        el.querySelector('.section-label'),
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        }
      )

      /* Heading lines stagger */
      const headLines = el.querySelectorAll('.head-line')
      gsap.fromTo(
        headLines,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      )

      /* Body text fade-up */
      gsap.fromTo(
        el.querySelector('.body-text'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el.querySelector('.body-text'), start: 'top 85%' },
        }
      )

      /* Right visual — scale parallax */
      gsap.fromTo(
        el.querySelector('.visual-right'),
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-lightgray py-32 md:py-48 section-padding">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left — Text */}
        <div>
          <p className="section-label text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
            Fundamento Teórico
          </p>

          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] text-navy leading-[1.1] mb-8">
            <span className="head-line block">La economía es simple,</span>
            <span className="head-line block text-bronze italic">
              mecánica y predecible
            </span>
          </h2>

          <p className="body-text font-body text-navy/60 text-lg leading-relaxed max-w-xl">
            La economía puede parecer compleja, pero funciona de manera muy simple
            y mecánica — tan mecánica que es sistemática, y precisamente eso la
            hace predecible. Para entender nuestro modelo, solo necesitas comprender
            tres protagonistas fundamentales que impulsan toda actividad económica.
          </p>
        </div>

        {/* Right — Abstract geometric visual */}
        <div className="visual-right flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            fill="none"
            className="w-full max-w-md"
          >
            {/* Three interconnected circles representing the 3 protagonists */}
            <circle cx="250" cy="160" r="100" stroke="#E5997B" strokeWidth="1" opacity="0.4" />
            <circle cx="160" cy="340" r="100" stroke="#E5997B" strokeWidth="1" opacity="0.4" />
            <circle cx="340" cy="340" r="100" stroke="#E5997B" strokeWidth="1" opacity="0.4" />

            {/* Center intersection — diamond */}
            <path d="M250 220L290 270L250 320L210 270Z" stroke="#D97E5A" strokeWidth="1.5" fill="#D97E5A" fillOpacity="0.08" />

            {/* Labels */}
            <text x="250" y="130" textAnchor="middle" className="font-display" fill="#030035" fontSize="16" opacity="0.6">
              Transacción
            </text>
            <text x="130" y="370" textAnchor="middle" className="font-display" fill="#030035" fontSize="16" opacity="0.6">
              Gasto
            </text>
            <text x="370" y="370" textAnchor="middle" className="font-display" fill="#030035" fontSize="16" opacity="0.6">
              Crédito
            </text>

            {/* Connection lines */}
            <line x1="250" y1="260" x2="190" y2="290" stroke="#E5997B" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="250" y1="260" x2="310" y2="290" stroke="#E5997B" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="200" y1="340" x2="300" y2="340" stroke="#E5997B" strokeWidth="0.5" strokeDasharray="4 4" />

            {/* Outer frame diamond */}
            <path d="M250 40L460 250L250 460L40 250Z" stroke="#E5997B" strokeWidth="0.3" opacity="0.2" />
          </svg>
        </div>
      </div>
    </section>
  )
}
