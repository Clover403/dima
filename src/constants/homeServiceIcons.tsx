import { motion } from 'framer-motion'

// =========================================================================================
// ── PREMIUM CLASSIC ENGRAVING THEME (STABLE GRADIENT EDITION) ──
// =========================================================================================
const ENGRAVE_SLOW: any = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 3.5, ease: [0.25, 0.1, 0.25, 1.0] } },
}
const ENGRAVE_MED: any = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 0.9, transition: { duration: 2.5, ease: 'easeInOut' } },
}
const ENGRAVE_FAST: any = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 0.6, transition: { duration: 1.8, ease: 'easeOut' } },
}
const FADE_IN: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.5, ease: 'easeOut' } },
}

const Hatching = ({ x1, y1, x2, y2, count = 8, spacing = 1.2, color = "#030035", strokeWidth = "0.15", angle = 0 }: any) => {
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const offset = i * spacing
        const sx1 = x1 + offset * cos; const sy1 = y1 + offset * sin
        const sx2 = x2 + offset * cos; const sy2 = y2 + offset * sin
        return <motion.line key={`hatch-${i}-${angle}`} x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={color} strokeWidth={strokeWidth} variants={ENGRAVE_FAST} />
      })}
    </g>
  )
}

// ── SERVICE 1: STRUCTURATION ──
export const ServiceIconStructuration = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 200 200" className="w-80 h-80 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto overflow-visible drop-shadow-2xl" fill="none">
    <defs>
      <linearGradient id="grad-white-radial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="grad-white-down" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="grad-white-up" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    <g opacity="0.4">
      <motion.circle cx="100" cy="100" r="90" stroke="url(#grad-white-radial)" strokeWidth="0.5" strokeDasharray="2 4" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="100" r="88" stroke="#030035" strokeWidth="0.2" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        return <motion.line key={`ray-${i}`} x1="100" y1="100" x2={100 + 90 * Math.cos(angle)} y2={100 + 90 * Math.sin(angle)} stroke="url(#grad-white-radial)" strokeWidth="0.2" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      })}
    </g>

    <g>
      <motion.path d="M 50 180 L 150 180 L 135 155 L 65 155 Z" fill="#FFFFFF" opacity="0.8" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 50 180 L 150 180 L 135 155 L 65 155 Z" stroke="#030035" strokeWidth="1.8" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="40" y="180" width="120" height="8" stroke="#030035" strokeWidth="2" fill="#FFFFFF" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="35" y="188" width="130" height="4" stroke="#E5997B" strokeWidth="1" fill="#030035" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="55" y1="175" x2="145" y2="175" count={15} spacing={1.5} angle={90} strokeWidth="0.3" color="#030035" />
      <Hatching x1="60" y1="175" x2="140" y2="175" count={10} spacing={1.5} angle={45} strokeWidth="0.2" color="#E5997B" />
    </g>

    <g>
      <motion.rect x="92" y="45" width="16" height="110" fill="#FFFFFF" opacity="0.9" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="92" y="45" width="16" height="110" stroke="#030035" strokeWidth="1.5" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.line x1="96" y1="45" x2="96" y2="155" stroke="#030035" strokeWidth="0.5" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.line x1="100" y1="45" x2="100" y2="155" stroke="#E5997B" strokeWidth="0.8" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.line x1="104" y1="45" x2="104" y2="155" stroke="#030035" strokeWidth="0.5" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="93" y1="50" x2="93" y2="150" count={10} spacing={1} angle={0} strokeWidth="0.2" color="#030035" />
    </g>

    <g>
      <motion.path d="M 80 45 L 120 45 L 110 30 L 90 30 Z" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 80 45 L 120 45 L 110 30 L 90 30 Z" stroke="#E5997B" strokeWidth="1.5" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="20" r="12" fill="#FFFFFF" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="20" r="12" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="20" r="6" fill="#E5997B" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="20" r="2" fill="#FFFFFF" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    <g>
      <motion.path d="M 20 60 Q 100 40 180 60" stroke="url(#grad-white-radial)" strokeWidth="4" fill="none" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 20 60 Q 100 40 180 60" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 20 64 Q 100 44 180 64" stroke="#E5997B" strokeWidth="1" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="50" r="8" fill="#FFFFFF" stroke="#030035" strokeWidth="2" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="50" r="3" fill="#E5997B" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    {[ {cx: 20, cy: 60}, {cx: 180, cy: 60} ].map((pos, idx) => (
      <g key={`bowl-${idx}`}>
        <motion.line x1={pos.cx} y1={pos.cy} x2={pos.cx - 25} y2={pos.cy + 60} stroke="#030035" strokeWidth="0.8" strokeDasharray="3 3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
        <motion.line x1={pos.cx} y1={pos.cy} x2={pos.cx} y2={pos.cy + 60} stroke="#030035" strokeWidth="0.8" strokeDasharray="3 3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
        <motion.line x1={pos.cx} y1={pos.cy} x2={pos.cx + 25} y2={pos.cy + 60} stroke="#030035" strokeWidth="0.8" strokeDasharray="3 3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
        
        <motion.path d={`M ${pos.cx - 30} ${pos.cy + 60} C ${pos.cx - 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 60} Z`} fill="#FFFFFF" opacity="0.9" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
        <motion.path d={`M ${pos.cx - 30} ${pos.cy + 60} C ${pos.cx - 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 85} ${pos.cx + 30} ${pos.cy + 60} Z`} stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
        <motion.path d={`M ${pos.cx - 30} ${pos.cy + 60} C ${pos.cx - 30} ${pos.cy + 75} ${pos.cx + 30} ${pos.cy + 75} ${pos.cx + 30} ${pos.cy + 60}`} stroke="#E5997B" strokeWidth="1" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
        
        <Hatching x1={pos.cx - 20} y1={pos.cy + 65} x2={pos.cx + 20} y2={pos.cy + 65} count={10} spacing={1.5} angle={90} strokeWidth="0.3" color="#030035" />
      </g>
    ))}
  </svg>
)

