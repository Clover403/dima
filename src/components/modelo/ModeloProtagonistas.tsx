import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const protagonists = [
  {
    num: '01',
    title: 'La Transacción',
    body: 'Una transacción ocurre simplemente cuando un comprador intercambia dinero o crédito por bienes, servicios o activos financieros con un vendedor. Es decir, cuando alguien gasta y alguien más recibe.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <path d="M8 32h20M36 32h20" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 24l8 8-8 8" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 24l-8 8 8 8" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'El Gasto',
    body: 'El gasto es la fuerza motriz de la economía. Cuando una persona gasta más, otra persona gana más — y al ganar más, tiene más para gastar. Este ciclo es el que impulsa todo el sistema económico.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <path d="M12 48L28 20l12 16 12-28" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="52" cy="8" r="4" stroke="#E5997B" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'El Crédito',
    body: 'Cuando el ingreso de alguien aumenta, obtiene capacidad de pago. Un mayor ingreso permite endeudarse, y endeudarse permite gastar más — y más gasto significa más ingreso. El crédito es el eslabón que amplifica la economía.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <circle cx="32" cy="32" r="20" stroke="#E5997B" strokeWidth="1.5" />
        <path d="M32 12a20 20 0 0 1 0 40" stroke="#E5997B" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M26 28l6 4-6 4" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 28l-6 4 6 4" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function ModeloProtagonistas() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const section = sectionRef.current!
      const track = trackRef.current!
      const cards = track.querySelectorAll('.protagonist-card')
      const totalScroll = track.scrollWidth - window.innerWidth

      /* Pinned horizontal scroll driven by vertical scroll */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      tl.to(track, {
        x: -totalScroll,
        ease: 'none',
      })

      /* Cards fade in as they come into view */
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.3 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left 80%',
              end: 'left 40%',
              scrub: true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-navy overflow-hidden">
      {/* Header — visible before scroll starts */}
      <div className="section-padding pt-32 pb-12">
        <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-4">
          Los 3 Protagonistas
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-white">
          Las fuerzas que mueven la economía
        </h2>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="flex items-stretch gap-0 pl-6 md:pl-12 lg:pl-24 xl:pl-32 will-change-transform">
        {protagonists.map((p) => (
          <div
            key={p.num}
            className="protagonist-card shrink-0 w-[85vw] md:w-[60vw] lg:w-[50vw] h-[60vh] flex flex-col justify-center px-8 md:px-16 mr-8 border-l border-bronze/20 relative"
          >
            {/* Large background number */}
            <span className="absolute top-8 right-8 font-display text-[8rem] md:text-[12rem] text-white/[0.03] leading-none select-none pointer-events-none">
              {p.num}
            </span>

            <div className="relative z-10">
              <div className="mb-8 opacity-60">{p.icon}</div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-bronze font-body text-sm tracking-widest">
                  {p.num}
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-white">
                  {p.title}
                </h3>
              </div>

              <p className="font-body text-white/50 text-lg leading-relaxed max-w-lg">
                {p.body}
              </p>
            </div>
          </div>
        ))}

        {/* Spacer for scroll end */}
        <div className="shrink-0 w-[20vw]" />
      </div>
    </section>
  )
}
