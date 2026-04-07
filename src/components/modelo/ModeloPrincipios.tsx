import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    num: '01',
    quote:
      'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.',
    subtitle: 'Causalidad Productiva',
    explanation:
      'El crédito se considera legítimo únicamente cuando la productividad futura generada es suficiente para amortizar el pasivo de forma independiente. Si la tasa de endeudamiento supera la capacidad de pago generada por la productividad, la entidad entra en un ciclo de expansión artificial que compromete su viabilidad estructural.',
  },
  {
    num: '02',
    quote:
      'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tiempo perderás competitividad.',
    subtitle: 'Eficiencia Operativa',
    explanation:
      'El modelo evalúa la Productividad del Capital más allá del crecimiento nominal de ingresos. Un aumento de ingresos derivado únicamente de indexación de precios o apalancamiento, sin mejora en eficiencia, erosiona la competitividad a largo plazo. Se analizan métricas críticas como la evolución de márgenes EBITDA, el ciclo de conversión de efectivo y la rotación de activos.',
  },
  {
    num: '03',
    quote:
      'Haz todo lo posible por aumentar tu productividad, porque, a largo plazo, eso es lo que más importa.',
    subtitle: 'Financiamiento "Tractor"',
    explanation:
      'La asignación de recursos se canaliza hacia la productividad — activos que optimizan procesos o reducen costos unitarios — y no hacia consumo improductivo. Se evalúa si la intervención estratégica posiciona a la empresa en una posición más fuerte frente a sus competidores a largo plazo. El objetivo es forjar una estructura de prosperidad donde cada financiamiento sustenta la viabilidad sistémica del negocio.',
  },
]

export default function ModeloPrincipios() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Section heading reveal */
      gsap.fromTo(
        el.querySelectorAll('.section-head'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: el, start: 'top 75%' },
        }
      )

      /* Each principle block — staggered reveal: quote → subtitle → explanation */
      const blocks = el.querySelectorAll('.principle-block')
      blocks.forEach((block) => {
        const quote = block.querySelector('.principle-quote')
        const subtitle = block.querySelector('.principle-subtitle')
        const explanation = block.querySelector('.principle-explanation')
        const divider = block.querySelector('.principle-divider')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 78%',
          },
        })

        tl.fromTo(
          divider,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.out' }
        )
          .fromTo(
            quote,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.4'
          )
          .fromTo(
            subtitle,
            { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
            { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.out' },
            '-=0.3'
          )
          .fromTo(
            explanation,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            '-=0.2'
          )
      })

      /* Sticky progress indicator */
      if (progressRef.current) {
        const progressDots = progressRef.current.querySelectorAll('.progress-dot')
        blocks.forEach((block, i) => {
          ScrollTrigger.create({
            trigger: block,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => {
              progressDots.forEach((d, j) =>
                d.classList.toggle('bg-bronze', j <= i)
              )
            },
            onEnterBack: () => {
              progressDots.forEach((d, j) =>
                d.classList.toggle('bg-bronze', j <= i)
              )
            },
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-navy py-32 md:py-48 section-padding relative">
      {/* Sticky progress indicator — desktop only */}
      <div
        ref={progressRef}
        className="hidden lg:flex fixed left-8 xl:left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-30"
        style={{ pointerEvents: 'none' }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="progress-dot w-2 h-2 rounded-full border border-bronze/30 transition-colors duration-500"
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-24 md:mb-32">
          <p className="section-head text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
            Nuestro Modelo
          </p>
          <h2 className="section-head font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Tres principios,
            <br />
            <span className="text-bronze italic">una arquitectura</span>
          </h2>
          <p className="section-head font-body text-white/50 text-lg leading-relaxed max-w-3xl mx-auto mt-8">
            El crédito nos permite consumir más de lo que producimos al adquirirlo,
            y nos obliga a consumir menos de lo que producimos al pagarlo. Bajo esta
            premisa, definimos cualquier producto financiero como un anticipo
            estratégico del gasto — una intervención que permite traer el futuro al
            presente para invertir hoy en lo que multiplicará la capacidad productiva
            mañana.
          </p>
        </div>

        {/* Principles */}
        <div className="space-y-24 md:space-y-32">
          {principles.map((p) => (
            <div key={p.num} className="principle-block relative">
              {/* Divider line */}
              <div className="principle-divider w-full h-px bg-bronze/20 mb-12 origin-left" />

              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-16">
                {/* Number */}
                <span className="font-display text-6xl md:text-7xl text-white/[0.06] leading-none select-none">
                  {p.num}
                </span>

                <div>
                  {/* Quote */}
                  <div className="principle-quote relative mb-8">
                    {/* Quotation mark decoration */}
                    <svg
                      className="absolute -top-6 -left-4 w-12 h-12 opacity-10"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        d="M14 28c-3 0-6-2-6-6 0-8 6-16 14-18l1 3c-5 2-8 6-9 10 1-1 3-1 4 0 3 1 4 4 4 6 0 3-3 5-6 5h-2zm20 0c-3 0-6-2-6-6 0-8 6-16 14-18l1 3c-5 2-8 6-9 10 1-1 3-1 4 0 3 1 4 4 4 6 0 3-3 5-6 5h-2z"
                        fill="#E5997B"
                      />
                    </svg>

                    <blockquote className="font-display text-2xl md:text-3xl text-bronze/90 italic leading-snug pl-2">
                      &ldquo;{p.quote}&rdquo;
                    </blockquote>
                    <p className="font-body text-white/30 text-sm mt-3 pl-2">
                      — Ray Dalio
                    </p>
                  </div>

                  {/* Subtitle */}
                  <p className="principle-subtitle inline-block text-bronze font-body text-sm tracking-[0.25em] uppercase mb-6 border-b border-bronze/30 pb-1">
                    {p.subtitle}
                  </p>

                  {/* Explanation */}
                  <p className="principle-explanation font-body text-white/50 text-lg leading-relaxed max-w-2xl">
                    {p.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
