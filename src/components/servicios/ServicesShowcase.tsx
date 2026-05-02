import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import AnimatedGridEdge from '../AnimatedGridEdge'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  number: string
  label: string
  heading: string[]
  descriptor: string
  paragraphs: string[]
  deliverables: string[]
  image: string
  layout: 'photo-left' | 'photo-right'
  theme: 'dark' | 'light'
  ctaLink: string
}

export default function ServicesShowcase({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const indexRef   = useRef(0)
  const lockedRef  = useRef(false)
  const total = services.length

  // ── Animate to service index ───────────────────────────────
  function goTo(next: number, el: HTMLDivElement) {
    const prev = indexRef.current
    if (next === prev) return

    indexRef.current = next

    const q   = (sel: string, i: number) => el.querySelectorAll(`[data-${sel}="${i}"]`)
    const dur = 0.6
    const delay = 0.25

    // Exit prev
    gsap.to(q('img',     prev), { opacity: 0, scale: 1.05, duration: dur, ease: 'power2.inOut' })
    gsap.to(q('bgnum',   prev), { opacity: 0, y: -16, duration: dur * 0.8, ease: 'power2.out' })
    gsap.to(q('counter', prev), { opacity: 0, y: -10, duration: dur * 0.7, ease: 'power3.out' })
    gsap.to(q('panel',   prev), { opacity: 0, y: -50, duration: dur, ease: 'power3.in' })
    gsap.to(q('dot',     prev), { scale: 0.6, opacity: 0.2, duration: dur * 0.6 })

    // Enter next
    gsap.fromTo(q('img', next),
      { opacity: 0, scale: 1.07 },
      { opacity: 1, scale: 1, duration: dur, ease: 'power2.inOut', delay })
    gsap.fromTo(q('bgnum', next),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: dur * 0.8, ease: 'power2.out', delay })
    gsap.fromTo(q('counter', next),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: dur * 0.7, ease: 'power3.out', delay })
    gsap.fromTo(q('panel', next),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: dur, ease: 'power3.out', delay })
    gsap.fromTo(q('dot', next),
      { scale: 0.6, opacity: 0.2 },
      { scale: 1, opacity: 1, duration: dur * 0.6, delay })

    // Progress lines
    for (let i = 0; i < next; i++) {
      const line = el.querySelector(`[data-line="${i}"]`)
      if (line) gsap.to(line, { scaleX: 1, opacity: 0.4, duration: 0.4, delay })
    }
    for (let i = next; i < total - 1; i++) {
      const line = el.querySelector(`[data-line="${i}"]`)
      if (line) gsap.to(line, { scaleX: 0, opacity: 0.4, duration: 0.3 })
    }
  }

  // ── Scroll jail ───────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return

    const el          = sectionRef.current
    const LOCK_MS     = 820   // must be >= goTo animation duration
    const BOUNDARY_MS = 500   // hold at edge before releasing

    let boundaryTimer: ReturnType<typeof setTimeout> | null = null

    // Pin section — ScrollTrigger just handles pin/unpin
    // scrollY intentionally stays near stStart while user is inside
    // We manually jump past stEnd only when user is done
    const st = ScrollTrigger.create({
      id: 'servicesScroll',
      trigger: el,
      start: 'top top',
      end: `+=${(total - 1) * 100}vh`,
      pin: true,
      pinSpacing: true,
    })

    function onWheel(e: WheelEvent) {
      // Guard: only intercept when section is actually pinned
      const scrollY = window.scrollY
      const stStart = st.start
      const stEnd   = st.end

      if (scrollY < stStart - 30 || scrollY > stEnd + 30) return

      // We're in section — always stop default scroll
      e.preventDefault()
      e.stopImmediatePropagation()

      if (lockedRef.current) return

      const dir  = e.deltaY > 0 ? 1 : -1
      const next = indexRef.current + dir

      // ── UPWARD EXIT — only from first service ──────────────
      if (next < 0) {
        if (!boundaryTimer) {
          boundaryTimer = setTimeout(() => {
            boundaryTimer = null
            lockedRef.current = true
            // Jump scroll to just before section start
            window.scrollTo({ top: Math.max(0, stStart - 80) })
            setTimeout(() => { lockedRef.current = false }, BOUNDARY_MS)
          }, BOUNDARY_MS)
        }
        return
      }

      // Cancel boundary timer if direction changed
      if (boundaryTimer) { clearTimeout(boundaryTimer); boundaryTimer = null }

      // ── DOWNWARD EXIT — only from last service ─────────────
      if (next >= total) {
        if (!boundaryTimer) {
          boundaryTimer = setTimeout(() => {
            boundaryTimer = null
            lockedRef.current = true
            // Jump scroll to just past section end → triggers unpin
            window.scrollTo({ top: stEnd + 80 })
            setTimeout(() => { lockedRef.current = false }, BOUNDARY_MS)
          }, BOUNDARY_MS)
        }
        return
      }

      // ── NORMAL STEP — max 1 per scroll ─────────────────────
      // Cancel any pending boundary exit
      if (boundaryTimer) { clearTimeout(boundaryTimer); boundaryTimer = null }

      lockedRef.current = true
      goTo(next, el)

      // ⚠️ DO NOT call window.scrollTo here.
      // scrollY stays at stStart → section remains pinned.
      // Only exit calls (above) move scrollY.

      setTimeout(() => { lockedRef.current = false }, LOCK_MS)
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions)
      if (boundaryTimer) clearTimeout(boundaryTimer)
      st.kill()
    }
  }, [total])

  // ── Parallax ornaments ────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      sectionRef.current!.querySelectorAll('.ornament-float').forEach((orn, idx) => {
        gsap.to(orn, {
          y: idx % 2 === 0 ? -60 : 40, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 },
        })
      })
      const geoDeco = sectionRef.current!.querySelector('.geo-deco')
      if (geoDeco) {
        gsap.to(geoDeco, {
          y: -80, rotation: 15, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2.5 },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="servicios" className="relative min-h-screen bg-navy overflow-hidden">

      {/* ── Diamond grid pattern ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.025]">
        <svg className="w-full h-full" viewBox="0 0 900 700" preserveAspectRatio="xMidYMid slice" fill="none">
          {Array.from({ length: 7 }).map((_, row) =>
            Array.from({ length: 9 }).map((_, col) => (
              <path key={`${row}-${col}`}
                d={`M${col*120+60} ${row*105+25} L${col*120+82} ${row*105+52.5} L${col*120+60} ${row*105+80} L${col*120+38} ${row*105+52.5} Z`}
                stroke="#E5997B" strokeWidth="0.4"/>
            ))
          )}
        </svg>
      </div>

      {/* ── Geo deco ────────────────────────────────────────── */}
      <div className="geo-deco absolute inset-0 pointer-events-none select-none overflow-hidden will-change-transform">
        <svg className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.03]"
          viewBox="0 0 700 700" fill="none">
          <path d="M350 30L670 350L350 670L30 350Z" stroke="#E5997B" strokeWidth="0.8"/>
          <path d="M350 130L570 350L350 570L130 350Z" stroke="#E5997B" strokeWidth="0.5"/>
          <line x1="350" y1="30" x2="350" y2="670" stroke="#E5997B" strokeWidth="0.2"/>
          <line x1="30" y1="350" x2="670" y2="350" stroke="#E5997B" strokeWidth="0.2"/>
        </svg>
      </div>

      {/* ── AnimatedGrid — right navy side only ─────────────── */}
      <div className="absolute inset-y-0 right-0 pointer-events-none" style={{ width: '46%' }}>
        <AnimatedGridEdge cellSize={60} color="229,153,123" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, #030035 0%, transparent 30%)',
        }}/>
      </div>

      {/* ── Floating ornaments ──────────────────────────────── */}
      <motion.div animate={{ y: [-10,10,-10] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="ornament-float absolute top-24 right-[38%] pointer-events-none hidden lg:block">
        <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10 opacity-[0.08]">
          <path d="M30 5L55 30L30 55L5 30Z" stroke="#E5997B" strokeWidth="0.7"/>
        </svg>
      </motion.div>
      <motion.div animate={{ y: [8,-8,8] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="ornament-float absolute bottom-40 left-[52%] pointer-events-none hidden lg:block">
        <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7 opacity-[0.06]">
          <path d="M20 3L37 20L20 37L3 20Z" stroke="#E5997B" strokeWidth="0.6"/>
        </svg>
      </motion.div>
      <motion.div animate={{ y: [-6,6,-6], x: [3,-3,3] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="ornament-float absolute top-[60%] right-16 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 50 50" fill="none" className="w-8 h-8 opacity-[0.05]">
          <path d="M25 4L46 25L25 46L4 25Z" stroke="#E5997B" strokeWidth="0.5"/>
          <path d="M25 14L36 25L25 36L14 25Z" stroke="#E5997B" strokeWidth="0.3"/>
        </svg>
      </motion.div>

      {/* ── Vertical accent line ────────────────────────────── */}
      <div className="absolute hidden lg:block pointer-events-none z-10"
        style={{ left: '54%', top: '15%', bottom: '15%', width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(229,153,123,0.15) 30%, rgba(229,153,123,0.15) 70%, transparent)' }}/>

      {/* ── Image layer ─────────────────────────────────────── */}
      <div className="absolute inset-y-0 left-0 pointer-events-none"
        style={{ width: '54%', clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }}>
        {services.map((svc, i) => (
          <div key={svc.number} data-img={i}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}>
            <img src={svc.image} alt={svc.label} className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}/>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(100deg, rgba(13,19,33,0.08) 30%, rgba(13,19,33,0.7) 100%)',
            }}/>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to bottom, rgba(13,19,33,0.35) 0%, transparent 18%, transparent 82%, rgba(13,19,33,0.35) 100%)',
            }}/>
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 w-px opacity-15"
          style={{ background: 'linear-gradient(to bottom, transparent, #E5997B 25%, #E5997B 75%, transparent)' }}/>
      </div>

      {/* ── Background numbers ──────────────────────────────── */}
      <div className="absolute pointer-events-none select-none font-display"
        style={{ fontSize: 'clamp(12rem, 24vw, 28rem)', lineHeight: 0.85, bottom: '-0.05em', left: '0.08em' }}>
        {services.map((svc, i) => (
          <span key={svc.number} data-bgnum={i}
            className="absolute bottom-0 left-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0, color: 'rgba(229,153,123,0.05)' }}>
            {svc.number}
          </span>
        ))}
        <span className="invisible" aria-hidden>{services[0].number}</span>
      </div>

      {/* ── Counter ─────────────────────────────────────────── */}
      <div className="absolute top-28 right-12 z-30 flex items-center gap-2">
        <div className="relative overflow-hidden" style={{ height: '1.4em' }}>
          {services.map((svc, i) => (
            <span key={svc.number} data-counter={i}
              className="absolute right-0 font-display text-sm tracking-[0.3em] text-bronze will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}>
              {svc.number}
            </span>
          ))}
          <span className="invisible font-display text-sm tracking-[0.3em]" aria-hidden>{services[0].number}</span>
        </div>
        <span className="font-display text-sm text-bronze/25 mx-1">/</span>
        <span className="font-display text-sm tracking-[0.3em] text-bronze/30">{String(total).padStart(2,'0')}</span>
      </div>

      {/* ── Content panels ──────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex items-stretch">
        <div className="hidden md:block flex-shrink-0" style={{ width: '56%' }}/>
        <div className="flex-1 relative min-h-screen flex items-center">
          {services.map((svc, i) => (
            <div key={svc.number} data-panel={i}
              className="absolute inset-0 flex flex-col justify-center will-change-transform"
              style={{
                opacity: i === 0 ? 1 : 0,
                paddingTop: 'clamp(3rem, 6vh, 7rem)',
                paddingBottom: 'clamp(3rem, 6vh, 7rem)',
                paddingLeft: 'clamp(1.5rem, 2vw, 2.5rem)',
                paddingRight: 'clamp(2rem, 4vw, 5rem)',
              }}>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-display uppercase"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.45em', color: 'rgba(229,153,123,0.5)' }}>
                  {svc.number}
                </span>
                <span className="block h-px bg-bronze/25" style={{ width: 28 }}/>
                <span className="font-body uppercase"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: 'rgba(229,153,123,0.9)' }}>
                  {svc.label}
                </span>
              </div>

              <h2 className="font-display text-white leading-[1.12] mb-5"
                style={{ fontSize: 'clamp(2rem, 2.8vw, 3.4rem)' }}>
                {svc.heading[0]}<br/>
                <em style={{ color: '#E5997B', fontStyle: 'italic' }}>{svc.heading[1]}</em>
              </h2>

              <p className="font-display italic leading-relaxed mb-7"
                style={{ color: 'rgba(229,153,123,0.6)', fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', maxWidth: '38ch' }}>
                &ldquo;{svc.descriptor}&rdquo;
              </p>

              <div className="mb-6" style={{ width: 40, height: 1, background: 'rgba(229,153,123,0.3)' }}/>

              <p className="font-body leading-[1.8] mb-8"
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.88rem, 1.05vw, 1rem)', maxWidth: '44ch' }}>
                {svc.paragraphs[0]}
              </p>

              <div className="space-y-3 mb-10">
                {svc.deliverables.map((d) => (
                  <div key={d} className="flex items-center gap-3">
                    <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 flex-shrink-0 opacity-50">
                      <path d="M6 1L11 6L6 11L1 6Z" stroke="#E5997B" strokeWidth="1"/>
                    </svg>
                    <span className="font-body uppercase"
                      style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: 'rgba(229,153,123,0.75)' }}>
                      {d}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <Link to={svc.ctaLink} className="btn-bronze">Solicitar Consulta</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress dots ───────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {services.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div data-dot={i} className="rounded-full will-change-transform bg-bronze"
              style={{ width: i===0?10:6, height: i===0?10:6, opacity: i===0?1:0.2, transform: i===0?'scale(1)':'scale(0.6)' }}/>
            {i < total - 1 && (
              <div data-line={i} className="h-px bg-bronze origin-left"
                style={{ width: 20, transform: 'scaleX(0)', opacity: 0.4 }}/>
            )}
          </div>
        ))}
      </div>

      {/* ── Scroll hint ─────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-12 z-20 hidden lg:flex flex-col items-center gap-2">
        <span className="text-white/20 text-[0.6rem] tracking-[0.25em] uppercase font-body">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-bronze/40 to-transparent"/>
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(229,153,123,0.2), transparent)' }}/>
    </section>
  )
}