import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const NAVY = '#030035'
const BRONZE = '#E5997B'
const GRAY = '#F4F4F5'

const CALENDLY_BASE = 'https://calendly.com/corporativo-dimafinance/30min'

const PRODUCT_OPTIONS = [
  'Crédito Simple',
  'Crédito Puente',
  'Cuenta Corriente',
  'Crédito Agroindustrial',
  'Arrendamiento Financiero',
  'Factoring',
  'Por definir / TBD',
]

type FormData = {
  sector: string
  contactName: string
  position: string
  email: string
  phone: string
  productType: string
  loanAmount: string
  loanCurrency: string
  loanTBD: boolean
  termMonths: string
  termTBD: boolean
}

const INITIAL_FORM: FormData = {
  sector: '',
  contactName: '',
  position: '',
  email: '',
  phone: '',
  productType: '',
  loanAmount: '',
  loanCurrency: 'MXN',
  loanTBD: false,
  termMonths: '',
  termTBD: false,
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="8" y1="3" x2="8" y2="6" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="6" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="6" width="16" height="14" rx="2" stroke={BRONZE} strokeWidth="1.6" />
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => (
          <circle
            key={`${col}-${row}`}
            cx={8 + col * 4}
            cy={11 + row * 4}
            r="1"
            fill={BRONZE}
          />
        ))
      )}
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M2 4l4 4 4-4" stroke={NAVY} strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FloatingCTA() {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showCalendly, setShowCalendly] = useState(false)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})
  const calendlyRef = useRef<HTMLDivElement>(null)

  // ── Mount delay ──
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // ── Pulse every 4s ──
  useEffect(() => {
    if (!mounted) return
    const id = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
    }, 4000)
    return () => clearInterval(id)
  }, [mounted])

  // ── Calendly script + css loader ──
  useEffect(() => {
    if (!document.querySelector('script[src*="calendly"]')) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.head.appendChild(script)
    }
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
  }, [])

  // ── Body scroll lock + Escape ──
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // ── Calendly inline init ──
  useEffect(() => {
    if (!showCalendly) return
    const params = new URLSearchParams({
      name: formData.contactName,
      email: formData.email,
      hide_gdpr_banner: '1',
      utm_source: 'floating_cta',
      utm_medium: formData.productType,
    })
    const url = `${CALENDLY_BASE}?${params.toString()}`
    const tryInit = (attempts = 0) => {
      const el = calendlyRef.current
      const Cal = (window as any).Calendly
      if (el && Cal?.initInlineWidget) {
        el.innerHTML = ''
        Cal.initInlineWidget({ url, parentElement: el })
      } else if (attempts < 30) {
        setTimeout(() => tryInit(attempts + 1), 120)
      }
    }
    tryInit()
  }, [showCalendly, formData.contactName, formData.email, formData.productType])

  // ── Validators ──
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const isEmailValid = validateEmail(formData.email)
  const isPhoneValid = formData.phone.replace(/[\s+\-()]/g, '').length >= 7
  const isFormValid = !!(
    formData.sector &&
    formData.contactName &&
    formData.position &&
    isEmailValid &&
    isPhoneValid &&
    formData.productType &&
    (formData.loanTBD || formData.loanAmount) &&
    (formData.termTBD || formData.termMonths)
  )

  // ── Handlers ──
  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => setShowCalendly(false), 350)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData((p) => ({ ...p, email: val }))
    if (val && !validateEmail(val)) setErrors((p) => ({ ...p, email: 'Ingrese un correo electrónico válido' }))
    else setErrors((p) => ({ ...p, email: undefined }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d\s+\-()]/g, '')
    setFormData((p) => ({ ...p, phone: val }))
    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    setShowCalendly(true)
  }

  // ── Styles (Sesuai dengan Contact Form Tema Light Gray) ──
  const capsuleInput = 'w-full px-5 py-3.5 bg-[#F4F4F5] border border-[#030035]/10 rounded-full text-[#030035] font-normal text-[15px] focus:outline-none focus:border-[#E5997B] focus:ring-1 focus:ring-[#E5997B]/50 transition-all duration-300 shadow-sm placeholder:text-[#030035]/40 placeholder:font-light'
  const labelCls = 'block font-sans text-base font-medium text-[#030035]/80 mb-2 pl-2'
  const validNote = 'mt-1.5 pl-4 font-sans text-sm text-[#E5997B]'
  const errorNote = 'mt-1.5 pl-4 font-sans text-sm text-red-500'
  const sectionHeaderCls = 'flex items-center gap-3 border-b border-[#030035]/15 pb-3 mt-8 mb-5'

  return (
    <>
      {/* ── Floating Button ── */}
      <AnimatePresence>
        {mounted && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            layout
            aria-label="Agendar Sesión"
className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] flex items-center gap-4 md:gap-6 rounded-full px-4 md:px-6 py-3 md:py-5 min-w-[64px] md:min-w-[96px] min-h-[64px] md:min-h-[96px] cursor-pointer select-none will-change-transform"
            style={{
              backgroundColor: NAVY,
              border: '1px solid rgba(244,244,245,0.06)',
              backdropFilter: 'blur(10px)',
              boxShadow: hovered
                ? `0 0 0 1px rgba(229,153,123,0.10), 0 0 26px rgba(3,0,53,0.34), 0 0 16px rgba(229,153,123,0.08)`
                : `0 0 0 1px rgba(244,244,245,0.04), 0 12px 30px rgba(3,0,53,0.26), 0 0 14px rgba(3,0,53,0.18)`,
              transition: 'box-shadow 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.45s ease',
            }}
          >
            <motion.div
              layout="position"
              animate={pulse ? { scale: [1, 1.14, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="flex items-center justify-center w-7 h-7 md:w-10 md:h-10 shrink-0"
            >
              <CalendarIcon className="w-7 h-7 md:w-10 md:h-10" />
            </motion.div>

            <AnimatePresence initial={false}>
              {hovered && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 4 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden whitespace-nowrap font-sans font-medium text-[13px] md:text-[15px] tracking-wide pr-2 md:pr-4"
                  style={{ color: GRAY }}
                >
                  Agendar Sesión
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeModal}
              className="fixed inset-0 z-[9998] backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(3,0,53,0.6)' }}
            />

            {/* ── Panel — diperlebar: md:w-[520px], bg disesuaikan tema Contact ── */}
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-screen z-[9999] w-screen md:w-[520px] overflow-y-auto overscroll-contain bg-white"
              onWheel={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Agendar sesión"
            >
              {/* Close */}
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center text-[#030035] hover:bg-black/5 rounded-full transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4.5 h-4.5">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>

              {!showCalendly ? (
                /* ── STATE 1: FORM ── */
                <div className="px-8 md:px-10 pt-16 pb-12">
                  {/* Judul */}
                  <h2 className="font-display text-4xl md:text-5xl tracking-tight text-[#030035] mb-4">
                    Agendar <span className="italic font-serif" style={{ color: BRONZE }}>Sesión</span>
                  </h2>
                  <p className="font-sans text-base text-[#030035]/70 leading-relaxed font-light">
                    Complete la información y agende directamente su sesión con nuestro equipo.
                  </p>
                  
                  <div className="h-px w-16 my-8 bg-[#030035]/10" />

                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Empresa ── */}
                    <div className={sectionHeaderCls}>
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E5997B]/20 text-[#E5997B] font-sans text-xs font-bold">1</span>
                      <span className="font-sans text-lg text-[#030035] font-bold tracking-wide">Empresa</span>
                    </div>

                    {/* 1. Sector */}
                    <div>
                      <label className={labelCls}>Sector / Industria</label>
                      <input
                        type="text"
                        value={formData.sector}
                        onChange={e => setFormData(p => ({ ...p, sector: e.target.value }))}
                        placeholder="Ej. Manufactura, Construcción..."
                        className={capsuleInput}
                        required
                      />
                    </div>

                    {/* ── Contacto ── */}
                    <div className={sectionHeaderCls}>
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E5997B]/20 text-[#E5997B] font-sans text-xs font-bold">2</span>
                      <span className="font-sans text-lg text-[#030035] font-bold tracking-wide">Contacto</span>
                    </div>

                    {/* 2. Nombre */}
                    <div>
                      <label className={labelCls}>Nombre de Contacto</label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))}
                        placeholder="Ej. Alejandro Magno"
                        className={capsuleInput}
                        required
                      />
                    </div>

                    {/* 3. Cargo */}
                    <div>
                      <label className={labelCls}>Cargo / Posición</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={e => setFormData(p => ({ ...p, position: e.target.value }))}
                        placeholder="Ej. Director General, CFO"
                        className={capsuleInput}
                        required
                      />
                    </div>

                    {/* 4. Email */}
                    <div>
                      <label className={labelCls}>Email Corporativo</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        placeholder="nombre@empresa.com"
                        className={`${capsuleInput} ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                        required
                      />
                      {errors.email && <p className={errorNote}>{errors.email}</p>}
                      {formData.email && isEmailValid && !errors.email && <p className={validNote}>✓ Válido</p>}
                    </div>

                    {/* 5. Teléfono */}
                    <div>
                      <label className={labelCls}>Teléfono</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="+52 55 0000 0000"
                        inputMode="tel"
                        className={capsuleInput}
                        required
                      />
                      {formData.phone && !isPhoneValid && (
                        <p className="mt-1.5 pl-4 font-sans text-sm text-[#030035]/50">Mínimo 8 dígitos</p>
                      )}
                      {formData.phone && isPhoneValid && <p className={validNote}>✓ Válido</p>}
                    </div>

                    {/* ── Crédito ── */}
                    <div className={sectionHeaderCls}>
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E5997B]/20 text-[#E5997B] font-sans text-xs font-bold">3</span>
                      <span className="font-sans text-lg text-[#030035] font-bold tracking-wide">Crédito</span>
                    </div>

                    {/* 6. Tipo de Producto */}
                    <div>
                      <label className={labelCls}>Tipo de Producto</label>
                      <div className="relative">
                        <select
                          value={formData.productType}
                          onChange={e => setFormData(p => ({ ...p, productType: e.target.value }))}
                          className={`${capsuleInput} appearance-none cursor-pointer pr-10`}
                          required
                        >
                          <option value="" disabled>Seleccione...</option>
                          {PRODUCT_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </div>

                    {/* 7. Monto */}
                    <div>
                      <label className={labelCls}>Monto Requerido</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={formData.loanTBD ? '' : formData.loanAmount}
                          onChange={e => setFormData(p => ({ ...p, loanAmount: e.target.value.replace(/[^0-9]/g, '') }))}
                          placeholder={formData.loanTBD ? 'Por definir' : 'Ej. 5000000'}
                          readOnly={formData.loanTBD}
                          className={`${capsuleInput} flex-1 ${formData.loanTBD ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                        />
                        <div className="relative shrink-0">
                          <select
                            value={formData.loanCurrency}
                            onChange={e => setFormData(p => ({ ...p, loanCurrency: e.target.value }))}
                            disabled={formData.loanTBD}
                            className={`${capsuleInput} w-[100px] appearance-none cursor-pointer pr-10 pl-4 text-center ${
                              formData.loanTBD ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                            }`}
                          >
                            {['MXN','USD','EUR','TBD'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown />
                        </div>
                      </div>
                      <label className="flex items-center gap-3 mt-3 ml-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.loanTBD}
                          onChange={e => setFormData(p => ({ ...p, loanTBD: e.target.checked, loanAmount: '' }))}
                          className="w-4 h-4 accent-[#E5997B] rounded text-[#E5997B] focus:ring-[#E5997B]"
                        />
                        <span className="font-sans text-base text-[#030035]/80">
                          Por definir / TBD
                        </span>
                      </label>
                    </div>

                    {/* 8. Plazo */}
                    <div>
                      <label className={labelCls}>Plazo Deseado (Meses)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.termTBD ? '' : formData.termMonths}
                        onChange={e => setFormData(p => ({ ...p, termMonths: e.target.value.replace(/[^0-9]/g, '') }))}
                        placeholder={formData.termTBD ? 'Por definir' : 'Ej. 24'}
                        readOnly={formData.termTBD}
                        className={`${capsuleInput} ${formData.termTBD ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                      />
                      <label className="flex items-center gap-3 mt-3 ml-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.termTBD}
                          onChange={e => setFormData(p => ({
                            ...p, termTBD: e.target.checked, termMonths: e.target.checked ? '' : p.termMonths
                          }))}
                          className="w-4 h-4 accent-[#E5997B] rounded text-[#E5997B] focus:ring-[#E5997B]"
                        />
                        <span className="font-sans text-base text-[#030035]/80">
                          Por definir / TBD
                        </span>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`w-full mt-6 py-4 rounded-full font-sans text-lg font-medium transition-all duration-300 shadow-md ${
                        isFormValid
                          ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] hover:text-[#030035] cursor-pointer'
                          : 'bg-[#030035]/40 text-[#F4F4F5] cursor-not-allowed shadow-none'
                      }`}
                    >
                      Continuar → Agendar
                    </button>

                    <p className="text-center font-sans text-sm text-[#030035]/40 pt-2 font-light">
                      Sin compromiso · Sesión de 30 minutos
                    </p>
                  </form>
                </div>
              ) : (
                /* ── STATE 2: CALENDLY ── */
                <div className="flex flex-col h-screen bg-[#E5E7EB]">
                  <div className="px-8 md:px-10 pt-14 pb-6 shrink-0 bg-white/50 border-b border-[#030035]/10">
                    <button
                      onClick={() => setShowCalendly(false)}
                      className="font-sans text-sm font-semibold tracking-wide uppercase mb-4 hover:opacity-70 transition-opacity flex items-center gap-2"
                      style={{ color: BRONZE }}
                    >
                      ← Editar Datos
                    </button>
                    <div className="flex items-center gap-2 flex-wrap font-sans text-sm text-[#030035]/70">
                      <span>{formData.sector}</span>
                      <span style={{ color: BRONZE }}>·</span>
                      <span className="font-medium">{formData.contactName}</span>
                      <span style={{ color: BRONZE }}>·</span>
                      <span>{formData.productType}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div
                      ref={calendlyRef}
                      className="calendly-inline-widget w-full h-full"
                      style={{ minWidth: '320px', height: '100%' }}
                    />
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}