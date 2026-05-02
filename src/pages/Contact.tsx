import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import AnimatedGrid from '../components/AnimatedGrid'
import GridDissolve from '../components/GridDissolve'
import InteractiveConstellationText from '../components/InteractiveConstellationText'

gsap.registerPlugin(ScrollTrigger)

const productTypes = [
  'Crédito Simple', 'Crédito Puente', 'Cuenta Corriente',
  'Crédito Agroindustrial', 'Arrendamiento Financiero', 'Factoring',
]
const loanRanges = ['$500K - $2M MXN', '$2M - $5M MXN', '$5M - $15M MXN', '$15M - $50M MXN', '$50M+ MXN']
const termOptions = ['6 meses', '12 meses', '24 meses', '36 meses', '48 meses', '60+ meses']

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

  // ── Vanta Birds ref for form ──────────────────────────────
  const formVantaRef = useRef<any>(null)

  // ── Spotlight mouse tracking ───────────────────────────────
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 })

  const trailX = useMotionValue(-9999)
  const trailY = useMotionValue(-9999)
  const trailSpringX = useSpring(trailX, { stiffness: 40, damping: 30 })
  const trailSpringY = useSpring(trailY, { stiffness: 40, damping: 30 })

  const maskWebkit = useTransform([springX, springY], ([x, y]) =>
    `radial-gradient(600px at ${x}px ${y}px, 
      rgba(255,255,255,1) 0%, 
      rgba(255,255,255,0.85) 15%, 
      rgba(255,255,255,0.4) 40%, 
      rgba(255,255,255,0.1) 65%, 
      rgba(255,255,255,0) 100%
    )`
  )

  const maskWebkitTrail = useTransform([trailSpringX, trailSpringY], ([x, y]) =>
    `radial-gradient(800px at ${x}px ${y}px, 
      rgba(255,255,255,0.5) 0%, 
      rgba(255,255,255,0.25) 20%, 
      rgba(255,255,255,0.05) 50%, 
      rgba(255,255,255,0) 100%
    )`
  )

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouseX.set(x)
      mouseY.set(y)
      trailX.set(x)
    }
  }

  const handleHeroMouseLeave = () => {
    mouseX.set(-9999)
    mouseY.set(-9999)
    trailX.set(-9999)
    trailY.set(-9999)
  }

  // ── Vanta Birds on form section ───────────────────────────
  useEffect(() => {
    if (!formRef.current || !(window as any).VANTA) return

    formVantaRef.current = (window as any).VANTA.BIRDS({
      el: formRef.current,
      THREE: (window as any).THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 600.0,
      minWidth: 600.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0xF4F4F5,
      color1: 0x1a1a4e,
      color2: 0xE5997B,
      colorMode: 'lerp',
      birdSize: 1.2,
      wingSpan: 18,
      speedLimit: 3,
      separation: 35,
      alignment: 40,
      cohesion: 50,
      quantity: 4,
    })

    return () => {
      formVantaRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (document.querySelector('script[src*="calendly"]')) return
    const script = document.createElement('script')
    script.src  = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)

    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    if (formStep !== 2) return
    const params = new URLSearchParams({
      name:             formData.contactName,
      email:            formData.email,
      hide_gdpr_banner: '1',
      utm_source:       'website_form',
      utm_medium:       formData.productType,
      utm_campaign:     formData.loanRange,
      utm_content:      formData.term,
    })
    const calendlyUrl = `${CALENDLY_BASE}?${params.toString()}`
    const tryInit = (attempts = 0) => {
      const el = document.querySelector('.calendly-inline-widget') as HTMLElement | null
      const Cal = (window as any).Calendly
      if (el && Cal?.initInlineWidget) {
        el.innerHTML = ''
        Cal.initInlineWidget({ url: calendlyUrl, parentElement: el })
      } else if (attempts < 20) {
        setTimeout(() => tryInit(attempts + 1), 100)
      }
    }
    tryInit()
  }, [formStep, formData.contactName, formData.email])

  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (formRef.current) {
        gsap.fromTo(formRef.current.querySelectorAll('.form-reveal'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: formRef.current, start: 'top 75%' } }
        )
      }
      gsap.to('.contact-marquee', { xPercent: -50, repeat: -1, duration: 50, ease: 'none' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // ── Hero section ───────────────────────────────────────────
  const heroSection = (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
    >
      {/* Grid base — redup selalu (layer 1) */}
      <div className="absolute inset-0 z-[1] opacity-[0.06] pointer-events-none">
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </div>

      {/* Grid spotlight — mengikuti kursor, sangat terang (layer 2) */}
      <motion.div
        style={{ WebkitMaskImage: maskWebkit, maskImage: maskWebkit }}
        className="absolute inset-0 z-[2] pointer-events-none opacity-[1]"
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      {/* Core glow — titik paling terang di pusat kursor (layer 3) */}
      <motion.div
        style={{ WebkitMaskImage: maskWebkit, maskImage: maskWebkit }}
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.6]"
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      {/* Trailing glow — bekas cahaya yang mengikuti dengan lambat (layer 4) */}
      <motion.div
        style={{ WebkitMaskImage: maskWebkitTrail, maskImage: maskWebkitTrail }}
        className="absolute inset-0 z-[4] pointer-events-none opacity-[0.35]"
      >
        <AnimatedGrid cellSize={60} color="229,153,123" />
      </motion.div>

      {/* Static CSS grid overlay (layer 5) */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          zIndex: 5,
          backgroundImage:
            'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner brackets */}
      {(['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'] as const).map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none`} style={{ zIndex: 5 }} viewBox="0 0 40 40" fill="none">
          <path
            d={['M0 20 L0 0 L20 0', 'M40 20 L40 0 L20 0', 'M0 20 L0 40 L20 40', 'M40 20 L40 40 L20 40'][i]}
            stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.35"
          />
        </svg>
      ))}

      {/* Marquee */}
      <div className="absolute top-[18%] left-0 w-full overflow-hidden opacity-[0.025] select-none pointer-events-none" style={{ zIndex: 5 }}>
        <div className="flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="contact-marquee font-display text-[14vw] leading-none uppercase pr-20 text-[#F4F4F5]">
              Agenda tu Cita &bull; Contacto &bull; Videollamada &bull;
            </span>
          ))}
        </div>
      </div>

      {/* Hero content — PERBESAR TEKS */}
      <div className="hero-content relative text-center max-w-7xl px-8 pointer-events-none" style={{ zIndex: 6 }}>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-8 h-px bg-[#E5997B]/50" />
          <p className="font-mono text-[#E5997B] text-[11px] tracking-[0.6em] uppercase">Contacto — DIMA Finance</p>
          <div className="w-8 h-px bg-[#E5997B]/50" />
        </div>
        <InteractiveConstellationText
          lines={[
            { text: "Agenda", y: 170, fontSize: 220 },
            { text: "Videollamada", y: 340, fontSize: 220, fontStyle: "italic" },
          ]}
          viewBox="0 0 1200 380"
          defaultFontSize={220}
          fontFamily="'Playfair Display', serif"
          containerClassName="pointer-events-auto mb-12"
        />
        <p className="font-body text-[#F4F4F5]/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-16">
          Completa el formulario de precalificación y agenda directamente
          una sesión con nuestro equipo de ingeniería financiera.
        </p>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
        </div>
      </div>

      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-16 flex items-center justify-between pointer-events-none" style={{ zIndex: 6 }}>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">SOFOM E.N.R. — México</span>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">Arquitectos de Equilibrio</span>
      </div>
    </section>
  )

  return (
    <PageTransition>
      <div ref={sectionRef}>

        {/* ══ GridDissolve cuma wrap hero ══════════ */}
        <GridDissolve cellSize={60} pinDistance="+=150%">
          {heroSection}
        </GridDissolve>

        {/* ══ Form section — DI LUAR GridDissolve ══════════ */}
        <section ref={formRef} className="relative min-h-screen py-28 md:py-36 bg-[#F4F4F5] overflow-hidden" style={{ zIndex: 1 }}>
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.25]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(3,0,53,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12">

            {/* Form header — PERBESAR TEKS */}
            <div className="form-reveal text-center mb-20">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#030035]/5 border border-[#030035]/10 mb-10">
                <div className="w-1.5 h-1.5 bg-[#E5997B] animate-pulse" />
                <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50">
                  Proceso de Precalificación — 3 etapas
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] text-[#030035] leading-tight mb-6">
                Formulario de{' '}
                <span className="text-[#E5997B] italic">Precalificación</span>
              </h2>
              <p className="font-body text-[#030035]/55 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                Esta información nos permite preparar una sesión personalizada
                enfocada en las necesidades específicas de su empresa.
              </p>
            </div>

            {/* Step indicator */}
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
                        : <span className="text-[11px] tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                      }
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/55 hidden md:block">
                      {label}
                    </span>
                  </button>
                  {i < 2 && (
                    <div className={`w-16 h-px transition-colors duration-500 ${formStep > i ? 'bg-[#E5997B]/60' : 'bg-[#030035]/10'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            <form className="max-w-2xl mx-auto">

              {/* STEP 1 */}
              <div className={`transition-all duration-500 ${formStep === 0 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                <div className="form-reveal space-y-10">
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                      Sector / Industria
                    </label>
                    <input type="text" name="sector" value={formData.sector} onChange={handleChange}
                      placeholder="Ej. Manufactura, Agroindustria, Inmobiliario..."
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-[#030035]/15 text-[#030035] font-body text-xl md:text-2xl focus:border-[#E5997B] focus:outline-none transition-colors placeholder:text-[#030035]/20" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Nombre de Contacto</label>
                      <input type="text" name="contactName" value={formData.contactName} onChange={handleChange}
                        className="w-full px-0 py-4 bg-transparent border-b-2 border-[#030035]/15 text-[#030035] font-body text-xl md:text-2xl focus:border-[#E5997B] focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Cargo</label>
                      <input type="text" name="position" value={formData.position} onChange={handleChange}
                        placeholder="Ej. Director General, CFO..."
                        className="w-full px-0 py-4 bg-transparent border-b-2 border-[#030035]/15 text-[#030035] font-body text-xl md:text-2xl focus:border-[#E5997B] focus:outline-none transition-colors placeholder:text-[#030035]/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Email Corporativo</label>
                      <input type="email" name="email" value={formData.email}
                        onChange={handleEmailChange}
                        onBlur={() => {
                          if (formData.email && !validateEmail(formData.email)) {
                            setErrors(prev => ({ ...prev, email: 'Ingrese un correo electrónico válido' }))
                          }
                        }}
                        placeholder="nombre@empresa.com"
                        className={`w-full px-0 py-4 bg-transparent border-b-2 text-[#030035] font-body text-xl md:text-2xl focus:outline-none transition-colors placeholder:text-[#030035]/20 ${
                          errors.email ? 'border-red-400' : formData.email && isEmailValid ? 'border-[#E5997B]' : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`} />
                      {errors.email && <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-red-400">{errors.email}</p>}
                      {formData.email && isEmailValid && !errors.email && (
                        <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#E5997B]/70">✓ Correo válido</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Teléfono</label>
                      <input type="tel" name="phone" value={formData.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={(e) => {
                          const allowed = ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','(',')',' ']
                          if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault()
                        }}
                        placeholder="+52 55 0000 0000"
                        inputMode="tel"
                        className={`w-full px-0 py-4 bg-transparent border-b-2 text-[#030035] font-body text-xl md:text-2xl focus:outline-none transition-colors placeholder:text-[#030035]/20 ${
                          formData.phone && isPhoneValid ? 'border-[#E5997B]' : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`} />
                      {formData.phone && !isPhoneValid && (
                        <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/35">Mínimo 8 dígitos</p>
                      )}
                      {formData.phone && isPhoneValid && (
                        <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#E5997B]/70">✓ Teléfono válido</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="button" onClick={nextStep} disabled={!isStep1Valid}
                      className={`inline-flex items-center gap-4 px-10 py-5 font-mono text-[12px] tracking-[0.3em] uppercase transition-all duration-300 ${
                        isStep1Valid ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] cursor-pointer' : 'bg-[#030035]/8 text-[#030035]/25 cursor-not-allowed'
                      }`}>
                      <span>Siguiente</span>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div className={`transition-all duration-500 ${formStep === 1 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                <div className="space-y-12">
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-6">Tipo de Producto</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {productTypes.map((type) => (
                        <button key={type} type="button"
                          onClick={() => setFormData({ ...formData, productType: type })}
                          className={`px-5 py-5 text-left font-body text-base md:text-lg border-2 transition-all duration-300 ${
                            formData.productType === type ? 'border-[#E5997B] bg-[#E5997B]/5 text-[#030035]' : 'border-[#030035]/10 text-[#030035]/55 hover:border-[#030035]/30'
                          }`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-6">Rango de Monto Requerido</label>
                    <div className="flex flex-wrap gap-3">
                      {loanRanges.map((range) => (
                        <button key={range} type="button"
                          onClick={() => setFormData({ ...formData, loanRange: range })}
                          className={`px-6 py-4 font-body text-base md:text-lg border-2 transition-all duration-300 ${
                            formData.loanRange === range ? 'border-[#E5997B] bg-[#E5997B]/5 text-[#030035]' : 'border-[#030035]/10 text-[#030035]/55 hover:border-[#030035]/30'
                          }`}>
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-6">Plazo Deseado</label>
                    <div className="flex flex-wrap gap-3">
                      {termOptions.map((term) => (
                        <button key={term} type="button"
                          onClick={() => setFormData({ ...formData, term })}
                          className={`px-6 py-4 font-body text-base md:text-lg border-2 transition-all duration-300 ${
                            formData.term === term ? 'border-[#E5997B] bg-[#E5997B]/5 text-[#030035]' : 'border-[#030035]/10 text-[#030035]/55 hover:border-[#030035]/30'
                          }`}>
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={prevStep}
                      className="inline-flex items-center gap-3 px-8 py-5 font-mono text-[12px] tracking-[0.3em] uppercase text-[#030035]/40 hover:text-[#030035] transition-colors">
                      <svg className="w-4 h-4 rotate-180" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Anterior</span>
                    </button>
                    <button type="button" onClick={nextStep} disabled={!isStep2Valid}
                      className={`inline-flex items-center gap-4 px-10 py-5 font-mono text-[12px] tracking-[0.3em] uppercase transition-all duration-300 ${
                        isStep2Valid ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] cursor-pointer' : 'bg-[#030035]/8 text-[#030035]/25 cursor-not-allowed'
                      }`}>
                      <span>Siguiente</span>
                      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className={`transition-all duration-500 ${formStep === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
                <div className="space-y-10">
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
                        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/35 block mb-1.5">{item.label}</span>
                        <span className="font-body text-[#030035] text-base md:text-lg">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border border-[#030035]/8 overflow-hidden">
                    <div className="bg-[#030035] px-6 py-5 flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#E5997B]" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#F4F4F5]/60">
                        Seleccione fecha y hora — Sesión de 30 minutos
                      </span>
                    </div>
                    <div
                      className="calendly-inline-widget"
                      data-url={`${CALENDLY_BASE}?name=${encodeURIComponent(formData.contactName)}&email=${encodeURIComponent(formData.email)}&hide_gdpr_banner=1`}
                      style={{ minWidth: '320px', height: '700px' }}
                    />
                  </div>
                  <div className="flex justify-start">
                    <button type="button" onClick={prevStep}
                      className="inline-flex items-center gap-3 px-8 py-5 font-mono text-[12px] tracking-[0.3em] uppercase text-[#030035]/40 hover:text-[#030035] transition-colors">
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

        {/* ══ Contact cards — DI LUAR GridDissolve ══════════ */}
        <section className="relative py-24 md:py-40 bg-[#F4F4F5] overflow-hidden">
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: `linear-gradient(rgba(3,0,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(3,0,53,0.05) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
              backgroundPosition: 'center center',
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            }}
          />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5997B]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-max mx-auto px-6">
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-8 h-px bg-[#030035]/10" />
                <span className="font-mono text-[#E5997B] text-[11px] tracking-[0.5em] uppercase font-bold">Contacto Directo</span>
                <div className="w-8 h-px bg-[#030035]/10" />
              </div>
              <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.2rem)] text-[#030035] leading-[1.1] mb-6">
                Hablemos de su <span className="text-[#E5997B] italic font-serif">próximo paso.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <path d="M2 7l10 6 10-6M2 4h20v16H2z" stroke="currentColor" strokeWidth="1.2"/>,
                  label: 'Email', value: 'corporativo@dimafinance.com.mx', href: 'mailto:corporativo@dimafinance.com.mx'
                },
                {
                  icon: <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="currentColor" strokeWidth="1.2"/>,
                  label: 'WhatsApp', value: '+52 1 33 1971 7871', href: 'https://wa.me/5213319717871'
                },
                {
                  icon: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.2"/></>,
                  label: 'Videollamada', value: 'Agendar Sesión', href: '#'
                }
              ].map((item, idx) => (
                <a key={idx} href={item.href} className="group relative p-12 bg-white/50 backdrop-blur-sm border border-[#030035]/5 hover:border-[#E5997B]/40 transition-all duration-500 flex flex-col items-center text-center">
                  <div className="w-12 h-12 mb-6 flex items-center justify-center text-[#030035] group-hover:text-[#E5997B] transition-colors duration-500">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">{item.icon}</svg>
                  </div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/40 mb-2">{item.label}</p>
                  <p className="font-body text-[#030035] text-base md:text-lg font-medium">{item.value}</p>
                </a>
              ))}
            </div>

            <div className="mt-20 flex items-center justify-center gap-4">
              <div className="h-px bg-[#030035]/5 flex-1 max-w-[100px]" />
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#030035]/30">Sin compromiso · 30 min</span>
              <div className="h-px bg-[#030035]/5 flex-1 max-w-[100px]" />
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  )
}