// ModeloHero.tsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
import InteractiveConstellationText from '../InteractiveConstellationText'
import type { TextLine } from '../InteractiveConstellationText'

export default function ModeloHero() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const lines: TextLine[] = [
    { text: 'Equilibrio', y: 100 },
    { text: 'como',       y: 215 },
    { text: 'principio',  y: 330, fontStyle: 'italic', color: '#E5997B' },
    { text: 'rector',     y: 435, fontStyle: 'italic', color: '#E5997B' },
  ]

  return (
    <section
  ref={sectionRef}
  className="relative h-screen flex items-center justify-center overflow-hidden"
  style={{ isolation: 'isolate' }}  // tambah ini
>
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/foto/illust-growth.jpg)' }}>
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Decorative geometric */}
      <div className="geo-deco absolute inset-0 pointer-events-none select-none overflow-hidden z-5">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04]"
          viewBox="0 0 800 800" fill="none">
          <path d="M400 40L760 400L400 760L40 400Z" stroke="#E5997B" strokeWidth="1" />
          <path d="M400 160L640 400L400 640L160 400Z" stroke="#E5997B" strokeWidth="0.5" />
          <line x1="400" y1="40" x2="400" y2="760" stroke="#E5997B" strokeWidth="0.3" />
          <line x1="40" y1="400" x2="760" y2="400" stroke="#E5997B" strokeWidth="0.3" />
          <path d="M200 200L320 200L320 260L260 340L200 260Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M480 200L600 200L600 260L540 340L480 260Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M200 600L320 600L320 540L260 460L200 540Z" stroke="#E5997B" strokeWidth="0.5" />
          <path d="M480 600L600 600L600 540L540 460L480 540Z" stroke="#E5997B" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="hero-inner relative z-20 text-center max-w-4xl mx-auto px-6 section-padding">
        <motion.p
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-bronze font-body text-sm tracking-[0.3em] uppercase mb-8"
        >
          Modelo Crediticio
        </motion.p>

        {/* Gunakan komponen interaktif, animasi stroke aktif */}
        <div className="mb-8 max-w-3xl mx-auto">
          <InteractiveConstellationText
            lines={lines}
            viewBox="0 0 800 440"
            fontFamily="'Playfair Display', serif"
            defaultFontSize={130}
            enableScramble={true}
            enableRGBSplit={true}
            enableStrokeGlow={true}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-white/60 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-8"
        >
          Nuestro modelo crediticio se fundamenta en los principios macroeconómicos
          de Ray Dalio, adaptados al contexto financiero mexicano. Estructuramos
          cada producto para mantener el equilibrio entre productividad y deuda.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-lightgray/30 text-xs tracking-widest uppercase font-body">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-bronze/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}