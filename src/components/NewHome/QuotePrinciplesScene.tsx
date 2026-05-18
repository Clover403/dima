import { useEffect, useMemo, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

const QUOTES_DATA = [
  {
    text: 'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.',
    author: 'Ray Dalio',
    labelLeft: 'THE ARC OF PRODUCTIVITY',
    labelRight: 'CAUSALIDAD PRODUCTIVA',
  },
  {
    text: 'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tiempo perderás competitividad.',
    author: 'Ray Dalio',
    labelLeft: 'THE ARC OF PRODUCTIVITY',
    labelRight: 'CAUSALIDAD PRODUCTIVA',
  },
  {
    text: 'Haz todo lo posible por aumentar tu productividad, porque en el largo plazo es lo que más importa.',
    author: 'Ray Dalio',
    labelLeft: 'THE ARC OF PRODUCTIVITY',
    labelRight: 'CAUSALIDAD PRODUCTIVA',
  },
]

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

function splitQuoteLines(text: string, maxChars = 24) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  })

  if (current) lines.push(current)
  return lines
}

function QuoteReveal({ quote, progress, index }: { quote: typeof QUOTES_DATA[0]; progress: MotionValue<number>; index: number }) {
  const start = index * 0.33
  const end = start + 0.33

  const wrapLines = useMemo(() => splitQuoteLines(quote.text), [quote.text])
  
  const opacity = useTransform(progress, [start, start + 0.02, end - 0.05, end], [0, 1, 1, 0])
  
  const drawEnd = start + 0.10; 
  const strokeDashoffset = useTransform(progress, [start, drawEnd, end - 0.02, end], [1000, 0, 0, 1000])
  const fillOpacity = useTransform(progress, [start + 0.08, start + 0.15, end - 0.02, end], [0, 1, 1, 0])
  
  const liftY = useTransform(progress, [start, start + 0.08, end - 0.05, end], [40, 0, 0, -20])

  const lineHeight = 100 
  const viewBoxHeight = wrapLines.length * lineHeight + 50

  return (
    <motion.div style={{ opacity, y: liftY }} className="absolute inset-0 flex flex-col justify-center w-full px-4 md:px-0 md:max-w-[1400px] mx-auto">
      <div className="w-12 md:w-16 h-[2px] md:h-[3px] bg-[#E5997B] mb-6 md:mb-8" />

      <div className="relative w-full">
        <span className="absolute -left-4 md:-left-12 -top-6 md:-top-10 text-6xl md:text-[10rem] text-[#E5997B] font-display opacity-40">“</span>
        
        <svg viewBox={`0 0 1500 ${viewBoxHeight}`} className="h-auto w-full max-w-full overflow-visible">
          {/* FASE 1: DRAWLINE SKELETON */}
          <motion.text
            x="0" y="20" textAnchor="start" dominantBaseline="hanging"
            className="font-display"  
            fontSize="90"             
            letterSpacing="-0.03em"
            fontWeight="400"
            fill="none"               
            stroke="#030035" 
            strokeWidth="1.5"         
            strokeLinejoin="round" 
            strokeLinecap="round" 
            pathLength="1000"         
            strokeDasharray="1000"    
            style={{ strokeDashoffset: strokeDashoffset, opacity }}
          >
            {wrapLines.map((line, lineIndex) => (
              <tspan key={lineIndex} x="0" dy={lineIndex === 0 ? 0 : lineHeight}>{line}</tspan>
            ))}
          </motion.text>

          {/* FASE 2: FILL SOLID */}
          <motion.text
            x="0" y="20" textAnchor="start" dominantBaseline="hanging"
            className="font-display"  
            fontSize="90"             
            letterSpacing="-0.03em"
            fontWeight="400"
            fill="#030035" 
            stroke="none"             
            style={{ opacity: fillOpacity }} 
          >
            {wrapLines.map((line, lineIndex) => (
              <tspan key={lineIndex} x="0" dy={lineIndex === 0 ? 0 : lineHeight}>{line}</tspan>
            ))}
          </motion.text>
        </svg>

        <motion.div style={{ opacity: fillOpacity }} className="mt-8 md:mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 overflow-visible w-full">
          <div className="flex flex-col items-start">
            <p className="font-display font-bold text-[#030035] text-xl md:text-3xl mb-1">— {quote.author}</p>
            <p className="text-[10px] md:text-xs text-[#030035]/40 font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase">{quote.labelLeft}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] md:text-xs text-[#E5997B] font-bold tracking-[0.2em] md:tracking-[0.5em] uppercase">{quote.labelRight}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function QuotePrinciplesScene({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)

  const sceneOpacity = useTransform(scrollYProgress, [0.84, 0.86, 0.99, 1], [0, 1, 1, 1])
  const sceneY = useTransform(scrollYProgress, [0.84, 0.88, 1], [0, 0, 0]) 
  
  const quoteProgress = useTransform(scrollYProgress, [0.85, 0.985], [0, 1])

  useEffect(() => {
    let destroyed = false

    async function initVanta() {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js')
      if (destroyed || !sceneRef.current) return

      vantaRef.current = (window as any).VANTA?.BIRDS?.({
        el: sceneRef.current,
        THREE: (window as any).THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 600.0,
        minWidth: 600.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0xf3f4f6,
        color1: 0x1a1a4e,
        color2: 0xe5997b,
        colorMode: 'lerp',
        birdSize: 1.05,
        wingSpan: 20,
        speedLimit: 2.8,
        separation: 26,
        alignment: 42,
        cohesion: 45,
        quantity: 4,
      })
    }

    initVanta().catch(() => {})

    return () => {
      destroyed = true
      vantaRef.current?.destroy()
      vantaRef.current = null
    }
  }, [])

  return (
    <motion.div style={{ opacity: sceneOpacity, y: sceneY }} className="absolute inset-0 z-25 pointer-events-none">
      <div ref={sceneRef} className="relative h-full w-full overflow-hidden bg-[#f3f4f6]">
        
        {/* Layer Blur untuk meredupkan Vanta Birds */}
        <div className="absolute inset-0 bg-[#f3f4f6]/80 backdrop-blur-[2px]" />

        {/* 1. Ornamen Grid Titik/Garis */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.04] [background-image:linear-gradient(#030035_1px,transparent_1px),linear-gradient(90deg,#030035_1px,transparent_1px)] [background-size:64px_64px]" />

        {/* 2. Ornamen SVG Garis Melingkar ala Blueprint/Engraving (Responsive) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-10">
          <svg viewBox="0 0 1000 1000" className="w-[150vw] h-[150vw] md:w-[120vw] md:h-[120vw] max-w-[1500px] animate-spin-slow">
            <circle cx="500" cy="500" r="400" fill="none" stroke="#030035" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="500" cy="500" r="300" fill="none" stroke="#030035" strokeWidth="0.5" />
            <circle cx="500" cy="500" r="150" fill="none" stroke="#030035" strokeWidth="0.5" strokeDasharray="1 4" />
            <path d="M 500 50 L 500 950 M 50 500 L 950 500" stroke="#030035" strokeWidth="0.5" strokeDasharray="6 6" />
            <path d="M 180 180 L 820 820 M 180 820 L 820 180" stroke="#030035" strokeWidth="0.5" strokeDasharray="4 10" />
          </svg>
        </div>

        <div className="absolute inset-0 z-20 px-4 md:px-6 lg:px-24">
          <div className="mx-auto flex h-full w-full max-w-[1700px] relative">
            {QUOTES_DATA.map((quote, index) => (
              <QuoteReveal key={index} quote={quote} progress={quoteProgress} index={index} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}