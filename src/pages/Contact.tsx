import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageTransition from '../components/layout/PageTransition'
import RippleGrid from '../components/RippleGrid'

gsap.registerPlugin(ScrollTrigger)

const CALENDLY_BASE = 'https://calendly.com/corporativo-dimafinance/30min'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const [showCalendly, setShowCalendly] = useState(false)
  const location = useLocation()
  const ctaState = location.state || {}

  const [formData, setFormData] = useState({
    sector: '', contactName: ctaState.contactName || '', position: '', email: ctaState.email || '', phone: '',
    productType: ctaState.productType || '', loanAmount: '', loanCurrency: 'MXN', loanTBD: false,
    termMonths: '', termTBD: false,
  })

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
    const params = new URLSearchParams({ name: formData.contactName, email: formData.email, hide_gdpr_banner: '1', utm_source: 'website_form', utm_medium: formData.productType })
    const calendlyUrl = `${CALENDLY_BASE}?${params.toString()}`
    const tryInit = (attempts = 0) => {
      const el = document.querySelector('.calendly-inline-widget') as HTMLElement | null
      const Cal = (window as any).Calendly
      if (el && Cal?.initInlineWidget) { el.innerHTML = ''; Cal.initInlineWidget({ url: calendlyUrl, parentElement: el }) }
      else if (attempts < 20) setTimeout(() => tryInit(attempts + 1), 100)
    }
    tryInit()
  }, [showCalendly, formData.contactName, formData.email, formData.productType])

  useEffect(() => { window.scrollTo(0, 0); const t = setTimeout(() => ScrollTrigger.refresh(), 800); return () => clearTimeout(t) }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      if (formRef.current) {
        gsap.fromTo(formRef.current.querySelectorAll('.form-reveal'),
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: formRef.current, start: 'top 80%' } })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value.replace(/[^\d\s+\-()]/g, ''); setFormData(p => ({ ...p, phone: v })); if (errors.phone) setErrors(p => ({ ...p, phone: undefined })) }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setFormData(p => ({ ...p, email: v })); if (v && !validateEmail(v)) setErrors(p => ({ ...p, email: 'Ingrese un correo electrónico válido' })); else setErrors(p => ({ ...p, email: undefined })) }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') { const c = (e.target as HTMLInputElement).checked; setFormData(p => ({ ...p, [name]: c })); if (name === 'loanTBD' && c) setFormData(p => ({ ...p, loanAmount: '', loanCurrency: 'MXN', loanTBD: true })); if (name === 'termTBD' && c) setFormData(p => ({ ...p, termMonths: '', termTBD: true })) }
    else setFormData(p => ({ ...p, [name]: value }))
  }
  const isEmailValid = validateEmail(formData.email)
  const isPhoneValid = formData.phone.replace(/[\s+\-()]/g, '').length >= 8
  const isFormValid = !!(formData.sector && formData.contactName && formData.position && isEmailValid && isPhoneValid && formData.productType && (formData.loanTBD || (formData.loanAmount && formData.loanCurrency)) && (formData.termTBD || formData.termMonths))
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!isFormValid) return; setShowCalendly(true); window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: 'smooth' }) }

  // Penyesuaian Style untuk form berwarna lightgray
  const labelStyle = 'block font-sans text-base md:text-lg font-medium text-[#030035]/80 mb-2.5 pl-2'
  const capsuleInput = 'w-full px-6 py-4 bg-white border border-[#030035]/10 rounded-full text-[#030035] font-normal text-base md:text-lg focus:outline-none focus:border-[#E5997B] focus:ring-1 focus:ring-[#E5997B]/50 transition-all duration-300 shadow-sm'
  const capsuleSelect = 'w-full px-6 py-4 bg-white border border-[#030035]/10 rounded-full text-[#030035] font-normal text-base md:text-lg focus:outline-none focus:border-[#E5997B] focus:ring-1 focus:ring-[#E5997B]/50 transition-all duration-300 shadow-sm'
  const placeholderStyle = 'placeholder:text-[#030035]/40 placeholder:font-light placeholder:text-base md:placeholder:text-lg'

  return (
    <PageTransition>
      <div ref={sectionRef} className="bg-[#030035]">

        <section ref={formRef} className="relative min-h-screen bg-[#030035] overflow-hidden">
          <div className="relative z-10 max-w-[1920px] w-[95%] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-start pt-32 pb-32 md:pt-40 md:pb-40">

            {/* ═══ KIRI ═══ */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-8 space-y-6 form-reveal mt-8">
              <div>
                <h1 className="font-display text-[clamp(3.2rem,6vw,6.5rem)] text-[#F4F4F5] leading-[1.05] mb-4 font-normal tracking-tight">
                  Formulario de <br/><span className="text-[#E5997B] ">Inscripción</span>
                </h1>
                <p className="font-body text-[#F4F4F5]/70 text-lg md:text-xl lg:text-2xl leading-relaxed font-light">
                  Complete la información y agende directamente su sesión con nuestro equipo de ingeniería financiera.
                </p>
              </div>
             <div className="relative group overflow-hidden border border-[#F4F4F5]/10 bg-[#F4F4F5]/5 rounded-2xl shadow-2xl">
  <img 
    src="/illustration/contact/invoice2.png" 
    alt="Corporate Architecture" 
    className="w-full h-[450px] lg:h-[650px] object-cover object-center contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out" 
  />
  <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
    <div className="w-8 h-px bg-[#E5997B]" />
    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#F4F4F5]/80">DIMA Finance — 2026</span>
  </div>
</div>
            </div>

            {/* ═══ KANAN: FORM BERWARNA LIGHT GRAY ═══ */}
            <div className="w-full lg:w-7/12 bg-[#E5E7EB] border border-white/50 p-8 md:p-12 lg:p-14 rounded-3xl relative shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              {!showCalendly ? (
                <form onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* STEP 1 */}
                  <div className="form-reveal space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#030035]/15 pb-6">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E5997B]/20 text-[#E5997B] font-mono text-sm font-bold">1</span>
                      <span className="font-sans text-lg md:text-xl text-[#030035] font-bold tracking-wide">Información de Contacto</span>
                    </div>
                    
                    <div>
                      <label className={labelStyle}>Sector / Industria</label>
                      <input type="text" name="sector" value={formData.sector} onChange={handleChange} placeholder="Ej. Manufactura, Agroindustria..." className={`${capsuleInput} ${placeholderStyle}`} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelStyle}>Nombre de Contacto</label>
                        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Ej. Alejandro Magno" className={`${capsuleInput} ${placeholderStyle}`} required />
                      </div>
                      <div>
                        <label className={labelStyle}>Cargo</label>
                        <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Ej. Director General, CFO..." className={`${capsuleInput} ${placeholderStyle}`} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelStyle}>Email Corporativo</label>
                        <input type="email" name="email" value={formData.email} onChange={handleEmailChange} onBlur={() => { if (formData.email && !validateEmail(formData.email)) setErrors(p => ({ ...p, email: 'Ingrese un correo electrónico válido' })) }} placeholder="nombre@empresa.com" className={`${capsuleInput} ${errors.email ? 'border-red-500 focus:border-red-500' : formData.email && isEmailValid ? 'border-[#E5997B]' : ''} ${placeholderStyle}`} required />
                        {errors.email && <p className="mt-2 pl-4 font-sans text-sm text-red-500">{errors.email}</p>}
                      </div>
                      <div>
                        <label className={labelStyle}>Teléfono</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} onKeyDown={(e) => { if (!['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','(',')',' '].includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault() }} placeholder="+52 55 0000 0000" inputMode="tel" className={`${capsuleInput} ${formData.phone && isPhoneValid ? 'border-[#E5997B]' : ''} ${placeholderStyle}`} required />
                        {formData.phone && !isPhoneValid && <p className="mt-2 pl-4 font-sans text-sm text-[#030035]/50">Mínimo 8 dígitos</p>}
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="form-reveal space-y-6 pt-4">
                    <div className="flex items-center gap-3 border-b border-[#030035]/15 pb-6">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E5997B]/20 text-[#E5997B] font-mono text-sm font-bold">2</span>
                      <span className="font-sans text-lg md:text-xl text-[#030035] font-bold tracking-wide">Información del Producto</span>
                    </div>

                    <div>
                      <label className={labelStyle}>Tipo de Producto</label>
                      <div className="relative">
                        <select name="productType" value={formData.productType} onChange={handleChange} className={`${capsuleSelect} ${placeholderStyle} appearance-none cursor-pointer pr-12`} required>
                          <option value="" disabled className="bg-white text-[#030035]/50">Seleccione un producto...</option>
                          <option value="Crédito Simple" className="bg-white text-[#030035]">Crédito Simple</option>
                          <option value="Crédito Puente" className="bg-white text-[#030035]">Crédito Puente</option>
                          <option value="Cuenta Corriente" className="bg-white text-[#030035]">Cuenta Corriente</option>
                          <option value="Crédito Agroindustrial" className="bg-white text-[#030035]">Crédito Agroindustrial</option>
                          <option value="Arrendamiento Financiero" className="bg-white text-[#030035]">Arrendamiento Financiero</option>
                          <option value="Factoring" className="bg-white text-[#030035]">Factoring</option>
                          <option value="Por definir" className="bg-white text-[#030035]">Por definir / TBD</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#030035]/50">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelStyle}>Monto Requerido</label>
                        <div className="flex bg-white border border-[#030035]/10 rounded-full p-1.5 focus-within:border-[#E5997B] focus-within:ring-1 focus-within:ring-[#E5997B]/50 transition-all duration-300 shadow-sm">
                          <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="0" disabled={formData.loanTBD} className={`w-full px-5 py-2.5 bg-transparent text-[#030035] font-normal text-base md:text-lg focus:outline-none ${formData.loanTBD ? 'text-[#030035]/30' : ''} ${placeholderStyle}`} />
                          <select name="loanCurrency" value={formData.loanCurrency} onChange={handleChange} disabled={formData.loanTBD} className={`px-5 py-2.5 bg-[#E5E7EB] rounded-full border-0 text-[#030035] font-normal text-base md:text-lg focus:outline-none cursor-pointer ${formData.loanTBD ? 'text-[#030035]/30' : ''}`}>
                            <option value="MXN" className="bg-white">MXN</option>
                            <option value="USD" className="bg-white">USD</option>
                            <option value="EUR" className="bg-white">EUR</option>
                            <option value="Por definir" className="bg-white">TBD</option>
                          </select>
                        </div>
                        <label className="flex items-center gap-2.5 mt-3 pl-3 cursor-pointer group w-max">
                          <input type="checkbox" name="loanTBD" checked={formData.loanTBD} onChange={handleChange} className="w-4 h-4 rounded accent-[#E5997B] border-[#030035]/30" />
                          <span className="font-sans text-sm md:text-base text-[#030035]/70 group-hover:text-[#030035] transition-colors">Por definir / TBD</span>
                        </label>
                      </div>

                      <div>
                        <label className={labelStyle}>Plazo Deseado <span className="text-[#030035]/50 text-sm font-light">(meses)</span></label>
                        <input type="number" name="termMonths" value={formData.termMonths} onChange={handleChange} placeholder="0" disabled={formData.termTBD} className={`${capsuleInput} ${formData.termTBD ? 'text-[#030035]/30 bg-white/50' : ''} ${placeholderStyle}`} />
                        <label className="flex items-center gap-2.5 mt-3 pl-3 cursor-pointer group w-max">
                          <input type="checkbox" name="termTBD" checked={formData.termTBD} onChange={handleChange} className="w-4 h-4 rounded accent-[#E5997B] border-[#030035]/30" />
                          <span className="font-sans text-sm md:text-base text-[#030035]/70 group-hover:text-[#030035] transition-colors">Por definir / TBD</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-reveal pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-[#030035]/15">
                    <p className="font-sans text-sm md:text-base text-[#030035]/70 max-w-sm leading-relaxed">Al continuar, acepta que nuestro equipo se ponga en contacto con usted.</p>
                    <button type="submit" disabled={!isFormValid} className={`w-full md:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 font-sans font-semibold text-base md:text-lg transition-all duration-300 shrink-0 rounded-full ${isFormValid ? 'bg-[#E5997B] text-[#030035] hover:bg-white hover:shadow-[0_0_30px_rgba(229,153,123,0.5)] cursor-pointer transform hover:-translate-y-0.5' : 'bg-[#030035]/10 text-[#030035]/40 cursor-not-allowed'}`}>
                      <span>Agendar Sesión</span>
                      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* RESUME TEKS */}
                  <div className="form-reveal border border-[#030035]/10 p-8 space-y-5 bg-white rounded-3xl shadow-xl">
                    <div className="flex items-center justify-between mb-4 border-b border-[#030035]/10 pb-4">
                      <span className="font-sans text-base md:text-lg font-bold text-[#030035]">Resumen de su solicitud</span>
                      <button onClick={() => setShowCalendly(false)} className="font-sans text-sm font-medium text-[#E5997B] hover:text-[#030035] transition-colors flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[#E5997B]/10 hover:bg-[#E5997B]/20">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Editar datos
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {[{ label: 'Contacto', value: formData.contactName },{ label: 'Sector', value: formData.sector },{ label: 'Cargo', value: formData.position },{ label: 'Email', value: formData.email },{ label: 'Teléfono', value: formData.phone },{ label: 'Producto', value: formData.productType },{ label: 'Monto', value: formData.loanTBD ? 'Por definir' : `${formData.loanAmount} ${formData.loanCurrency}` },{ label: 'Plazo', value: formData.termTBD ? 'Por definir' : `${formData.termMonths} meses` }].map((item) => (
                        <div key={item.label} className="flex justify-between items-baseline border-b border-[#030035]/5 pb-2.5">
                          <span className="font-sans text-sm text-[#030035]/60">{item.label}</span>
                          <span className="font-sans text-base md:text-lg text-[#030035] font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CALENDLY */}
                  <div className="border border-[#030035]/10 overflow-hidden rounded-3xl bg-white shadow-xl">
                    <div className="bg-[#E5E7EB] px-6 py-4 flex items-center gap-3 border-b border-[#030035]/10">
                      <div className="w-3 h-3 rounded-full bg-[#E5997B] animate-pulse" />
                      <span className="font-sans text-sm font-medium text-[#030035]/80">Seleccione fecha y hora — 30 min</span>
                    </div>
                    <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '700px' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            CONTACT CARDS - MENGGUNAKAN RIPPLE GRID
            ═══════════════════════════════════════ */}
        <section ref={contactRef} className="relative py-28 md:py-40 pb-32 md:pb-48 bg-[#030035] overflow-hidden">

          
          {/* Layer Ripple Grid di Section Bawah (Opacity diturunkan agar lebih redup) */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <RippleGrid
              baseColor="rgba(244, 244, 245, 0.04)"
              accentColor="rgba(244, 244, 245, 0.12)"
            />
          </div>

          {/* Layer Transisi Halus (Gradient Fade dari atas ke bawah) agar mulus menyatu dengan section atas */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#030035] via-[#030035]/80 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
            
          <div className="relative z-10 max-w-[1600px] w-[92%] mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-6 h-px bg-[#F4F4F5]/10" />
                <span className="font-mono text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-medium">Contacto Directo</span>
                <div className="w-6 h-px bg-[#F4F4F5]/10" />
              </div>
              <h2 className="font-display text-[clamp(3.5rem,6.5vw,6rem)] text-[#F4F4F5] leading-[1.1] mb-4 font-normal">
                Hablemos de su <span className="text-[#E5997B]">próximo paso.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <path d="M2 7l10 6 10-6M2 4h20v16H2z" stroke="currentColor" strokeWidth="1.2"/>, label: 'Email', value: 'corporativo@dimafinance.com.mx', href: 'mailto:corporativo@dimafinance.com.mx' },
                { icon: <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="currentColor" strokeWidth="1.2"/>, label: 'WhatsApp', value: '+52 1 33 1971 7871', href: 'https://wa.me/5213319717871' },
                { icon: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.2"/></>, label: 'Videollamada', value: 'Agendar Sesión', href: '#' },
              ].map((item, idx) => (
                <a key={idx} href={item.href} className="group relative p-10 bg-[#F4F4F5]/3 backdrop-blur-sm border border-[#F4F4F5]/10 hover:border-[#E5997B]/50 transition-all duration-500 flex flex-col items-center text-center rounded-3xl hover:bg-[#F4F4F5]/5 shadow-lg">
                  <div className="w-12 h-12 mb-5 flex items-center justify-center rounded-full bg-[#F4F4F5]/5 text-[#F4F4F5]/70 group-hover:text-[#E5997B] group-hover:scale-110 transition-all duration-500">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">{item.icon}</svg>
                  </div>
                  <p className="font-sans text-xs text-[#F4F4F5]/50 mb-1">{item.label}</p>
                  <p className="font-body text-[#F4F4F5] text-base md:text-lg font-medium">{item.value}</p>
                </a>
              ))}
            </div>
            <div className="mt-16 flex items-center justify-center gap-3">
              <div className="h-px bg-[#F4F4F5]/10 flex-1 max-w-[80px]" />
              <span className="font-sans text-xs text-[#F4F4F5]/40">Sin compromiso · 30 min</span>
              <div className="h-px bg-[#F4F4F5]/10 flex-1 max-w-[80px]" />
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}