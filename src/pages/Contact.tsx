import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/PageTransition'
import GridDissolve from '../components/GridDissolve'
// import InteractiveConstellationText from '../components/InteractiveConstellationText'
import UnifiedMagmaGrid from '../components/UnifiedMagmaGrid'
import InteractiveConstellationText from '../components/InteractiveConstellationText'

gsap.registerPlugin(ScrollTrigger)

const CALENDLY_BASE = 'https://calendly.com/corporativo-dimafinance/30min'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef    = useRef<HTMLDivElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const [showCalendly, setShowCalendly] = useState(false)
  const [formData, setFormData] = useState({
    sector: '', contactName: '', position: '', email: '', phone: '',
    productType: '', loanAmount: '', loanCurrency: 'MXN', loanTBD: false,
    termMonths: '', termTBD: false,
  })

  const vantaRef = useRef<any>(null)

  // ── Vanta Birds — lazy: aktif hanya saat section terlihat ──
  useEffect(() => {
    if (!contactRef.current) return

    const initVanta = () => {
      if (vantaRef.current || !(window as any).VANTA) return
      vantaRef.current = (window as any).VANTA.BIRDS({
        el: contactRef.current,
        THREE: (window as any).THREE,
        mouseControls: true, touchControls: true, gyroControls: true,
        minHeight: 400.0, minWidth: 400.0, scale: 1.0, scaleMobile: 1.0,
        backgroundColor: 0xF4F4F5, color1: 0x1a1a4e, color2: 0xE5997B, colorMode: 'lerp',
        birdSize: 1.2, wingSpan: 18, speedLimit: 2.0,
        separation: 10, alignment: 75, cohesion: 75, quantity: 4,
      })
    }

    const destroyVanta = () => {
      vantaRef.current?.destroy()
      vantaRef.current = null
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) initVanta()
          else destroyVanta()
        })
      },
      { threshold: 0.1 }  // aktif saat 10% section sudah terlihat
    )

    observer.observe(contactRef.current)

    return () => {
      observer.disconnect()
      destroyVanta()
    }
  }, [])

  // ── Calendly ──────────────────────────────────────────────
  useEffect(() => {
    if (document.querySelector('script[src*="calendly"]')) return
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link'); link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    if (!showCalendly) return
    const params = new URLSearchParams({
      name: formData.contactName, email: formData.email,
      hide_gdpr_banner: '1', utm_source: 'website_form', utm_medium: formData.productType,
    })
    const calendlyUrl = `${CALENDLY_BASE}?${params.toString()}`
    const tryInit = (attempts = 0) => {
      const el  = document.querySelector('.calendly-inline-widget') as HTMLElement | null
      const Cal = (window as any).Calendly
      if (el && Cal?.initInlineWidget) { el.innerHTML = ''; Cal.initInlineWidget({ url: calendlyUrl, parentElement: el }) }
      else if (attempts < 20) setTimeout(() => tryInit(attempts + 1), 100)
    }
    tryInit()
  }, [showCalendly, formData.contactName, formData.email, formData.productType])

  useEffect(() => {
    window.scrollTo(0, 0)
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 800)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (formRef.current) {
        gsap.fromTo(formRef.current.querySelectorAll('.form-reveal'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08,
            scrollTrigger: { trigger: formRef.current, start: 'top 80%' } }
        )
      }
      gsap.to('.contact-marquee', { xPercent: -50, repeat: -1, duration: 60, ease: 'none' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d\s+\-()]/g, '')
    setFormData(prev => ({ ...prev, phone: val }))
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, email: val }))
    if (val && !validateEmail(val)) setErrors(prev => ({ ...prev, email: 'Ingrese un correo electrónico válido' }))
    else setErrors(prev => ({ ...prev, email: undefined }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
      if (name === 'loanTBD' && checked) setFormData(prev => ({ ...prev, loanAmount: '', loanCurrency: 'MXN', loanTBD: true }))
      if (name === 'termTBD' && checked) setFormData(prev => ({ ...prev, termMonths: '', termTBD: true }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const isEmailValid = validateEmail(formData.email)
  const isPhoneValid = formData.phone.replace(/[\s+\-()]/g, '').length >= 8
  const isFormValid  = !!(
    formData.sector && formData.contactName && formData.position &&
    isEmailValid && isPhoneValid && formData.productType &&
    (formData.loanTBD || (formData.loanAmount && formData.loanCurrency)) &&
    (formData.termTBD || formData.termMonths)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    setShowCalendly(true)
    window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: 'smooth' })
  }

  const inputBase     = 'w-full px-0 py-4 bg-transparent border-b-2 text-[#030035] font-body text-xl focus:outline-none transition-colors placeholder:text-[#030035]/25'
  const inputIdle     = 'border-[#030035]/15 focus:border-[#E5997B]'
  const inputValid    = 'border-[#E5997B]'
  const inputDisabled = 'border-[#030035]/5 text-[#030035]/20'

  const heroSection = (
  <section
    ref={heroRef}
    className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
  >
    {/* ── 1. BASE STATIC GRID ── */}
    <div
      className="absolute inset-0 z-[1] pointer-events-none opacity-[0.05]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(229,153,123,1) 1px, transparent 1px), 
          linear-gradient(to bottom, rgba(229,153,123,1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />

    {/* ── 2. UNIFIED MAGMA ENGINE ── */}
    <UnifiedMagmaGrid 
      cellSize={60} 
      color="229,153,123" 
    />

    {/* ── 3. STATIC CSS GRID OVERLAY ── */}
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none z-[5]"
      style={{
        backgroundImage:
          'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    {/* ── 4. MARQUEE ── */}
    <div className="absolute top-[18%] w-full overflow-hidden opacity-[0.04] pointer-events-none select-none z-[6]">
      <div
        className="hero-marquee-text flex whitespace-nowrap font-display text-[14vw] text-[#F4F4F5] uppercase"
        style={{ WebkitTextStroke: '2px #F4F4F5' }}
      >
        <span className="flex-shrink-0">Agenda tu Cita&nbsp;•&nbsp;Contacto&nbsp;•&nbsp;Videollamada&nbsp;•&nbsp;</span>
        <span className="flex-shrink-0">Agenda tu Cita&nbsp;•&nbsp;Contacto&nbsp;•&nbsp;Videollamada&nbsp;•&nbsp;</span>
      </div>
    </div>

    {/* ── 5. CORNER DECORATIONS ── */}
    {(['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'] as const).map((pos, i) => (
      <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none z-[7]`} viewBox="0 0 40 40" fill="none">
        <path d={['M0 20 L0 0 L20 0','M40 20 L40 0 L20 0','M0 20 L0 40 L20 40','M40 20 L40 40 L20 40'][i]} stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.35" />
      </svg>
    ))}

    {/* ── 6. HERO CONTENT ── */}
    <div className="hero-content relative text-center max-w-7xl px-8 pointer-events-none flex flex-col items-center z-[20]">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-8 h-px bg-[#E5997B]/50" />
        <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
          Contacto — DIMA Finance
        </p>
        <div className="w-8 h-px bg-[#E5997B]/50" />
      </div>

      <InteractiveConstellationText
        lines={[
          { text: 'Agenda', y: 170, fontSize: 220, color: '#F4F4F5' },
          { text: 'Videollamada', y: 340, fontSize: 220, fontStyle: 'italic', color: '#E5997B' },
        ]}
        viewBox="0 0 1200 380"
        defaultFontSize={220}
        fontFamily="'Playfair Display', serif"
        containerClassName="pointer-events-auto mb-12 w-full"
      />

      <p className="hero-subtext text-[#F4F4F5]/40 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
        Completa el formulario de precalificación y agenda directamente
        una sesión con nuestro equipo de ingeniería financiera.
      </p>

      <div className="mt-12 flex flex-col items-center gap-2">
        <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
      </div>
    </div>

    {/* ── 7. FOOTER BAR ── */}
    <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-16 flex items-center justify-between pointer-events-none z-[8]">
      <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">SOFOM E.N.R. — México</span>
      <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">Arquitectos de Equilibrio</span>
    </div>
  </section>
)

  return (
    <PageTransition>
      <div ref={sectionRef}>

        {/*
          ✅ FIX UTAMA — semua section masuk sebagai children GridDissolve:
          • child[0] = heroSection  → dirender di atas (absolute z-30) oleh GridDissolve
          • child[1] = formSection  → dirender sebagai konten normal di bawah hero
          • child[2] = contactSection → lanjutan setelah form
          Dengan 2+ children, pengecekan `childArray.length < 2` lolos
          dan seluruh logika GSAP ScrollTrigger dissolve berjalan.
        */}
        <GridDissolve cellSize={60} pinDistance="+=120%">

          {/* ── CHILD 0: Hero ── */}
          {heroSection}

          {/* ── CHILD 1: Form section ── */}
          <section ref={formRef} className="relative min-h-screen py-28 md:py-36 bg-[#F4F4F5] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.22]"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(3,0,53,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16">

              <div className="form-reveal text-center mb-20">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#030035]/5 border border-[#030035]/10 mb-10">
                  <div className="w-1.5 h-1.5 bg-[#E5997B] animate-pulse" />
                  <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50">Precalificación Rápida</span>
                </div>
                <h2 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] text-[#030035] leading-tight mb-6">
                  Formulario de <span className="text-[#E5997B] italic">Precalificación</span>
                </h2>
                <p className="font-body text-[#030035]/55 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                  Completa la información y agenda directamente tu sesión con nuestro equipo.
                </p>
              </div>

              {!showCalendly ? (
                <form onSubmit={handleSubmit} className="space-y-20">

                  {/* GROUP 1 */}
                  <div className="form-reveal space-y-12">
                    <div className="flex items-center gap-4">
                      <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#E5997B] shrink-0">01 — Información de Contacto</p>
                      <div className="flex-1 h-px bg-[#030035]/8" />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Sector / Industria</label>
                      <input type="text" name="sector" value={formData.sector} onChange={handleChange}
                        placeholder="Ej. Manufactura, Agroindustria, Inmobiliario..."
                        className={`${inputBase} ${inputIdle} text-2xl`} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                      <div>
                        <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Nombre de Contacto</label>
                        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange}
                          className={`${inputBase} ${inputIdle} text-2xl`} required />
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Cargo</label>
                        <input type="text" name="position" value={formData.position} onChange={handleChange}
                          placeholder="Ej. Director General, CFO..."
                          className={`${inputBase} ${inputIdle} text-2xl`} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                      <div>
                        <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Email Corporativo</label>
                        <input type="email" name="email" value={formData.email}
                          onChange={handleEmailChange}
                          onBlur={() => { if (formData.email && !validateEmail(formData.email)) setErrors(prev => ({ ...prev, email: 'Ingrese un correo electrónico válido' })) }}
                          placeholder="nombre@empresa.com"
                          className={`${inputBase} text-2xl ${errors.email ? 'border-red-400' : formData.email && isEmailValid ? inputValid : inputIdle}`}
                          required />
                        {errors.email && <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-red-400">{errors.email}</p>}
                        {formData.email && isEmailValid && !errors.email && <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#E5997B]/70">✓ Correo válido</p>}
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Teléfono</label>
                        <input type="tel" name="phone" value={formData.phone}
                          onChange={handlePhoneChange}
                          onKeyDown={(e) => {
                            const allowed = ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','(',')',' ']
                            if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault()
                          }}
                          placeholder="+52 55 0000 0000" inputMode="tel"
                          className={`${inputBase} text-2xl ${formData.phone && isPhoneValid ? inputValid : inputIdle}`}
                          required />
                        {formData.phone && !isPhoneValid && <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/35">Mínimo 8 dígitos</p>}
                        {formData.phone && isPhoneValid && <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-[#E5997B]/70">✓ Teléfono válido</p>}
                      </div>
                    </div>
                  </div>

                  {/* GROUP 2 */}
                  <div className="form-reveal space-y-12">
                    <div className="flex items-center gap-4">
                      <p className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#E5997B] shrink-0">02 — Información del Producto</p>
                      <div className="flex-1 h-px bg-[#030035]/8" />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Tipo de Producto</label>
                      <select name="productType" value={formData.productType} onChange={handleChange}
                        className={`${inputBase} ${inputIdle} text-2xl appearance-none cursor-pointer`} required>
                        <option value="" disabled>Seleccione un producto...</option>
                        <option value="Crédito Simple">Crédito Simple</option>
                        <option value="Crédito Puente">Crédito Puente</option>
                        <option value="Cuenta Corriente">Cuenta Corriente</option>
                        <option value="Crédito Agroindustrial">Crédito Agroindustrial</option>
                        <option value="Arrendamiento Financiero">Arrendamiento Financiero</option>
                        <option value="Factoring">Factoring</option>
                        <option value="Por definir">Por definir / TBD</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                      <div>
                        <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">Monto Requerido</label>
                        <div className="flex gap-4 items-end">
                          <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange}
                            placeholder="0" disabled={formData.loanTBD}
                            className={`flex-1 ${inputBase} text-2xl ${formData.loanTBD ? inputDisabled : inputIdle}`} />
                          <select name="loanCurrency" value={formData.loanCurrency} onChange={handleChange}
                            disabled={formData.loanTBD}
                            className={`w-28 ${inputBase} text-xl appearance-none cursor-pointer ${formData.loanTBD ? inputDisabled : inputIdle}`}>
                            <option value="MXN">MXN</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="Por definir">TBD</option>
                          </select>
                        </div>
                        <label className="flex items-center gap-3 mt-4 cursor-pointer">
                          <input type="checkbox" name="loanTBD" checked={formData.loanTBD} onChange={handleChange} className="w-4 h-4 accent-[#E5997B]" />
                          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/40">Por definir / TBD</span>
                        </label>
                      </div>
                      <div>
                        <label className="block font-mono text-[11px] tracking-[0.4em] uppercase text-[#030035]/50 mb-4">
                          Plazo Deseado <span className="text-[#030035]/30 normal-case tracking-normal">(en meses)</span>
                        </label>
                        <input type="number" name="termMonths" value={formData.termMonths} onChange={handleChange}
                          placeholder="0" disabled={formData.termTBD}
                          className={`${inputBase} text-2xl ${formData.termTBD ? inputDisabled : inputIdle}`} />
                        <label className="flex items-center gap-3 mt-4 cursor-pointer">
                          <input type="checkbox" name="termTBD" checked={formData.termTBD} onChange={handleChange} className="w-4 h-4 accent-[#E5997B]" />
                          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/40">Por definir / TBD</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="form-reveal pt-4 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-[#030035]/8">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/30 max-w-xs leading-relaxed">
                      Al continuar, aceptas que nuestro equipo se ponga en contacto contigo para coordinar la sesión.
                    </p>
                    <button type="submit" disabled={!isFormValid}
                      className={`inline-flex items-center gap-4 px-14 py-6 font-mono text-[13px] tracking-[0.3em] uppercase transition-all duration-300 shrink-0 ${
                        isFormValid ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] cursor-pointer' : 'bg-[#030035]/8 text-[#030035]/25 cursor-not-allowed'
                      }`}>
                      <span>Agendar Sesión</span>
                      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </form>

              ) : (
                <div className="space-y-10">
                  <div className="form-reveal border border-[#030035]/8 p-10 space-y-4 bg-white/40">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/40">Resumen de su solicitud</span>
                      <button onClick={() => setShowCalendly(false)}
                        className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E5997B] hover:text-[#030035] transition-colors">
                        Editar información
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                      {[
                        { label: 'Contacto', value: formData.contactName },
                        { label: 'Sector',   value: formData.sector },
                        { label: 'Cargo',    value: formData.position },
                        { label: 'Email',    value: formData.email },
                        { label: 'Teléfono', value: formData.phone },
                        { label: 'Producto', value: formData.productType },
                        { label: 'Monto',    value: formData.loanTBD ? 'Por definir' : `${formData.loanAmount} ${formData.loanCurrency}` },
                        { label: 'Plazo',    value: formData.termTBD ? 'Por definir' : `${formData.termMonths} meses` },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-baseline border-b border-[#030035]/5 py-3">
                          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#030035]/35">{item.label}</span>
                          <span className="font-body text-[#030035] text-sm md:text-base">{item.value}</span>
                        </div>
                      ))}
                    </div>
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
                    <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '700px' }} />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── CHILD 2: Contact cards ── */}
          <section ref={contactRef} className="relative py-24 md:py-40 bg-[#F4F4F5] overflow-hidden" style={{ zIndex: 1 }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: `linear-gradient(rgba(3,0,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(3,0,53,0.05) 1px, transparent 1px)`,
              backgroundSize: '80px 80px', backgroundPosition: 'center center',
              maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            }} />
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
                  { icon: <path d="M2 7l10 6 10-6M2 4h20v16H2z" stroke="currentColor" strokeWidth="1.2"/>, label: 'Email', value: 'corporativo@dimafinance.com.mx', href: 'mailto:corporativo@dimafinance.com.mx' },
                  { icon: <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="currentColor" strokeWidth="1.2"/>, label: 'WhatsApp', value: '+52 1 33 1971 7871', href: 'https://wa.me/5213319717871' },
                  { icon: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.2"/></>, label: 'Videollamada', value: 'Agendar Sesión', href: '#' },
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

        </GridDissolve>
      </div>
    </PageTransition>
  )
}