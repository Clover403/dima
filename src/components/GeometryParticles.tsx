import { useEffect, useRef } from 'react'

type Props = {
  particleCount?: number
  opacity?: number
}

export default function GeometryParticles({ particleCount = 200, opacity = 0.55 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number

    const PARTICLE_COUNT = particleCount
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      angle: number
      spin: number
      shape: string
      restX: number
      restY: number
      offsetX: number
      offsetY: number
      phaseX: number
      phaseY: number
      floatSpeed: number
      floatRadius: number
    }[] = []

    const mouse = { x: -1000, y: -1000 }
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles.forEach((p) => {
        p.restX = Math.random() * canvas.width
        p.restY = Math.random() * canvas.height
        p.offsetX = 0
        p.offsetY = 0
      })
    }

    window.addEventListener('resize', resize)
    resize()

    const NAVY = '#0A192F'
    const shapes = ['diamond', 'cross', 'triangle', 'lines', 'facet']

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 10 + 6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.01,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        restX: x,
        restY: y,
        offsetX: 0,
        offsetY: 0,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.0008 + 0.0004,
        floatRadius: Math.random() * 20 + 10,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      const repelRadius = 180
      const repelStrength = 1.5
      const returnForce = 0.02
      const friction = 0.94

      for (const p of particles) {
        const floatX = Math.sin(time * p.floatSpeed * 1000 + p.phaseX) * p.floatRadius
        const floatY = Math.cos(time * p.floatSpeed * 1000 + p.phaseY) * p.floatRadius
        const targetX = p.restX + floatX
        const targetY = p.restY + floatY

        const dxMouse = p.x - mouse.x
        const dyMouse = p.y - mouse.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distMouse < repelRadius && distMouse > 0) {
          const angle = Math.atan2(dyMouse, dxMouse)
          const force = ((repelRadius - distMouse) / repelRadius) * repelStrength
          p.vx += Math.cos(angle) * force
          p.vy += Math.sin(angle) * force
        }

        p.vx += (targetX - p.x) * returnForce
        p.vy += (targetY - p.y) * returnForce
        p.vx *= friction
        p.vy *= friction

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 15) {
          p.vx = (p.vx / speed) * 15
          p.vy = (p.vy / speed) * 15
        }

        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin

        if (p.x < -50) {
          p.x = canvas.width + 50
          p.restX = p.x
        }
        if (p.x > canvas.width + 50) {
          p.x = -50
          p.restX = p.x
        }
        if (p.y < -50) {
          p.y = canvas.height + 50
          p.restY = p.y
        }
        if (p.y > canvas.height + 50) {
          p.y = -50
          p.restY = p.y
        }
      }

      ctx.strokeStyle = NAVY
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const p of particles) {
        ctx.globalAlpha = Math.min(opacity, 0.55 + (Math.min(Math.abs(p.vx) + Math.abs(p.vy), 5) / 5) * 0.3)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.beginPath()
        const s = p.size / 2
        switch (p.shape) {
          case 'diamond':
            ctx.moveTo(0, -s)
            ctx.lineTo(s * 0.6, 0)
            ctx.lineTo(0, s)
            ctx.lineTo(-s * 0.6, 0)
            ctx.closePath()
            break
          case 'cross':
            ctx.moveTo(-s * 0.8, -s * 0.8)
            ctx.lineTo(s * 0.8, s * 0.8)
            ctx.moveTo(s * 0.8, -s * 0.8)
            ctx.lineTo(-s * 0.8, s * 0.8)
            break
          case 'triangle':
            ctx.moveTo(0, -s)
            ctx.lineTo(s * 0.8, s * 0.6)
            ctx.lineTo(-s * 0.8, s * 0.6)
            ctx.closePath()
            break
          case 'lines':
            ctx.moveTo(-s * 0.5, -s * 0.8)
            ctx.lineTo(s * 0.5, -s * 0.4)
            ctx.moveTo(-s * 0.5, -s * 0.2)
            ctx.lineTo(s * 0.5, s * 0.2)
            ctx.moveTo(-s * 0.5, s * 0.4)
            ctx.lineTo(s * 0.5, s * 0.8)
            break
          case 'facet':
            ctx.moveTo(0, -s)
            ctx.lineTo(s * 0.6, 0)
            ctx.lineTo(0, s)
            break
        }
        ctx.stroke()
        ctx.restore()
      }
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [particleCount, opacity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