// ── SERVICE 2: RISK ──
export const ServiceIconRisk = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 200 200" className="w-80 h-80 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto overflow-visible drop-shadow-2xl" fill="none">
    <defs>
      <linearGradient id="grad-white-beam-L" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="grad-white-beam-R" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="grad-white-up-2" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    <g opacity="0.3">
      <motion.circle cx="100" cy="100" r="95" stroke="#FFFFFF" strokeWidth="1" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="100" r="85" stroke="#030035" strokeWidth="0.5" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      {[45, 135, 225, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <motion.line key={`nav-${i}`} x1="100" y1="100" x2={100 + 95 * Math.cos(rad)} y2={100 + 95 * Math.sin(rad)} stroke="#030035" strokeWidth="0.5" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      })}
    </g>

    <g>
      <motion.path d="M 0 170 Q 20 140 40 170 T 80 170 T 120 170 T 160 170 T 200 170" fill="#FFFFFF" opacity="0.8" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 0 170 Q 20 140 40 170 T 80 170 T 120 170 T 160 170 T 200 170" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 5 180 Q 25 150 45 180 T 85 180 T 125 180 T 165 180 T 195 180" stroke="#E5997B" strokeWidth="1.2" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 10 190 Q 30 160 50 190 T 90 190 T 130 190 T 170 190 T 190 190" stroke="#030035" strokeWidth="1.5" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="10" y1="175" x2="190" y2="175" count={12} spacing={2} angle={0} strokeWidth="0.3" color="#030035" />
      <Hatching x1="10" y1="175" x2="190" y2="175" count={12} spacing={2} angle={45} strokeWidth="0.2" color="#E5997B" />
    </g>

    <g>
      <motion.path d="M 50 160 L 70 130 L 130 130 L 150 160 Z" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 50 160 L 70 130 L 130 130 L 150 160 Z" stroke="#FFFFFF" strokeWidth="1" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="60" y1="155" x2="140" y2="135" count={20} spacing={1.5} angle={120} strokeWidth="0.4" color="#E5997B" />
    </g>

    <g>
      <motion.path d="M 75 130 L 85 45 L 115 45 L 125 130 Z" fill="#FFFFFF" opacity="0.9" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 75 130 L 85 45 L 115 45 L 125 130 Z" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 77 110 Q 100 120 123 110" stroke="#030035" strokeWidth="1" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 79 90 Q 100 100 121 90" stroke="#E5997B" strokeWidth="1" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 81 70 Q 100 80 119 70" stroke="#030035" strokeWidth="1" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="115" y1="125" x2="119" y2="50" count={25} spacing={3} angle={0} strokeWidth="0.3" color="#030035" />
    </g>

    {[60, 80, 100, 120].map((y, i) => (
      <motion.rect key={`win-${i}`} x="96" y={y} width="8" height="12" rx="4" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    ))}

    <g>
      <motion.rect x="80" y="40" width="40" height="5" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="80" y="40" width="40" height="5" stroke="#FFFFFF" strokeWidth="0.5" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="84" y="20" width="32" height="20" fill="#FFFFFF" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="84" y="20" width="32" height="20" stroke="#030035" strokeWidth="1.5" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.line x1="94" y1="20" x2="94" y2="40" stroke="#030035" strokeWidth="1" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.line x1="106" y1="20" x2="106" y2="40" stroke="#030035" strokeWidth="1" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="30" r="6" fill="#E5997B" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="30" r="3" fill="#FFFFFF" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    <g>
      <motion.path d="M 80 20 C 80 0 120 0 120 20 Z" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 80 20 C 80 0 120 0 120 20 Z" stroke="#E5997B" strokeWidth="1.5" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="5" r="3" fill="#FFFFFF" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    <g opacity="0.8">
      <motion.path d="M 84 30 L -10 -10 L -10 90 Z" fill="url(#grad-white-beam-L)" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 116 30 L 210 -10 L 210 90 Z" fill="url(#grad-white-beam-R)" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 84 30 L -10 -10 L -10 90 Z" stroke="#E5997B" strokeWidth="1" fill="none" strokeDasharray="6 3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 116 30 L 210 -10 L 210 90 Z" stroke="#E5997B" strokeWidth="1" fill="none" strokeDasharray="6 3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.line key={`beam-L-${i}`} x1="84" y1="30" x2={0} y2={-10 + i * 7} stroke="url(#grad-white-beam-L)" strokeWidth="0.5" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.line key={`beam-R-${i}`} x1="116" y1="30" x2={200} y2={-10 + i * 7} stroke="url(#grad-white-beam-R)" strokeWidth="0.5" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      ))}
    </g>
  </svg>
)

