import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    number: '01',
    title: 'Causalidad Productiva',
    description:
      'El crédito solo es legítimo cuando la productividad futura generada es suficiente para amortizar el pasivo de forma independiente.',
  },
  {
    number: '02',
    title: 'Eficiencia Operativa',
    description:
      'Evaluamos la productividad del capital más allá del crecimiento nominal de ingresos. Un aumento de ingresos sin mejora en eficiencia erosiona la competitividad.',
  },
  {
    number: '03',
    title: 'Financiamiento Tractor',
    description:
      'La asignación de recursos se canaliza hacia la productividad — activos que optimizan procesos o reducen costos unitarios — y no hacia consumo improductivo.',
  },
  {
    number: '04',
    title: 'Ventaja Competitiva Sostenible',
    description:
      'Evaluamos si la intervención estratégica posiciona a la empresa en una posición más fuerte frente a sus competidores a largo plazo.',
  },
]

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!pageRef.current) return

    const ctx = gsap.context(() => {
      // Hero parallax
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector('.hero-content'), {
          y: -80,
          opacity: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: heroRef.current,
            start: '40% top',
            end: '80% top',
            scrub: 1,
          },
        })
      }

      // Marquee
      gsap.to('.about-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 55,
        ease: 'none',
      })

      // Philosophy text reveal - line by line
      const philosophyLines = document.querySelectorAll('.philosophy-line')
      philosophyLines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { opacity: 0, y: 40, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
            },
            delay: i * 0.1,
          }
        )
      })

      // Values cards stagger
      const valueCards = document.querySelectorAll('.value-card')
      valueCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            delay: i * 0.08,
          }
        )
      })

      // Identity section text reveal
      const identityReveals = document.querySelectorAll('.identity-reveal')
      identityReveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
            },
          }
        )
      })

      // Photo mask reveal
      const photoMasks = document.querySelectorAll('.photo-mask')
      photoMasks.forEach((mask) => {
        gsap.fromTo(
          mask,
          { clipPath: 'inset(0% 100% 0% 0% round 0px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            duration: 1.5,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: mask,
              start: 'top 75%',
            },
          }
        )
      })

      // CTA section
      const ctaReveals = document.querySelectorAll('.cta-reveal')
      ctaReveals.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
            delay: i * 0.12,
          }
        )
      })

      // Grid backgrounds
      gsap.to('.about-grid-bg', {
        backgroundPosition: '0 120px',
        scrollTrigger: {
          trigger: pageRef.current,
          scrub: true,
        },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <PageTransition>
      <div ref={pageRef}>
        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden bg-lightgray"
        >
          {/* Grid */}
          <div
            className="about-grid-bg absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(to right, #030035 1px, transparent 1px), linear-gradient(to bottom, #030035 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Marquee */}
          <div className="absolute top-[15%] left-0 flex whitespace-nowrap opacity-[0.025] select-none pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="about-marquee font-display text-[14vw] leading-none uppercase pr-20 text-navy"
              >
                Dima Finance &bull; Ingenieria Financiera &bull; Equilibrio &bull;
              </span>
            ))}
          </div>

          <div className="hero-content relative z-10 text-center max-w-4xl px-8">
            <p className="font-body text-bronze text-sm tracking-[0.5em] uppercase mb-8">
              Nosotros
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-navy leading-[1.05] mb-8">
              Arquitectos del
              <br />
              <span className="text-bronze italic">equilibrio</span>
            </h1>
            <p className="font-body text-navy/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Somos una Institución de Ingeniería Financiera fundada sobre la
              ideología y filosofía del economista filantrópico Raymond Thomas Dalio.
            </p>

            <div className="mt-16 flex flex-col items-center gap-2">
              <span className="text-navy/30 text-xs tracking-widest uppercase font-body">
                Scroll
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PHILOSOPHY SECTION - Pinned text reveal
        ═══════════════════════════════════════════ */}
        <section className="relative py-32 md:py-48 bg-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.25]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(3,0,53,0.05) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-12">
            <p className="philosophy-line font-body text-bronze text-xs tracking-[0.5em] uppercase mb-16">
              Nuestra Filosofía
            </p>

            <div className="space-y-10">
              <h2 className="philosophy-line font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.15]">
                Su comprensión de los ciclos económicos y la mecánica del crédito
                ha transformado la forma en que interpretamos la economía global.
              </h2>

              <p className="philosophy-line font-body text-navy/60 text-lg md:text-xl leading-relaxed max-w-3xl">
                Sin embargo, no buscamos predecir los mercados globales. Logramos
                transformar su modelo macroeconómico al nivel empresarial y fusionarlo
                con la práctica del crédito.
              </p>

              <p className="philosophy-line font-body text-navy/60 text-lg md:text-xl leading-relaxed max-w-3xl">
                No operamos bajo la lógica transaccional de la intermediación
                financiera tradicional — somos una institución de pensamiento aplicado.
              </p>

              <div className="philosophy-line pt-8">
                <div className="w-20 h-px bg-bronze/40" />
              </div>

              <blockquote className="philosophy-line">
                <p className="font-display text-2xl md:text-3xl text-navy italic leading-snug max-w-3xl">
                  &ldquo;Nuestro objetivo es replicar para cada acreditado la misma lógica
                  de equilibrio y sostenibilidad que mantiene estable la economía global.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            IDENTITY SECTION — Photo + Text
        ═══════════════════════════════════════════ */}
        <section className="relative py-32 md:py-48 bg-lightgray overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Photo */}
              <div className="photo-mask overflow-hidden">
                <img
                  src="/foto/brand-corporate.jpg"
                  alt="DIMA Finance"
                  className="w-full aspect-[4/5] object-cover"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div>
                <p className="identity-reveal font-body text-bronze text-xs tracking-[0.5em] uppercase mb-8">
                  Quiénes Somos
                </p>
                <h2 className="identity-reveal font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.1] mb-8">
                  Una institución de
                  <span className="text-bronze italic"> pensamiento aplicado</span>
                </h2>
                <div className="identity-reveal w-16 h-px bg-bronze/40 mb-8" />
                <p className="identity-reveal font-body text-navy/60 text-base leading-relaxed mb-6">
                  Somos un equipo multidisciplinario de ingenieros financieros,
                  economistas y estrategas comprometidos con transformar
                  el panorama crediticio en México.
                </p>
                <p className="identity-reveal font-body text-navy/60 text-base leading-relaxed mb-6">
                  Nuestro éxito institucional no se mide por el volumen de capital
                  estructurado, sino por la acumulación de resiliencia y rentabilidad
                  en la entidad receptora del financiamiento.
                </p>
                <p className="identity-reveal font-body text-navy/60 text-base leading-relaxed">
                  Este modelo de ingeniería no sustituye el análisis de riesgo
                  tradicional; lo potencia mediante una visión 360° que traduce
                  la comprensión de las fuerzas macroeconómicas globales al ámbito
                  práctico de la competitividad empresarial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            VALUES — 4 Pillar cards
        ═══════════════════════════════════════════ */}
        <section className="relative py-32 md:py-48 bg-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.3]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(3,0,53,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16 md:mb-24">
              <p className="identity-reveal font-body text-bronze text-xs tracking-[0.5em] uppercase mb-6">
                Nuestros Pilares
              </p>
              <h2 className="identity-reveal font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight">
                Los principios que
                <span className="text-bronze italic"> nos definen</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.number}
                  className="value-card group relative p-10 md:p-12 border border-navy/[0.06] rounded-2xl bg-white hover:border-bronze/20 transition-all duration-500"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-bronze origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ borderRadius: '16px 16px 0 0' }} />

                  {/* Ghost number */}
                  <span className="absolute -top-4 -right-2 font-display text-[100px] leading-none select-none text-navy/[0.03] group-hover:text-bronze/[0.06] transition-colors duration-500">
                    {value.number}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-body text-[10px] tracking-[0.35em] uppercase text-bronze font-medium">
                        {value.number}
                      </span>
                      <div className="flex-1 h-px bg-navy/10 group-hover:bg-bronze/20 transition-colors duration-500" />
                    </div>

                    <h3 className="font-display text-xl md:text-2xl text-navy leading-tight mb-4 group-hover:text-bronze transition-colors duration-400">
                      {value.title}
                    </h3>

                    <p className="font-body text-navy/50 text-base leading-relaxed group-hover:text-navy/70 transition-colors duration-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MISSION STATEMENT — Cinematic break
        ═══════════════════════════════════════════ */}
        <section className="relative py-32 md:py-48 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/foto/brand-nature.jpg"
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-navy/75" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
            <p className="cta-reveal font-body text-bronze text-xs tracking-[0.5em] uppercase mb-8">
              Nuestra Misión
            </p>
            <h2 className="cta-reveal font-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] mb-8 italic">
              &ldquo;Al fusionar disciplina financiera con planificación estratégica,
              se asegura que el crédito deje de percibirse como deuda y se convierta
              en un medio de equilibrio, crecimiento y libertad económica.&rdquo;
            </h2>
            <div className="cta-reveal w-16 h-px bg-bronze/50 mx-auto mb-8" />
            <p className="cta-reveal font-body text-white/50 text-sm tracking-[0.3em] uppercase">
              DIMA Finance
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CTA SECTION
        ═══════════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-lightgray overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
            <h2 className="cta-reveal font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight mb-6">
              ¿Listo para
              <span className="text-bronze italic"> conocernos?</span>
            </h2>
            <p className="cta-reveal font-body text-navy/50 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Agende una videollamada con nuestro equipo y descubra cómo podemos
              estructurar el crecimiento de su empresa.
            </p>
            <div className="cta-reveal flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contacto" className="btn-bronze-fill">
                Agendar Consulta
              </Link>
              <Link to="/modelo-crediticio" className="btn-bronze">
                Conocer Nuestro Modelo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
