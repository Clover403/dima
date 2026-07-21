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
import PageTransition from '../components/layout/PageTransition'
import QuotePrinciplesScene from '../components/NewHome/QuotePrinciplesScene'
import {
  PRODUCTS_DATA,
  SERVICES_DATA,
  TEKS_1_HERO,
  TEKS_2_WHO_WE_ARE,
  TEKS_3_PRODUCTS,
  TEKS_4_SERVICES,
  TEKS_5_FINALE,
} from '../constants/homeNewContent'
import { ProductsSequenceLayer, ProductsForeground } from '../components/NewHome/sections/ProductsSection'
import { ServicesSection } from '../components/NewHome/sections/ServicesSection'
import { RayDalioSection } from '../components/NewHome/sections/RayDalioSection'
import { BackgroundLayer } from '../components/NewHome/sections/BackgroundLayer'
import { TEKS_RAY_DALIO } from '../constants/rayDalioContent'
import { WhoWeAreSection } from '../components/NewHome/sections/WhoWeAreSection'
import { HeroSection } from '../components/NewHome/sections/HeroSection'
import { FinaleSection } from '../components/NewHome/sections/FinaleSection'



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
  const backgroundColor = useTransform(scrollYProgress, timeline, ['#030035', '#030035', '#030035', '#e5997b', '#e5997b', '#030035', '#030035', '#030035'])
  const textColor = useTransform(scrollYProgress, timeline, ['#f3f4f6', '#f3f4f6', '#f3f4f6', '#030035', '#030035', '#f3f4f6', '#f3f4f6', '#f3f4f6'])
  const borderColor = useTransform(scrollYProgress, timeline, ['rgba(243,244,246,0.1)', 'rgba(243,244,246,0.1)', 'rgba(243,244,246,0.1)', 'rgba(3,0,53,0.1)', 'rgba(3,0,53,0.1)', 'rgba(243,244,246,0.1)', 'rgba(243,244,246,0.1)', 'rgba(243,244,246,0.1)'])

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
        <div ref={storyRef} className="relative h-[2000vh] w-full">
          <div className={`sticky top-0 h-screen w-full ${isZoomed ? '' : 'overflow-hidden'}`}>
            <div style={zoomWrapperStyle as any}>
              {/* ── BG PARALLAX LAYER DIKEMBALIKAN TANPA WRAPPER AGAR Z-INDEX TERJAGA ── */}
              {/* Canvas ini merender geometri kecil yang sekarang jumlahnya banyak dan interaktif mental */}
              <motion.canvas
                ref={canvasRef}
                style={{ opacity: canvasOpacity, zIndex: canvasZ, x: bgX, y: bgY }}
                className="absolute inset-0 pointer-events-none"
              />
              <BackgroundLayer
                bgX={bgX}
                bgY={bgY}
                fgX={fgX}
                fgY={fgY}
                insideDiamondOpacity={insideDiamondOpacity}
                insideDiamondScale={insideDiamondScale}
                t4HeaderOp={t4HeaderOp}
                t4HeaderY={t4HeaderY}
                diamondX={diamondX}
                diamondY={diamondY}
                diamondZ={diamondZ}
                diamondScale={diamondScale}
                diamondRotate={diamondRotate}
                fig1Y={fig1Y}
                fig2Y={fig2Y}
                figOpacity={figOpacity}
                midX={midX}
                midY={midY}
                tiltX={tiltX}
                tiltY={tiltY}
                ornamentOpacity={ornamentOpacity}
                ornamentDraw={ornamentDraw}
                activeBeat={activeBeat}
                b1Y={b1Y}
                b1StrokeOp={b1StrokeOp}
                b1PathLength={b1PathLength}
                b1FillOp={b1FillOp}
                handlePointClick={handlePointClick}
                teks4Services={TEKS_4_SERVICES}
              />
              {/* ── PRODUCTS SEQUENCE ── */}
              <ProductsSequenceLayer 
                products={products}
                scrollYProgress={scrollYProgress}
                title3Opacity={title3Opacity}
              />
              {/* ── SERVICES SECTION ── */}
              <ServicesSection
                services={services}
                openIndex={openIndex}
                serviceOffsets={serviceOffsets}
                servicesOp={servicesOp}
                fgX={fgX}
                fgY={fgY}
                handlePointClick={handlePointClick}
                scrollYProgress={scrollYProgress}
              />
              {/* ── RAY DALIO SECTION ── */}
              <RayDalioSection
                dalioOp={dalioOp}
                dalioFilmY={dalioFilmY}
                dalioDraw={dalioDraw}
                dalioFillOp={dalioFillOp}
                bgX={bgX}
                bgY={bgY}
                fgX={fgX}
                fgY={fgY}
                borderColor={borderColor}
              />
              <QuotePrinciplesScene scrollYProgress={scrollYProgress} />
              
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
                          <FinaleSection borderColor={borderColor} textColor={textColor} />
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
                                <HeroSection 
                                  beat={beats[0]} 
                                  b0Y={b0Y} 
                                  heroStrokeDashoffset={heroStrokeDashoffset} 
                                  heroStrokeOp={heroStrokeOp} 
                                  heroFillOp={heroFillOp} 
                                />
                              </>
                            )}
                            {/* BEAT 1 DESKTOP */}
                            {activeBeat === 1 && (
                              <>
                                <WhoWeAreSection 
                                  beat={beats[1]} 
                                  b1Y={b1Y} 
                                  b1StrokeDashoffset={b1StrokeDashoffset} 
                                  b1StrokeOp={b1StrokeOp} 
                                  b1FillOp={b1FillOp} 
                                  heroFillOp={heroFillOp} 
                                />
                              </>
                            )}
                            {/* BEAT 2 DESKTOP */}
                            {activeBeat === 2 && (
                              <>
                                <ProductsForeground 
                                  beat={beats[2]}
                                  b2Y={b2Y}
                                  b2PathLength={b2PathLength}
                                  b2StrokeOp={b2StrokeOp}
                                  b2FillOp={b2FillOp}
                                  heroFillOp={heroFillOp}
                                  b2StrokeDashoffset={b2StrokeDashoffset}
                                />
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
                                    style={{ backgroundColor: '#E5997B', color: '#030035' }}
                                    className="inline-flex items-center justify-center rounded-full px-10 py-4 text-base md:text-lg font-semibold transition-transform hover:-translate-y-0.5 shadow-lg"
                                  >
                                    {beats[activeBeat]?.ctaPrimary.label}
                                  </motion.div>
                                </Link>
                                <Link to={beats[activeBeat]?.ctaSecondary.to}>
                                  <motion.div
                                    style={{ borderColor: textColor }}
                                    className="inline-flex items-center justify-center rounded-full border px-10 py-4 text-base md:text-lg font-semibold backdrop-blur-xl transition-opacity hover:opacity-70 bg-[#E5997B]/10 text-[#E5997B] border-[#E5997B]/20"
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