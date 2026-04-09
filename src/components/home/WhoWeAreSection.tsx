import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WhoWeAreSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      // Animasi pemunculan teks (Phrase reveals) — stagger saat scroll
      const phrases = sectionRef.current.querySelectorAll('.reveal-phrase')
      phrases.forEach((phrase) => {
        gsap.fromTo(
          phrase,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: phrase,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center bg-lightgray overflow-hidden"
    >
      {/* Container Teks - Dibuat terpusat dan lebar maksimal agar enak dibaca */}
      <div
        ref={textWrapRef}
        className="w-full max-w-5xl px-8 md:px-12 lg:px-16 xl:px-20 py-24"
      >
        <p className="text-bronze font-body text-xs tracking-[0.3em] uppercase mb-12 reveal-phrase">
          QUIÉNES SOMOS
        </p>

        <div className="space-y-10 md:space-y-14">
          <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-navy leading-tight">
            No somos un banco.
          </p>
          <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-navy leading-tight">
            Somos <em className="text-bronze not-italic">arquitectos</em> de equilibrio.
          </p>
          <p className="reveal-phrase font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-navy leading-tight">
            Transformamos la deuda en{' '}
            <em className="text-bronze not-italic">productividad.</em>
          </p>
          
          <div className="pt-8">
            <p className="reveal-phrase font-body text-lg md:text-2xl text-navy/60 max-w-2xl leading-relaxed">
              En DIMA Finance, cada decisión crediticia se fundamenta en principios
              de ingeniería financiera y equilibrio macroeconómico. No otorgamos
              créditos — diseñamos estructuras que generan valor.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}