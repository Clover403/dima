import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- Helper Functions ---

const pointAt = (seg: { points: [number, number][]; dist: number[]; total: number }, d: number) => {
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
  segIndex: number;
  pos: number;
  dir: 1 | -1;
  speed: number;
  trail: number;
  opacity: number;
  dead: boolean;
  deadAge: number;
}

const spawnDot = (dots: Dot[], segments: { points: [number, number][]; dist: number[]; total: number }[], segIndex: number) => {
  const seg = segments[segIndex]
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
  dots.push({
    segIndex,
    pos: dir === 1 ? 0 : seg.total,
    dir,
    speed: 0.7 + Math.random() * 0.3,
    trail: 1.5,
    opacity: 0.6,
    dead: false,
    deadAge: 0,
  })
}

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

    // GEOMETRI FINAL:
    // Garis bawah dipanjangin dikit lagi ke titik (38,64) & (62,64) biar nempel sempurna tanpa gap
    const RAW_SEGMENTS: [number, number][][] = [
      [[0,0],[10,16.8],[20,33.6],[30,50.4],[40,67.2],
       [42.5,69.5],[45,71],[47.5,71.8],[50,72],[52.5,71.8],[55,71],[57.5,69.5],[60,67.2],
       [70,50.4],[80,33.6],[90,16.8],[100,0]],
      [[0,100],[19,82],[38,64]],
      [[100,100],[81,82],[62,64]],
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

    const dots: Dot[] = []
    const cooldowns = new Array(segments.length).fill(0)

    segments.forEach((_, i) => spawnDot(dots, segments, i))
    
    const spawnInterval = setInterval(() => {
      segments.forEach((_, segIndex) => {
        if (dots.filter(d => d.segIndex === segIndex).length === 0 && cooldowns[segIndex] === 0) {
          spawnDot(dots, segments, segIndex)
        }
      })
    }, 4000)

    let raf = 0
    const lineColor = '180, 143, 108' // RGB Bronze
    const glowColor = '244, 244, 245' // RGB Light Gray

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scaleX = canvas.width / 100
      const scaleY = canvas.height / 100
      const lineW = 1.5

      for (let s = 0; s < segments.length; s++) {
        if (cooldowns[s] > 0) {
          cooldowns[s]--
          if (cooldowns[s] === 0 && dots.filter(d => d.segIndex === s).length === 0) {
            spawnDot(dots, segments, s)
          }
        }
      }

      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i]
        const seg = segments[dot.segIndex]

        if (dot.dead) {
          dot.deadAge++
          if (dot.deadAge > 20) {
            const sIdx = dot.segIndex
            dots.splice(i, 1)
            cooldowns[sIdx] = 120 + Math.floor(Math.random() * 80)
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
        glow.addColorStop(0, `rgba(${glowColor},${0.08 * fade})`)
        glow.addColorStop(1, `rgba(${glowColor},0)`)
        
        ctx.beginPath()
        ctx.fillStyle = glow
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.strokeStyle = `rgba(${lineColor},${dot.opacity * fade})`
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

// --- Component Definition ---

export default function ClosingCtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null)
  useEnvelopeDots(dotsCanvasRef as React.RefObject<HTMLCanvasElement>)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return

      gsap.fromTo(
        sectionRef.current.querySelector('.cta-eyebrow'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelector('.cta-headline'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        sectionRef.current.querySelector('.cta-link'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.35,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[80vh] bg-[#030035] overflow-hidden flex flex-col items-center justify-center py-32 px-8"
    >
      {/* Decorative Envelope Lines — Koordinat L38,64 dan L62,64 presisi menutup gap */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L40,67.2 Q50,78 60,67.2 L100,0 M0,100 L38,64 M100,100 L62,64"
          stroke="#B48F6C"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Canvas for Snake Grid — z-index 5 */}
      <canvas
        ref={dotsCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-5"
      />

      {/* Konten dengan kompresi margin atas optimal */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center -mt-16 md:-mt-24">
        {/* EYEBROW */}
        <p className="cta-eyebrow font-mono text-[#F4F4F5]/40 text-xs md:text-sm tracking-[0.5em] uppercase mb-8">
          Empecemos
        </p>

        {/* HEADLINE */}
        <h2 className="cta-headline font-display text-5xl md:text-7xl lg:text-[5.5rem] text-[#F4F4F5] leading-[1.1] max-w-4xl mb-12">
          Diseñemos juntos la structure financiera que tu empresa necesita
        </h2>

        {/* CTA */}
        <Link
          to="/productos"
          className="cta-link group font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-[#F4F4F5] border-b border-[#F4F4F5]/40 pb-1 transition-colors duration-300 hover:text-[#E5997B] hover:border-[#E5997B]"
        >
          Agenda una consulta
        </Link>
      </div>
    </section>
  )
}