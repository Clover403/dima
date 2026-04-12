import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    name: 'Estructuración de Deuda',
    image: '/foto/brand-nature.jpg',
    description:
      'Rediseñamos la arquitectura financiera de tu empresa para maximizar produktividad y minimizar el costo de capital.',
  },
  {
    number: '02',
    name: 'Análisis de Riesgo Crediticio',
    image: '/foto/brand-stationery.jpg',
    description:
      'Evaluación profunda basada en modelos macroeconómicos y análisis sectorial del contexto mexicano.',
  },
  {
    number: '03',
    name: 'Planeación Financiera Estratégica',
    image: '/foto/illust-buildings.jpg',
    description:
      'Diseñamos roadmaps financieros alineados a tus objetivos de crecimiento a mediano y largo plazo.',
  },
]

export default function ServicesSection() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0)
  const sectionRef   = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const imageParallaxRef = useRef<HTMLDivElement>(null)
  const textWrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        // Same as WhoWeAreSection — clip from LEFT
        if (imageWrapRef.current) {
          gsap.set(imageWrapRef.current, {
            opacity: 0,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          })
        }

        if (textWrapRef.current) {
          textWrapRef.current.classList.remove('text-left')
          textWrapRef.current.classList.add('text-center')
        }

        // image col starts 0, text col is full
        gsap.set(sectionRef.current, { gridTemplateColumns: '0fr 1fr' })

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.2,
          },
        })

        introTl.to(sectionRef.current, {
          gridTemplateColumns: '1fr 1fr',
          duration: 1.2,
          ease: 'power3.inOut',
        })

        introTl.to(
          imageWrapRef.current,
          {
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
            duration: 1.2,
            ease: 'power3.inOut',
          },
          0
        )

        introTl.to(
          textWrapRef.current,
          {
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => {
              textWrapRef.current?.classList.remove('text-center')
              textWrapRef.current?.classList.add('text-left')
            },
          },
          0.2
        )
      })

      // Photo parallax — same as WhoWeAre
      if (imageParallaxRef.current) {
        gsap.fromTo(
          imageParallaxRef.current,
          { scale: 1.12, y: 60 },
          {
            scale: 1.0,
            y: -60,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }

      // Service rows — same reveal as reveal-phrase
      const items = sectionRef.current.querySelectorAll('.service-row')
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              end: 'top 50%',
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
      className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-lightgray overflow-hidden"
    >
      {/* ── KIRI: Foto — persis kayak WhoWeAre ───────────────────────────── */}
      <div className="relative h-[60vh] lg:h-auto lg:min-h-screen overflow-hidden">
        <div ref={imageWrapRef} className="absolute inset-0 overflow-hidden">
          <div
            ref={imageParallaxRef}
            className="absolute inset-0 w-full h-[115%] will-change-transform"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={services[activeServiceIndex].image}
                src={services[activeServiceIndex].image}
                alt={`DIMA Finance — ${services[activeServiceIndex].name}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                initial={{ opacity: 0, scale: 1.04, filter: 'blur(2px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.985, filter: 'blur(2px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
          </div>
          {/* Diagonal blend ke kanan menuju text area */}
          <div
            className="absolute inset-y-0 right-0 w-[36%] hidden lg:block"
            style={{
              clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
              background:
                'linear-gradient(100deg, rgba(244,244,245,0) 0%, rgba(244,244,245,0.55) 55%, rgba(244,244,245,1) 100%)',
            }}
          />
        </div>
      </div>

      {/* ── KANAN: Teks — persis kayak WhoWeAre ──────────────────────────── */}
      <div
        ref={textWrapRef}
        className="flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-24 lg:py-0"
      >
        <p className="text-bronze font-body text-xs tracking-[0.3em] uppercase mb-10 service-row">
          SERVICIOS
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-navy leading-tight mb-16 service-row">
          Acompañamiento{' '}
          <em className="text-bronze">estratégico</em>
        </h2>

        <div className="space-y-0">
          {services.map((service, index) => (
            <button
              type="button"
              key={service.number}
              onClick={() => setActiveServiceIndex(index)}
              className="service-row group w-full py-10 border-b border-navy/10 flex gap-8 items-start text-left transition-colors duration-500"
              aria-pressed={activeServiceIndex === index}
            >
              <span
                className={`font-display text-4xl transition-colors duration-500 shrink-0 leading-none mt-1 ${
                  activeServiceIndex === index
                    ? 'text-bronze/30'
                    : 'text-navy/[0.06] group-hover:text-bronze/20'
                }`}
              >
                {service.number}
              </span>
              <div>
                <h3
                  className={`font-display text-xl md:text-2xl mb-3 transition-colors duration-500 ${
                    activeServiceIndex === index
                      ? 'text-bronze'
                      : 'text-navy group-hover:text-bronze'
                  }`}
                >
                  {service.name}
                </h3>
                <p className="font-body text-sm md:text-base text-navy/50 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 service-row">
          <Link to="/servicios" className="btn-bronze">
            EXPLORAR SERVICIOS
          </Link>
        </div>
      </div>
    </section>
  )
}