// ── SERVICE 3: PLANNING ──
export const ServiceIconSacredGeometry = ({ isOpen }: { isOpen: boolean }) => (
  <svg viewBox="0 0 200 200" className="w-80 h-80 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto overflow-visible drop-shadow-2xl" fill="none">
    <defs>
      <linearGradient id="grad-white-radial-3" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="grad-white-up-3" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>

    <g opacity="0.5">
      <motion.circle cx="100" cy="100" r="90" stroke="url(#grad-white-radial-3)" strokeWidth="0.8" strokeDasharray="4 4" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="100" r="85" stroke="#030035" strokeWidth="0.3" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="100" r="15" stroke="#E5997B" strokeWidth="0.5" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.ellipse cx="100" cy="100" rx="95" ry="30" transform="rotate(45 100 100)" stroke="url(#grad-white-radial-3)" strokeWidth="0.3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.ellipse cx="100" cy="100" rx="95" ry="30" transform="rotate(-45 100 100)" stroke="url(#grad-white-radial-3)" strokeWidth="0.3" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    <g>
      <motion.rect x="55" y="20" width="90" height="10" rx="2" fill="#FFFFFF" opacity="0.9" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="55" y="20" width="90" height="10" rx="2" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="60" y="30" width="80" height="6" stroke="#E5997B" strokeWidth="1.5" fill="#030035" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="55" y="170" width="90" height="10" rx="2" fill="#FFFFFF" opacity="0.9" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="55" y="170" width="90" height="10" rx="2" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="60" y="164" width="80" height="6" stroke="#E5997B" strokeWidth="1.5" fill="#030035" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="58" y1="25" x2="142" y2="25" count={20} spacing={1} angle={90} strokeWidth="0.3" color="#030035" />
      <Hatching x1="58" y1="175" x2="142" y2="175" count={20} spacing={1} angle={90} strokeWidth="0.3" color="#030035" />
    </g>

    <g>
      <motion.rect x="62" y="36" width="6" height="128" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="62" y="36" width="6" height="128" stroke="#FFFFFF" strokeWidth="1" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="132" y="36" width="6" height="128" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="132" y="36" width="6" height="128" stroke="#FFFFFF" strokeWidth="1" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    <g>
      <motion.path d="M 75 36 C 75 85 95 95 95 100 C 95 105 75 115 75 164 L 125 164 C 125 115 105 105 105 100 C 105 95 125 85 125 36 Z" fill="#FFFFFF" opacity="0.6" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 75 36 C 75 85 95 95 95 100 C 95 105 75 115 75 164" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 125 36 C 125 85 105 95 105 100 C 105 105 125 115 125 164" stroke="#030035" strokeWidth="2" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 82 45 C 82 80 97 93 97 100 C 97 107 82 120 82 155" stroke="url(#grad-white-up-3)" strokeWidth="1.5" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 118 45 C 118 80 103 93 103 100 C 103 107 118 120 118 155" stroke="#030035" strokeWidth="0.5" opacity="0.5" fill="none" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>

    <g>
      <motion.path d="M 80 60 L 120 60 C 115 85 105 95 100 100 C 95 95 85 85 80 60 Z" fill="#E5997B" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 80 60 L 120 60 C 115 85 105 95 100 100 C 95 95 85 85 80 60 Z" stroke="#030035" strokeWidth="1" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="82" y1="65" x2="118" y2="65" count={12} spacing={2.5} angle={0} strokeWidth="0.3" color="#030035" />
      <Hatching x1="86" y1="75" x2="114" y2="75" count={8} spacing={2.5} angle={0} strokeWidth="0.3" color="url(#grad-white-up-3)" />
    </g>

    <g>
      <motion.path d="M 78 160 L 122 160 L 100 110 Z" fill="#E5997B" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.path d="M 78 160 L 122 160 L 100 110 Z" stroke="#030035" strokeWidth="1" fill="none" variants={ENGRAVE_MED} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <Hatching x1="85" y1="150" x2="115" y2="150" count={10} spacing={2.5} angle={0} strokeWidth="0.3" color="#030035" />
      <Hatching x1="80" y1="155" x2="120" y2="155" count={14} spacing={2.5} angle={0} strokeWidth="0.3" color="url(#grad-white-up-3)" />
    </g>

    <motion.line x1="100" y1="100" x2="100" y2="125" stroke="url(#grad-white-up-3)" strokeWidth="1.5" strokeDasharray="3 2" variants={ENGRAVE_FAST} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />

    <g>
      <motion.rect x="90" y="96" width="20" height="8" rx="2" fill="#030035" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.rect x="90" y="96" width="20" height="8" rx="2" stroke="#E5997B" strokeWidth="1.5" fill="none" variants={ENGRAVE_SLOW} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
      <motion.circle cx="100" cy="100" r="2" fill="#FFFFFF" variants={FADE_IN} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} />
    </g>
  </svg>
)