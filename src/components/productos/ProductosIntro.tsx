import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProductosIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      gsap.fromTo(
        el.querySelectorAll('.reveal'),
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white py-24 md:py-32 section-padding">
      <div className="max-w-3xl mx-auto text-center">
        <p className="reveal font-body text-navy/60 text-lg md:text-xl leading-relaxed">
          La mayoría de los créditos pueden adaptarse a las circunstancias y
          necesidades de cada cliente. Lo que verdaderamente los diferencia son
          las cláusulas y condiciones contractuales, que se diseñan a medida. A
          continuación, presentamos las características principales de cada tipo
          y sus usos más comunes — aunque estos no están estrictamente definidos.
        </p>

        {/* Decorative divider */}
        <div className="reveal flex items-center justify-center gap-4 mt-16">
          <div className="w-12 h-px bg-bronze/30" />
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path d="M12 2L22 12L12 22L2 12Z" stroke="#E5997B" strokeWidth="1" />
          </svg>
          <div className="w-12 h-px bg-bronze/30" />
        </div>
      </div>
    </section>
  )
}
