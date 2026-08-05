import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

function useEnvelopeDots(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const RAW_SEGMENTS: [number, number][][] = [
      [[0,0],[10,14],[20,28],[30,42],[40,56],
       [42.5,57.75],[45,59],[47.5,59.75],[50,60],[52.5,59.75],[55,59],[57.5,57.75],[60,56],
       [70,42],[80,28],[90,14],[100,0]],
      [[0,100],[17.5,74.5],[35,49]],
      [[100,100],[82.5,74.5],[65,49]],
    ]

    const segments = RAW_SEGMENTS.map(points => {
      const dist: number[] = [0]
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1]
        const [bx, by] = points[i]
        dist.push(dist[i - 1] + Math.hypot(bx - ax, by - ay))
      }
      return { points, dist, total: dist[dist.length - 1] }
    })

    const pointAt = (seg: typeof segments[0], d: number) => {
      const { points, dist, total } = seg
      const clamped = Math.max(0, Math.min(total, d))
      let i = 1
      while (i < dist.length && dist[i] < clamped) i++
      const d0 = dist[i - 1], d1 = dist[i]
      const t = d1 === d0 ? 0 : (clamped - d0) / (d1 - d0)
      const [ax, ay] = points[i - 1]
      const [bx, by] = points[i]
      return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t }
    }

    interface Dot {
      segIndex: number; pos: number; dir: 1 | -1
      speed: number; trail: number; opacity: number
      dead: boolean; deadAge: number
    }
    const dots: Dot[] = []

    const spawnDot = (segIndex: number) => {
      const seg = segments[segIndex]
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
      dots.push({
        segIndex, pos: dir === 1 ? 0 : seg.total, dir,
        speed: 0.7 + Math.random() * 0.3,
        trail: 1.5,
        opacity: 0.6,
        dead: false, deadAge: 0,
      })
    }

    segments.forEach((_, i) => spawnDot(i))
    const spawnInterval = setInterval(() => {
      segments.forEach((_, segIndex) => {
        if (dots.filter(d => d.segIndex === segIndex).length === 0) {
          spawnDot(segIndex)
        }
      })
    }, 1500)

    let raf = 0
    const color = '3,0,53' 

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scaleX = canvas.width / 100
      const scaleY = canvas.height / 100
      const lineW = 1.5

      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i]
        const seg = segments[dot.segIndex]

        if (dot.dead) {
          dot.deadAge++
          if (dot.deadAge > 20) { 
            const sIdx = dot.segIndex
            dots.splice(i, 1)
            spawnDot(sIdx) 
            continue 
          }
        } else {
          dot.pos += dot.dir * dot.speed
          if (dot.pos <= 0 || dot.pos >= seg.total) dot.dead = true
        }

        const fade = dot.dead ? Math.max(0, 1 - dot.deadAge / 20) : 1
        const head = pointAt(seg, dot.pos)
        const tail = pointAt(seg, dot.pos - dot.dir * dot.trail)
        const hx = head.x * scaleX, hy = head.y * scaleY
        const tx = tail.x * scaleX, ty = tail.y * scaleY

        const cx = (hx + tx) / 2
        const cy = (hy + ty) / 2
        const glowRadius = 45 
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius)
        glow.addColorStop(0, `rgba(${color},${0.02 * fade})`) 
        glow.addColorStop(1, `rgba(${color},0)`)
        
        ctx.beginPath()
        ctx.fillStyle = glow
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.strokeStyle = `rgba(${color},${dot.opacity * fade})`
        ctx.lineWidth = lineW
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }

    draw() 

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(spawnInterval)
      ro.disconnect()
    }
  }, [canvasRef])
}

const navigationLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/modelo-crediticio', label: 'Modelo Crediticio' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/productos', label: 'Productos' },
]

const companyLinks = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
]

