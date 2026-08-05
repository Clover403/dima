// src/components/proceso/ProcesoIntro.tsx
import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
// Pastikan path import ini sesuai dengan struktur foldermu
import HoverTrailOverlay from '../HoverTrailOverlay'

const BG_COLOR = '#030035'   // Navy
const ACCENT = '#E5997B'     // Bronze
const TEXT_MAIN = '#F4F4F5'  // Off-white
const TEXT_MUTED = 'rgba(244, 244, 245, 0.6)'

const PHASES = [
  {
    num: '01',
    code: 'FASE 01',
    label: 'Diagnóstico Estructural',
    desc: 'Antes de estructurar cualquier instrumento, entendemos la anatomía financiera de tu empresa. Mapeamos activos, pasivos, flujo libre y genética de valor — con la misma precisión con la que Ray Dalio lee los ciclos macroeconómicos.',
    image: '/illustration-compressed/process/ukuran.webp',
  },
  {
    num: '02',
    code: 'FASE 02',
    label: 'Reingeniería de Riesgos',
    desc: 'No rechazamos. Intervenimos. Si la evaluación detecta solvencia subóptima, activamos el protocolo ITERAR — una transformación activa del balance corporativo hasta que la estructura sea apta para el crédito que mereces.',
    image: '/illustration-compressed/process/gear-tingkat.webp',
  },
  {
    num: '03',
    code: 'FASE 03',
    label: 'Despliegue y Escalabilidad',
    desc: 'El capital no es el final del proceso — es el comienzo. Formalizamos, dispersamos y luego acompañamos la gobernanza financiera para que cada ciclo crediticio sea más eficiente que el anterior.',
    image: '/illustration-compressed/process/tiang.webp',
  },
]

// ─── Single image layer ───
function PhaseImage({
  phase,
  index,
  scrollYProgress,
  count,
}: {
  phase: (typeof PHASES)[number]
  index: number
  scrollYProgress: MotionValue<number>
  count: number
}) {
  const segment = 1 / count
  const start = index * segment
  const end = start + segment
  
  // Membuat interval crossfade perlahan yang saling bertumpuk (overlap)
  // agar gambar tidak pernah menghilang menjadi background kosong / berkedip
  const fadeInStart = Math.max(0, start - segment / 2)
  const fadeInEnd = start + segment / 4
  const fadeOutStart = end - segment / 4
  const fadeOutEnd = Math.min(1, end + segment / 2)

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [index === 0 ? 1 : 0, 1, 1, index === count - 1 ? 1 : 0]
  )
  const scale = useTransform(scrollYProgress, [start, end], [1.08, 1])

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <img
        src={phase.image}
        alt={phase.label}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </motion.div>
  )
}

// ─── Title + description block ───
function PhaseText({
  phase,
  index,
  scrollYProgress,
  count,
}: {
  phase: (typeof PHASES)[number]
  index: number
  scrollYProgress: MotionValue<number>
  count: number
}) {
  const segment = 1 / count
  const start = index * segment
  const end = start + segment
  const fadeInEnd = start + segment * 0.25
  const fadeOutStart = end - segment * 0.25

  const opacity = useTransform(
    scrollYProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0]
  )
  const y = useTransform(
    scrollYProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [40, 0, 0, -40]
  )

  return (
  <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0 pl-2 md:pl-6">
      <span
        className="font-mono text-xs tracking-[0.5em] uppercase"
        style={{ color: ACCENT }}
      >
        {phase.code}
      </span>
      {/* Diperbesar menjadi text-4xl hingga 3.5vw */}
     <h3
        className="mt-4 text-4xl md:text-[3.5vw] leading-[1.1] font-light tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'normal', color: TEXT_MAIN }}
      >
        {phase.label}
      </h3>
      {/* Batas lebar max-w-2xl diubah ke max-w-3xl agar teks deskripsi memanjang lebih ke kanan */}
      <p
        className="mt-5 max-w-4xl text-[1.25rem] md:text-[1.4rem] leading-[1.75]"
        style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300, color: TEXT_MUTED }}
      >
        {phase.desc}
      </p>
    </motion.div>
  )
}

function IndicatorDot({
  index,
  scrollYProgress,
  count,
}: {
  index: number
  scrollYProgress: MotionValue<number>
  count: number
}) {
  const segment = 1 / count
  const start = index * segment
  const end = start + segment

  const opacity = useTransform(
    scrollYProgress,
    [start, start + segment * 0.15, end - segment * 0.15, end],
    [0.2, 1, 1, 0.2]
  )

  return (
    <motion.div style={{ opacity }} className="h-[2px] w-12">
      <div className="w-full h-full" style={{ backgroundColor: ACCENT }} />
    </motion.div>
  )
}

function PhaseIndicator({
  scrollYProgress,
  count,
}: {
  scrollYProgress: MotionValue<number>
  count: number
}) {
  return (
    <div className="flex items-center gap-3 mt-12">
      {Array.from({ length: count }).map((_, i) => (
        <IndicatorDot key={i} index={i} scrollYProgress={scrollYProgress} count={count} />
      ))}
    </div>
  )
}

export default function ProcesoIntro() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: BG_COLOR, height: `${PHASES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative z-10 h-full w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 max-w-none mx-auto px-8 md:px-16 xl:px-24">

          {/* LEFT — Teks Utama Dibuat Raksasa (Giant Typography) */}
          <div className="flex flex-col justify-center w-full lg:w-[45%] shrink-0 py-6 lg:py-0">
            <span
              className="font-mono text-xs tracking-[0.6em] uppercase mb-6 block"
              style={{ color: ACCENT }}
            >
              Metodología
            </span>
            <h2
              className="text-[2.8rem] sm:text-[3.8rem] md:text-[4.5vw] lg:text-[4.8vw] leading-[1.05] tracking-tight font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: TEXT_MAIN }}
            >
              Tres fases.{' '}
              <span style={{ color: ACCENT, fontStyle: 'normal' }}>Una arquitectura</span>{' '}
              financiera.
            </h2>
            {/* Ukuran deskripsi utama kiri diperbesar agar lebih terbaca (text-[1.35rem] md:text-[1.5rem]) */}
            <p
              className="mt-8 max-w-xl text-[1.35rem] md:text-[1.5rem] leading-[1.8]"
              style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300, color: TEXT_MUTED }}
            >
              Cada estructura de capital comienza con un diagnóstico profundo y termina en
              escalabilidad sostenida. Así transformamos balances corporativos en instrumentos
              de crecimiento.
            </p>

            <PhaseIndicator scrollYProgress={scrollYProgress} count={PHASES.length} />
          </div>

          {/* RIGHT — Area Immersive Full Layar Kesamping */}
          <div className="relative w-full lg:w-[50%] flex-1 py-6 lg:py-0 h-[75vh] lg:h-[85vh] flex flex-col justify-between">
            {/* Container Gambar yang diberi efek HoverTrailOverlay */}
            <div className="relative w-full flex-1 overflow-hidden rounded-2xl shadow-2xl border border-white/5 cursor-none">
              {PHASES.map((phase, i) => (
                <PhaseImage
                  key={phase.num}
                  phase={phase}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  count={PHASES.length}
                />
              ))}
              
              {/* Efek Rasi Bintang ditambahkan di sini agar terisolasi di dalam gambar */}
              <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />
            </div>

            {/* Area teks kanan ditinggikan min-h nya menyesuaikan font deskripsi yang membesar */}
            <div className="relative mt-10 min-h-[280px] md:min-h-[220px]">
              {PHASES.map((phase, i) => (
                <PhaseText
                  key={phase.num}
                  phase={phase}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  count={PHASES.length}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}