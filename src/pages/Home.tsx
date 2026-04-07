import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import DimaGeometric from '../components/DimaGeometric'

gsap.registerPlugin(ScrollTrigger)

/* ─── Product Data ─── */
const products = [
  {
    name: 'Crédito Estructurado',
    description: 'Financiamiento diseñado con ingeniería de equilibrio macroeconómico.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="4" width="40" height="40" rx="4" stroke="#E5997B" strokeWidth="1.5" />
        <path d="M14 34V22M24 34V14M34 34V26" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Línea Revolvente',
    description: 'Capital de trabajo flexible alineado a ciclos productivos.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" stroke="#E5997B" strokeWidth="1.5" />
        <path d="M24 14v10l7 7" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Factoraje Financiero',
    description: 'Liquidez inmediata transformando cuentas por cobrar en capital.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M6 38L18 26l8 8 16-20" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Arrendamiento Puro',
    description: 'Activos productivos sin descapitalización, con beneficio fiscal.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="20" width="32" height="20" rx="2" stroke="#E5997B" strokeWidth="1.5" />
        <path d="M16 20V12a8 8 0 0116 0v8" stroke="#E5997B" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'Crédito Puente',
    description: 'Financiamiento transitorio para proyectos de alto impacto.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M4 36h40M12 36V24a12 12 0 0124 0v12" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Asesoría Integral',
    description: 'Diagnóstico y estrategia financiera personalizada.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" stroke="#E5997B" strokeWidth="1.5" />
        <path d="M24 16v8M24 28v4" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 24h16" stroke="#E5997B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

/* ─── Services Data ─── */
const services = [
  {
    name: 'Estructuración de Deuda',
    description:
      'Rediseñamos la arquitectura financiera de tu empresa para maximizar productividad y minimizar el costo de capital.',
  },
  {
    name: 'Análisis de Riesgo Crediticio',
    description:
      'Evaluación profunda basada en modelos macroeconómicos y análisis sectorial del contexto mexicano.',
  },
  {
    name: 'Planeación Financiera Estratégica',
    description:
      'Diseñamos roadmaps financieros alineados a tus objetivos de crecimiento a mediano y largo plazo.',
  },
]

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const whoWeAreRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─── Hero fade-out on scroll ─── */
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector('.hero-content'), {
          y: -80,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '60% top',
            scrub: 1.5,
          },
        })
      }

      /* ─── Who We Are — line-by-line reveal ─── */
      if (whoWeAreRef.current) {
        const phrases = whoWeAreRef.current.querySelectorAll('.reveal-phrase')
        phrases.forEach((phrase) => {
          gsap.fromTo(
            phrase,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: phrase,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
              },
            }
          )
        })
      }

      /* ─── Products — staggered card entrance ─── */
      if (productsRef.current) {
        const cards = productsRef.current.querySelectorAll('.product-card')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: productsRef.current,
              start: 'top 75%',
            },
          }
        )
      }

      /* ─── Services — alternating reveal ─── */
      if (servicesRef.current) {
        const items = servicesRef.current.querySelectorAll('.service-item')
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
              },
            }
          )
        })
      }

      /* ─── Credit Model — parallax background text ─── */
      if (modelRef.current) {
        const bgText = modelRef.current.querySelector('.bg-text')
        if (bgText) {
          gsap.fromTo(
            bgText,
            { y: 100 },
            {
              y: -100,
              ease: 'none',
              scrollTrigger: {
                trigger: modelRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
              },
            }
          )
        }

        gsap.fromTo(
          modelRef.current.querySelector('.model-content'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: modelRef.current,
              start: 'top 70%',
            },
          }
        )
      }

      /* ─── CTA Banner ─── */
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <PageTransition>
      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        {/* Geometric background animation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-20 pointer-events-none hidden lg:block">
          <DimaGeometric />
        </div>

        <div className="hero-content section-padding relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
              DIMA Finance
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05] mb-8"
          >
            Ingeniería
            <br />
            Financiera para el
            <br />
            <span className="text-bronze italic">Crecimiento Real</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-lightgray/60 font-body text-lg md:text-xl max-w-xl leading-relaxed mb-10"
          >
            Estructuramos soluciones crediticias basadas en equilibrio
            macroeconómico. Donde otros ven deuda, nosotros diseñamos productividad.
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-24 h-px bg-bronze mb-10 origin-left"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Link to="/modelo-crediticio" className="btn-bronze">
              Conoce Nuestro Modelo
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-lightgray/30 text-xs tracking-widest uppercase font-body">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — WHO WE ARE
      ═══════════════════════════════════════════ */}
      <section
        ref={whoWeAreRef}
        className="py-32 md:py-48 section-padding"
      >
        <div className="max-w-4xl mx-auto space-y-20 md:space-y-32">
          <p className="reveal-phrase font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
            No somos un banco.
          </p>
          <p className="reveal-phrase font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
            Somos <span className="text-bronze italic">arquitectos</span> de equilibrio.
          </p>
          <p className="reveal-phrase font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
            Transformamos la deuda en{' '}
            <span className="text-bronze italic">productividad.</span>
          </p>
          <p className="reveal-phrase font-body text-lg md:text-xl text-lightgray/50 max-w-2xl leading-relaxed">
            En DIMA Finance, cada decisión crediticia se fundamenta en principios
            de ingeniería financiera y equilibrio macroeconómico. No otorgamos
            créditos — diseñamos estructuras que generan valor.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — PRODUCTS PREVIEW
      ═══════════════════════════════════════════ */}
      <section ref={productsRef} className="py-24 md:py-32 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-4">
              Productos
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Soluciones con ingeniería
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.name}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="product-card group relative p-8 border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-bronze/30 transition-colors duration-500"
              >
                <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {product.icon}
                </div>
                <h3 className="font-display text-xl text-white mb-3">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-lightgray/50 leading-relaxed">
                  {product.description}
                </p>
                {/* Hover border glow */}
                <div className="absolute inset-0 border border-bronze/0 group-hover:border-bronze/20 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/productos" className="btn-bronze">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — SERVICES PREVIEW
      ═══════════════════════════════════════════ */}
      <section ref={servicesRef} className="py-24 md:py-32 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-4">
              Servicios
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Acompañamiento estratégico
            </h2>
          </div>

          <div className="space-y-0">
            {services.map((service, i) => (
              <div
                key={service.name}
                className="service-item group py-12 border-b border-white/5 flex flex-col md:flex-row md:items-start gap-6 md:gap-16"
              >
                {/* Index number */}
                <span className="font-display text-6xl md:text-7xl text-white/5 group-hover:text-bronze/20 transition-colors duration-500 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex-1">
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-4 group-hover:text-bronze transition-colors duration-500">
                    {service.name}
                  </h3>
                  <p className="font-body text-lightgray/50 leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>

                {/* Geometric placeholder */}
                <div className="hidden md:flex items-center justify-center w-24 h-24 shrink-0">
                  <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <path
                      d={
                        i === 0
                          ? 'M40 5L75 40L40 75L5 40Z'
                          : i === 1
                          ? 'M40 5L75 25V55L40 75L5 55V25Z'
                          : 'M5 5H75V75H5Z'
                      }
                      stroke="#E5997B"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/servicios" className="btn-bronze">
              Explorar Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — CREDIT MODEL TEASER
      ═══════════════════════════════════════════ */}
      <section
        ref={modelRef}
        className="relative py-32 md:py-48 section-padding overflow-hidden"
      >
        {/* Large background text */}
        <div className="bg-text absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[20vw] md:text-[15vw] text-white/[0.02] tracking-widest">
            DIMA
          </span>
        </div>

        <div className="model-content relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
            Modelo Crediticio
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-8">
            Fundamentado en el
            <br />
            equilibrio de <span className="text-bronze italic">Ray Dalio</span>
          </h2>
          <p className="font-body text-lightgray/50 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            La productividad debe crecer más rápido que la deuda. Este principio,
            extraído del modelo macroeconómico de Ray Dalio, guía cada estructura
            crediticia que diseñamos. No financiamos — equilibramos.
          </p>

          {/* Visual divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-12 h-px bg-bronze/30" />
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M12 2L22 12L12 22L2 12Z" stroke="#E5997B" strokeWidth="1" />
            </svg>
            <div className="w-12 h-px bg-bronze/30" />
          </div>

          <Link to="/modelo-crediticio" className="btn-bronze">
            Descubre el Modelo
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — CTA BANNER
      ═══════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-24 md:py-32 section-padding">
        <div className="relative overflow-hidden bg-gradient-to-br from-bronze/90 to-bronze px-8 md:px-16 py-16 md:py-24">
          {/* Subtle geometric overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="xMidYMid slice">
              <path d="M400 0L800 200L400 400L0 200Z" stroke="#030035" strokeWidth="1" />
              <path d="M400 50L750 200L400 350L50 200Z" stroke="#030035" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-navy leading-tight mb-6">
              ¿Listo para estructurar tu crecimiento?
            </h2>
            <p className="font-body text-navy/70 text-lg mb-10 max-w-xl mx-auto">
              Conversemos sobre cómo la ingeniería financiera puede transformar
              la estructura de tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-block px-8 py-3 bg-navy text-lightgray font-body font-medium text-sm tracking-widest uppercase transition-all duration-500 hover:bg-navy/80"
              >
                Agenda una Videollamada
              </a>
              <Link
                to="/contacto"
                className="inline-block px-8 py-3 border border-navy text-navy font-body font-medium text-sm tracking-widest uppercase transition-all duration-500 hover:bg-navy hover:text-lightgray"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
