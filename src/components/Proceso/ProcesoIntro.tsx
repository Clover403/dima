// src/components/proceso/ProcesoIntro.tsx
import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import UnifiedMagmaGrid from '../UnifiedMagmaGrid'

const BG_COLOR = '#030035' // Navy
const ACCENT = '#E5997B'   // Bronze
const TEXT_MAIN = '#F4F4F5' // Off-white

const PHASES = [
  {
    num: '01',
    code: 'FASE 01',
    label: 'Diagnóstico Estructural',
    desc: 'Antes de estructurar cualquier instrumento, entendemos la anatomía financiera de tu empresa. Mapeamos activos, pasivos, flujo libre y genética de valor — con la misma precisión con la que Ray Dalio lee los ciclos macroeconómicos.',
  },
  {
    num: '02',
    code: 'FASE 02',
    label: 'Reingeniería de Riesgos',
    desc: 'No rechazamos. Intervenimos. Si la evaluación detecta solvencia subóptima, activamos el protocolo ITERAR — una transformación activa del balance corporativo hasta que la estructura sea apta para el crédito que mereces.',
  },
  {
    num: '03',
    code: 'FASE 03',
    label: 'Despliegue y Escalabilidad',
    desc: 'El capital no es el final del proceso — es el comienzo. Formalizamos, dispersamos y luego acompañamos la gobernanza financiera para que cada ciclo crediticio sea más eficiente que el anterior.',
  },
]

