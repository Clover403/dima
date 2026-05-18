import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const protagonists = [
  {
    num: '01',
    viewBoxNum: "0 0 160 140",
    title: 'La Transacción',
    viewBoxTitle: "0 0 550 60",
    body: 'Una transacción ocurre simplemente cuando un comprador intercambia dinero o crédito por bienes, servicios o activos financieros con un vendedor. Es decir, cuando alguien gasta y alguien más recibe.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-[#E5997B]">
        <path d="M8 32h20M36 32h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 24l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 24l-8 8 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '02',
    viewBoxNum: "0 0 160 140",
    title: 'El Gasto',
    viewBoxTitle: "0 0 350 60",
    body: 'El gasto es la fuerza motriz de la economía. Cuando una persona gasta más, otra persona gana más — y al ganar más, tiene más para gastar. Este ciclo es el que impulsa todo el sistema económico.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-[#E5997B]">
        <path d="M12 48L28 20l12 16 12-28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="52" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: '03',
    viewBoxNum: "0 0 160 140",
    title: 'El Crédito',
    viewBoxTitle: "0 0 380 60",
    body: 'Cuando el ingreso de alguien aumenta, obtiene capacidad de pago. Un mayor ingreso permite endeudarse, y endeudarse permite gastar más — y más gasto significa más ingreso. El crédito es el eslabón que amplifica la economía.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-[#E5997B]">
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M32 12a20 20 0 0 1 0 40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M26 28l6 4-6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 28l-6 4 6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function TypingBody({ text, scrollYProgress, typeStart, typeEnd }: { text: string, scrollYProgress: any, typeStart: number, typeEnd: number }) {
  const chars = text.split('')
  const N = chars.length
  return (
    <p className="font-serif text-[#030035]/80 text-xl md:text-2xl lg:text-3xl leading-relaxed whitespace-pre-wrap">
      {chars.map((char, j) => {
        const charStart = typeStart + (j / N) * (typeEnd - typeStart)
        const charEnd = charStart + ((typeEnd - typeStart) / (N * 0.4))
        const charOp = useTransform(scrollYProgress, [charStart, charEnd], [0, 1])
        return <motion.span style={{ opacity: charOp }} key={j}>{char}</motion.span>
      })}
    </p>
  )
}

const EngravingDefs = () => (
  <defs>
    <radialGradient id="grad-white-radial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="grad-white-up" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
  </defs>
)

const HatchingScroll = ({ x1, y1, x2, y2, count = 8, spacing = 1.2, color = "#030035", strokeWidth = "0.15", angle = 0, draw, fade }: any) => {
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return (
    <g style={{ opacity: fade }}>
      {Array.from({ length: count }).map((_, i) => {
        const offset = i * spacing
        const sx1 = x1 + offset * cos; const sy1 = y1 + offset * sin
        const sx2 = x2 + offset * cos; const sy2 = y2 + offset * sin
        return <motion.line key={`hatch-${i}`} x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={strokeWidth} style={{ pathLength: draw }} />
      })}
    </g>
  )
}

function CornerIcons({ scrollYProgress }: { scrollYProgress: any }) {
  const N = '#030035'
  const B = '#E5997B'

  const draw1 = useTransform(scrollYProgress, [0.01, 0.25], [0, 1])
  const draw2 = useTransform(scrollYProgress, [0.34, 0.58], [0, 1])
  const draw3 = useTransform(scrollYProgress, [0.67, 0.91], [0, 1])

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      
      {/* ── IKON 1: KIRI BAWAH (Balance Scales) ── */}
      <div className="absolute -bottom-12 -left-12 w-[350px] h-[350px] md:w-[450px] md:h-[450px] opacity-70">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full overflow-visible drop-shadow-2xl">
          <EngravingDefs />
          <g opacity="0.4">
            <motion.circle cx="100" cy="100" r="90" fill="url(#grad-white-radial)" style={{ opacity: draw1 }} />
            <motion.circle cx="100" cy="100" r="88" stroke={N} strokeWidth="0.2" fill="none" style={{ pathLength: draw1 }} />
          </g>
          <g>
            <motion.path d="M 50 180 L 150 180 L 135 155 L 65 155 Z" fill="#FFFFFF" opacity="0.8" style={{ opacity: draw1 }} />
            <motion.path d="M 50 180 L 150 180 L 135 155 L 65 155 Z" stroke={N} strokeWidth="1.8" fill="none" style={{ pathLength: draw1 }} />
            <motion.rect x="40" y="180" width="120" height="8" stroke={N} strokeWidth="2" fill="#FFFFFF" style={{ pathLength: draw1, opacity: draw1 }} />
            <motion.rect x="35" y="188" width="130" height="4" stroke={B} strokeWidth="1" fill={N} style={{ pathLength: draw1, opacity: draw1 }} />
            <HatchingScroll x1="55" y1="175" x2="145" y2="175" count={15} spacing={1.5} angle={90} strokeWidth="0.3" color={N} draw={draw1} fade={draw1} />
          </g>
          <g>
            <motion.rect x="92" y="45" width="16" height="110" fill="#FFFFFF" opacity="0.9" style={{ opacity: draw1 }} />
            <motion.rect x="92" y="45" width="16" height="110" stroke={N} strokeWidth="1.5" fill="none" style={{ pathLength: draw1 }} />
            <motion.line x1="96" y1="45" x2="96" y2="155" stroke={N} strokeWidth="0.5" style={{ pathLength: draw1 }} />
            <motion.line x1="100" y1="45" x2="100" y2="155" stroke={B} strokeWidth="0.8" style={{ pathLength: draw1 }} />
            <motion.line x1="104" y1="45" x2="104" y2="155" stroke={N} strokeWidth="0.5" style={{ pathLength: draw1 }} />
            <HatchingScroll x1="93" y1="50" x2="93" y2="150" count={10} spacing={1} angle={0} strokeWidth="0.2" color={N} draw={draw1} fade={draw1} />
          </g>
          <g>
            <motion.path d="M 80 45 L 120 45 L 110 30 L 90 30 Z" fill={N} style={{ opacity: draw1 }} />
            <motion.path d="M 80 45 L 120 45 L 110 30 L 90 30 Z" stroke={B} strokeWidth="1.5" fill="none" style={{ pathLength: draw1 }} />
            <motion.circle cx="100" cy="20" r="12" fill="#FFFFFF" style={{ opacity: draw1 }} />
            <motion.circle cx="100" cy="20" r="12" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw1 }} />
            <motion.circle cx="100" cy="20" r="6" fill={B} style={{ opacity: draw1 }} />
            <motion.circle cx="100" cy="20" r="2" fill="#FFFFFF" style={{ opacity: draw1 }} />
          </g>
          <g>
            <motion.path d="M 20 60 Q 100 40 180 60" stroke="url(#grad-white-radial)" strokeWidth="4" fill="none" style={{ opacity: draw1 }} />
            <motion.path d="M 20 60 Q 100 40 180 60" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw1 }} />
            <motion.path d="M 20 64 Q 100 44 180 64" stroke={B} strokeWidth="1" fill="none" style={{ pathLength: draw1 }} />
            <motion.circle cx="100" cy="50" r="8" fill="#FFFFFF" stroke={N} strokeWidth="2" style={{ opacity: draw1 }} />
            <motion.circle cx="100" cy="50" r="3" fill={B} style={{ opacity: draw1 }} />
          </g>
          {[ {cx: 20, cy: 60}, {cx: 180, cy: 60} ].map((pos, idx) => (
            <g key={`bowl-${idx}`}>
              <motion.line x1={pos.cx} y1={pos.cy} x2={pos.cx - 25} y2={pos.cy + 60} stroke={N} strokeWidth="0.8" strokeDasharray="3 3" style={{ pathLength: draw1 }} />
              <motion.line x1={pos.cx} y1={pos.cy} x2={pos.cx} y2={pos.cy + 60} stroke={N} strokeWidth="0.8" strokeDasharray="3 3" style={{ pathLength: draw1 }} />
              <motion.line x1={pos.cx} y1={pos.cy} x2={pos.cx + 25} y2={pos.cy + 60} stroke={N} strokeWidth="0.8" strokeDasharray="3 3" style={{ pathLength: draw1 }} />
              <motion.path d={`M ${pos.cx - 30} ${pos.cy + 60} C ${pos.cx - 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 60} Z`} fill="#FFFFFF" opacity="0.9" style={{ opacity: draw1 }} />
              <motion.path d={`M ${pos.cx - 30} ${pos.cy + 60} C ${pos.cx - 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 60} Z`} stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw1 }} />
              <motion.path d={`M ${pos.cx - 30} ${pos.cy + 60} C ${pos.cx - 30} ${pos.cy + 75} ${pos.cx + 30} ${pos.cy + 75} ${pos.cx + 30} ${pos.cy + 60}`} stroke={B} strokeWidth="1" fill="none" style={{ pathLength: draw1 }} />
            </g>
          ))}
        </svg>
      </div>

     {/* ── IKON 2: KANAN BAWAH (Burung Hantu Gagah - Detail Full + Alis Naik) ── */}
