import { useEffect, useState, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import PageTransition from '../components/PageTransition'
import DimaDiamond3D from '../components/NewHome/DimaDiamond3D'
import QuotePrinciplesScene from '../components/NewHome/QuotePrinciplesScene'
import { GreekEngravingBackground } from '../components/NewHome/GreekEngravingBackground'
import { ProductSequenceItem } from '../components/NewHome/ProductSequenceItem'
import { RayDalioFilmRoll } from '../components/NewHome/RayDalioFilmRoll'
import { DalioEconomicChart } from '../components/NewHome/DalioEconomicChart'
import { IconMacroSystem } from '../constants/homeProductPointIcons'
import { EngravingDalioEquilibriumChart } from '../constants/EngravingDalioEquilibriumChart'
import {
  ServiceIconStructuration,
  ServiceIconRisk,
  ServiceIconSacredGeometry,
} from '../constants/homeServiceIcons'
import {
  PRODUCTS_DATA,
  SERVICES_DATA,
  TEKS_1_HERO,
  TEKS_2_WHO_WE_ARE,
  TEKS_3_PRODUCTS,
  TEKS_4_SERVICES,
  TEKS_5_FINALE,
} from '../constants/homeNewContent'

const TEKS_RAY_DALIO = {
  eyebrow: 'LA TEORÍA FUNDAMENTAL',
  description:
    'Basados en los principios de Ray Dalio, entendemos que la economía funciona como una máquina simple regida por ciclos de deuda a corto y largo plazo. No navegamos estos ciclos con especulación, sino con precisión arquitectónica y geométrica.',
}

const RAY_DALIO_ASSETS = [
  { type: 'photo', src: '/foto/raydalio.png' },
  { type: 'quote', text: 'Pain + Reflection = Progress' },
  { type: 'photo', src: '/foto/raydalio2.png' },
  {
    type: 'quote',
    text: 'Principles are fundamental truths that serve as the foundations for behavior.',
  },
]

// ── HOOKS RESPONSIVE ──
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

// ── ZOOM LOCK HOOK ──
function useBrowserZoom() {
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const update = () => {
      if (typeof window === 'undefined') return
      const ratio = window.outerWidth / window.innerWidth
      if (ratio > 1.15) {
        const clamped = Math.min(ratio, 3)
        setZoom(clamped)
      } else {
        setZoom(1)
      }
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('keydown', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('keydown', update)
    }
  }, [])
  return zoom
}