// --- KOMPONEN BARU (Kiri Bawah): Jangka Arsitek & Astrolabe ---
function StructuralCompassIcon({ scrollYProgress, mouseX, mouseY }: any) {
  const drawProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const clipInset = useTransform(scrollYProgress, [0.1, 0.9], [100, 0])
  const clipPath = useMotionTemplate`inset(${clipInset}% 0 0 0)`

  // Parallax & Tilt
  const x = useTransform(mouseX, [-0.5, 0.5], [20, -20])
  const y = useTransform(mouseY, [-0.5, 0.5], [20, -20])
  const tiltX = useTransform(mouseY, [-0.5, 0.5], [10, -10])
  const tiltY = useTransform(mouseX, [-0.5, 0.5], [-10, 10])

  return (
    <div className="fixed hidden lg:flex left-[4%] bottom-[4%] w-[28vw] max-w-[420px] aspect-square pointer-events-none z-20 items-center justify-center opacity-35 mix-blend-screen" style={{ perspective: 1200 }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <pattern id="compass-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke={ACCENT} strokeWidth="1" opacity="0.6"/>
          </pattern>
        </defs>
      </svg>

      <motion.div style={{ x, y, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }} className="relative w-full h-full">
        {/* Layer 1: Drawline */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible">
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            
            {/* Grid Background Horizontal (Blueprints) */}
            {[60, 80, 100, 120, 140, 160].map(vy => (
              <motion.line key={vy} x1="20" y1={vy} x2="180" y2={vy} stroke={TEXT_MAIN} strokeWidth="0.5" strokeOpacity="0.1" style={{ pathLength: drawProgress }} />
            ))}

            {/* Outer Astrolabe/Protractor rings */}
            <motion.circle cx="100" cy="110" r="75" stroke={ACCENT} strokeWidth="1" strokeOpacity="0.3" style={{ pathLength: drawProgress }} />
            <motion.circle cx="100" cy="110" r="65" stroke={ACCENT} strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray="2 4" style={{ pathLength: drawProgress }} />

            {/* Measurement tick lines on the radius */}
            <motion.g stroke={ACCENT} strokeOpacity="0.4" strokeWidth="1" style={{ pathLength: drawProgress }}>
              {[180, 200, 220, 240, 260, 280, 300, 320, 340, 360].map(angle => {
                const rad = angle * Math.PI / 180;
                return <line key={angle} x1={100 + 65*Math.cos(rad)} y1={110 + 65*Math.sin(rad)} x2={100 + 75*Math.cos(rad)} y2={110 + 75*Math.sin(rad)} />
              })}
            </motion.g>

            {/* Compass Legs (Kaki Jangka) */}
            <motion.path 
              d="M 92 50 L 45 160 L 35 160 L 88 45 Z" 
              stroke={ACCENT} strokeWidth="1.5" strokeOpacity="0.9" style={{ pathLength: drawProgress }} 
            />
            <motion.path 
              d="M 108 50 L 155 160 L 165 160 L 112 45 Z" 
              stroke={ACCENT} strokeWidth="1.5" strokeOpacity="0.9" style={{ pathLength: drawProgress }} 
            />
            
            {/* Compass Hinge (Engsel atas) */}
            <motion.circle cx="100" cy="45" r="8" stroke={ACCENT} strokeWidth="1.5" strokeOpacity="0.9" style={{ pathLength: drawProgress }} />
            <motion.circle cx="100" cy="45" r="3" fill={BG_COLOR} stroke={ACCENT} strokeWidth="1" style={{ pathLength: drawProgress }} />

            {/* Measurement Arc linking the legs */}
            <motion.path d="M 55 140 A 80 80 0 0 0 145 140" stroke={ACCENT} strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 4" style={{ pathLength: drawProgress }} />

            {/* Plumb bob / Pendulum (Bandul di tengah) */}
            <motion.line x1="100" y1="53" x2="100" y2="135" stroke={TEXT_MAIN} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" style={{ pathLength: drawProgress }} />
            <motion.path d="M 100 135 L 108 148 L 100 170 L 92 148 Z" stroke={ACCENT} strokeWidth="1.2" strokeOpacity="0.9" style={{ pathLength: drawProgress }} />
          </g>
        </svg>

        {/* Layer 2: Engraving Hatching dengan Wipe ClipPath */}
        <motion.svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible" style={{ clipPath }}>
          <path d="M 92 50 L 45 160 L 35 160 L 88 45 Z" fill="url(#compass-hatch)" />
          <path d="M 108 50 L 155 160 L 165 160 L 112 45 Z" fill="url(#compass-hatch)" />
          <path d="M 100 135 L 108 148 L 100 170 L 92 148 Z" fill="url(#compass-hatch)" />
          <circle cx="100" cy="45" r="8" fill={BG_COLOR} />
        </motion.svg>
      </motion.div>
    </div>
  )
}

// --- KOMPONEN Kanan Bawah (Pohon Baobab) ---
function BaobabIcon({ scrollYProgress, mouseX, mouseY }: any) {
  const drawProgress = useTransform(scrollYProgress, [0, 0.8], [0, 1])
  const clipInset = useTransform(scrollYProgress, [0.1, 0.9], [100, 0])
  const clipPath = useMotionTemplate`inset(${clipInset}% 0 0 0)`

  // Parallax & Tilt
  const x = useTransform(mouseX, [-0.5, 0.5], [-20, 20])
  const y = useTransform(mouseY, [-0.5, 0.5], [-20, 20])
  const tiltX = useTransform(mouseY, [-0.5, 0.5], [10, -10])
  const tiltY = useTransform(mouseX, [-0.5, 0.5], [-10, 10])

  return (
    <div className="fixed hidden lg:flex right-[4%] bottom-[4%] w-[28vw] max-w-[420px] aspect-square pointer-events-none z-20 items-center justify-center opacity-35 mix-blend-screen" style={{ perspective: 1200 }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <pattern id="baobab-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(40)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={ACCENT} strokeWidth="0.8" opacity="0.5"/>
            <line x1="0" y1="0" x2="6" y2="0" stroke={ACCENT} strokeWidth="0.8" opacity="0.5"/>
          </pattern>
        </defs>
      </svg>

      <motion.div style={{ x, y, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }} className="relative w-full h-full">
        {/* Layer 1: Drawline */}
        <svg viewBox="0 0 200 220" className="absolute inset-0 w-full h-full overflow-visible">
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            
            <motion.g stroke={TEXT_MAIN} strokeWidth="0.5" strokeOpacity="0.15" style={{ pathLength: drawProgress }}>
              <path d="M 68 200 C 60 180 55 150 62 110 L 72 80 L 128 80 L 138 110 C 145 150 140 180 132 200 Z" />
              <path d="M 75 195 C 55 200 30 205 15 215" />
              <path d="M 85 198 C 72 205 60 210 48 218" />
              <path d="M 115 198 C 128 205 140 210 152 218" />
              <path d="M 125 195 C 145 200 170 205 185 215" />
              <path d="M 86 80 C 75 65 55 50 38 42" />
              <path d="M 114 80 C 125 65 145 50 162 42" />
              <path d="M 55 56 C 45 44 32 35 22 28" />
              <path d="M 62 62 C 52 55 42 52 28 54" />
              <path d="M 145 56 C 155 44 168 35 178 28" />
              <path d="M 138 62 C 148 55 158 52 172 54" />
            </motion.g>

            {/* Trunk Outline */}
            <motion.path 
              d="M 68 200 C 60 180 55 150 62 110 L 72 80 L 128 80 L 138 110 C 145 150 140 180 132 200 Z" 
              stroke={ACCENT} strokeWidth="1.5" style={{ pathLength: drawProgress }} 
            />

            {/* Roots */}
            <motion.g stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1" style={{ pathLength: drawProgress }}>
              <path d="M 75 195 C 55 200 30 205 15 215" />
              <path d="M 85 198 C 72 205 60 210 48 218" />
              <path d="M 115 198 C 128 205 140 210 152 218" />
              <path d="M 125 195 C 145 200 170 205 185 215" />
            </motion.g>

            {/* Branches */}
            <motion.g stroke={ACCENT} strokeOpacity="0.8" strokeWidth="1.2" style={{ pathLength: drawProgress }}>
              <path d="M 86 80 C 75 65 55 50 38 42" />
              <path d="M 114 80 C 125 65 145 50 162 42" />
              <path d="M 55 56 C 45 44 32 35 22 28" />
              <path d="M 62 62 C 52 55 42 52 28 54" />
              <path d="M 145 56 C 155 44 168 35 178 28" />
              <path d="M 138 62 C 148 55 158 52 172 54" />
            </motion.g>

            {/* Dots on branch ends */}
            <motion.g fill={BG_COLOR} stroke={ACCENT} strokeWidth="1" style={{ opacity: drawProgress }}>
              <circle cx="38" cy="42" r="2.5" />
              <circle cx="162" cy="42" r="2.5" />
              <circle cx="22" cy="28" r="2.5" />
              <circle cx="28" cy="54" r="2.5" />
              <circle cx="178" cy="28" r="2.5" />
              <circle cx="172" cy="54" r="2.5" />
            </motion.g>
          </g>
        </svg>

        {/* Layer 2: Engraving Hatching dengan Wipe ClipPath */}
        <motion.svg viewBox="0 0 200 220" className="absolute inset-0 w-full h-full overflow-visible" style={{ clipPath }}>
          <path d="M 68 200 C 60 180 55 150 62 110 L 72 80 L 128 80 L 138 110 C 145 150 140 180 132 200 Z" fill="url(#baobab-hatch)" />
        </motion.svg>
      </motion.div>
    </div>
  )
}

// --- Komponen Canvas Bintang ---
function StarCanvas({ scrollYProgress }: { scrollYProgress: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const opacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let animationFrameId: number; let particles: any[] = []

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles() }
    const initParticles = () => {
      particles = []
      const numParticles = Math.floor((canvas.width * canvas.height) / 9000)
      for (let i = 0; i < numParticles; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, radius: Math.random() * 1.6 + 0.4 })
      }
    }
    const animateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(244, 244, 245, 0.42)'; ctx.fill()
      })
      
      for(let i=0; i<particles.length; i++) {
        for(let j=i+1; j<particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if(dist < 115) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(244, 244, 245, ${0.16 - dist/900})`
            ctx.lineWidth = 0.7
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateCanvas)
    }
    
    window.addEventListener('resize', resize); resize(); animateCanvas()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId) }
  }, [])

  return (
    <motion.canvas ref={canvasRef} style={{ opacity }} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen" />
  )
}

// --- Animasi Teks Muncul Per Kata ---
function WordRevealBody({ text, scrollYProgress, typeStart, typeEnd }: { text: string, scrollYProgress: any, typeStart: number, typeEnd: number }) {
  const words = text.split(' ')
  return (
    <p 
      className="text-[1.2rem] md:text-[1.5vw] max-w-2xl mx-auto leading-[1.8] mt-6 tracking-wide text-center"
      style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300 }}
    >
      {words.map((word, j) => {
        const start = typeStart + (j / words.length) * (typeEnd - typeStart) * 0.7
        const end = start + ((typeEnd - typeStart) * 0.3)
        const wordOp = useTransform(scrollYProgress, [start, end], [0, 1])
        const wordY = useTransform(scrollYProgress, [start, end], [15, 0])
        return (
          <motion.span 
            style={{ opacity: wordOp, y: wordY, display: 'inline-block', marginRight: '0.3em', color: TEXT_MAIN }} 
            key={j}
          >
            {word}
          </motion.span>
        )
      })}
    </p>
  )
}

// --- Ilustrasi Drawline Utama (Ikon Kecil di Tengah Atas Teks) ---
function PhaseIllustration({ phase, drawProgress }: { phase: string, drawProgress: any }) {
  return (
    <div className="relative flex items-center justify-center w-40 h-40 md:w-56 md:h-56 mb-6">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(229,153,123,0.25)]">
        <g stroke={ACCENT} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {phase === '01' && (
            <>
              {/* Abstrak Jaringan/Struktur */}
              <motion.circle cx="50" cy="50" r="42" strokeOpacity="0.2" style={{ pathLength: drawProgress }} />
              <motion.path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" strokeOpacity="0.3" strokeDasharray="2 4" style={{ pathLength: drawProgress }} />
              <motion.polygon points="50,18 82,50 50,82 18,50" style={{ pathLength: drawProgress }} />
              <motion.circle cx="50" cy="18" r="3" fill={BG_COLOR} style={{ pathLength: drawProgress }} />
              <motion.circle cx="82" cy="50" r="3" fill={BG_COLOR} style={{ pathLength: drawProgress }} />
              <motion.circle cx="50" cy="82" r="3" fill={BG_COLOR} style={{ pathLength: drawProgress }} />
              <motion.circle cx="18" cy="50" r="3" fill={BG_COLOR} style={{ pathLength: drawProgress }} />
              <motion.circle cx="50" cy="50" r="7" fill={BG_COLOR} style={{ pathLength: drawProgress }} />
              <motion.circle cx="50" cy="50" r="2" fill={TEXT_MAIN} style={{ pathLength: drawProgress }} stroke="none" />
            </>
          )}
          {phase === '02' && (
            <>
              {/* Abstrak Kubus/Rekayasa */}
              <motion.polygon points="50,12 85,32 85,68 50,88 15,68 15,32" style={{ pathLength: drawProgress }} />
              <motion.path d="M15 32 L50 52 L85 32 M50 52 L50 88" style={{ pathLength: drawProgress }} />
              <motion.path d="M50 24 L68 35 L68 54 L50 65 L32 54 L32 35 Z" stroke={TEXT_MAIN} strokeWidth="1" style={{ pathLength: drawProgress }} />
              <motion.circle cx="50" cy="52" r="4" fill={BG_COLOR} style={{ pathLength: drawProgress }} />
            </>
          )}
          {phase === '03' && (
            <>
              {/* Abstrak Roket/Eskalasi */}
              <motion.path d="M50 10 L82 85 L50 70 L18 85 Z" style={{ pathLength: drawProgress }} />
              <motion.path d="M50 10 L50 70" strokeOpacity="0.8" style={{ pathLength: drawProgress }} />
              <motion.path d="M35 45 L15 65 M65 45 L85 65" strokeOpacity="0.4" style={{ pathLength: drawProgress }} />
              <motion.path d="M50 82 L50 100 M35 88 L35 100 M65 88 L65 100" stroke={TEXT_MAIN} strokeOpacity="0.6" style={{ pathLength: drawProgress }} />
            </>
          )}
        </g>
      </svg>
    </div>
  )
}

function ComplexEngraving({ scrollYProgress, mouseX, mouseY }: any) {
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -120])
  const drawLine = useTransform(scrollYProgress, [0, 0.8], [0, 1])

  // Parallax Layer Belakang (Bergerak berlawanan)
  const bgX = useTransform(mouseX, [-0.5, 0.5], [30, -30])
  const bgY = useTransform(mouseY, [-0.5, 0.5], [30, -30])

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-30">
      <motion.div 
        className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px]"
        style={{ rotate: rotate1, x: bgX, y: bgY }}
      >
        <svg viewBox="0 0 1000 1000" fill="none" className="w-full h-full opacity-60">
          <g stroke={ACCENT} strokeWidth="1" fill="none">
            <motion.circle cx="500" cy="500" r="400" strokeDasharray="4 12" style={{ pathLength: drawLine }} />
            <motion.circle cx="500" cy="500" r="380" strokeOpacity="0.3" style={{ pathLength: drawLine }} />
            <motion.circle cx="500" cy="500" r="300" strokeDasharray="1 6" strokeOpacity="0.8" style={{ pathLength: drawLine }} />
            <motion.circle cx="500" cy="500" r="150" stroke={TEXT_MAIN} strokeDasharray="10 20" style={{ pathLength: drawLine }} />
            <motion.path d="M500 100 L846.4 300 L846.4 700 L500 900 L153.6 700 L153.6 300 Z" strokeOpacity="0.2" style={{ pathLength: drawLine }} />
            <motion.path d="M500 200 L759.8 350 L759.8 650 L500 800 L240.2 650 L240.2 350 Z" strokeOpacity="0.4" style={{ pathLength: drawLine }} />
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.line 
                key={`line-${i}`} 
                x1="500" y1="100" x2="500" y2="900" 
                transform={`rotate(${i * 15} 500 500)`} 
                strokeOpacity="0.15" 
                style={{ pathLength: drawLine }} 
              />
            ))}
          </g>
        </svg>
      </motion.div>

      <motion.div 
        className="absolute -top-[10%] -left-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px]"
        style={{ rotate: rotate2, x: bgX, y: bgY }}
      >
        <svg viewBox="0 0 600 600" fill="none" className="w-full h-full opacity-40">
          <g stroke={TEXT_MAIN} strokeWidth="0.5" fill="none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.circle 
                key={`c-${i}`} cx="300" cy="300" r={50 + i * 30} 
                strokeDasharray={i % 2 === 0 ? "2 4" : "none"}
                style={{ pathLength: drawLine }} 
                opacity={1 - i * 0.1} 
              />
            ))}
          </g>
        </svg>
      </motion.div>
    </div>
  )
}

function ScrollBoundSlide({ p, index, scrollYProgress, mouseX, mouseY }: any) {
  const start = index * 0.333; const end = (index + 1) * 0.333
  const fadeIn = start + 0.05; 
  const fadeOut = index === 2 ? 1.0 : end - 0.02 

  const strokeDrawEnd = start + 0.18
  const fillStart = start + 0.15
  const fillEnd = start + 0.22
  const strokeFadeStart = start + 0.20
  const strokeFadeEnd = start + 0.25

  const typeStart = start + 0.12; const typeEnd = start + 0.30

  // Scroll Animations
  const opacity = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0.95, 1, 1, 1.05])
  const yOffset = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [40, 0, 0, -40])

  const strokeDashoffset = useTransform(scrollYProgress, [start, strokeDrawEnd], [1000, 0])
  const iconDrawProgress = useTransform(scrollYProgress, [start, fillStart], [0, 1])
  const fillOpacity = useTransform(scrollYProgress, [fillStart, fillEnd], [0, 1])
  const strokeOpacity = useTransform(scrollYProgress, [strokeFadeStart, strokeFadeEnd], [1, 0])

  // Parallax Layers
  const numX = useTransform(mouseX, [-0.5, 0.5], [40, -40])
  const numY = useTransform(mouseY, [-0.5, 0.5], [40, -40])

  const contentX = useTransform(mouseX, [-0.5, 0.5], [-20, 20])
  const contentY = useTransform(mouseY, [-0.5, 0.5], [-20, 20])

  const iconX = useTransform(mouseX, [-0.5, 0.5], [-40, 40])
  const iconY = useTransform(mouseY, [-0.5, 0.5], [-40, 40])
  
  const tiltX = useTransform(mouseY, [-0.5, 0.5], [15, -15])
  const tiltY = useTransform(mouseX, [-0.5, 0.5], [-15, 15])

  return (
    <motion.div style={{ opacity, y: yOffset, scale, perspective: 1200 }} className="absolute inset-0 flex flex-col justify-center items-center w-full">
      
      {/* Angka Background Raksasa (Parallax Mundur) */}
      <motion.div style={{ x: numX, y: numY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0 w-full h-full flex items-center justify-center overflow-hidden opacity-[0.05]">
        <svg viewBox="0 0 1000 600" className="w-full h-full max-w-[1200px] overflow-visible">
          <motion.text
            x="500" y="450"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="450"
            fontWeight="100"
            fill="none"
            stroke={ACCENT}
            strokeWidth="3"
            pathLength="1000"
            strokeDasharray="1000"
            style={{ strokeDashoffset }}
          >
            {p.num}
          </motion.text>
        </svg>
      </motion.div>
      
      <motion.div style={{ x: contentX, y: contentY }} className="relative z-10 flex flex-col items-center px-4 w-full">
        {/* Ilustrasi Utama (Maju ke Depan + 3D Tilt) */}
        <motion.div style={{ x: iconX, y: iconY, rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}>
          <PhaseIllustration phase={p.num} drawProgress={iconDrawProgress} />
        </motion.div>
        
        <span className="font-mono text-[10px] md:text-[12px] tracking-[0.5em] uppercase border-b border-[#E5997B]/30 pb-3 mb-2 mt-4" style={{ color: TEXT_MAIN }}>
          {p.code}
        </span>
        
        {/* Headline Judul Utama */}
        <div className="w-full max-w-5xl h-24 md:h-32 lg:h-40 flex items-center justify-center overflow-visible drop-shadow-lg mb-2 mt-2">
          <svg viewBox="0 0 1400 200" className="w-full h-full overflow-visible">
            <g>
              <motion.text
                x="700" y="140"
                textAnchor="middle"
                fontFamily="'Playfair Display', serif"
                fontSize="120"
                fontStyle="italic"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                pathLength="1000"
                strokeDasharray="1000"
                style={{ strokeDashoffset, opacity: strokeOpacity }}
              >
                {p.label}
              </motion.text>
              <motion.text
                x="700" y="140"
                textAnchor="middle"
                fontFamily="'Playfair Display', serif"
                fontSize="120"
                fontStyle="italic"
                fill={ACCENT}
                stroke="none"
                style={{ opacity: fillOpacity }}
              >
                {p.label}
              </motion.text>
            </g>
          </svg>
        </div>

        <div className="w-full max-w-4xl">
          <WordRevealBody text={p.desc} scrollYProgress={scrollYProgress} typeStart={typeStart} typeEnd={typeEnd} />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProcesoIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const gridFadeOut = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  // ── HOOKS MOUSE PARALLAX GLOBAL ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 25, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 25, mass: 0.5 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return
    const x = (e.clientX / window.innerWidth) - 0.5
    const y = (e.clientY / window.innerHeight) - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  // Grid Parallax
  const gridX = useTransform(smoothMouseX, [-0.5, 0.5], [10, -10])
  const gridY = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10])

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative w-full h-[400vh]" style={{ backgroundColor: BG_COLOR }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        <StarCanvas scrollYProgress={scrollYProgress} />

        {/* Grid Layer */}
        <motion.div 
          className="absolute inset-[-5%] pointer-events-none z-0"
          style={{ opacity: gridFadeOut, x: gridX, y: gridY }}
        >
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(229,153,123,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,153,123,1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <UnifiedMagmaGrid cellSize={60} color="229,153,123" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </motion.div>

        {/* Engraving Layer (Sudah terhubung ke mouseX & mouseY) */}
        <ComplexEngraving scrollYProgress={scrollYProgress} mouseX={smoothMouseX} mouseY={smoothMouseY} />

        {/* Dekorasi Pojok (Sudah terhubung ke mouseX & mouseY) */}
        <StructuralCompassIcon scrollYProgress={scrollYProgress} mouseX={smoothMouseX} mouseY={smoothMouseY} />
        <BaobabIcon scrollYProgress={scrollYProgress} mouseX={smoothMouseX} mouseY={smoothMouseY} />

        <div className="absolute top-10 left-0 w-full flex justify-center z-30 pointer-events-none mix-blend-screen">
          <h1 className="text-sm md:text-lg tracking-[0.3em] opacity-60 font-light uppercase border-x border-[#E5997B]/30 px-6 py-1" style={{ color: TEXT_MAIN }}>
            Metodología <span style={{ color: ACCENT, fontStyle: 'italic', textTransform: 'none', fontFamily: "'Playfair Display', serif" }}>Dima</span>
          </h1>
        </div>

        {/* Slides Content (Sudah terhubung ke mouseX & mouseY) */}
        <div className="relative z-20 w-full h-[80vh] flex items-center">
          {PHASES.map((p, i) => (
            <ScrollBoundSlide key={p.num} p={p} index={i} scrollYProgress={scrollYProgress} mouseX={smoothMouseX} mouseY={smoothMouseY} />
          ))}
        </div>

        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center gap-4 z-30">
           <motion.div 
             className="w-[1px] h-16 opacity-60 origin-top" 
             style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT})` }}
             animate={{ scaleY: [0, 1, 0], translateY: [0, 10, 20] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           />
           <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40" style={{ color: TEXT_MAIN }}>Scroll</span>
        </div>
      </div>
    </section>
  )
}