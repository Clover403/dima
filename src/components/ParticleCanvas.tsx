import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

type Props = {
  className?: string
  density?: number // smaller = more particles (area/divisor)
  color?: string
  blend?: CSSProperties['mixBlendMode']
  dotAlpha?: number
  connAlpha?: number
  sizeMultiplier?: number
}

export default function ParticleCanvas({ className = '', density = 10000, color = '244,244,245', blend = 'screen', dotAlpha = 0.42, connAlpha = 0.16, sizeMultiplier = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const count = Math.max(8, Math.floor((canvas.width * canvas.height) / density))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: (Math.random() * 1.6 + 0.6) * sizeMultiplier,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${dotAlpha})`
        ctx.fill()
      })

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.beginPath()
            const alpha = Math.max(0, connAlpha - d / 900)
            ctx.strokeStyle = `rgba(${color},${alpha})`
            ctx.lineWidth = 0.8
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [density, color])

  return (
    <canvas
      ref={canvasRef}
      className={`${className} pointer-events-none`}
      style={{ width: '100%', height: '100%', mixBlendMode: blend }}
    />
  )
}