export default function Home() {
  const location = useLocation()
  const storyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeBeat, setActiveBeat] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isManualScroll = useRef(false)
  const manualScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const browserZoom = useBrowserZoom()
  const isZoomed = browserZoom > 1.15
  const zoomCounter = 1 / browserZoom

  // ── HOOKS MOUSE PARALLAX & 3D TILT ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.5 })

  // Layer Background (Bergerak berlawanan kursor)
  const bgX = useTransform(smoothMouseX, [-0.5, 0.5], [25, -25])
  const bgY = useTransform(smoothMouseY, [-0.5, 0.5], [25, -25])
  // Layer Tengah (Sedikit bergerak & Tilt 3D)
  const midX = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15])
  const midY = useTransform(smoothMouseY, [-0.5, 0.5], [-15, 15])
  const tiltX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10])
  const tiltY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10])
  // Layer Foreground / Teks (Bergerak searah kursor)
  const fgX = useTransform(smoothMouseX, [-0.5, 0.5], [-40, 40])
  const fgY = useTransform(smoothMouseY, [-0.5, 0.5], [-40, 40])

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    const x = e.clientX / window.innerWidth - 0.5
    const y = e.clientY / window.innerHeight - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }
  // ────────────────────────────────────

  const beats: any[] = [
    { ...TEKS_1_HERO, align: 'mr-auto items-start text-left justify-center pl-6 lg:pl-16' },
    { ...TEKS_2_WHO_WE_ARE, align: 'ml-auto items-end text-right justify-center pr-2 md:pr-6 lg:pr-10 xl:pr-12' },
    { ...TEKS_3_PRODUCTS, align: 'mr-auto items-start text-left justify-end pb-24 pl-6 lg:pl-16' },
    { ...TEKS_4_SERVICES, align: 'ml-auto items-end text-right justify-center pr-6 lg:pl-16' },
    { ...TEKS_RAY_DALIO, align: 'ml-auto items-end text-right justify-center pr-0 sm:pr-2 md:pr-6 lg:pr-14 xl:pr-20' },
    { align: 'mx-auto items-center text-center justify-center' },
    { ...TEKS_5_FINALE, align: 'mx-auto items-center text-center justify-center' },
  ]

  const products = PRODUCTS_DATA
  const services = SERVICES_DATA.slice(0, 3)

  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] })
  const timeline = [0, 0.1, 0.6, 0.62, 0.75, 0.77, 0.92, 0.95]
  const backgroundColor = useTransform(scrollYProgress, timeline, ['#f3f4f6', '#f3f4f6', '#f3f4f6', '#e5997b', '#e5997b', '#f3f4f6', '#f3f4f6', '#f3f4f6'])
  const textColor = useTransform(scrollYProgress, timeline, ['#030035', '#030035', '#030035', '#030035', '#030035', '#030035', '#030035', '#030035'])
  const borderColor = useTransform(scrollYProgress, timeline, ['rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)'])

  const canvasOpacity = useTransform(scrollYProgress, [0.22, 0.25, 0.98, 0.99], [1, 0, 0, 0])
  const canvasZ = useTransform(scrollYProgress, [0.97, 0.98], [0, 26])

  const t4HeaderOp = useTransform(scrollYProgress, [0.6, 0.61, 0.64, 0.65], [0, 1, 1, 0])
  const t4HeaderY = useTransform(scrollYProgress, [0.6, 0.65], [50, -50])
  const servicesOp = useTransform(scrollYProgress, [0.66, 0.68, 0.74, 0.76], [0, 1, 1, 0])
  const dalioOp = useTransform(scrollYProgress, [0.77, 0.79, 0.82, 0.84], [0, 1, 1, 0])
  const dalioDraw = useTransform(scrollYProgress, [0.77, 0.8, 0.82, 0.84], [0, 1, 1, 0])
  const dalioFillOp = useTransform(scrollYProgress, [0.79, 0.81, 0.82, 0.84], [0, 1, 1, 0])
  const dalioFilmY = useTransform(scrollYProgress, [0.76, 0.84], ['10%', '-130%'])
  const finaleOp = useTransform(scrollYProgress, [0.985, 0.99, 1], [0, 1, 1])
  const finaleY = useTransform(scrollYProgress, [0.985, 0.99, 1], [30, 0, 0])

  const dTime = [0, 0.1, 0.2, 0.24, 0.28, 0.6, 0.62, 0.75, 0.77, 0.84, 0.86, 0.985, 1]
  const diamondX = useTransform(scrollYProgress, dTime, ['25vw', '-25vw', '25vw', '25vw', '0vw', '0vw', '-28vw', '-28vw', '-45vw', '-45vw', '42vw', '42vw', '0vw'])
  const diamondY = useTransform(scrollYProgress, dTime, ['0vh', '0vh', '0vh', '0vh', '30vh', '30vh', '0vh', '0vh', '55vh', '55vh', '-40vh', '-40vh', '-27vh'])
  const diamondScale = useTransform(scrollYProgress, dTime, [1.8, 0.9, 0.9, 0.9, 8, 8, 0.45, 0.45, 1.8, 1.8, 1.6, 1.6, 0.4])
  const diamondRotate = useTransform(scrollYProgress, dTime, [15, -10, 80, 80, 180, 180, 0, 0, 35, 35, 215, 215, 0])
  const diamondZRaw = useTransform(scrollYProgress, [0, 0.199, 0.2, 0.629, 0.63, 1], [50, 50, 0, 0, 50, 50])
  const diamondZ = useTransform(diamondZRaw, (value) => Math.round(value))
  const figOpacity = useTransform(scrollYProgress, [0.63, 0.65, 0.74, 0.76], [0, 1, 1, 0])
  const fig1Y = useTransform(scrollYProgress, [0.63, 0.65, 0.73, 0.76], ['0vh', '-22vh', '-22vh', '0vh'])
  const fig2Y = useTransform(scrollYProgress, [0.63, 0.65, 0.73, 0.76], ['0vh', '22vh', '22vh', '0vh'])

  const insideDiamondOpacity = useTransform(scrollYProgress, [0.25, 0.28, 0.6, 0.62], [0, 1, 1, 0])
  const insideDiamondScale = useTransform(scrollYProgress, [0.25, 0.62], [0.8, 1.2])

  // Teks Judul 3 akan menghilang pas scroll 0.26
  const title3Opacity = useTransform(scrollYProgress, [0.2, 0.23, 0.26], [1, 1, 0])
  const heroFillOp = useTransform(scrollYProgress, [0, 0.02], [1, 0])
  const heroStrokeDashoffset = useTransform(scrollYProgress, [0.02, 0.08], [0, 1000])
  const heroStrokeOp = useTransform(scrollYProgress, [0.08, 0.1], [1, 0])
  const b1StrokeDashoffset = useTransform(scrollYProgress, [0.13, 0.17], [1000, 0])
  const b1PathLength = useTransform(scrollYProgress, [0.13, 0.17], [0, 1])
  const b1StrokeOp = useTransform(scrollYProgress, [0.1, 0.11, 0.19, 0.2], [0, 1, 1, 0])
  const b1FillOp = useTransform(scrollYProgress, [0.17, 0.19, 0.19, 0.2], [0, 1, 1, 0])
  const b2StrokeDashoffset = useTransform(scrollYProgress, [0.2, 0.23, 0.24, 0.28], [1000, 0, 0, 1000])
  const b2PathLength = useTransform(scrollYProgress, [0.2, 0.23, 0.24, 0.28], [0, 1, 1, 0])
  const b2StrokeOp = useTransform(scrollYProgress, [0.19, 0.2, 0.28, 0.29], [0, 1, 1, 0])
  const b2FillOp = useTransform(scrollYProgress, [0.22, 0.23, 0.24, 0.25], [0, 1, 1, 0])

  const b0Y = useTransform(scrollYProgress, [0.08, 0.1], [0, -150])
  const b1Y = useTransform(scrollYProgress, [0.18, 0.2], [0, -150])
  const b2Y = useTransform(scrollYProgress, [0.58, 0.6], [0, -150])

  // ── HOOKS UNTUK ORNAMEN BUKAN DI JUDUL ──
  // Baru muncul pas judul memudar (0.26) supaya cuma ada pas poin-poin muncul
  const ornamentOpacity = useTransform(scrollYProgress, [0.25, 0.27, 0.58, 0.6], [0, 1, 1, 0])
  // Gambar lebih cepat, selesai sempurna pas scroll 0.50 (sebelum masuk Section 4)
  const ornamentDraw = useTransform(scrollYProgress, [0.26, 0.5], [0, 1])

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (value) => {
      if (isManualScroll.current) return
      if (value < 0.1) setActiveBeat(0)
      else if (value < 0.2) setActiveBeat(1)
      else if (value < 0.6) setActiveBeat(2)
      else if (value < 0.75) setActiveBeat(3)
      else if (value < 0.85) setActiveBeat(4)
      else if (value < 0.985) setActiveBeat(5)
      else setActiveBeat(6)

      if (value >= 0.66 && value < 0.69) setOpenIndex(0)
      else if (value >= 0.69 && value < 0.71) setOpenIndex(1)
      else if (value >= 0.71 && value <= 0.74) setOpenIndex(2)
      else setOpenIndex(null)
    })
    return () => unsub()
  }, [scrollYProgress])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  const handlePointClick = (idx: number) => {
    isManualScroll.current = true
    setOpenIndex(idx)
    const targets = [0.67, 0.7, 0.73]
    const targetY = targets[idx] * (document.documentElement.scrollHeight - window.innerHeight)
    window.scrollTo({ top: targetY, behavior: 'smooth' })
    if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current)
    manualScrollTimer.current = setTimeout(() => {
      isManualScroll.current = false
      const currentScroll =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (currentScroll >= 0.66 && currentScroll < 0.69) setOpenIndex(0)
      else if (currentScroll >= 0.69 && currentScroll < 0.71) setOpenIndex(1)
      else if (currentScroll >= 0.71 && currentScroll <= 0.74) setOpenIndex(2)
      else setOpenIndex(null)
    }, 900)
  }

  const serviceOffsets = ['-22vh', '0vh', '22vh']

  // ── EFFECT CANVAS GEOMETRI (DIPERBANYAK & INTERAKTIF MENTAL) ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number

    // PERUBAHAN 1: Jumlah partikel diperbanyak drastis
    const PARTICLE_COUNT = isMobile ? 100 : 300

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
      // Re-init posisi rest agar tersebar ulang saat resize
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

    // let time = 0
   const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      const repelRadius = 180
      const repelStrength = 1.5
      const returnForce = 0.02
      const friction = 0.94

      for (const p of particles) {
        // 1. Hitung titik target mengambang (float)
        const floatX = Math.sin(time * p.floatSpeed * 1000 + p.phaseX) * p.floatRadius
        const floatY = Math.cos(time * p.floatSpeed * 1000 + p.phaseY) * p.floatRadius
        const targetX = p.restX + floatX
        const targetY = p.restY + floatY

        // 2. Gaya Tolak dari kursor
        const dxMouse = p.x - mouse.x
        const dyMouse = p.y - mouse.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distMouse < repelRadius && distMouse > 0) {
          const angle = Math.atan2(dyMouse, dxMouse)
          const force = ((repelRadius - distMouse) / repelRadius) * repelStrength
          p.vx += Math.cos(angle) * force
          p.vy += Math.sin(angle) * force
        }

        // 3. Tarik partikel kembali ke titik target (yang sedang mengambang)
        p.vx += (targetX - p.x) * returnForce
        p.vy += (targetY - p.y) * returnForce

        // 4. Terapkan gesekan
        p.vx *= friction
        p.vy *= friction

        // Batasi kecepatan
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 15) {
          p.vx = (p.vx / speed) * 15
          p.vy = (p.vy / speed) * 15
        }

        // 5. Update posisi akhir
        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin

        // Wrap around
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

      // Render shapes
      ctx.strokeStyle = NAVY
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const p of particles) {
        ctx.globalAlpha = 0.55 + (Math.min(Math.abs(p.vx) + Math.abs(p.vy), 5) / 5) * 0.3
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
  }, [isMobile])
  // ─────────────────────────────────────────────────────────────────────────────

  const zoomWrapperStyle: React.CSSProperties = isZoomed
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${browserZoom * 100}%`,
        height: `${browserZoom * 100}%`,
        zoom: zoomCounter,
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }

  return (
    <PageTransition>
      <motion.main
        onMouseMove={handleGlobalMouseMove}
        style={{ backgroundColor, color: textColor, perspective: 1200 }}
        className="relative w-full transition-colors duration-500"
      >
        <div ref={storyRef} className="relative h-[10000vh] w-full">
          <div className={`sticky top-0 h-screen w-full ${isZoomed ? '' : 'overflow-hidden'}`}>
            <div style={zoomWrapperStyle as any}>
              {/* ── BG PARALLAX LAYER DIKEMBALIKAN TANPA WRAPPER AGAR Z-INDEX TERJAGA ── */}
              {/* Canvas ini merender geometri kecil yang sekarang jumlahnya banyak dan interaktif mental */}
              <motion.canvas
                ref={canvasRef}
                style={{ opacity: canvasOpacity, zIndex: canvasZ, x: bgX, y: bgY }}
                className="absolute inset-0 pointer-events-none"
              />
              <motion.div
                style={{
                  opacity: insideDiamondOpacity,
                  scale: insideDiamondScale,
                  x: bgX,
                  y: bgY,
                  backgroundImage: `repeating-linear-gradient(60deg, transparent, transparent 30px, rgba(3,0,53,0.06) 30px, rgba(3,0,53,0.06) 32px), repeating-linear-gradient(-60deg, transparent, transparent 30px, rgba(3,0,53,0.06) 30px, rgba(3,0,53,0.06) 32px)`,
                  backgroundColor: '#ffffff',
                }}
                className="absolute inset-[-50%] pointer-events-none z-10"
              />
              <motion.div
                style={{ opacity: t4HeaderOp, y: t4HeaderY }}
                className="absolute inset-0 flex items-center justify-end px-4 sm:px-6 lg:px-24 pointer-events-none z-30"
              >
                <motion.div
                  style={{ x: fgX, y: fgY }}
                  className="w-full max-w-[80vw] md:max-w-[500px] lg:max-w-[600px] text-right flex flex-col items-end"
                >
                  <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#030035]/10 bg-[#030035]/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.45em] backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B]" />
                    {TEKS_4_SERVICES.eyebrow}
                  </div>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-[-0.04em] text-[#030035]">
                    {TEKS_4_SERVICES.title}
                  </h1>
                  <p className="mt-4 md:mt-6 text-sm sm:text-base leading-relaxed opacity-75 md:text-lg max-w-md text-[#030035]">
                    {TEKS_4_SERVICES.description}
                  </p>
                </motion.div>
              </motion.div>
              {/* ── BERLIAN 3D DENGAN PARALLAX + TILT ── */}
              <motion.div
                style={{ x: diamondX, y: diamondY, zIndex: diamondZ }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  style={{ scale: diamondScale, rotateZ: diamondRotate }}
                  className="absolute origin-center pointer-events-auto cursor-pointer flex justify-center items-center"
                  onClick={() => handlePointClick(1)}
                >
                  <motion.div
                    style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
                    className="w-[36rem] h-[36rem] max-w-[70vw] max-h-[70vh] aspect-square drop-shadow-2xl flex justify-center items-center"
                  >
                    <DimaDiamond3D />
                  </motion.div>
                </motion.div>
                <motion.div
                  style={{ y: fig1Y, scale: diamondScale, rotateZ: diamondRotate, opacity: figOpacity }}
                  className="absolute origin-center pointer-events-auto cursor-pointer flex justify-center items-center"
                  onClick={() => handlePointClick(0)}
                >
                  <motion.div
                    style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
                    className="w-[36rem] h-[36rem] max-w-[70vw] max-h-[70vh] aspect-square drop-shadow-2xl flex justify-center items-center"
                  >
                    <DimaDiamond3D />
                  </motion.div>
                </motion.div>
                <motion.div
                  style={{ y: fig2Y, scale: diamondScale, rotateZ: diamondRotate, opacity: figOpacity }}
                  className="absolute origin-center pointer-events-auto cursor-pointer flex justify-center items-center"
                  onClick={() => handlePointClick(2)}
                >
                  <motion.div
                    style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
                    className="w-[36rem] h-[36rem] max-w-[70vw] max-h-[70vh] aspect-square drop-shadow-2xl flex justify-center items-center"
                  >
                    <DimaDiamond3D />
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                style={{ opacity: ornamentOpacity }}
                className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block"
              >
                {/* KIRI ATAS - LEBIH LEBAR & LEBIH PENDEK */}
                <div className="absolute top-0 left-0 w-[500px] h-[200px] lg:w-[650px] lg:h-[250px] text-[#030035] opacity-60">
                  <svg
                    viewBox="0 0 600 250"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full drop-shadow-sm"
                  >
                    {/* 1. BATANG UTAMA MEMANJANG HORIZONTAL */}
                    <motion.path d="M 0 0 C 150 40, 300 80, 450 150 T 600 250" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 0 30 C 120 70, 250 90, 380 180" style={{ pathLength: ornamentDraw }} />
                    {/* 2. PUSAT DETAIL KOMPLEKS (PADAT DI SUDUT KIRI ATAS) */}
                    {/* Spiral Rapat Horisontal */}
                    <motion.path d="M 70 30 C 40 10, 15 40, 35 60 C 55 80, 85 55, 75 30 C 65 10, 35 20, 42 45 C 46 55, 65 52, 58 38" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 110 40 C 90 15, 55 25, 70 50 C 85 75, 120 50, 100 30 C 85 15, 65 30, 75 45" style={{ pathLength: ornamentDraw }} />
                    {/* Kelopak Daun Berlapis Sudut */}
                    <motion.path d="M 20 10 C 5 5, 0 18, 10 22 C 20 26, 25 12, 20 10" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 40 15 Q 20 30, 12 15" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 50 10 Q 70 25, 55 35" style={{ pathLength: ornamentDraw }} />
                    {/* 3. AREA TENGAH MEMANJANG (SULUR ACANTHUS & SIRIP DAUN) */}
                    {/* Lingkaran Sulur Tengah 1 */}
                    <motion.path d="M 200 70 C 150 50, 130 110, 160 130 C 190 150, 230 110, 215 80 C 200 50, 170 70, 180 100 C 185 115, 198 110, 192 95" style={{ pathLength: ornamentDraw }} />
                    {/* Lingkaran Sulur Tengah 2 */}
                    <motion.path d="M 320 100 C 270 80, 250 140, 280 160 C 310 180, 350 140, 335 110 C 320 80, 290 100, 300 130 C 305 145, 318 140, 312 125" style={{ pathLength: ornamentDraw }} />
                    {/* Sirip Daun Bergerigi Mengikuti Alur Lebar */}
                    <motion.path d="M 130 50 C 150 30, 175 42, 165 25 C 190 38, 195 62, 175 70" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 250 75 C 270 55, 295 67, 285 50 C 310 63, 315 87, 295 95" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 90 75 C 70 90, 80 110, 62 102 C 75 120, 100 122, 108 105" style={{ pathLength: ornamentDraw }} />
                    {/* 4. AREA UJUNG LUAR (MERAMBAT TIPIS KE KANAN BAWAH) */}
                    <motion.path d="M 450 160 C 500 130, 520 180, 495 210 C 460 240, 420 200, 435 165 C 445 135, 475 145, 468 175" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 520 170 C 550 155, 565 180, 555 195 C 540 205, 525 190, 520 170" style={{ pathLength: ornamentDraw }} />
                    {/* Detail Serat Garis Daun */}
                    <motion.path d="M 160 85 Q 130 65, 115 78" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 280 115 Q 250 95, 235 108" style={{ pathLength: ornamentDraw }} />
                    {/* Aksen Titik Ornamen */}
                    <motion.circle cx="45" cy="35" r="2" fill="currentColor" />
                    <motion.circle cx="185" cy="95" r="2" fill="currentColor" />
                    <motion.circle cx="305" cy="125" r="2" fill="currentColor" />
                    <motion.circle cx="460" cy="170" r="2.5" fill="currentColor" />
                  </svg>
                </div>
                {/* KANAN BAWAH - LEBIH LEBAR & LEBIH PENDEK */}
                <div className="absolute bottom-0 right-0 w-[500px] h-[200px] lg:w-[650px] lg:h-[250px] text-[#030035] opacity-60 rotate-180">
                  <svg
                    viewBox="0 0 600 250"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full drop-shadow-sm"
                  >
                    {/* Batang Utama */}
                    <motion.path d="M 0 0 C 150 40, 300 80, 450 150 T 600 250" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 0 30 C 120 70, 250 90, 380 180" style={{ pathLength: ornamentDraw }} />
                    {/* Kompleksitas Sudut */}
                    <motion.path d="M 70 30 C 40 10, 15 40, 35 60 C 55 80, 85 55, 75 30 C 65 10, 35 20, 42 45 C 46 55, 65 52, 58 38" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 110 40 C 90 15, 55 25, 70 50 C 85 75, 120 50, 100 30 C 85 15, 65 30, 75 45" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 20 10 C 5 5, 0 18, 10 22 C 20 26, 25 12, 20 10" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 40 15 Q 20 30, 12 15" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 50 10 Q 70 25, 55 35" style={{ pathLength: ornamentDraw }} />
                    {/* Area Tengah Memanjang */}
                    <motion.path d="M 200 70 C 150 50, 130 110, 160 130 C 190 150, 230 110, 215 80 C 200 50, 170 70, 180 100 C 185 115, 198 110, 192 95" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 320 100 C 270 80, 250 140, 280 160 C 310 180, 350 140, 335 110 C 320 80, 290 100, 300 130 C 305 145, 318 140, 312 125" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 130 50 C 150 30, 175 42, 165 25 C 190 38, 195 62, 175 70" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 250 75 C 270 55, 295 67, 285 50 C 310 63, 315 87, 295 95" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 90 75 C 70 90, 80 110, 62 102 C 75 120, 100 122, 108 105" style={{ pathLength: ornamentDraw }} />
                    {/* Area Ujung Luar */}
                    <motion.path d="M 450 160 C 500 130, 520 180, 495 210 C 460 240, 420 200, 435 165 C 445 135, 475 145, 468 175" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 520 170 C 550 155, 565 180, 555 195 C 540 205, 525 190, 520 170" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 160 85 Q 130 65, 115 78" style={{ pathLength: ornamentDraw }} />
                    <motion.path d="M 280 115 Q 250 95, 235 108" style={{ pathLength: ornamentDraw }} />
                    <motion.circle cx="45" cy="35" r="2" fill="currentColor" />
                    <motion.circle cx="185" cy="95" r="2" fill="currentColor" />
                    <motion.circle cx="305" cy="125" r="2" fill="currentColor" />
                    <motion.circle cx="460" cy="170" r="2.5" fill="currentColor" />
                  </svg>
                </div>
              </motion.div>
              {/* ── PRODUCTS SEQUENCE ── */}
              <div className="absolute inset-0 pointer-events-none z-30 hidden md:block">
                {products.map((product, idx) => (
                  <ProductSequenceItem
                    key={product.name}
                    product={product}
                    index={idx}
                    total={products.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
              {/* ── PRODUCTS MOBILE SIMPLIFIED ── */}
              <motion.div
                style={{ opacity: title3Opacity }}
                className="absolute inset-0 flex items-center justify-center z-20 md:hidden px-6"
              >
                <div className="text-center max-w-sm">
                  <h2 className="font-display text-3xl leading-tight tracking-tight text-[#030035] mb-4">
                    {TEKS_3_PRODUCTS.title}
                  </h2>
                  <p className="text-base text-[#030035]/70 leading-relaxed">
                    {TEKS_3_PRODUCTS.description}
                  </p>
                </div>
              </motion.div>
              {/* ── SERVICES DESKTOP ── */}
              <div className="hidden lg:block">
                <div className="absolute top-1/2 left-[30vw] lg:left-[25vw] w-full max-w-[400px] md:max-w-[450px] pointer-events-none z-30 -translate-y-1/2">
                  {services.map((service, idx) => {
                    const isOpen = openIndex === idx
                    return (
                      <motion.div
                        key={idx}
                        style={{ y: serviceOffsets[idx], opacity: servicesOp }}
                        className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-auto"
                      >
                        <motion.div style={{ x: fgX, y: fgY }}>
                          <div
                            onClick={() => handlePointClick(idx)}
                            className="relative cursor-pointer group p-4 transition-all duration-500"
                          >
                            <motion.div
                              initial={false}
                              animate={{ opacity: isOpen ? 0.3 : 0 }}
                              transition={{ duration: 0.8 }}
                              className="absolute inset-0 bg-[#ffffff] blur-[50px] rounded-full pointer-events-none"
                            />
                            <h3
                              className={`relative z-10 text-3xl md:text-5xl font-display font-medium tracking-tight leading-none transition-all duration-500 ${
                                isOpen ? 'text-[#030035] opacity-100 scale-105' : 'text-transparent opacity-40 hover:opacity-100'
                              }`}
                              style={{ WebkitTextStroke: isOpen ? '0px' : '1.5px #030035' }}
                            >
                              {service.name}
                            </h3>
                            <p
                              className={`relative z-10 font-sans font-bold text-xs tracking-[0.2em] mt-3 transition-all duration-500 ${
                                isOpen ? 'opacity-100 text-[#030035]' : 'opacity-0 text-[#030035]'
                              }`}
                            >
                              0{service.number} — SECTION
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )
                  })}
                </div>
                <motion.div
                  style={{ opacity: servicesOp }}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20"
                >
                  <GreekEngravingBackground scrollYProgress={scrollYProgress} />
                  {/* WRAPPER DIPISAH AGAR TRANSLATE-Y TAILWIND TIDAK RUSAK OLEH FRAMER MOTION */}
                  <div className="absolute top-1/2 right-[5vw] lg:right-[8vw] w-full max-w-[600px] lg:max-w-[700px] -translate-y-1/2 pointer-events-auto">
                    <motion.div style={{ x: fgX, y: fgY }} className="w-full">
                      <AnimatePresence mode="wait">
                        {openIndex !== null && services[openIndex] && (
                          <motion.div
                            key={openIndex}
                            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="flex flex-col text-left"
                          >
                            <div className="relative w-full p-8 md:p-12 rounded-[1.5rem] border border-[#030035]/10 bg-white/20 backdrop-blur-md shadow-[0_20px_40px_rgba(3,0,53,0.05)] overflow-hidden">
                              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#030035]/30" />
                              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#030035]/30" />
                              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#030035]/30" />
                              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#030035]/30" />
                              <div className="flex items-center gap-4 mb-8 justify-center">
                                <span className="h-[1px] flex-1 bg-[#030035]/20" />
                                <span className="text-[10px] font-bold tracking-[0.3em] text-[#030035] uppercase">
                                  Capítulo 0{openIndex + 1}
                                </span>
                                <span className="h-[1px] flex-1 bg-[#030035]/20" />
                              </div>
                              <div className="w-full flex justify-center mb-8 relative z-10">
                                {openIndex === 0 && <ServiceIconStructuration isOpen={true} />}
                                {openIndex === 1 && <ServiceIconRisk isOpen={true} />}
                                {openIndex === 2 && <ServiceIconSacredGeometry isOpen={true} />}
                              </div>
                              <div className="relative z-10">
                                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#030035] font-serif font-medium">
                                  <span className="float-left text-[3.5rem] md:text-[4rem] leading-[0.8] mr-3 mt-1 text-[#030035] font-display opacity-90 drop-shadow-sm">
                                    {services[openIndex].description.charAt(0)}
                                  </span>
                                  {services[openIndex].description.slice(1)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              {/* ── SERVICES MOBILE SIMPLIFIED ── */}
              <motion.div
                style={{ opacity: servicesOp }}
                className="absolute inset-0 flex items-center justify-center z-30 lg:hidden px-6 py-12"
              >
                <div className="w-full max-w-sm space-y-4">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white/70 backdrop-blur-md rounded-xl p-5 border border-[#030035]/10 shadow-sm"
                    >
                      <p className="text-[10px] font-bold tracking-[0.2em] text-[#030035]/60 uppercase mb-1">
                        0{service.number} — SECTION
                      </p>
                      <h3 className="text-xl font-display font-medium text-[#030035] mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-[#030035]/80 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
              {/* ── RAY DALIO DESKTOP ── */}
              <motion.div
                style={{ opacity: dalioOp }}
                className="absolute inset-0 pointer-events-none z-30 hidden md:block"
              >
                <div className="w-full h-full max-w-[1800px] mx-auto relative px-6 lg:px-24 overflow-hidden">
                  <motion.div
                    style={{ x: bgX, y: bgY }}
                    className="absolute inset-0 z-10 pointer-events-none"
                  >
                    <div className="w-full h-full pointer-events-auto">
                      <RayDalioFilmRoll
                        assets={
                          RAY_DALIO_ASSETS as Array<{ type: 'photo' | 'quote'; src?: string; text?: string }>
                        }
                        filmY={dalioFilmY}
                      />
                    </div>
                  </motion.div>
                  <div className="absolute top-0 right-0 w-full lg:w-[45%] h-32 md:h-48 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6]/90 to-transparent z-40 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-full lg:w-[45%] h-32 md:h-48 bg-gradient-to-t from-[#f3f4f6] via-[#f3f4f6]/90 to-transparent z-40 pointer-events-none" />
                  <motion.div
                    style={{ x: fgX, y: fgY }}
                    className="absolute bottom-12 left-[10vw] lg:left-[11vw] w-full max-w-[850px] md:max-w-[950px] lg:max-w-[1100px] xl:max-w-[1250px] flex flex-col items-start text-left pointer-events-auto z-0"
                  >
                    <motion.div className="w-full max-w-[900px] md:max-w-[1050px] lg:max-w-[1300px] mb-6 z-20 relative -ml-28 lg:-ml-44 xl:-ml-60 pointer-events-none">
                      <DalioEconomicChart drawProgress={dalioDraw} fillOpacity={dalioFillOp} />
                    </motion.div>
                    <motion.div style={{ opacity: dalioOp, borderColor }} className="pointer-events-auto">
                      <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-current/10 bg-current/5 px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.45em] backdrop-blur-xl">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B] shadow-[0_0_18px_rgba(229,153,123,0.8)]" />
                        {TEKS_RAY_DALIO.eyebrow}
                      </div>
                      <svg
                        viewBox="0 0 600 180"
                        className="w-full h-auto max-h-[30vh] overflow-visible drop-shadow-sm mb-4 max-w-[500px]"
                      >
                        <motion.text
                          x="0"
                          y="40"
                          textAnchor="start"
                          dominantBaseline="hanging"
                          className="font-display"
                          fontSize="75"
                          fontWeight="400"
                          fill="none"
                          stroke="#030035"
                          strokeWidth="2.5"
                          style={{ pathLength: dalioDraw, opacity: dalioOp }}
                        >
                          <tspan x="0" dy="0">La Máquina</tspan>
                          <tspan x="0" dy="85">Económica</tspan>
                        </motion.text>
                        <motion.text
                          x="0"
                          y="40"
                          textAnchor="start"
                          dominantBaseline="hanging"
                          className="font-display"
                          fontSize="75"
                          fontWeight="400"
                          fill="#030035"
                          stroke="none"
                          style={{ opacity: dalioFillOp }}
                        >
                          <tspan x="0" dy="0">La Máquina</tspan>
                          <tspan x="0" dy="85">Económica</tspan>
                        </motion.text>
                      </svg>
                      <p className="text-2xl lg:text-3xl leading-[1.3] text-[#030035] font-serif max-w-2xl lg:max-w-4xl mt-2">
                        "{TEKS_RAY_DALIO.description}"
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
              {/* ── RAY DALIO MOBILE SIMPLIFIED ── */}
              <motion.div
                style={{ opacity: dalioOp }}
                className="absolute inset-0 flex items-center justify-center z-30 md:hidden px-6"
              >
                <div className="max-w-sm w-full">
                  <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-[#030035]/10 bg-[#030035]/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.45em] backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B]" />
                    {TEKS_RAY_DALIO.eyebrow}
                  </div>
                  <h2 className="font-display text-3xl leading-tight text-[#030035] mb-4">
                    La Máquina<br />Económica
                  </h2>
                  <p className="text-base text-[#030035]/80 leading-relaxed font-serif">
                    "{TEKS_RAY_DALIO.description}"
                  </p>
                </div>
              </motion.div>
              <QuotePrinciplesScene scrollYProgress={scrollYProgress} />
              {/* ── TIMBANGAN DESKTOP DENGAN PARALLAX + TILT ── */}
              <AnimatePresence>
                {activeBeat === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -40, y: 40 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -40, y: -40 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute bottom-10 left-10 lg:bottom-16 lg:left-16 xl:bottom-24 xl:left-24 w-64 lg:w-[500px] xl:w-[650px] max-h-[60vh] z-10 pointer-events-none hidden md:block"
                    style={{ y: b1Y }}
                  >
                    <motion.div style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }} className="w-full h-full">
                      <motion.svg
                        viewBox="0 0 240 240"
                        className="w-full h-full max-h-[60vh] text-[#030035]"
                        style={{ opacity: b1StrokeOp }}
                      >
                        <defs>
                          <pattern id="hatch-b1" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="4" stroke="#030035" strokeWidth="0.5" opacity="0.4" />
                          </pattern>
                          <pattern id="hatch-bronze" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="6" stroke="#E5997B" strokeWidth="0.5" opacity="0.5" />
                          </pattern>
                        </defs>
                        <g stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <motion.circle cx="120" cy="120" r="110" strokeWidth="0.3" opacity="0.3" strokeDasharray="2 4" style={{ pathLength: b1PathLength }} />
                          <motion.circle cx="120" cy="120" r="90" strokeWidth="0.3" opacity="0.2" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M120 10 L120 230 M10 120 L230 120" strokeWidth="0.3" opacity="0.2" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 60 160 A 80 80 0 0 1 180 160" strokeWidth="0.8" opacity="0.6" strokeDasharray="1 3" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 70 150 A 65 65 0 0 1 170 150" strokeWidth="1.2" opacity="0.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 120 85 L 120 75 M 100 89 L 95 80 M 140 89 L 145 80 M 80 102 L 72 96 M 160 102 L 168 96" strokeWidth="0.8" opacity="0.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 115 40 L 50 190 L 60 190 L 120 50 Z" fill="url(#hatch-b1)" strokeWidth="1" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.path d="M 115 40 L 50 190" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 55 190 L 45 210 L 50 210 Z" strokeWidth="1" fill="currentColor" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.path d="M 125 40 L 190 190 L 180 190 L 120 50 Z" fill="url(#hatch-b1)" strokeWidth="1" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.path d="M 125 40 L 190 190" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 185 190 L 195 210 L 190 210 Z" strokeWidth="1" fill="currentColor" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.circle cx="120" cy="40" r="12" strokeWidth="1.5" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.circle cx="120" cy="40" r="6" strokeWidth="1" fill="url(#hatch-bronze)" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.circle cx="120" cy="40" r="2" fill="#E5997B" stroke="none" style={{ fillOpacity: b1FillOp }} />
                          <motion.path d="M 115 28 L 115 15 L 125 15 L 125 28 Z" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.circle cx="120" cy="10" r="5" strokeWidth="1.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 30 100 L 210 100" stroke="#E5997B" strokeWidth="2.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 120 85 L 115 100 L 125 100 Z" fill="#E5997B" stroke="none" style={{ fillOpacity: b1FillOp }} />
                          <motion.circle cx="120" cy="100" r="3" fill="#030035" stroke="none" style={{ fillOpacity: b1FillOp }} />
                          <motion.circle cx="30" cy="100" r="4" stroke="#E5997B" strokeWidth="2" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.circle cx="210" cy="100" r="4" stroke="#E5997B" strokeWidth="2" fill="#f3f4f6" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.path d="M 30 104 L 10 160 M 30 104 L 30 160 M 30 104 L 50 160" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 5 160 Q 30 190 55 160 Z" fill="url(#hatch-b1)" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.path d="M 5 160 L 55 160" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 210 104 L 190 160 M 210 104 L 210 160 M 210 104 L 230 160" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 185 160 Q 210 190 235 160 Z" fill="url(#hatch-b1)" strokeWidth="1.5" style={{ pathLength: b1PathLength, fillOpacity: b1FillOp }} />
                          <motion.path d="M 185 160 L 235 160" strokeWidth="1" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 15 165 L 45 165 M 20 172 L 40 172" strokeWidth="0.5" opacity="0.5" style={{ pathLength: b1PathLength }} />
                          <motion.path d="M 195 165 L 225 165 M 200 172 L 220 172" strokeWidth="0.5" opacity="0.5" style={{ pathLength: b1PathLength }} />
                        </g>
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* ── MAIN TEXT BEATS DENGAN FOREGROUND PARALLAX ── */}
              <div className="absolute inset-0 flex px-6 sm:px-10 lg:px-16 pointer-events-none z-20">
                <motion.div
                  style={{ x: fgX, y: fgY }}
                  className="mx-auto flex h-full w-full max-w-[1800px] relative"
                >
                  <AnimatePresence>
                    {(activeBeat < 3 || activeBeat === 6) && (
                      <motion.div
                        key={activeBeat}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`absolute inset-0 pointer-events-auto flex w-full flex-col md:max-w-2xl lg:max-w-4xl xl:max-w-5xl ${beats[activeBeat].align}`}
                        style={{
                          opacity: activeBeat === 2 ? title3Opacity : activeBeat === 6 ? finaleOp : 1,
                          y: activeBeat === 6 ? finaleY : 0,
                        }}
                      >
                        {/* ── FINALE ── */}
                        {activeBeat === 6 ? (
                          <div className="flex flex-col items-center justify-end w-full h-full pb-[10vh] pt-[12vh] text-center relative px-4">
                            <div className="absolute inset-0 pointer-events-none items-center justify-center opacity-10 z-0 hidden md:flex">
                              <svg viewBox="0 0 800 800" className="w-[800px] h-[800px] max-w-full animate-spin-slow">
                                <circle cx="400" cy="400" r="350" fill="none" stroke="#030035" strokeWidth="1" strokeDasharray="4 12" />
                                <circle cx="400" cy="400" r="280" fill="none" stroke="#030035" strokeWidth="0.5" />
                                <path d="M 400 50 L 400 750 M 50 400 L 750 400" stroke="#030035" strokeWidth="0.5" strokeDasharray="10 10" />
                                <path d="M 152 152 L 648 648 M 152 648 L 648 152" stroke="#030035" strokeWidth="0.5" strokeDasharray="10 10" />
                              </svg>
                            </div>
                            <div className="absolute -bottom-[12vh] left-1/2 -translate-x-1/2 origin-bottom z-0 pointer-events-none scale-[3.1] md:scale-[4.1] opacity-40 mix-blend-multiply text-[#030035] hidden md:block">
                              <IconMacroSystem />
                            </div>
                            <div className="w-full flex flex-col items-center z-10 mt-auto">
                              <motion.div
                                style={{ borderColor }}
                                className="mb-6 inline-flex items-center gap-3 rounded-full border border-current/10 bg-current/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.45em] backdrop-blur-xl relative"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#E5997B] shadow-[0_0_18px_rgba(229,153,123,0.8)]" />
                                EL FUTURO DE TU PATRIMONIO
                              </motion.div>
                              <h1 className="font-display text-5xl md:text-9xl lg:text-[8.2rem] leading-[0.9] tracking-[-0.04em] text-[#030035] drop-shadow-sm mb-4">
                                Comienza a<br />Construir<br />Tu Legado
                              </h1>
                              <p className="text-xl md:text-2xl leading-relaxed opacity-80 sm:text-lg max-w-2xl text-[#030035] font-serif">
                                La precisión arquitectónica que tu capital merece. Da el siguiente paso hacia el equilibrio financiero definitivo.
                              </p>
                              <div className="mt-8 flex flex-wrap gap-4 w-full justify-center">
                                <Link to="/contact">
                                  <motion.div
                                    style={{ backgroundColor: textColor, color: backgroundColor }}
                                    className="inline-flex items-center justify-center rounded-full px-12 py-4 text-base font-semibold transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(3,0,53,0.15)] pointer-events-auto"
                                  >
                                    Agenda una Llamada
                                  </motion.div>
                                </Link>
                                <Link to="/about">
                                  <motion.div
                                    style={{ borderColor: textColor }}
                                    className="inline-flex items-center justify-center rounded-full border border-[#030035]/20 px-12 py-4 text-base font-semibold backdrop-blur-xl transition-opacity hover:opacity-70 bg-[#030035]/5 text-[#030035] pointer-events-auto"
                                  >
                                    Conoce Dima
                                  </motion.div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {activeBeat !== 5 && (
                              <motion.div
                                style={{ borderColor }}
                                className="mt-2 mb-6 inline-flex items-center gap-3 rounded-full border border-current/10 bg-current/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.45em] backdrop-blur-xl z-10 relative"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-bronze shadow-[0_0_18px_rgba(229,153,123,0.8)]" />
                                {beats[activeBeat]?.eyebrow}
                              </motion.div>
                            )}
                            {/* HERO DESKTOP */}
                            {activeBeat === 0 && (
                              <>
                                <motion.div style={{ y: b0Y }} className="w-full relative mt-2 mb-4 -ml-1 hidden md:block">
                                  <svg
                                    viewBox="0 0 800 720"
                                    className="w-full h-auto max-h-[75vh] max-w-[100%] md:max-w-[900px] object-contain object-left overflow-visible"
                                  >
                                    <motion.text
                                      x="0" y="80" textAnchor="start" className="font-display" fontSize="130" letterSpacing="-0.04em"
                                      fontWeight="400" fill="none" stroke="#030035" strokeWidth="1.2" pathLength="1000"
                                      strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }}
                                    >
                                      <tspan x="0" dy="0">{beats[0]?.title?.split(' ')[0]}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ')[1]}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ').slice(2, 5).join(' ')}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ').slice(5, 7).join(' ')}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ').slice(7).join(' ')}</tspan>
                                    </motion.text>
                                    <motion.text
                                      x="0" y="80" textAnchor="start" className="font-display" fontSize="130" letterSpacing="-0.04em"
                                      fontWeight="400" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}
                                    >
                                      <tspan x="0" dy="0">{beats[0]?.title?.split(' ')[0]}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ')[1]}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ').slice(2, 5).join(' ')}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ').slice(5, 7).join(' ')}</tspan>
                                      <tspan x="0" dy="117">{beats[0]?.title?.split(' ').slice(7).join(' ')}</tspan>
                                    </motion.text>
                                    <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beats[0]?.ctaPrimary?.to || '#'}>
                                      <motion.rect x="0" y="630" width="260" height="60" rx="30" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }} />
                                      <motion.rect x="0" y="630" width="260" height="60" rx="30" fill="#030035" stroke="none" style={{ opacity: heroFillOp }} />
                                      <motion.text x="130" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#030035" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }}>{beats[0]?.ctaPrimary?.label}</motion.text>
                                      <motion.text x="130" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>{beats[0]?.ctaPrimary?.label}</motion.text>
                                    </g>
                                    <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beats[0]?.ctaSecondary?.to || '#'}>
                                      <motion.rect x="280" y="630" width="260" height="60" rx="30" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }} />
                                      <motion.rect x="280" y="630" width="260" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="none" style={{ opacity: heroFillOp }} />
                                      <motion.text x="410" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#030035" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: heroStrokeDashoffset, opacity: heroStrokeOp }}>{beats[0]?.ctaSecondary?.label}</motion.text>
                                      <motion.text x="410" y="663" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>{beats[0]?.ctaSecondary?.label}</motion.text>
                                    </g>
                                  </svg>
                                </motion.div>
                                {/* HERO MOBILE */}
                                <div className="md:hidden w-full relative z-10 px-2">
                                  <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] tracking-[-0.04em] text-[#030035] mb-6">
                                    {beats[0]?.title}
                                  </h1>
                                  <div className="flex flex-wrap gap-3">
                                    <Link to={beats[0]?.ctaPrimary?.to || '#'}>
                                      <span className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold bg-[#030035] text-[#f3f4f6]">
                                        {beats[0]?.ctaPrimary?.label}
                                      </span>
                                    </Link>
                                    <Link to={beats[0]?.ctaSecondary?.to || '#'}>
                                      <span className="inline-flex items-center justify-center rounded-full border border-[#030035]/20 px-8 py-3 text-sm font-semibold text-[#030035] bg-white/10 backdrop-blur-xl">
                                        {beats[0]?.ctaSecondary?.label}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* BEAT 1 DESKTOP */}
                            {activeBeat === 1 && (
                              <>
                                <motion.div style={{ y: b1Y }} className="w-full relative max-w-[750px] xl:max-w-[900px] z-20 flex-shrink-0 hidden md:block">
                                  <svg viewBox="0 0 1000 820" className="w-full h-auto max-w-full max-h-[75vh] overflow-visible drop-shadow-sm">
                                    <motion.text
                                      x="1000" y="100" textAnchor="end" className="font-display" fontSize="160" letterSpacing="-0.03em"
                                      fontWeight="400" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000"
                                      strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}
                                    >
                                      <tspan x="1000" dy="0">No somos un banco.</tspan>
                                      <tspan x="1000" dy="165">Somos <tspan stroke="#E5997B" fontFamily="serif">arquitectos</tspan></tspan>
                                      <tspan x="1000" dy="165">de equilibrio.</tspan>
                                    </motion.text>
                                    <motion.line
                                      x1="600" y1="450" x2="1000" y2="450" stroke="#030035" strokeWidth="2.5" strokeDasharray="1000"
                                      pathLength="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}
                                    />
                                    <motion.text
                                      x="1000" y="530" textAnchor="end" className="font-display" fontSize="95" letterSpacing="-0.02em"
                                      fontWeight="400" fill="none" stroke="#030035" strokeWidth="1" pathLength="1000"
                                      strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}
                                    >
                                      <tspan x="1000" dy="0">Transformamos la deuda</tspan>
                                      <tspan x="1000" dy="110">en productividad.</tspan>
                                    </motion.text>
                                    <motion.text
                                      x="1000" y="100" textAnchor="end" className="font-display" fontSize="160" letterSpacing="-0.03em"
                                      fontWeight="400" fill="#030035" stroke="none" style={{ opacity: b1FillOp }}
                                    >
                                      <tspan x="1000" dy="0">No somos un banco.</tspan>
                                      <tspan x="1000" dy="165">Somos <tspan fill="#E5997B" fontFamily="serif">arquitectos</tspan></tspan>
                                      <tspan x="1000" dy="165">de equilibrio.</tspan>
                                    </motion.text>
                                    <motion.line x1="600" y1="450" x2="1000" y2="450" stroke="#030035" strokeWidth="2.5" style={{ opacity: b1FillOp }} />
                                    <motion.text
                                      x="1000" y="530" textAnchor="end" className="font-display" fontSize="95" letterSpacing="-0.02em"
                                      fontWeight="400" fill="#030035" stroke="none" style={{ opacity: b1FillOp }}
                                    >
                                      <tspan x="1000" dy="0">Transformamos la deuda</tspan>
                                      <tspan x="1000" dy="110">en productividad.</tspan>
                                    </motion.text>
                                    <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beats[1]?.ctaPrimary?.to || '#'}>
                                      <motion.rect x="460" y="720" width="260" height="60" rx="30" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }} />
                                      <motion.rect x="460" y="720" width="260" height="60" rx="30" fill="#030035" stroke="none" style={{ opacity: b1FillOp }} />
                                      <motion.text x="590" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#030035" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}>{beats[1]?.ctaPrimary?.label}</motion.text>
                                      <motion.text x="590" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>{beats[1]?.ctaPrimary?.label}</motion.text>
                                    </g>
                                    <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beats[1]?.ctaSecondary?.to || '#'}>
                                      <motion.rect x="740" y="720" width="260" height="60" rx="30" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }} />
                                      <motion.rect x="740" y="720" width="260" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="none" style={{ opacity: heroFillOp }} />
                                      <motion.text x="870" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#030035" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b1StrokeDashoffset, opacity: b1StrokeOp }}>{beats[1]?.ctaSecondary?.label}</motion.text>
                                      <motion.text x="870" y="753" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>{beats[1]?.ctaSecondary?.label}</motion.text>
                                    </g>
                                  </svg>
                                </motion.div>
                                {/* BEAT 1 MOBILE */}
                                <div className="md:hidden w-full relative z-10 px-2 text-right">
                                  <h1 className="font-display text-3xl sm:text-4xl leading-[1.1] tracking-[-0.03em] text-[#030035] mb-4">
                                    No somos un banco.<br />
                                    Somos <span className="text-[#E5997B] font-serif">arquitectos</span><br />
                                    de equilibrio.
                                  </h1>
                                  <div className="w-24 h-[2px] bg-[#030035] ml-auto mb-4" />
                                  <p className="text-lg text-[#030035]/80 font-display mb-6">
                                    Transformamos la deuda<br />en productividad.
                                  </p>
                                  <div className="flex flex-wrap gap-3 justify-end">
                                    <Link to={beats[1]?.ctaPrimary?.to || '#'}>
                                      <span className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-[#030035] text-[#f3f4f6]">
                                        {beats[1]?.ctaPrimary?.label}
                                      </span>
                                    </Link>
                                    <Link to={beats[1]?.ctaSecondary?.to || '#'}>
                                      <span className="inline-flex items-center justify-center rounded-full border border-[#030035]/20 px-6 py-2.5 text-sm font-semibold text-[#030035] bg-white/10 backdrop-blur-xl">
                                        {beats[1]?.ctaSecondary?.label}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* BEAT 2 DESKTOP */}
                            {activeBeat === 2 && (
                              <>
                                <motion.div style={{ y: b2Y }} className="w-full relative mt-0 mb-0 -ml-1 hidden md:block">
                                  <EngravingDalioEquilibriumChart drawProgress={b2PathLength} strokeOpacity={b2StrokeOp} fillOpacity={b2FillOp} />
                                  <svg viewBox="0 0 1000 360" className="w-full h-auto max-w-[1000px] max-h-[75vh] overflow-visible">
                                    <motion.text x="0" y="160" textAnchor="start" className="font-display" fontSize="115" letterSpacing="-0.04em" fontWeight="400" fill="none" stroke="#030035" strokeWidth="1.2" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }}>
                                      <tspan x="0" dy="0">Product pages that feel</tspan>
                                      <tspan x="0" dy="110">like one continuous motion.</tspan>
                                    </motion.text>
                                    <motion.text x="0" y="160" textAnchor="start" className="font-display" fontSize="115" letterSpacing="-0.04em" fontWeight="400" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>
                                      <tspan x="0" dy="0">Product pages that feel</tspan>
                                      <tspan x="0" dy="110">like one continuous motion.</tspan>
                                    </motion.text>
                                    <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beats[2]?.ctaPrimary?.to || '#'}>
                                      <motion.rect x="0" y="300" width="260" height="60" rx="30" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }} />
                                      <motion.rect x="0" y="300" width="260" height="60" rx="30" fill="#030035" stroke="none" style={{ opacity: heroFillOp }} />
                                      <motion.text x="130" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#030035" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }}>{beats[2]?.ctaPrimary?.label}</motion.text>
                                      <motion.text x="130" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#f3f4f6" stroke="none" style={{ opacity: heroFillOp }}>{beats[2]?.ctaPrimary?.label}</motion.text>
                                    </g>
                                    <g className="cursor-pointer pointer-events-auto" onClick={() => window.location.href = beats[2]?.ctaSecondary?.to || '#'}>
                                      <motion.rect x="280" y="300" width="260" height="60" rx="30" fill="none" stroke="#030035" strokeWidth="1.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }} />
                                      <motion.rect x="280" y="300" width="260" height="60" rx="30" fill="rgba(255,255,255,0.1)" stroke="none" style={{ opacity: heroFillOp }} />
                                      <motion.text x="410" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="none" stroke="#030035" strokeWidth="0.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset: b2StrokeDashoffset, opacity: b2StrokeOp }}>{beats[2]?.ctaSecondary?.label}</motion.text>
                                      <motion.text x="410" y="333" textAnchor="middle" dominantBaseline="middle" className="font-sans" fontSize="18" fontWeight="600" fill="#030035" stroke="none" style={{ opacity: heroFillOp }}>{beats[2]?.ctaSecondary?.label}</motion.text>
                                    </g>
                                  </svg>
                                </motion.div>
                                {/* BEAT 2 MOBILE */}
                                <div className="md:hidden w-full relative z-10 px-2">
                                  <h1 className="font-display text-3xl sm:text-4xl leading-[1.1] tracking-[-0.04em] text-[#030035] mb-4">
                                    {beats[2]?.title}
                                  </h1>
                                  <p className="text-base text-[#030035]/70 mb-6 max-w-xs">
                                    {beats[2]?.description}
                                  </p>
                                  <div className="flex flex-wrap gap-3">
                                    <Link to={beats[2]?.ctaPrimary?.to || '#'}>
                                      <span className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-[#030035] text-[#f3f4f6]">
                                        {beats[2]?.ctaPrimary?.label}
                                      </span>
                                    </Link>
                                    <Link to={beats[2]?.ctaSecondary?.to || '#'}>
                                      <span className="inline-flex items-center justify-center rounded-full border border-[#030035]/20 px-6 py-2.5 text-sm font-semibold text-[#030035] bg-white/10 backdrop-blur-xl">
                                        {beats[2]?.ctaSecondary?.label}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </>
                            )}
                            {activeBeat > 2 && activeBeat !== 5 && (
                              <h1 className="font-display text-4xl leading-[0.92] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                                {beats[activeBeat]?.title}
                              </h1>
                            )}
                            {activeBeat > 2 && activeBeat !== 5 && (
                              <p className="mt-6 text-base leading-relaxed opacity-75 sm:text-lg max-w-md">
                                {beats[activeBeat]?.description}
                              </p>
                            )}
                            {beats[activeBeat]?.ctaPrimary && activeBeat > 2 && activeBeat !== 5 && (
                              <div className={`mt-10 flex flex-wrap gap-4 w-full justify-start`}>
                                <Link to={beats[activeBeat]?.ctaPrimary.to}>
                                  <motion.div
                                    style={{ backgroundColor: textColor, color: backgroundColor }}
                                    className="inline-flex items-center justify-center rounded-full px-10 py-4 text-base md:text-lg font-semibold transition-transform hover:-translate-y-0.5 shadow-lg"
                                  >
                                    {beats[activeBeat]?.ctaPrimary.label}
                                  </motion.div>
                                </Link>
                                <Link to={beats[activeBeat]?.ctaSecondary.to}>
                                  <motion.div
                                    style={{ borderColor: textColor }}
                                    className="inline-flex items-center justify-center rounded-full border px-10 py-4 text-base md:text-lg font-semibold backdrop-blur-xl transition-opacity hover:opacity-70 bg-white/10"
                                  >
                                    {beats[activeBeat]?.ctaSecondary.label}
                                  </motion.div>
                                </Link>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </PageTransition>
  )
}