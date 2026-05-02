import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const products = [
  { number: '01', name: 'Crédito Simple',          tagline: 'Anticipo del gasto enfocado en expandir la capacidad instalada.',      photo: '/foto/illust-growth.jpg' },
  { number: '02', name: 'Crédito Puente',           tagline: 'Sincronización del flujo de efectivo con el avance de obra.',          photo: '/foto/illust-buildings.jpg' },
  { number: '03', name: 'Cuenta Corriente',         tagline: 'Mitigación táctica en el ciclo de conversión de efectivo.',            photo: '/foto/illust-piechart.jpg' },
  { number: '04', name: 'Crédito Agroindustrial',   tagline: 'Calibración del financiamiento a la maduración de activos biológicos.', photo: '/foto/illust-truck.jpg' },
  { number: '05', name: 'Arrendamiento Financiero', tagline: 'Uso de activos productivos con máxima eficiencia de capital.',         photo: '/foto/illust-house.jpg' },
  { number: '06', name: 'Factoring',                tagline: 'Aceleración estratégica del ciclo de conversión de efectivo.',         photo: '/foto/illust-shipping.jpg' },
]

const NAVBAR_H = 80
const HEADER_H = 160

function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let raf: number, t = 0
    const CELL = 56, DOT_R = 1.5
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const draw = () => {
      t += 0.04; ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cols = Math.ceil(canvas.width / CELL) + 2
      const rows = Math.ceil(canvas.height / CELL) + 2
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL, y = r * CELL
          const wave = Math.sin(t + c * 0.5 + r * 0.6) * 0.5 + 0.5
          ctx.strokeStyle = `rgba(3,0,53,${0.08 + wave * 0.04})`; ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); ctx.stroke()
          ctx.fillStyle = `rgba(3,0,53,${0.15 + wave * 0.25})`
          ctx.beginPath(); ctx.arc(x, y, DOT_R, 0, Math.PI * 2); ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default function ProductsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const sticky  = stickyRef.current
    const track   = trackRef.current
    if (!wrapper || !sticky || !track) return

    gsap.fromTo(sticky.querySelectorAll('.head-item'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: wrapper, start: 'top 75%' } })

    gsap.fromTo(track.querySelectorAll('.product-card'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: wrapper, start: 'top 65%' } })

    const onScroll = () => {
      const rect       = wrapper.getBoundingClientRect()
      const scrollable = wrapper.offsetHeight - window.innerHeight
      const progress   = Math.max(0, Math.min(1, -rect.top / scrollable))
      const maxX       = -(track.scrollWidth - window.innerWidth + 48)
      track.style.transform = `translateX(${maxX * progress}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '350vh' }}>
      <div ref={stickyRef} className="sticky top-0 w-full overflow-hidden"
        style={{ background: '#E5997B', height: '100vh' }}>
        <AnimatedGrid />

        <div className="relative z-10 flex items-end justify-between px-10 md:px-16"
          style={{ paddingTop: `${NAVBAR_H + 56}px`, paddingBottom: '20px' }}>
          <div>
            <p className="head-item font-body text-[12px] tracking-[0.35em] uppercase text-navy mb-3">Productos</p>
            <h2 className="head-item font-display text-[clamp(36px,4.5vw,64px)] text-navy leading-[1.1]">
              Soluciones con <em className="italic text-lightgray">ingeniería.</em>
            </h2>
          </div>
          <Link to="/productos" className="head-item group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-navy hover:text-lightgray transition-colors border-b border-navy/25 hover:border-lightgray pb-0.5 mb-2">
            Ver todos
            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col justify-center"
          style={{ height: `calc(100vh - ${NAVBAR_H + 56}px - ${HEADER_H}px)`, paddingBottom: '24px' }}>
          <div ref={trackRef} className="flex items-center will-change-transform"
            style={{ paddingLeft: '2.5vw', paddingRight: '2.5vw', gap: '16px' }}>

            {products.map((product, i) => (
              <Link key={product.number} to="/productos"
                className="product-card group relative shrink-0 overflow-hidden"
                style={{ width: 'clamp(300px, 28vw, 420px)', height: 'clamp(360px, 58vh, 520px)', borderRadius: '20px' }}>
                <img src={product.photo} alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading={i < 3 ? 'eager' : 'lazy'} />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-500" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl px-5 py-4"
                  style={{ background: 'rgba(3,0,53,0.68)', backdropFilter: 'blur(10px)' }}>
                  <h3 className="font-display text-white text-[19px] leading-snug">{product.name}</h3>
                  <p className="font-body text-white/55 text-[13px] leading-relaxed overflow-hidden transition-all duration-500 ease-out"
                    style={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
                    ref={(el) => {
                      if (!el) return
                      const card = el.closest<HTMLElement>('.group'); if (!card) return
                      card.addEventListener('mouseenter', () => { el.style.maxHeight = '64px'; el.style.opacity = '1'; el.style.marginTop = '6px' })
                      card.addEventListener('mouseleave', () => { el.style.maxHeight = '0'; el.style.opacity = '0'; el.style.marginTop = '0' })
                    }}>
                    {product.tagline}
                  </p>
                </div>
              </Link>
            ))}

            {/* CTA Card — pure navy */}
            <div className="product-card relative shrink-0 flex flex-col justify-end overflow-hidden"
              style={{ width: '300px', height: 'clamp(360px, 58vh, 520px)', borderRadius: '20px', background: '#030035', padding: '32px', flexShrink: 0 }}>
              <svg className="absolute top-6 right-6 opacity-[0.08]" width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path d="M26 2 L50 26 L26 50 L2 26 Z" stroke="#E5997B" strokeWidth="1.5" />
                <path d="M26 13 L39 26 L26 39 L13 26 Z" stroke="#E5997B" strokeWidth="1" />
              </svg>
              <div className="w-7 h-px bg-[#E5997B]/40 mb-5" />
              <p className="font-display text-white text-[20px] leading-snug mb-7">
                Encuentra el producto <em className="text-[#E5997B] italic">ideal</em> para tu empresa.
              </p>
              <Link to="/productos"
                className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.25em] uppercase text-[#E5997B] border border-[#E5997B]/35 px-5 py-3 transition-all duration-300 hover:bg-[#E5997B] hover:text-navy"
                style={{ borderRadius: '2px', width: 'fit-content' }}>
                Ver todos
                <svg className="transition-transform duration-300 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}