// src/components/proceso/ProcesoIntro.tsx
import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
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
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0 pl-0 lg:pl-6">
      <span
        className="font-mono text-[10px] lg:text-xs tracking-[0.5em] uppercase"
        style={{ color: ACCENT }}
      >
        {phase.code}
      </span>
      {/* Teks untuk desktop dan mobile disesuaikan ukurannya */}
      <h3
        className="mt-2 lg:mt-4 text-2xl lg:text-[3.5vw] leading-[1.1] font-light tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'normal', color: TEXT_MAIN }}
      >
        {phase.label}
      </h3>
      {/* Deskripsi diperkecil untuk mobile, desktop tetap memanjang */}
      <p
  className="mt-2 lg:mt-5 max-w-4xl text-base lg:text-[1.4rem] leading-relaxed lg:leading-[1.75]"
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
    <motion.div style={{ opacity }} className="h-[2px] w-8 lg:w-12">
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
    <div className="flex items-center gap-2 lg:gap-3 mt-6 lg:mt-12">
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
      {/* ─── MOBILE ONLY: Intro text (Scrolls naturally, not sticky) ─── */}
      <div className="lg:hidden block px-6 pt-20 pb-8 relative z-20">
        <span
          className="font-mono text-[10px] tracking-[0.6em] uppercase mb-4 block"
          style={{ color: ACCENT }}
        >
          Metodología
        </span>
        <h2
          className="text-3xl leading-[1.1] tracking-tight font-normal"
          style={{ fontFamily: "'Playfair Display', serif", color: TEXT_MAIN }}
        >
          Tres fases.{' '}
          <span style={{ color: ACCENT, fontStyle: 'normal' }}>Una arquitectura</span>{' '}
          financiera.
        </h2>
        <p
          className="mt-4 text-base leading-relaxed"
          style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 300, color: TEXT_MUTED }}
        >
          Cada estructura de capital comienza con un diagnóstico profundo y termina en
          escalabilidad sostenida. Así transformamos balances corporativos en instrumentos
          de crecimiento.
        </p>
      </div>

      {/* ─── STICKY AREA ─── */}
      <div className="sticky top-0 h-[100dvh] lg:h-screen w-full overflow-hidden flex flex-col justify-center">
        <div className="relative z-10 w-full h-full lg:h-auto flex flex-col lg:flex-row items-center justify-between gap-0 lg:gap-20 max-w-none mx-auto px-6 md:px-16 xl:px-24 py-8 lg:py-0">

          {/* DESKTOP ONLY: Teks Utama Raksasa Kiri */}
          <div className="hidden lg:flex flex-col justify-center w-full lg:w-[45%] shrink-0">
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

          {/* RIGHT — Area Gambar dan Teks Fase (Muncul di Mobile dan Desktop) */}
          <div className="relative w-full lg:w-[50%] h-full lg:h-[85vh] flex flex-col justify-between lg:justify-between pb-8 lg:pb-0">
            {/* Indikator fase untuk mobile (Desktop menggunakan indikator di sebelah kiri) */}
            <div className="lg:hidden mb-4">
              <PhaseIndicator scrollYProgress={scrollYProgress} count={PHASES.length} />
            </div>

            {/* Container Gambar: Di mobile ambil ~60% tinggi, di desktop ambil sisa flex */}
            <div className="relative w-full h-[50%] md:h-[55%] lg:h-auto lg:flex-1 overflow-hidden rounded-2xl shadow-2xl border border-white/5 cursor-none shrink-0 mb-6 lg:mb-0">
              {PHASES.map((phase, i) => (
                <PhaseImage
                  key={phase.num}
                  phase={phase}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  count={PHASES.length}
                />
              ))}
              <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />
            </div>

            {/* Container Teks Fase: Di mobile ambil sisanya agar tidak bertabrakan */}
            <div className="relative w-full h-[35%] lg:h-auto lg:min-h-[220px] lg:mt-10 shrink-0">
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