<div className="absolute -bottom-12 -right-12 w-[350px] h-[350px] md:w-[450px] md:h-[450px] opacity-70">
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full overflow-visible drop-shadow-2xl">
    <EngravingDefs />
    
    {/* Lingkaran latar */}
    <motion.circle cx="100" cy="110" r="88" fill="url(#grad-white-radial)" style={{ opacity: draw2 }} />
    <motion.circle cx="100" cy="110" r="85" stroke={N} strokeWidth="0.4" strokeDasharray="3 5" style={{ pathLength: draw2 }} />
    <motion.circle cx="100" cy="110" r="82" stroke={N} strokeWidth="0.2" strokeDasharray="1 6" style={{ pathLength: draw2 }} />

    {/* ===== TANDUK (Ear Tufts) ===== */}
    <g>
      <motion.path d="M 68 52 L 40 8 L 62 18 L 52 6 L 72 42 Z" fill={N} stroke={B} strokeWidth="0.8" strokeLinejoin="round" style={{ opacity: draw2, pathLength: draw2 }} />
      <motion.path d="M 65 48 L 42 12 L 58 20" stroke={B} strokeWidth="1.2" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
      <motion.path d="M 60 38 L 50 16 L 58 26" stroke="#FFFFFF" strokeWidth="0.6" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
      <motion.path d="M 132 52 L 160 8 L 138 18 L 148 6 L 128 42 Z" fill={N} stroke={B} strokeWidth="0.8" strokeLinejoin="round" style={{ opacity: draw2, pathLength: draw2 }} />
      <motion.path d="M 135 48 L 158 12 L 142 20" stroke={B} strokeWidth="1.2" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
      <motion.path d="M 140 38 L 150 16 L 142 26" stroke="#FFFFFF" strokeWidth="0.6" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
    </g>

    {/* ===== KEPALA ===== */}
    <motion.path d="M 72 50 Q 100 32 128 50" stroke={N} strokeWidth="2" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
    <motion.path d="M 75 46 Q 100 28 125 46" stroke={N} strokeWidth="0.8" strokeDasharray="2 3" fill="none" style={{ pathLength: draw2 }} />
    
    <g stroke={N} strokeWidth="0.7" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }}>
      <motion.path d="M 85 43 L 82 38" /><motion.path d="M 92 37 L 90 32" /><motion.path d="M 100 35 L 100 29" /><motion.path d="M 108 37 L 110 32" /><motion.path d="M 115 43 L 118 38" />
    </g>

    {/* ===== FACIAL DISK ===== */}
    <motion.path d="M 100 95 C 62 105 38 82 48 54 C 52 42 68 36 82 44 C 90 32 110 32 118 44 C 132 36 148 42 152 54 C 162 82 138 105 100 95 Z" fill="#FFFFFF" opacity="0.85" style={{ opacity: draw2 }} />
    <motion.path d="M 100 95 C 62 105 38 82 48 54 C 52 42 68 36 82 44 C 90 32 110 32 118 44 C 132 36 148 42 152 54 C 162 82 138 105 100 95 Z" stroke={B} strokeWidth="1.8" fill="none" strokeLinejoin="round" style={{ pathLength: draw2 }} />
    <motion.path d="M 100 92 C 68 100 48 80 56 56 C 60 46 72 42 84 48 C 90 40 110 40 116 48 C 128 42 140 46 144 56 C 152 80 132 100 100 92 Z" stroke={N} strokeWidth="0.6" strokeDasharray="2 3" fill="none" style={{ pathLength: draw2 }} />
    <motion.path d="M 52 62 Q 68 48 84 60" stroke={N} strokeWidth="1.2" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
    <motion.path d="M 148 62 Q 132 48 116 60" stroke={N} strokeWidth="1.2" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />

    {/* ===== MATA & ALIS (ALIS PINDAH KE ATAS) ===== */}
    <g>
      {/* Alis tebal (Naik 6px dari sebelumnya) */}
      <motion.path d="M 48 49 L 92 62 M 52 54 L 88 66" stroke={N} strokeWidth="3" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
      <motion.path d="M 50 51 L 90 62" stroke={B} strokeWidth="1" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
      <motion.path d="M 152 49 L 108 62 M 148 54 L 112 66" stroke={N} strokeWidth="3" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />
      <motion.path d="M 150 51 L 110 62" stroke={B} strokeWidth="1" fill="none" strokeLinecap="round" style={{ pathLength: draw2 }} />

      {/* Bola mata tetap di tempat */}
      <motion.circle cx="78" cy="68" r="10" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw2 }} />
      <motion.circle cx="122" cy="68" r="10" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw2 }} />
      <motion.circle cx="78" cy="68" r="5.5" fill={B} style={{ opacity: draw2 }} />
      <motion.circle cx="122" cy="68" r="5.5" fill={B} style={{ opacity: draw2 }} />
      <motion.circle cx="78" cy="68" r="3" fill={N} style={{ opacity: draw2 }} />
      <motion.circle cx="122" cy="68" r="3" fill={N} style={{ opacity: draw2 }} />
      <motion.circle cx="76" cy="66" r="1.2" fill="#FFFFFF" style={{ opacity: draw2 }} />
      <motion.circle cx="120" cy="66" r="1.2" fill="#FFFFFF" style={{ opacity: draw2 }} />
      <motion.path d="M 70 74 Q 78 80 86 74" stroke={N} strokeWidth="0.8" fill="none" style={{ pathLength: draw2 }} />
      <motion.path d="M 114 74 Q 122 80 130 74" stroke={N} strokeWidth="0.8" fill="none" style={{ pathLength: draw2 }} />
    </g>

    {/* ===== PARUH ===== */}
    <motion.path d="M 94 76 L 106 76 L 100 98 Z" fill={B} stroke={N} strokeWidth="2" strokeLinejoin="round" style={{ opacity: draw2, pathLength: draw2 }} />
    <motion.path d="M 97 80 L 103 80 L 100 95 Z" fill="#FFFFFF" opacity="0.5" style={{ opacity: draw2 }} />
    <motion.line x1="100" y1="76" x2="100" y2="96" stroke={N} strokeWidth="0.8" style={{ pathLength: draw2 }} />
    <motion.ellipse cx="97" cy="82" rx="1" ry="0.8" fill={N} style={{ opacity: draw2 }} />
    <motion.ellipse cx="103" cy="82" rx="1" ry="0.8" fill={N} style={{ opacity: draw2 }} />

    {/* ===== SAYAP ===== */}
    <motion.path d="M 55 70 C 22 110 30 165 58 178" stroke={N} strokeWidth="3" fill="none" style={{ pathLength: draw2 }} />
    <motion.path d="M 58 75 C 32 112 38 160 60 175" stroke={B} strokeWidth="1.2" fill="none" style={{ pathLength: draw2 }} />
    <motion.path d="M 145 70 C 178 110 170 165 142 178" stroke={N} strokeWidth="3" fill="none" style={{ pathLength: draw2 }} />
    <motion.path d="M 142 75 C 168 112 162 160 140 175" stroke={B} strokeWidth="1.2" fill="none" style={{ pathLength: draw2 }} />
    <g stroke={N} strokeWidth="0.7" fill="none" style={{ pathLength: draw2 }}>
      <motion.path d="M 42 100 L 52 115" /><motion.path d="M 38 115 L 48 130" /><motion.path d="M 158 100 L 148 115" /><motion.path d="M 162 115 L 152 130" />
    </g>

    {/* ===== BADAN / PERUT ===== */}
    <motion.path d="M 72 100 Q 80 120 68 155 Q 78 178 100 180 Q 122 178 132 155 Q 120 120 128 100" stroke={N} strokeWidth="1.5" fill="#FFFFFF" opacity="0.6" style={{ opacity: draw2, pathLength: draw2 }} />
    <g stroke={N} strokeWidth="1.4" fill="none" style={{ pathLength: draw2 }}>
      <motion.path d="M 76 108 Q 90 122 100 108 Q 110 122 124 108" />
      <motion.path d="M 72 122 Q 86 136 100 122 Q 114 136 128 122" />
      <motion.path d="M 78 164 Q 89 178 100 164 Q 111 178 122 164" />
    </g>
    <g stroke={B} strokeWidth="0.8" fill="none" style={{ pathLength: draw2 }}>
      <motion.path d="M 82 112 L 87 120" /><motion.path d="M 93 112 L 88 120" />
      <motion.path d="M 78 126 L 83 134" /><motion.path d="M 111 126 L 116 134" />
    </g>

    {/* ===== DAHAN & CAKAR ===== */}
    <motion.rect x="30" y="178" width="140" height="10" rx="4" fill="#FFFFFF" stroke={N} strokeWidth="2" style={{ pathLength: draw2, opacity: draw2 }} />
    <motion.line x1="35" y1="183" x2="165" y2="183" stroke={B} strokeWidth="1.2" style={{ pathLength: draw2 }} />
    <HatchingScroll x1="35" y1="181" x2="165" y2="181" count={28} spacing={3.5} angle={90} color={N} strokeWidth="0.35" draw={draw2} fade={draw2} />
    
    <g fill={N} style={{ opacity: draw2 } as any}>
      <motion.path d="M 72 172 C 68 185 72 192 78 192 C 84 192 82 185 80 172 Z" />
      <motion.path d="M 120 172 C 120 185 124 192 128 192 C 132 192 130 185 128 172 Z" />
    </g>

    {/* ===== HIASAN BINTANG ===== */}
    <g stroke={B} strokeWidth="0.5" fill="none" style={{ pathLength: draw2 }}>
      <motion.path d="M 30 40 L 30 30 M 25 35 L 35 35" />
      <motion.path d="M 170 25 L 170 15 M 165 20 L 175 20" />
    </g>
  </svg>
