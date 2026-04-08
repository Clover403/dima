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
  const whoWeAreImageWrapRef = useRef<HTMLDivElement>(null)
  const whoWeAreImageRef = useRef<HTMLImageElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const servicesImageWrapRef = useRef<HTMLDivElement>(null)
  const servicesImageRef = useRef<HTMLImageElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)
  const modelChartPathRef = useRef<SVGPathElement>(null)
  const modelChartWaveRef = useRef<SVGPathElement>(null)
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

        /* ── Photo: clip-path wipe from right ── */
        if (whoWeAreImageWrapRef.current && whoWeAreImageRef.current) {
          gsap.fromTo(
            whoWeAreImageWrapRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: whoWeAreRef.current,
                start: 'top 70%',
              },
            }
          )
          gsap.fromTo(
            whoWeAreImageRef.current,
            { scale: 1.15, y: 50 },
            {
              scale: 1.0,
              y: -50,
              ease: 'none',
              scrollTrigger: {
                trigger: whoWeAreRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          )
        }
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

        /* ── Photo: clip-path wipe from left ── */
        if (servicesImageWrapRef.current && servicesImageRef.current) {
          gsap.fromTo(
            servicesImageWrapRef.current,
            { clipPath: 'inset(0 0 0 100%)' },
            {
              clipPath: 'inset(0 0% 0 0%)',
              duration: 1.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: servicesRef.current,
                start: 'top 70%',
              },
            }
          )
          gsap.fromTo(
            servicesImageRef.current,
            { scale: 1.15, y: 50 },
            {
              scale: 1.0,
              y: -50,
              ease: 'none',
              scrollTrigger: {
                trigger: servicesRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          )
        }
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

        /* ── SVG chart: draw paths on scroll ── */
        ;[modelChartPathRef.current, modelChartWaveRef.current].forEach((path) => {
          if (!path) return
          const length = path.getTotalLength()
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: modelRef.current,
              start: 'top 65%',
              end: 'bottom 35%',
              scrub: 1.5,
            },
          })
        })

        /* ── Chart labels fade in ── */
        gsap.fromTo(
          modelRef.current.querySelectorAll('.chart-label'),
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            stagger: 0.2,
            scrollTrigger: {
              trigger: modelRef.current,
              start: 'top 55%',
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
          SECTION 1 — HERO WITH BANNER
      ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        {/* Hero Banner */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/foto/brand-corporate.jpg)',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60" />
        </div>

        {/* Geometric background animation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-10 pointer-events-none hidden lg:block z-5">
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
          SECTION 2 — WHO WE ARE  (split layout: text + photo)
      ═══════════════════════════════════════════ */}
      <section
        ref={whoWeAreRef}
        className="py-32 md:py-48 section-padding"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 lg:gap-20 items-start">

          {/* ── Left: phrase stack ── */}
          <div className="space-y-20 md:space-y-32">
            <p className="reveal-phrase font-display text-3xl md:text-5xl lg:text-6xl text-navy leading-tight">
              No somos un banco.
            </p>
            <p className="reveal-phrase font-display text-3xl md:text-5xl lg:text-6xl text-navy leading-tight">
              Somos <span className="text-bronze italic">arquitectos</span> de equilibrio.
            </p>
            <p className="reveal-phrase font-display text-3xl md:text-5xl lg:text-6xl text-navy leading-tight">
              Transformamos la deuda en{' '}
              <span className="text-bronze italic">productividad.</span>
            </p>
            <p className="reveal-phrase font-body text-lg md:text-xl text-navy/55 max-w-2xl leading-relaxed">
              En DIMA Finance, cada decisión crediticia se fundamenta en principios
              de ingeniería financiera y equilibrio macroeconómico. No otorgamos
              créditos — diseñamos estructuras que generan valor.
            </p>
          </div>

          {/* ── Right: sticky brand photo (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              {/* Label */}
              <motion.p
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-bronze/50 font-body text-xs tracking-[0.3em] uppercase mb-5 text-right"
              >
                Ingeniería · Equilibrio
              </motion.p>

              {/* Photo with clip-path wipe reveal */}
              <div className="relative">
                <div
                  ref={whoWeAreImageWrapRef}
                  className="relative overflow-hidden aspect-[2/3]"
                >
                  <img
                    ref={whoWeAreImageRef}
                    src="/foto/brand-stationery.jpg"
                    alt="DIMA Finance"
                    className="w-full h-full object-cover will-change-transform"
                    loading="lazy"
                  />
                  {/* Subtle bottom fade to section bg */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-lightgray/20 pointer-events-none" />
                </div>

                {/* Bronze corner frame accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-bronze/40 pointer-events-none" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-bronze/40 pointer-events-none" />

                {/* Floating diamond ornament */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-5 top-[38%] pointer-events-none"
                >
                  <svg viewBox="0 0 44 44" fill="none" className="w-9 h-9 opacity-25">
                    <path d="M22 2L42 22L22 42L2 22Z" stroke="#E5997B" strokeWidth="0.8" />
                    <path d="M22 10L34 22L22 34L10 22Z" stroke="#E5997B" strokeWidth="0.4" />
                  </svg>
                </motion.div>
              </div>

              {/* Caption */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-navy/20 font-body text-xs tracking-widest uppercase mt-5 text-right"
              >
                DIMA Finance — 2025
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — PRODUCTS PREVIEW  (with ornaments)
      ═══════════════════════════════════════════ */}
      <section ref={productsRef} className="relative py-24 md:py-32 section-padding overflow-hidden">

        {/* Background: subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 14 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 64 + 32} cy={row * 64 + 32} r="1.5" fill="#030035" />
              ))
            )}
          </svg>
        </div>

        {/* Background: large diamond ornament */}
        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 pointer-events-none opacity-[0.03] hidden lg:block">
          <svg viewBox="0 0 600 600" fill="none" className="w-[500px] h-[500px]">
            <path d="M300 30L570 300L300 570L30 300Z" stroke="#030035" strokeWidth="0.8" />
            <path d="M300 120L480 300L300 480L120 300Z" stroke="#030035" strokeWidth="0.5" />
            <line x1="300" y1="30" x2="300" y2="570" stroke="#030035" strokeWidth="0.2" />
            <line x1="30" y1="300" x2="570" y2="300" stroke="#030035" strokeWidth="0.2" />
          </svg>
        </div>

        {/* Floating ornament top-right */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-[8%] pointer-events-none hidden lg:block"
        >
          <svg viewBox="0 0 50 50" fill="none" className="w-10 h-10 opacity-[0.06]">
            <path d="M25 3L47 25L25 47L3 25Z" stroke="#030035" strokeWidth="0.7" />
            <path d="M25 11L39 25L25 39L11 25Z" stroke="#030035" strokeWidth="0.4" />
          </svg>
        </motion.div>

        {/* Floating ornament bottom-left */}
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-14 left-[6%] pointer-events-none hidden lg:block"
        >
          <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8 opacity-[0.06]">
            <path d="M20 2L38 20L20 38L2 20Z" stroke="#E5997B" strokeWidth="0.7" />
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header with drawing line */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-10 h-px bg-bronze/50 origin-left"
              />
              <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase">
                Productos
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-navy">
              Soluciones con ingeniería
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.name}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="product-card group relative p-8 border border-navy/10 bg-white hover:border-bronze/30 shadow-sm hover:shadow-md transition-all duration-500"
              >
                <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {product.icon}
                </div>
                <h3 className="font-display text-xl text-navy mb-3">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-navy/55 leading-relaxed">
                  {product.description}
                </p>
                {/* Bottom bronze accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-bronze origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
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
          SECTION 4 — SERVICES PREVIEW  (split layout: list + photo)
      ═══════════════════════════════════════════ */}
      <section ref={servicesRef} className="py-24 md:py-32 section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-start">

          {/* ── Left: services list ── */}
          <div className="lg:pr-20">
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-10 h-px bg-bronze/50 origin-left"
                />
                <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase">
                  Servicios
                </p>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-navy">
                Acompañamiento estratégico
              </h2>
            </div>

            <div className="space-y-0">
              {services.map((service, i) => (
                <div
                  key={service.name}
                  className="service-item group py-12 border-b border-navy/10 flex flex-col md:flex-row md:items-start gap-6 md:gap-12"
                >
                  <span className="font-display text-5xl md:text-6xl text-navy/5 group-hover:text-bronze/20 transition-colors duration-500 shrink-0 leading-none pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1">
                    <h3 className="font-display text-2xl md:text-3xl text-navy mb-4 group-hover:text-bronze transition-colors duration-500">
                      {service.name}
                    </h3>
                    <p className="font-body text-navy/55 leading-relaxed max-w-xl">
                      {service.description}
                    </p>
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

          {/* ── Right: sticky brand photo (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              {/* Clip-path wipe reveal from left */}
              <div className="relative">
                <div
                  ref={servicesImageWrapRef}
                  className="relative overflow-hidden aspect-[3/4]"
                >
                  <img
                    ref={servicesImageRef}
                    src="/foto/brand-nature.jpg"
                    alt="DIMA Finance — Servicios"
                    className="w-full h-full object-cover will-change-transform"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-lightgray/25 via-transparent to-transparent pointer-events-none" />
                  {/* Bronze border */}
                  <div className="absolute inset-0 border border-bronze/15 pointer-events-none" />
                </div>

                {/* Bronze corner frames */}
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-bronze/40 pointer-events-none" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-bronze/40 pointer-events-none" />

                {/* Floating ornament */}
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [0, -4, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -left-6 top-[30%] pointer-events-none"
                >
                  <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7 opacity-20">
                    <path d="M18 2L34 18L18 34L2 18Z" stroke="#E5997B" strokeWidth="0.8" />
                  </svg>
                </motion.div>
              </div>

              {/* Caption */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-navy/20 font-body text-xs tracking-widest uppercase mt-5"
              >
                Acompañamiento · Estrategia
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — CREDIT MODEL TEASER  (text + animated SVG chart)
      ═══════════════════════════════════════════ */}
      <section
        ref={modelRef}
        className="relative py-32 md:py-48 section-padding overflow-hidden"
      >
        {/* Large background text */}
        <div className="bg-text absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[20vw] md:text-[15vw] text-navy/[0.04] tracking-widest">
            DIMA
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: animated economic chart (desktop only) ── */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 520 360"
              fill="none"
              className="w-full max-w-lg"
            >
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="60"
                  y1={50 + i * 55}
                  x2="490"
                  y2={50 + i * 55}
                  stroke="#030035"
                  strokeWidth="0.4"
                  opacity="0.07"
                />
              ))}
              {/* X axis */}
              <line x1="60" y1="305" x2="490" y2="305" stroke="#030035" strokeWidth="0.8" opacity="0.15" />
              {/* Y axis */}
              <line x1="60" y1="30" x2="60" y2="305" stroke="#030035" strokeWidth="0.8" opacity="0.15" />

              {/* ── Productividad — upward growth curve ── */}
              <path
                ref={modelChartPathRef}
                d="M60 280 Q130 265 185 240 T300 185 T400 110 T490 55"
                stroke="#D97E5A"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Diamond endpoint on productividad */}
              <path
                className="chart-label"
                d="M488 53L494 59L488 65L482 59Z"
                fill="#D97E5A"
                fillOpacity="0.7"
              />

              {/* ── Deuda — oscillating cycle with slight upward trend ── */}
              <path
                ref={modelChartWaveRef}
                d="M60 240 C100 240 115 175 155 175 S205 240 245 240 S295 305 335 298 S385 240 425 222 S465 200 490 185"
                stroke="#E5997B"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="7 4"
              />

              {/* ── Axis labels ── */}
              <text
                className="chart-label"
                x="60"
                y="325"
                fill="#030035"
                fontSize="10"
                opacity="0.35"
                style={{ fontFamily: 'Inter Tight, sans-serif' }}
              >
                Tiempo →
              </text>
              <text
                className="chart-label"
                x="14"
                y="170"
                fill="#030035"
                fontSize="10"
                opacity="0.35"
                transform="rotate(-90, 14, 170)"
                style={{ fontFamily: 'Inter Tight, sans-serif' }}
              >
                Crecimiento ↑
              </text>

              {/* ── Legend labels ── */}
              <g className="chart-label">
                <line x1="320" y1="28" x2="340" y2="28" stroke="#D97E5A" strokeWidth="2" />
                <text x="344" y="32" fill="#D97E5A" fontSize="9.5" opacity="0.85" style={{ fontFamily: 'Inter Tight, sans-serif' }}>Productividad</text>
              </g>
              <g className="chart-label">
                <line x1="320" y1="46" x2="340" y2="46" stroke="#E5997B" strokeWidth="1.8" strokeDasharray="5 3" />
                <text x="344" y="50" fill="#E5997B" fontSize="9.5" opacity="0.75" style={{ fontFamily: 'Inter Tight, sans-serif' }}>Deuda (ciclo)</text>
              </g>

              {/* ── "Equilibrio DIMA" zone annotation ── */}
              <rect
                className="chart-label"
                x="60" y="100" width="430" height="85"
                fill="#E5997B"
                fillOpacity="0.04"
              />
              <text
                className="chart-label"
                x="275"
                y="148"
                textAnchor="middle"
                fill="#E5997B"
                fontSize="9"
                opacity="0.4"
                letterSpacing="0.15em"
                style={{ fontFamily: 'Inter Tight, sans-serif' }}
              >
                ZONA DE EQUILIBRIO DIMA
              </text>

              {/* ── Chart title ── */}
              <text
                className="chart-label"
                x="275"
                y="20"
                textAnchor="middle"
                fill="#030035"
                fontSize="8.5"
                opacity="0.25"
                letterSpacing="0.18em"
                style={{ fontFamily: 'Inter Tight, sans-serif' }}
              >
                MODELO MACROECONÓMICO — RAY DALIO
              </text>
            </svg>

            {/* Source note */}
            <p className="text-navy/25 font-body text-[10px] tracking-[0.2em] uppercase mt-4">
              Basado en "How the Economic Machine Works" — Ray Dalio
            </p>
          </div>

          {/* ── Right: text content ── */}
          <div className="model-content text-center lg:text-left">
            <p className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-6">
              Modelo Crediticio
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-tight mb-8">
              Fundamentado en el
              <br />
              equilibrio de <span className="text-bronze italic">Ray Dalio</span>
            </h2>
            <p className="font-body text-navy/55 text-lg leading-relaxed mb-12 max-w-2xl lg:max-w-none">
              La productividad debe crecer más rápido que la deuda. Este principio,
              extraído del modelo macroeconómico de Ray Dalio, guía cada estructura
              crediticia que diseñamos. No financiamos — equilibramos.
            </p>

            {/* Visual divider */}
            <div className="flex items-center gap-4 mb-12 justify-center lg:justify-start">
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — CTA BANNER
      ═══════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-24 md:py-32 section-padding">
        <div className="relative overflow-hidden bg-gradient-to-br from-bronze/90 to-bronze px-8 md:px-16 py-16 md:py-24">
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
