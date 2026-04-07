import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const overview = [
  {
    num: '01',
    name: 'Crédito Simple',
    hook: 'Capital a plazo fijo para expandir capacidad instalada.',
    use: 'Adquisición de activos y expansión',
  },
  {
    num: '02',
    name: 'Crédito Puente',
    hook: 'Financiamiento alineado al avance de obra inmobiliaria.',
    use: 'Desarrollos inmobiliarios',
  },
  {
    num: '03',
    name: 'Cuenta Corriente',
    hook: 'Línea revolvente para gestionar ciclos operativos.',
    use: 'Capital de trabajo recurrente',
  },
  {
    num: '04',
    name: 'Crédito Agroindustrial',
    hook: 'Financiamiento calibrado a ciclos de cosecha.',
    use: 'Sector agropecuario',
  },
  {
    num: '05',
    name: 'Arrendamiento Financiero',
    hook: 'Activos productivos sin descapitalización.',
    use: 'Maquinaria y tecnología',
  },
  {
    num: '06',
    name: 'Factoring',
    hook: 'Liquidez inmediata sobre cuentas por cobrar.',
    use: 'Cadena de valor y flujo de efectivo',
  },
]

export default function ProductosOverview() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* Header */
      gsap.fromTo(
        el.querySelectorAll('.section-head'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 75%' },
        }
      )

      /* Cards stagger */
      gsap.fromTo(
        el.querySelectorAll('.overview-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el.querySelector('.overview-grid'),
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-navy py-32 md:py-40 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="section-head text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
            Resumen
          </p>
          <h2 className="section-head font-display text-4xl md:text-5xl text-white leading-tight">
            Todos nuestros productos
          </h2>
        </div>

        {/* Grid */}
        <div className="overview-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {overview.map((item) => (
            <motion.div
              key={item.num}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="overview-card group relative p-7 border border-white/5 bg-white/[0.02] hover:border-bronze/30 transition-colors duration-500"
            >
              {/* Number */}
              <span className="font-display text-5xl text-white/[0.04] group-hover:text-bronze/10 transition-colors duration-500 absolute top-4 right-6 select-none">
                {item.num}
              </span>

              <div className="relative z-10">
                <h3 className="font-display text-xl text-white group-hover:text-bronze transition-colors duration-500 mb-3">
                  {item.name}
                </h3>
                <p className="font-body text-white/45 text-sm leading-relaxed mb-4">
                  {item.hook}
                </p>
                <p className="font-body text-bronze/50 text-xs tracking-widest uppercase">
                  {item.use}
                </p>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 border border-bronze/0 group-hover:border-bronze/20 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/contacto" className="btn-bronze">
            Solicitar Asesoría Personalizada
          </Link>
        </div>
      </div>
    </section>
  )
}