</div>

      {/* ── IKON 3: KANAN ATAS (Premium Diamond Pillar) ── */}
      <div className="absolute top-4 -right-12 w-[350px] h-[350px] md:w-[450px] md:h-[450px] opacity-70">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full overflow-visible drop-shadow-2xl">
          <EngravingDefs />
          <g opacity="0.5">
            <motion.circle cx="100" cy="100" r="90" stroke="url(#grad-white-radial)" strokeWidth="0.8" strokeDasharray="4 4" fill="none" style={{ pathLength: draw3 }} />
            <motion.circle cx="100" cy="100" r="85" stroke={N} strokeWidth="0.3" fill="none" style={{ pathLength: draw3 }} />
            <motion.circle cx="100" cy="100" r="15" stroke={B} strokeWidth="0.5" fill="none" style={{ pathLength: draw3 }} />
          </g>
          <g>
            <motion.rect x="55" y="20" width="90" height="10" rx="2" fill="#FFFFFF" opacity="0.9" style={{ opacity: draw3 }} />
            <motion.rect x="55" y="20" width="90" height="10" rx="2" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw3 }} />
            <motion.rect x="60" y="30" width="80" height="6" stroke={B} strokeWidth="1.5" fill={N} style={{ pathLength: draw3, opacity: draw3 }} />
            <motion.rect x="55" y="170" width="90" height="10" rx="2" fill="#FFFFFF" opacity="0.9" style={{ opacity: draw3 }} />
            <motion.rect x="55" y="170" width="90" height="10" rx="2" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw3 }} />
            <motion.rect x="60" y="164" width="80" height="6" stroke={B} strokeWidth="1.5" fill={N} style={{ pathLength: draw3, opacity: draw3 }} />
            <HatchingScroll x1="58" y1="25" x2="142" y2="25" count={20} spacing={1} angle={90} strokeWidth="0.3" color={N} draw={draw3} fade={draw3} />
            <HatchingScroll x1="58" y1="175" x2="142" y2="175" count={20} spacing={1} angle={90} strokeWidth="0.3" color={N} draw={draw3} fade={draw3} />
          </g>
          <g>
            <motion.rect x="62" y="36" width="6" height="128" fill={N} style={{ opacity: draw3 }} />
            <motion.rect x="62" y="36" width="6" height="128" stroke="#FFFFFF" strokeWidth="1" fill="none" style={{ pathLength: draw3 }} />
            <motion.rect x="132" y="36" width="6" height="128" fill={N} style={{ opacity: draw3 }} />
            <motion.rect x="132" y="36" width="6" height="128" stroke="#FFFFFF" strokeWidth="1" fill="none" style={{ pathLength: draw3 }} />
          </g>
          <g>
            <motion.path d="M 75 36 C 75 85 95 95 95 100 C 95 105 75 115 75 164 L 125 164 C 125 115 105 105 105 100 C 105 95 125 85 125 36 Z" fill="#FFFFFF" opacity="0.6" style={{ opacity: draw3 }} />
            <motion.path d="M 75 36 C 75 85 95 95 95 100 C 95 105 75 115 75 164" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw3 }} />
            <motion.path d="M 125 36 C 125 85 105 95 105 100 C 105 105 125 115 125 164" stroke={N} strokeWidth="2" fill="none" style={{ pathLength: draw3 }} />
            <motion.path d="M 82 45 C 82 80 97 93 97 100 C 97 107 82 120 82 155" stroke="url(#grad-white-up)" strokeWidth="1.5" fill="none" style={{ pathLength: draw3 }} />
          </g>
          <g>
            <motion.path d="M 80 60 L 120 60 C 115 85 105 95 100 100 C 95 95 85 85 80 60 Z" fill={B} style={{ opacity: draw3 }} />
            <motion.path d="M 80 60 L 120 60 C 115 85 105 95 100 100 C 95 95 85 85 80 60 Z" stroke={N} strokeWidth="1" fill="none" style={{ pathLength: draw3 }} />
            <HatchingScroll x1="82" y1="65" x2="118" y2="65" count={12} spacing={2.5} angle={0} strokeWidth="0.3" color={N} draw={draw3} fade={draw3} />
          </g>
          <g>
            <motion.path d="M 78 160 L 122 160 L 100 110 Z" fill={B} style={{ opacity: draw3 }} />
            <motion.path d="M 78 160 L 122 160 L 100 110 Z" stroke={N} strokeWidth="1" fill="none" style={{ pathLength: draw3 }} />
            <HatchingScroll x1="85" y1="150" x2="115" y2="150" count={10} spacing={2.5} angle={0} strokeWidth="0.3" color={N} draw={draw3} fade={draw3} />
          </g>
          <g>
            <motion.rect x="90" y="96" width="20" height="8" rx="2" fill={N} style={{ opacity: draw3 }} />
            <motion.rect x="90" y="96" width="20" height="8" rx="2" stroke={B} strokeWidth="1.5" fill="none" style={{ pathLength: draw3 }} />
            <motion.circle cx="100" cy="100" r="2" fill="#FFFFFF" style={{ opacity: draw3 }} />
          </g>
        </svg>
      </div>

    </div>
  )
}

