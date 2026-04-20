import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import AnimatedGrid from '../components/AnimatedGrid'

gsap.registerPlugin(ScrollTrigger)

const productTypes = [
  'Crédito Simple', 'Crédito Puente', 'Cuenta Corriente',
  'Crédito Agroindustrial', 'Arrendamiento Financiero', 'Factoring',
]
const loanRanges = ['$500K - $2M MXN', '$2M - $5M MXN', '$5M - $15M MXN', '$15M - $50M MXN', '$50M+ MXN']
const termOptions = ['6 meses', '12 meses', '24 meses', '36 meses', '48 meses', '60+ meses']

// ── Calendly URL base — linked to Diego's calendar ────────────
const CALENDLY_BASE = 'https://calendly.com/corporativo-dimafinance/30min'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef    = useRef<HTMLDivElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)
  const [formStep, setFormStep] = useState(0)
  const [formData, setFormData] = useState({
    sector: '', contactName: '', position: '', email: '', phone: '',
    productType: '', loanRange: '', term: '',
  })

  // ── Load Calendly script once ─────────────────────────────
  useEffect(() => {
    if (document.querySelector('script[src*="calendly"]')) return
    const script = document.createElement('script')
    script.src  = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)

    // Calendly CSS
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
  }, [])

  // ── Init Calendly inline widget when reaching step 3 ─────
  useEffect(() => {
    if (formStep !== 2) return

    // Build pre-filled URL with lead data
    const params = new URLSearchParams({
      name:             formData.contactName,
      email:            formData.email,
      hide_gdpr_banner: '1',
      // Pass qualification data as notes via utm params
      utm_source:       'website_form',
      utm_medium:       formData.productType,
      utm_campaign:     formData.loanRange,
      utm_content:      formData.term,
    })
    const calendlyUrl = `${CALENDLY_BASE}?${params.toString()}`

    // Wait for Calendly script + DOM element to be ready
    const tryInit = (attempts = 0) => {
      const el = document.querySelector('.calendly-inline-widget') as HTMLElement | null
      const Cal = (window as any).Calendly

      if (el && Cal?.initInlineWidget) {
        // Clear previous widget if any
        el.innerHTML = ''
        Cal.initInlineWidget({ url: calendlyUrl, parentElement: el })
      } else if (attempts < 20) {
        // Retry up to 2s
        setTimeout(() => tryInit(attempts + 1), 100)
      }
    }
    tryInit()
  }, [formStep, formData.contactName, formData.email])

  // ── Scroll to top + animations ───────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector('.hero-content'), {
          y: -80, opacity: 0, ease: 'power2.inOut',
          scrollTrigger: { trigger: heroRef.current, start: '40% top', end: '80% top', scrub: 1 },
        })
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current.querySelectorAll('.form-reveal'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: formRef.current, start: 'top 75%' } }
        )
      }
      gsap.to('.contact-marquee', { xPercent: -50, repeat: -1, duration: 50, ease: 'none' })
      gsap.to('.contact-grid-bg', {
        backgroundPosition: '0 150px',
        scrollTrigger: { trigger: sectionRef.current, scrub: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, +, -, (, )
    const val = e.target.value.replace(/[^\d\s+\-()]/g, '')
    setFormData({ ...formData, phone: val })
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData({ ...formData, email: val })
    if (val && !validateEmail(val)) {
      setErrors(prev => ({ ...prev, email: 'Ingrese un correo electrónico válido' }))
    } else {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const nextStep = () => setFormStep((s) => Math.min(s + 1, 2))
  const prevStep = () => setFormStep((s) => Math.max(s - 1, 0))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const isEmailValid = validateEmail(formData.email)
  const isPhoneValid = formData.phone.replace(/[\s+\-()]/g, '').length >= 8
  const isStep1Valid = !!(formData.sector && formData.contactName && formData.position && isEmailValid && isPhoneValid)
  const isStep2Valid = !!(formData.productType && formData.loanRange && formData.term)
  const STEPS = ['Información', 'Producto', 'Agendar']

  return (
    <PageTransition>
      <div ref={sectionRef}>

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-[#030035]">
          <AnimatedGrid cellSize={60} color="229,153,123" />
          <div className="contact-grid-bg absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}/>
          {['top-8 left-8','top-8 right-8','bottom-8 left-8','bottom-8 right-8'].map((pos, i) => (
            <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none`} viewBox="0 0 40 40" fill="none">
              <path d={['M0 20 L0 0 L20 0','M40 20 L40 0 L20 0','M0 20 L0 40 L20 40','M40 20 L40 40 L20 40'][i]}
                stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.35"/>
            </svg>
          ))}
          <div className="absolute top-[18%] left-0 w-full overflow-hidden opacity-[0.025] select-none pointer-events-none">
            <div className="flex whitespace-nowrap">
              {[...Array(4)].map((_,i) => (
                <span key={i} className="contact-marquee font-display text-[14vw] leading-none uppercase pr-20 text-[#F4F4F5]">
                  Agenda tu Cita &bull; Contacto &bull; Videollamada &bull;
                </span>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(229,153,123,0.07) 0%, transparent 60%)' }}/>
          <div className="hero-content relative z-10 text-center max-w-4xl px-8 pointer-events-none">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-[#E5997B]/50" />
              <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">Contacto — DIMA Finance</p>
              <div className="w-8 h-px bg-[#E5997B]/50" />
            </div>
            <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] text-[#F4F4F5] leading-[1.0] tracking-tight mb-6">
              Agenda tu<br/><span className="text-[#E5997B] italic">videollamada.</span>
            </h1>
            <p className="font-body text-[#F4F4F5]/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-16">
              Completa el formulario de precalificación y agenda directamente
              una sesión con nuestro equipo de ingeniería financiera.
            </p>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-16 flex items-center justify-between pointer-events-none">
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">SOFOM E.N.R. — México</span>
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">Arquitectos de Equilibrio</span>
          </div>
        </section>

        {/* ══ FORM SECTION ══════════════════════════════════════ */}
        <section ref={formRef} className="relative min-h-screen py-28 md:py-36 bg-[#F4F4F5] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.25]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(3,0,53,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }}/>

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">

            {/* ── Form header ─────────────────────────────────── */}
            <div className="form-reveal text-center mb-20">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#030035]/5 border border-[#030035]/10 mb-10">
                <div className="w-1.5 h-1.5 bg-[#E5997B] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50">
                  Proceso de Precalificación — 3 etapas
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] text-[#030035] leading-tight mb-5">
                Formulario de{' '}
                <span className="text-[#E5997B] italic">Precalificación</span>
              </h2>
              <p className="font-body text-[#030035]/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Esta información nos permite preparar una sesión personalizada
                enfocada en las necesidades específicas de su empresa.
              </p>
            </div>

            {/* ── Step indicator ──────────────────────────────── */}
            <div className="form-reveal flex items-center justify-center gap-6 mb-20">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-6">
                  <button
                    onClick={() => { if (i < formStep) setFormStep(i) }}
                    className={`flex items-center gap-4 transition-all duration-500 ${formStep >= i ? 'opacity-100' : 'opacity-35'}`}
                  >
                    <div className={`w-11 h-11 flex items-center justify-center font-mono transition-all duration-500 ${
                      formStep === i ? 'bg-[#030035] text-[#F4F4F5]'
                      : formStep > i ? 'bg-[#E5997B] text-white'
                      : 'bg-[#030035]/8 text-[#030035]/35'
                    }`}>
                      {formStep > i
                        ? <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <span className="text-[11px] tracking-widest">{String(i+1).padStart(2,'0')}</span>
                      }
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/55 hidden md:block">
                      {label}
                    </span>
                  </button>
                  {i < 2 && (
                    <div className={`w-16 h-px transition-colors duration-500 ${formStep > i ? 'bg-[#E5997B]/60' : 'bg-[#030035]/10'}`}/>
                  )}
                </div>
              ))}
            </div>

            {/* ── Form ────────────────────────────────────────── */}
            <form className="max-w-2xl mx-auto">

              {/* STEP 1 — Información de contacto */}
              <div className={`transition-all duration-500 ${formStep === 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                <div className="form-reveal space-y-10">

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                      Sector / Industria
                    </label>
                    <input type="text" name="sector" value={formData.sector} onChange={handleChange}
                      placeholder="Ej. Manufactura, Agroindustria, Inmobiliario..."
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-[#030035]/15 text-[#030035] font-body text-lg md:text-xl focus:border-[#E5997B] focus:outline-none transition-colors placeholder:text-[#030035]/20"/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                        Nombre de Contacto
                      </label>
                      <input type="text" name="contactName" value={formData.contactName} onChange={handleChange}
                        className="w-full px-0 py-4 bg-transparent border-b-2 border-[#030035]/15 text-[#030035] font-body text-lg md:text-xl focus:border-[#E5997B] focus:outline-none transition-colors"/>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                        Cargo
                      </label>
                      <input type="text" name="position" value={formData.position} onChange={handleChange}
                        placeholder="Ej. Director General, CFO..."
                        className="w-full px-0 py-4 bg-transparent border-b-2 border-[#030035]/15 text-[#030035] font-body text-lg md:text-xl focus:border-[#E5997B] focus:outline-none transition-colors placeholder:text-[#030035]/20"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                        Email Corporativo
                      </label>
                      <input type="email" name="email" value={formData.email}
                        onChange={handleEmailChange}
                        onBlur={() => {
                          if (formData.email && !validateEmail(formData.email)) {
                            setErrors(prev => ({ ...prev, email: 'Ingrese un correo electrónico válido' }))
                          }
                        }}
                        placeholder="nombre@empresa.com"
                        className={`w-full px-0 py-4 bg-transparent border-b-2 text-[#030035] font-body text-lg md:text-xl focus:outline-none transition-colors placeholder:text-[#030035]/20 ${
                          errors.email ? 'border-red-400' : formData.email && isEmailValid ? 'border-[#E5997B]' : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`}/>
                      {errors.email && (
                        <p className="mt-2 font-mono text-[9px] tracking-[0.3em] uppercase text-red-400">
                          {errors.email}
                        </p>
                      )}
                      {formData.email && isEmailValid && !errors.email && (
                        <p className="mt-2 font-mono text-[9px] tracking-[0.3em] uppercase text-[#E5997B]/70">
                          ✓ Correo válido
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                        Teléfono
                      </label>
                      <input type="tel" name="phone" value={formData.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={(e) => {
                          // Block non-numeric except control keys and allowed chars
                          const allowed = ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','(',')',' ']
                          if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        placeholder="+52 55 0000 0000"
                        inputMode="tel"
                        className={`w-full px-0 py-4 bg-transparent border-b-2 text-[#030035] font-body text-lg md:text-xl focus:outline-none transition-colors placeholder:text-[#030035]/20 ${
                          formData.phone && isPhoneValid ? 'border-[#E5997B]' : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`}/>
                      {formData.phone && !isPhoneValid && (
                        <p className="mt-2 font-mono text-[9px] tracking-[0.3em] uppercase text-[#030035]/35">
                          Mínimo 8 dígitos
                        </p>
                      )}
                      {formData.phone && isPhoneValid && (
                        <p className="mt-2 font-mono text-[9px] tracking-[0.3em] uppercase text-[#E5997B]/70">
                          ✓ Teléfono válido
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="button" onClick={nextStep} disabled={!isStep1Valid}
                      className={`inline-flex items-center gap-4 px-10 py-5 font-mono text-[11px] tracking-[0.3em] uppercase transition-all duration-300 ${
                        isStep1Valid
                          ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] cursor-pointer'
                          : 'bg-[#030035]/8 text-[#030035]/25 cursor-not-allowed'}`}>
                      <span>Siguiente</span>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 2 — Información del producto */}
              <div className={`transition-all duration-500 ${formStep === 1 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                <div className="space-y-12">

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-6">
                      Tipo de Producto
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {productTypes.map((type) => (
                        <button key={type} type="button"
                          onClick={() => setFormData({ ...formData, productType: type })}
                          className={`px-5 py-5 text-left font-body text-sm md:text-base border-2 transition-all duration-300 ${
                            formData.productType === type
                              ? 'border-[#E5997B] bg-[#E5997B]/5 text-[#030035]'
                              : 'border-[#030035]/10 text-[#030035]/55 hover:border-[#030035]/30'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-6">
                      Rango de Monto Requerido
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {loanRanges.map((range) => (
                        <button key={range} type="button"
                          onClick={() => setFormData({ ...formData, loanRange: range })}
                          className={`px-6 py-4 font-body text-sm md:text-base border-2 transition-all duration-300 ${
                            formData.loanRange === range
                              ? 'border-[#E5997B] bg-[#E5997B]/5 text-[#030035]'
                              : 'border-[#030035]/10 text-[#030035]/55 hover:border-[#030035]/30'}`}>
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/50 mb-6">
                      Plazo Deseado
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {termOptions.map((term) => (
                        <button key={term} type="button"
                          onClick={() => setFormData({ ...formData, term })}
                          className={`px-6 py-4 font-body text-sm md:text-base border-2 transition-all duration-300 ${
                            formData.term === term
                              ? 'border-[#E5997B] bg-[#E5997B]/5 text-[#030035]'
                              : 'border-[#030035]/10 text-[#030035]/55 hover:border-[#030035]/30'}`}>
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={prevStep}
                      className="inline-flex items-center gap-3 px-8 py-5 font-mono text-[11px] tracking-[0.3em] uppercase text-[#030035]/40 hover:text-[#030035] transition-colors">
                      <svg className="w-4 h-4 rotate-180" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Anterior</span>
                    </button>
                    <button type="button" onClick={nextStep} disabled={!isStep2Valid}
                      className={`inline-flex items-center gap-4 px-10 py-5 font-mono text-[11px] tracking-[0.3em] uppercase transition-all duration-300 ${
                        isStep2Valid
                          ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] cursor-pointer'
                          : 'bg-[#030035]/8 text-[#030035]/25 cursor-not-allowed'}`}>
                      <span>Siguiente</span>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3 — Agendar con Calendly */}
              <div className={`transition-all duration-500 ${formStep === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                <div className="space-y-10">

                  {/* Summary of lead data */}
                  <div className="border border-[#030035]/8 p-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Contacto', value: formData.contactName },
                      { label: 'Sector',   value: formData.sector },
                      { label: 'Producto', value: formData.productType },
                      { label: 'Monto',    value: formData.loanRange },
                      { label: 'Plazo',    value: formData.term },
                      { label: 'Email',    value: formData.email },
                    ].map((item) => (
                      <div key={item.label}>
                        <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#030035]/35 block mb-1.5">
                          {item.label}
                        </span>
                        <span className="font-body text-[#030035] text-sm md:text-base">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendly embed — connected to Diego's calendar */}
                  <div className="border border-[#030035]/8 overflow-hidden">
                    <div className="bg-[#030035] px-6 py-5 flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#E5997B]" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#F4F4F5]/60">
                        Seleccione fecha y hora — Sesión de 30 minutos
                      </span>
                    </div>
                    {/* Calendly widget is initialized via useEffect above */}
                    <div
                      className="calendly-inline-widget"
                      data-url={`${CALENDLY_BASE}?name=${encodeURIComponent(formData.contactName)}&email=${encodeURIComponent(formData.email)}&hide_gdpr_banner=1`}
                      style={{ minWidth: '320px', height: '700px' }}
                    />
                  </div>

                  <div className="flex justify-start">
                    <button type="button" onClick={prevStep}
                      className="inline-flex items-center gap-3 px-8 py-5 font-mono text-[11px] tracking-[0.3em] uppercase text-[#030035]/40 hover:text-[#030035] transition-colors">
                      <svg className="w-4 h-4 rotate-180" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Anterior</span>
                    </button>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </section>

        {/* ══ DIRECT CONTACT ════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 bg-[#030035] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(229,153,123,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(229,153,123,0.04) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}/>
          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-6 h-px bg-[#E5997B]/40" />
              <span className="font-mono text-[#E5997B]/60 text-[9px] tracking-[0.5em] uppercase">Contacto Directo</span>
              <div className="w-6 h-px bg-[#E5997B]/40" />
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-[#F4F4F5] leading-tight mb-12">
              También puede contactarnos{' '}
              <span className="text-[#E5997B] italic">directamente.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F4F4F5]/5">
              {[
                {
                  icon: <path d="M2 7l10 6 10-6M2 4h20v16H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>,
                  label: 'Email', value: 'corporativo@dimafinance.com.mx',
                  href: 'mailto:corporativo@dimafinance.com.mx',
                },
                {
                  icon: <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
                  label: 'WhatsApp', value: '+52 1 33 1971 7871',
                  href: 'https://wa.me/5213319717871',
                },
                {
                  icon: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
                  label: 'Videollamada', value: 'Agendar directamente',
                  href: CALENDLY_BASE,
                },
              ].map((item) => (
                <a key={item.label} href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group p-10 bg-[#030035] hover:bg-[#F4F4F5]/3 transition-colors duration-500 flex flex-col items-center gap-5">
                  <svg className="w-8 h-8 text-[#E5997B]" viewBox="0 0 24 24" fill="none">{item.icon}</svg>
                  <div className="text-center">
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#F4F4F5]/30 mb-2">{item.label}</p>
                    <p className="font-body text-[#F4F4F5]/70 group-hover:text-[#E5997B] transition-colors text-sm md:text-base">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-16 flex items-center justify-center gap-4 opacity-30">
              <div className="flex-1 max-w-32 h-px bg-[#F4F4F5]/20" />
              <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/40">
                Sesión de 30 min · Sin compromiso
              </span>
              <div className="flex-1 max-w-32 h-px bg-[#F4F4F5]/20" />
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  )
}