export default function Footer() {
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null)
  useEnvelopeDots(dotsCanvasRef as React.RefObject<HTMLCanvasElement>)

  return (
    // Margin negatif dikurangi sedikit (-mt-12 md:-mt-20)
    <footer className="relative z-20 w-full min-h-screen flex flex-col bg-transparent -mt-12 md:-mt-20">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LAYER BACKGROUND (Cekungan Bolong & Warna Solid) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        {/* Tinggi cekungan disesuaikan (h-12 md:h-20) */}
        <div className="relative z-10 w-full h-12 md:h-20 text-bronze -mb-[1px]">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 L0,100 L1440,100 L1440,0 C1100,0 950,85 720,85 C490,85 340,0 0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="relative z-0 w-full flex-1 bg-bronze" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPACER ATAS (Mengosongkan area kurva agar tidak tertutup konten) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Tinggi spacer disesuaikan (h-12 md:h-20) */}
      <div className="w-full h-12 md:h-20 shrink-0 relative z-10 pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* KONTEN FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Padding horizontal sedikit dikurangi */}
      <div className="relative z-10 px-5 md:px-10 lg:px-20 pb-8 flex-1 flex flex-col">
        
        {/* ===== GARIS BACKGROUND BENTUK AMPLOP (MAIL) ===== */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none text-navy opacity-30 z-0"
          aria-hidden="true"
        >
          <path
            d="M0,0 L40,56 Q50,64 60,56 L100,0 M0,100 L35,49 M100,100 L65,49"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* ===== Canvas titik animasi jalan di sepanjang garis amplop ===== */}
        <canvas
          ref={dotsCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Teks dan Navigasi */}
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative z-10">
          
          {/* ===== CTA Section ===== */}
          {/* py-20 turun jadi py-16 */}
          <div className="flex-1 flex flex-col justify-center items-center py-16 text-center border-b border-navy/20">
            <div className="max-w-6xl mx-auto space-y-10 md:space-y-14 mb-8 md:mb-12">
              {/* Teks judul dikecilkan sedikit */}
              <h2 className="font-display text-4xl md:text-6xl lg:text-[6rem] text-navy leading-[1.05] tracking-tight uppercase">
                ¿Listo para estructurar su crecimiento?
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
                {/* Ukuran tombol dan teks tombol dikecilkan sedikit */}
                <a
                  href="https://calendly.com/corporativo-dimafinance/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-navy text-white font-bold text-sm tracking-widest uppercase hover:bg-navy/90 transition-all duration-300"
                >
                  Consulta
                </a>
                <Link
                  to="/productos"
                  className="px-10 py-4 border border-navy text-navy font-bold text-sm tracking-widest uppercase hover:bg-navy hover:text-white transition-all duration-300"
                >
                  Ver Productos
                </Link>
              </div>
            </div>
          </div>

          {/* ===== Bagian Bawah: Link & Copyright ===== */}
          <div className="shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-14">
              <div className="col-span-2 md:col-span-1">
                <img
                  src="/logo/orange_black.svg"
                  alt="DIMA Finance"
                  className="h-8 w-auto"
                />
              </div>

              <div className="col-span-1">
                {/* Title kolom text-sm jadi text-xs, margin bawah dikurangi */}
                <h4 className="font-display text-xs text-navy tracking-widest uppercase mb-4 font-bold">
                  Navegación
                </h4>
                <ul className="space-y-3">
                  {navigationLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-navy hover:opacity-60 transition-opacity duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-1">
                <h4 className="font-display text-xs text-navy tracking-widest uppercase mb-4 font-bold">
                  Empresa
                </h4>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-navy hover:opacity-60 transition-opacity duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h4 className="font-display text-xs text-navy tracking-widest uppercase mb-4 font-bold">
                  Contacto
                </h4>
                <ul className="space-y-3 text-sm text-navy">
                  <li>
                    <a
                      href="mailto:corporativo@dimafinance.com.mx"
                      className="hover:opacity-60 transition-opacity duration-300"
                    >
                      corporativo@dimafinance.com.mx
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/5213319717871"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-60 transition-opacity duration-300"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://calendly.com/corporativo-dimafinance/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-60 transition-opacity duration-300"
                    >
                      Agendar Videollamada
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* mt-20 jadi mt-16 */}
            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="order-2 md:order-1">
                <p className="text-xs text-navy">
                  &copy; {new Date().getFullYear()} DIMA Finance.
                </p>
              </div>
              <div className="flex gap-6 order-1 md:order-2">
                <Link
                  to="/aviso-legal"
                  className="text-xs text-navy hover:opacity-60 transition-opacity duration-300 uppercase tracking-wider"
                >
                  Aviso Legal
                </Link>
                <Link
                  to="/privacidad"
                  className="text-xs text-navy hover:opacity-60 transition-opacity duration-300 uppercase tracking-wider"
                >
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}