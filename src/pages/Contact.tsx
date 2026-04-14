import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'

gsap.registerPlugin(ScrollTrigger)

const productTypes = [
  'Crédito Simple',
  'Crédito Puente',
  'Cuenta Corriente',
  'Crédito Agroindustrial',
  'Arrendamiento Financiero',
  'Factoring',
]

const loanRanges = [
  '$500K - $2M MXN',
  '$2M - $5M MXN',
  '$5M - $15M MXN',
  '$15M - $50M MXN',
  '$50M+ MXN',
]

const termOptions = [
  '6 meses',
  '12 meses',
  '24 meses',
  '36 meses',
  '48 meses',
  '60+ meses',
]

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [formStep, setFormStep] = useState(0)
  const [formData, setFormData] = useState({
    sector: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
    productType: '',
    loanRange: '',
    term: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Hero parallax and fade
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

      // Form section reveal
      if (formRef.current) {
        const reveals = formRef.current.querySelectorAll('.form-reveal')
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 40, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 75%',
            },
          }
        )
      }

      // Marquee
      gsap.to('.contact-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 50,
        ease: 'none',
      })

      // Grid movement
      gsap.to('.contact-grid-bg', {
        backgroundPosition: '0 150px',
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Open Calendly with pre-filled info
    const calendlyUrl = `https://calendly.com/corporativo-dimafinance/30min?name=${encodeURIComponent(formData.contactName)}&email=${encodeURIComponent(formData.email)}`
    window.open(calendlyUrl, '_blank')
  }

  const nextStep = () => setFormStep((s) => Math.min(s + 1, 2))
  const prevStep = () => setFormStep((s) => Math.max(s - 1, 0))

  const isStep1Valid = formData.sector && formData.contactName && formData.position && formData.email && formData.phone
  const isStep2Valid = formData.productType && formData.loanRange && formData.term

  return (
    <PageTransition>
      <div ref={sectionRef}>
        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden bg-lightgray"
        >
          {/* Grid background */}
          <div
            className="contact-grid-bg absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(to right, #030035 1px, transparent 1px), linear-gradient(to bottom, #030035 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Marquee */}
          <div className="absolute top-[20%] left-0 flex whitespace-nowrap opacity-[0.025] select-none pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="contact-marquee font-display text-[14vw] leading-none uppercase pr-20 text-navy"
              >
                Agenda tu Cita &bull; Contacto &bull; Videollamada &bull;
              </span>
            ))}
          </div>

          <div className="hero-content relative z-10 text-center max-w-4xl px-8">
            <p className="font-body text-bronze text-sm tracking-[0.5em] uppercase mb-8">
              Contacto
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-navy leading-[1.05] mb-8">
              Agenda tu
              <br />
              <span className="text-bronze italic">videollamada</span>
            </h1>
            <p className="font-body text-navy/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Completa el formulario de precalificación y agenda
              directamente una sesión con nuestro equipo de ingeniería financiera.
            </p>

            {/* Scroll indicator */}
            <div className="mt-16 flex flex-col items-center gap-2">
              <span className="text-navy/30 text-xs tracking-widest uppercase font-body">
                Scroll
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FORM SECTION
        ═══════════════════════════════════════════ */}
        <section
          ref={formRef}
          className="relative min-h-screen py-24 md:py-32 bg-white overflow-hidden"
        >
          {/* Subtle texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.3]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(3,0,53,0.04) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
            {/* Important notice */}
            <div className="form-reveal text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-bronze/5 border border-bronze/20 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
                <span className="font-body text-sm text-navy/70">
                  Al completar este formulario, estará agendando una cita directamente
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-tight mb-4">
                Formulario de
                <span className="text-bronze italic"> Precalificación</span>
              </h2>
              <p className="font-body text-navy/50 text-base max-w-xl mx-auto">
                Esta información nos permite preparar una sesión personalizada
                y enfocada en las necesidades específicas de su empresa.
              </p>
            </div>

            {/* Step indicator */}
            <div className="form-reveal flex items-center justify-center gap-4 mb-16">
              {['Información', 'Producto', 'Agendar'].map((label, i) => (
                <div key={label} className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (i < formStep) setFormStep(i)
                    }}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      formStep >= i ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-body transition-all duration-500 ${
                        formStep === i
                          ? 'bg-bronze text-white'
                          : formStep > i
                            ? 'bg-navy text-white'
                            : 'bg-navy/10 text-navy/40'
                      }`}
                    >
                      {formStep > i ? (
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                          <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className="font-body text-sm text-navy/70 hidden md:block">
                      {label}
                    </span>
                  </button>
                  {i < 2 && (
                    <div
                      className={`w-16 h-px transition-colors duration-500 ${
                        formStep > i ? 'bg-bronze' : 'bg-navy/10'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              {/* Step 1 - Contact info */}
              <div
                className={`transition-all duration-500 ${
                  formStep === 0
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 absolute pointer-events-none'
                }`}
              >
                <div className="form-reveal space-y-6">
                  <div>
                    <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-3">
                      Sector / Industria
                    </label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      placeholder="Ej. Manufactura, Agroindustria, Inmobiliario..."
                      className="w-full px-0 py-4 bg-transparent border-b border-navy/15 text-navy font-body text-lg focus:border-bronze focus:outline-none transition-colors placeholder:text-navy/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-3">
                        Nombre de Contacto
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-0 py-4 bg-transparent border-b border-navy/15 text-navy font-body text-lg focus:border-bronze focus:outline-none transition-colors placeholder:text-navy/20"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-3">
                        Cargo
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="Ej. Director General, CFO..."
                        className="w-full px-0 py-4 bg-transparent border-b border-navy/15 text-navy font-body text-lg focus:border-bronze focus:outline-none transition-colors placeholder:text-navy/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-3">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-0 py-4 bg-transparent border-b border-navy/15 text-navy font-body text-lg focus:border-bronze focus:outline-none transition-colors placeholder:text-navy/20"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-3">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-0 py-4 bg-transparent border-b border-navy/15 text-navy font-body text-lg focus:border-bronze focus:outline-none transition-colors placeholder:text-navy/20"
                      />
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep1Valid}
                      className={`inline-flex items-center gap-3 px-8 py-4 font-body text-sm tracking-[0.2em] uppercase transition-all duration-300 rounded-sm ${
                        isStep1Valid
                          ? 'bg-navy text-white hover:bg-bronze'
                          : 'bg-navy/10 text-navy/30 cursor-not-allowed'
                      }`}
                    >
                      <span>Siguiente</span>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 - Product info */}
              <div
                className={`transition-all duration-500 ${
                  formStep === 1
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 absolute pointer-events-none'
                }`}
              >
                <div className="space-y-8">
                  {/* Product type selection */}
                  <div>
                    <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-5">
                      Tipo de Producto
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {productTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, productType: type })
                          }
                          className={`px-4 py-4 text-left font-body text-sm border rounded-lg transition-all duration-300 ${
                            formData.productType === type
                              ? 'border-bronze bg-bronze/5 text-navy'
                              : 'border-navy/10 text-navy/50 hover:border-navy/30'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loan range */}
                  <div>
                    <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-5">
                      Rango de Monto
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {loanRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, loanRange: range })
                          }
                          className={`px-5 py-3 font-body text-sm border rounded-full transition-all duration-300 ${
                            formData.loanRange === range
                              ? 'border-bronze bg-bronze/5 text-navy'
                              : 'border-navy/10 text-navy/50 hover:border-navy/30'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Term */}
                  <div>
                    <label className="block font-body text-xs tracking-[0.2em] uppercase text-navy/50 mb-5">
                      Plazo Deseado
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {termOptions.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, term: term })
                          }
                          className={`px-5 py-3 font-body text-sm border rounded-full transition-all duration-300 ${
                            formData.term === term
                              ? 'border-bronze bg-bronze/5 text-navy'
                              : 'border-navy/10 text-navy/50 hover:border-navy/30'
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-3 px-6 py-4 font-body text-sm tracking-[0.2em] uppercase text-navy/50 hover:text-navy transition-colors"
                    >
                      <svg className="w-4 h-4 rotate-180" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Anterior</span>
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep2Valid}
                      className={`inline-flex items-center gap-3 px-8 py-4 font-body text-sm tracking-[0.2em] uppercase transition-all duration-300 rounded-sm ${
                        isStep2Valid
                          ? 'bg-navy text-white hover:bg-bronze'
                          : 'bg-navy/10 text-navy/30 cursor-not-allowed'
                      }`}
                    >
                      <span>Siguiente</span>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 - Book appointment */}
              <div
                className={`transition-all duration-500 ${
                  formStep === 2
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 absolute pointer-events-none'
                }`}
              >
                <div className="text-center space-y-8">
                  {/* Summary */}
                  <div className="bg-lightgray rounded-2xl p-8 text-left space-y-4">
                    <h3 className="font-display text-xl text-navy mb-6">
                      Resumen de su solicitud
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-navy/40 block mb-1">
                          Contacto
                        </span>
                        <span className="font-body text-navy">
                          {formData.contactName}
                        </span>
                      </div>
                      <div>
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-navy/40 block mb-1">
                          Sector
                        </span>
                        <span className="font-body text-navy">
                          {formData.sector}
                        </span>
                      </div>
                      <div>
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-navy/40 block mb-1">
                          Producto
                        </span>
                        <span className="font-body text-navy">
                          {formData.productType}
                        </span>
                      </div>
                      <div>
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-navy/40 block mb-1">
                          Monto
                        </span>
                        <span className="font-body text-navy">
                          {formData.loanRange}
                        </span>
                      </div>
                      <div>
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-navy/40 block mb-1">
                          Plazo
                        </span>
                        <span className="font-body text-navy">
                          {formData.term}
                        </span>
                      </div>
                      <div>
                        <span className="font-body text-xs tracking-[0.2em] uppercase text-navy/40 block mb-1">
                          Email
                        </span>
                        <span className="font-body text-navy">
                          {formData.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-bronze/5 border border-bronze/20 rounded-full">
                      <svg className="w-5 h-5 text-bronze" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="font-body text-sm text-navy/70">
                        Será redirigido a nuestra agenda para seleccionar fecha y hora
                      </span>
                    </div>

                    <p className="font-display text-2xl md:text-3xl text-navy">
                      Listo para agendar su
                      <span className="text-bronze italic"> videollamada</span>
                    </p>
                    <p className="font-body text-navy/50 text-base max-w-lg mx-auto">
                      Al hacer clic, será redirigido a Calendly para seleccionar
                      la fecha y hora que mejor se adapte a su agenda. La sesión
                      dura 30 minutos.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center justify-center gap-3 px-6 py-4 font-body text-sm tracking-[0.2em] uppercase text-navy/50 hover:text-navy transition-colors"
                    >
                      <svg className="w-4 h-4 rotate-180" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Anterior</span>
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-bronze text-white font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-bronze-dark transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M10 15l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Agendar Videollamada</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            DIRECT CONTACT SECTION
        ═══════════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-navy overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(to right, #E5997B 1px, transparent 1px), linear-gradient(to bottom, #E5997B 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
            <p className="font-body text-bronze text-xs tracking-[0.5em] uppercase mb-6">
              Contacto Directo
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white leading-tight mb-12">
              También puede contactarnos
              <span className="text-bronze italic"> directamente</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Email */}
              <a
                href="mailto:corporativo@dimafinance.com.mx"
                className="group p-8 border border-white/10 rounded-xl hover:border-bronze/30 transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-bronze mb-4 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 7l10 6 10-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
                  Email
                </p>
                <p className="font-body text-white group-hover:text-bronze transition-colors text-sm">
                  corporativo@dimafinance.com.mx
                </p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/5213319717871"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 border border-white/10 rounded-xl hover:border-bronze/30 transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-bronze mb-4 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm5 5a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1z"
                    fill="currentColor"
                  />
                </svg>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
                  WhatsApp
                </p>
                <p className="font-body text-white group-hover:text-bronze transition-colors text-sm">
                  +52 1 33 1971 7871
                </p>
              </a>

              {/* Calendly Direct */}
              <a
                href="https://calendly.com/corporativo-dimafinance/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 border border-white/10 rounded-xl hover:border-bronze/30 transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-bronze mb-4 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
                  Videollamada
                </p>
                <p className="font-body text-white group-hover:text-bronze transition-colors text-sm">
                  Agendar directamente
                </p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
