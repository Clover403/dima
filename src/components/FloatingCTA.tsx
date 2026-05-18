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
  contactName: string
  email: string
  phone: string
  productType: string
  termMonths: string
  termTBD: boolean
}

const INITIAL_FORM: FormData = {
  contactName: '',
  email: '',
  phone: '',
  productType: '',
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
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
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
    formData.contactName &&
    isEmailValid &&
    isPhoneValid &&
    formData.productType &&
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
    if (val && !validateEmail(val)) setErrors((p) => ({ ...p, email: 'Correo inválido' }))
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

  // ── Styles — teks lebih besar ──
  const inputBase =
    'w-full px-0 py-3.5 bg-transparent border-b text-[#030035] text-[15px] font-body focus:outline-none transition-colors placeholder:text-[#030035]/25'
  const labelCls =
    'block font-mono text-[11px] tracking-[0.35em] uppercase text-[#030035]/55 mb-2'
  const validNote = 'mt-1.5 font-mono text-[11px] tracking-[0.25em] uppercase text-[#E5997B]/80'
  const errorNote = 'mt-1.5 font-mono text-[11px] tracking-[0.25em] uppercase text-red-400'

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
            className="fixed bottom-8 right-8 z-[9999] flex items-center gap-6 rounded-full px-6 py-5 min-w-[96px] min-h-[96px] cursor-pointer select-none will-change-transform"
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
              className="flex items-center justify-center w-10 h-10 shrink-0"
            >
              <CalendarIcon className="w-10 h-10" />
            </motion.div>

            <AnimatePresence initial={false}>
              {hovered && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 4 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden whitespace-nowrap font-mono text-[14px] tracking-[0.32em] uppercase pr-4"
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
              style={{ backgroundColor: 'rgba(3,0,53,0.5)' }}
            />

            {/* ── Panel — diperlebar: md:w-[520px] ── */}
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-screen z-[9999] w-screen md:w-[520px] overflow-y-auto"
              style={{ backgroundColor: GRAY }}
              role="dialog"
              aria-modal="true"
              aria-label="Agendar sesión"
            >
              {/* Close */}
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center text-[#030035] hover:opacity-60 transition-opacity"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4.5 h-4.5">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>

              {!showCalendly ? (
                /* ── STATE 1: FORM ── */
                <div className="px-10 pt-14 pb-12">
                  <p
                    className="font-mono text-[11px] tracking-[0.4em] uppercase mb-4"
                    style={{ color: BRONZE }}
                  >
                    Precalificación
                  </p>
                  {/* Judul lebih besar */}
                  <h2 className="font-display text-[2.4rem] leading-[1.1] text-[#030035] mb-3">
                    Agendar <span className="italic" style={{ color: BRONZE }}>Sesión</span>
                  </h2>
                  <p className="font-body text-[15px] text-[#030035]/55 leading-relaxed">
                    Sesión de 30 minutos con nuestro equipo.
                  </p>
                  <div className="h-px w-12 my-7" style={{ backgroundColor: BRONZE }} />

                  <form onSubmit={handleSubmit} className="space-y-7">
                    {/* 1. Nombre */}
                    <div>
                      <label className={labelCls}>Nombre de Contacto</label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, contactName: e.target.value }))
                        }
                        className={`${inputBase} border-[#030035]/15 focus:border-[#E5997B] ${
                          formData.contactName ? 'border-[#E5997B]' : ''
                        }`}
                        required
                      />
                    </div>

                    {/* 2. Email */}
                    <div>
                      <label className={labelCls}>Email Corporativo</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        placeholder="nombre@empresa.com"
                        className={`${inputBase} ${
                          errors.email
                            ? 'border-red-400'
                            : formData.email && isEmailValid
                            ? 'border-[#E5997B]'
                            : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`}
                        required
                      />
                      {errors.email && <p className={errorNote}>{errors.email}</p>}
                      {formData.email && isEmailValid && !errors.email && (
                        <p className={validNote}>✓ válido</p>
                      )}
                    </div>

                    {/* 3. Teléfono */}
                    <div>
                      <label className={labelCls}>Teléfono</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="+52 55 0000 0000"
                        inputMode="tel"
                        className={`${inputBase} ${
                          formData.phone && isPhoneValid
                            ? 'border-[#E5997B]'
                            : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`}
                        required
                      />
                      {formData.phone && !isPhoneValid && (
                        <p className="mt-1.5 font-mono text-[11px] tracking-[0.25em] uppercase text-[#030035]/55">
                          mín. 7 dígitos
                        </p>
                      )}
                      {formData.phone && isPhoneValid && (
                        <p className={validNote}>✓ válido</p>
                      )}
                    </div>

                    {/* 4. Tipo de Producto */}
                    <div>
                      <label className={labelCls}>Tipo de Producto</label>
                      <div className="relative">
                        <select
                          value={formData.productType}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, productType: e.target.value }))
                          }
                          className={`${inputBase} appearance-none cursor-pointer pr-6 ${
                            formData.productType
                              ? 'border-[#E5997B]'
                              : 'border-[#030035]/15 focus:border-[#E5997B]'
                          }`}
                          required
                        >
                          <option value="" disabled>
                            Seleccione...
                          </option>
                          {PRODUCT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </div>

                    {/* 5. Plazo — FIXED: type text + inputMode numeric + readOnly ──*/}
                    <div>
                      <label className={labelCls}>Plazo Deseado</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.termTBD ? '' : formData.termMonths}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '')
                          setFormData((p) => ({ ...p, termMonths: val }))
                        }}
                        placeholder={formData.termTBD ? 'Por definir' : 'Ej. 24'}
                        readOnly={formData.termTBD}
                        className={`${inputBase} ${
                          formData.termTBD
                            ? 'border-[#030035]/5 text-[#030035]/30 cursor-not-allowed'
                            : formData.termMonths
                            ? 'border-[#E5997B]'
                            : 'border-[#030035]/15 focus:border-[#E5997B]'
                        }`}
                        required={!formData.termTBD}
                      />
                      <p className="mt-1 font-mono text-[11px] tracking-[0.25em] uppercase text-[#030035]/40">
                        en meses
                      </p>
                      <label className="flex items-center gap-2.5 mt-3.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.termTBD}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              termTBD: e.target.checked,
                              termMonths: e.target.checked ? '' : p.termMonths,
                            }))
                          }
                          className="w-4 h-4 accent-[#E5997B]"
                        />
                        <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#030035]/55">
                          Por definir / TBD
                        </span>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`w-full mt-2 py-[18px] font-mono text-[12px] tracking-[0.3em] uppercase transition-all duration-300 ${
                        isFormValid
                          ? 'bg-[#030035] text-[#F4F4F5] hover:bg-[#E5997B] hover:text-[#030035] cursor-pointer'
                          : 'bg-[#030035] text-[#F4F4F5] opacity-40 cursor-not-allowed'
                      }`}
                    >
                      Continuar → Agendar
                    </button>

                    <p className="text-center font-mono text-[10px] tracking-[0.4em] uppercase text-[#030035]/35 pt-2">
                      Sin compromiso · 30 min
                    </p>
                  </form>
                </div>
              ) : (
                /* ── STATE 2: CALENDLY ── */
                <div className="flex flex-col h-screen">
                  <div className="px-10 pt-14 pb-4 shrink-0">
                    <button
                      onClick={() => setShowCalendly(false)}
                      className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4 hover:opacity-70 transition-opacity"
                      style={{ color: BRONZE }}
                    >
                      ← Editar
                    </button>
                    <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] tracking-[0.25em] uppercase text-[#030035]/65">
                      <span>{formData.contactName}</span>
                      <span style={{ color: BRONZE }}>·</span>
                      <span>{formData.productType}</span>
                      <span style={{ color: BRONZE }}>·</span>
                      <span>
                        {formData.termTBD ? 'Plazo TBD' : `${formData.termMonths} meses`}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 border-t border-[#030035]/10">
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