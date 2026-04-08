import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ModeloFuerzas() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Label clip reveal */
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

      /* Block A — text slide up + growth visual */
      const blockA = el.querySelector('.block-a')
      if (blockA) {
        gsap.fromTo(
          blockA.querySelectorAll('.reveal-el'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: { trigger: blockA, start: 'top 75%' },
          }
        )

        /* Ascending line SVG stroke animation */
        const growthPath = blockA.querySelector('.growth-path') as SVGPathElement | null
        if (growthPath) {
          const length = growthPath.getTotalLength()
          gsap.set(growthPath, { strokeDasharray: length, strokeDashoffset: length })
          gsap.to(growthPath, {
            strokeDashoffset: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: blockA,
              start: 'top 65%',
              end: 'bottom 50%',
              scrub: 1,
            },
          })
        }
      }

      /* Block B — text + wave animation */
      const blockB = el.querySelector('.block-b')
      if (blockB) {
        gsap.fromTo(
          blockB.querySelectorAll('.reveal-el'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: { trigger: blockB, start: 'top 75%' },
          }
        )

        /* Wave path stroke animation */
        if (waveRef.current) {
          const length = waveRef.current.getTotalLength()
          gsap.set(waveRef.current, { strokeDasharray: length, strokeDashoffset: length })
          gsap.to(waveRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: blockB,
              start: 'top 65%',
              end: 'bottom 40%',
              scrub: 1,
            },
          })
        }
      }

      /* Callout — clip-path reveal from left */
      const callout = el.querySelector('.callout-box')
      if (callout) {
        gsap.fromTo(
          callout,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: callout, start: 'top 80%' },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white py-32 md:py-48 section-padding">
      <div className="max-w-6xl mx-auto">
        <p className="section-label text-bronze font-body text-sm tracking-[0.3em] uppercase mb-16">
          Las Fuerzas Económicas
        </p>

        {/* ─── Block A: Ingreso por Productividad ─── */}
        <div className="block-a grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 md:mb-48">
          <div>
            <h3 className="reveal-el font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight mb-6">
              Ingreso por Productividad
            </h3>
            <p className="reveal-el font-body text-navy/60 text-lg leading-relaxed">
              En una transacción, algo debe darse para recibir algo, y lo que se recibe
              depende de cuánto se produce a lo largo del tiempo. Quienes son ingeniosos
              y trabajadores producen más, por lo tanto ganan más, lo que les da la
              oportunidad de gastar más. Y dado que el gasto de una persona es siempre
              el ingreso de otra, la economía crece cuando alguien se vuelve más productivo.
            </p>
          </div>

          {/* Ascending growth line */}
          <div className="reveal-el flex items-center justify-center">
            <svg viewBox="0 0 400 300" fill="none" className="w-full max-w-sm">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={60 + i * 50}
                  x2="380"
                  y2={60 + i * 50}
                  stroke="#E5997B"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
              ))}
              {/* Growth path */}
              <path
                className="growth-path"
                d="M40 260 Q100 240 140 220 T220 170 T300 100 T380 40"
                stroke="#D97E5A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Axis labels */}
              <text x="40" y="290" fill="#030035" fontSize="11" opacity="0.4" className="font-body">Tiempo</text>
              <text x="10" y="50" fill="#030035" fontSize="11" opacity="0.4" className="font-body" transform="rotate(-90, 10, 50)">Productividad</text>
              {/* Dot at end */}
              <circle cx="380" cy="40" r="4" fill="#D97E5A" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* ─── Block B: Los Ciclos de Deuda ─── */}
        <div className="block-b grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 md:mb-32">
          {/* Wave visual — shown first on desktop for alternating layout */}
          <div className="reveal-el flex items-center justify-center order-2 lg:order-1">
            <svg viewBox="0 0 400 250" fill="none" className="w-full max-w-sm">
              {/* Baseline */}
              <line x1="20" y1="125" x2="380" y2="125" stroke="#E5997B" strokeWidth="0.5" opacity="0.3" />
              {/* Cycle wave */}
              <path
                ref={waveRef}
                d="M20 125 C60 125 70 60 110 60 S160 125 200 125 S250 190 290 190 S340 125 380 125"
                stroke="#D97E5A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Labels */}
              <text x="80" y="45" fill="#D97E5A" fontSize="10" className="font-body" opacity="0.7">Expansión</text>
              <text x="250" y="215" fill="#D97E5A" fontSize="10" className="font-body" opacity="0.7">Contracción</text>
              {/* Arrows */}
              <path d="M95 50 L105 46" stroke="#D97E5A" strokeWidth="1" opacity="0.5" />
              <path d="M275 200 L285 204" stroke="#D97E5A" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="reveal-el font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight mb-6">
              Los Ciclos de Deuda
            </h3>
            <p className="reveal-el font-body text-navy/60 text-lg leading-relaxed">
              Existen dos tipos: Ciclos de Deuda a Largo Plazo y Ciclos de Deuda a
              Corto Plazo. Cada vez que pedimos prestado, creamos un ciclo. Esto no
              se debe a ninguna ley o regulación, sino a la naturaleza humana y al
              funcionamiento del crédito. El crédito nos permite consumir más de lo
              que producimos al adquirirlo, y nos obliga a consumir menos de lo que
              producimos al pagarlo. Pedir prestado es una forma de adelantar el
              gasto — esencialmente estás tomando prestado de tu yo futuro.
            </p>
          </div>
        </div>

        {/* ─── Callout Box ─── */}
        <div className="callout-box border-l-2 border-bronze bg-lightgray px-8 md:px-12 py-8 md:py-10 max-w-4xl mx-auto">
          <p className="font-display text-xl md:text-2xl text-navy leading-relaxed italic">
            &ldquo;El crédito no es necesariamente algo malo. Es malo cuando financia
            consumo que no puede ser pagado. Cuando los recursos se asignan de manera
            eficiente y estratégica, generando suficiente ingreso para cubrir la
            deuda — ahí es donde ocurre el verdadero crecimiento y desarrollo.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}