function ScrollBoundSlide({ p, index, scrollYProgress }: any) {
  const start = index * 0.333
  const end = (index + 1) * 0.333
  const fadeIn = start + 0.01
  const drawEnd = start + 0.25 
  const typeStart = start + 0.05 
  const typeEnd = start + 0.31
  const fadeOut = index === 2 ? 1.0 : end - 0.02 

  const opacity = useTransform(scrollYProgress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0])
  const strokeDashoffset = useTransform(scrollYProgress, [fadeIn, drawEnd], [1000, 0])
  const fillOpacityTitle = useTransform(scrollYProgress, [drawEnd, typeEnd], [0, 1])
  const fillOpacityNum = useTransform(scrollYProgress, [drawEnd, typeEnd], [0, 0.05])

  const iconScale = useTransform(scrollYProgress, [fadeIn, typeStart], [0.5, 1])
  const iconOpacity = useTransform(scrollYProgress, [fadeIn, typeStart], [0, 1])
  const lineWidth = useTransform(scrollYProgress, [drawEnd, typeEnd], ["0%", "4rem"])

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center w-full mt-10">
      <div className="lg:col-span-5 relative flex flex-col items-start">
        <div className="absolute -top-24 -left-16 md:-left-28 select-none pointer-events-none z-0">
          <svg viewBox={p.viewBoxNum} className="w-[16rem] h-auto md:w-[22rem]">
            <motion.text
              x="0" y="110" fontFamily="serif" fontSize="180" fontWeight="400"
              fill="#030035" stroke="#030035" strokeWidth="0.5" strokeDasharray="1000"
              style={{ strokeDashoffset, fillOpacity: fillOpacityNum }}
            >
              {p.num}
            </motion.text>
          </svg>
        </div>
        
        <motion.div 
          style={{ scale: iconScale, opacity: iconOpacity }}
          className="relative z-10 w-24 h-24 md:w-32 md:h-32 p-5 md:p-7 bg-white/50 backdrop-blur-xl border border-[#030035]/5 rounded-3xl shadow-[0_20px_40px_rgba(3,0,53,0.03)] mb-8 flex items-center justify-center"
        >
          <div className="w-full h-full text-[#E5997B]">{p.icon}</div>
        </motion.div>
        
        <svg viewBox={p.viewBoxTitle} className="w-full h-auto relative z-10 -ml-1 overflow-visible">
          <motion.text
            x="0" y="50" fontFamily="serif" fontSize="60" fontWeight="400"
            fill="#030035" stroke="#030035" strokeWidth="1" strokeDasharray="1000"
            style={{ strokeDashoffset, fillOpacity: fillOpacityTitle, letterSpacing: '-0.04em' } as any}
          >
            {p.title}
          </motion.text>
        </svg>
      </div>

      <div className="lg:col-span-7 relative z-10 flex flex-col justify-center">
        <div className="h-full flex flex-col">
          <motion.div style={{ width: lineWidth }} className="hidden lg:block h-[2px] bg-[#E5997B] mb-8" />
          <TypingBody text={p.body} scrollYProgress={scrollYProgress} typeStart={typeStart} typeEnd={typeEnd} />
        </div>
      </div>
    </motion.div>
  )
}

export default function ModeloProtitas() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={sectionRef} className="relative bg-[#F4F4F5] w-full h-[400vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(3,0,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(3,0,53,1) 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
              maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
            }}
          />
        </div>

        <CornerIcons scrollYProgress={scrollYProgress} />

        <div className="absolute top-10 md:top-16 left-6 md:left-12 lg:left-24 z-30 w-full pointer-events-none">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <div className="w-12 h-px bg-[#E5997B]" />
            <p className="text-[#E5997B] font-mono text-[10px] tracking-[0.5em] uppercase font-bold">
              Los 3 Protagonistas
            </p>
          </div>
          <h1 className="font-serif text-[#030035] text-4xl md:text-5xl lg:text-6xl max-w-4xl tracking-tight">
            Las fuerzas que mueven la economía
          </h1>
        </div>

        <div className="relative z-20 w-full max-w-7xl px-6 md:px-12 lg:px-24 h-[60vh] mt-16 md:mt-24">
          {protagonists.map((p, index) => (
            <ScrollBoundSlide key={p.num} p={p} index={index} scrollYProgress={scrollYProgress} />
          ))}
        </div>

      </div>
    </section>
  )
}