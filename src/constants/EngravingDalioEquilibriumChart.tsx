import { motion } from 'framer-motion'

interface ChartProps {
  drawProgress: any
  strokeOpacity: any
  fillOpacity: any
}

export const EngravingDalioEquilibriumChart = ({ drawProgress, strokeOpacity, fillOpacity }: ChartProps) => {
  const shortTermCurve = 'M 70 390 C 110 330, 120 250, 150 290 C 175 325, 195 170, 225 215 C 250 255, 280 110, 315 160 C 350 210, 375 70, 410 125 C 445 175, 470 90, 505 145 C 535 195, 555 260, 585 300 C 610 330, 640 350, 670 285 C 700 215, 725 150, 755 120 C 772 102, 785 84, 800 70'
  const longTermLine = 'M 70 390 L 800 70'

  return (
    <svg 
      viewBox="0 0 850 500" 
      className="w-full max-w-[1100px] h-auto text-[#030035] overflow-visible select-none -mt-10"
    >
      <defs>
        <pattern id="premium-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#E5997B" strokeWidth="0.55" opacity="0.34" />
        </pattern>

        <pattern id="chart-grid" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M 42 0 L 0 0 0 42" fill="none" stroke="currentColor" strokeWidth="0.45" opacity="0.04" />
          <path d="M 0 21 L 42 21 M 21 0 L 21 42" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.03" />
        </pattern>

        <radialGradient id="edge-fade" cx="50%" cy="50%" r="50%">
          <stop offset="75%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="canvas-mask">
          <rect x="-50" y="-50" width="950" height="600" fill="url(#edge-fade)" />
        </mask>

        <linearGradient id="hatch-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="30%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="hatch-mask">
          <rect width="850" height="500" fill="url(#hatch-fade)" />
        </mask>

        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id="curve-clip">
          <path d={`${shortTermCurve} L 800 500 L 70 500 Z`} />
        </clipPath>
      </defs>

      <g mask="url(#canvas-mask)">
        <rect width="850" height="500" fill="url(#chart-grid)" />

        <g stroke="currentColor" opacity="0.08" strokeWidth="0.5" fill="none">
          <circle cx="425" cy="250" r="180" />
          <circle cx="425" cy="250" r="320" strokeDasharray="4 4" />
          <line x1="50" y1="250" x2="800" y2="250" strokeDasharray="6 6" />
          <line x1="70" y1="390" x2="800" y2="70" strokeDasharray="2 8" />
        </g>

        <motion.g stroke="currentColor" opacity="0.34" strokeWidth="1.2" style={{ opacity: strokeOpacity }}>
          <line x1="70" y1="390" x2="800" y2="70" strokeDasharray="6 6" />
          <line x1="70" y1="390" x2="800" y2="390" strokeDasharray="3 10" opacity="0.35" />
          <text x="660" y="116" fontSize="9" fontFamily="sans-serif" fontWeight="700" letterSpacing="0.2em" fill="currentColor">
            PRODUCTIVITY
          </text>
        </motion.g>

        <motion.g style={{ opacity: fillOpacity }} mask="url(#hatch-mask)">
          <path d={`${shortTermCurve} L 800 500 L 70 500 Z`} fill="url(#premium-hatch)" />
          <g clipPath="url(#curve-clip)" opacity="0.55">
            {Array.from({ length: 26 }).map((_, index) => (
              <line
                key={`h-${index}`}
                x1={64 + index * 30}
                y1="145"
                x2={24 + index * 30}
                y2="500"
                stroke="#E5997B"
                strokeWidth="0.35"
                opacity="0.18"
              />
            ))}
          </g>
        </motion.g>

        <motion.path 
          d={longTermLine}
          fill="none" 
          stroke="#030035"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          style={{ pathLength: drawProgress, opacity: strokeOpacity }}
        />

        <motion.path 
          d={shortTermCurve}
          fill="none" 
          stroke="#030035"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: drawProgress, opacity: strokeOpacity }}
        />

        <motion.path 
          d={shortTermCurve}
          fill="none" 
          stroke="#E5997B" 
          strokeWidth="2.4" 
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: drawProgress, opacity: strokeOpacity }}
        />

        <motion.g style={{ opacity: fillOpacity }}>
          {[
            { x: 150, y: 290 }, { x: 225, y: 215 }, { x: 315, y: 160 },
            { x: 410, y: 125 }, { x: 505, y: 145 }, { x: 585, y: 300 },
            { x: 670, y: 285 }, { x: 755, y: 120 }
          ].map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#FFF" stroke="#E5997B" strokeWidth="1.5" />
          ))}

          <g transform="translate(545, 155)" fill="currentColor">
            <circle cx="0" cy="0" r="2.4" />
            <line x1="0" y1="0" x2="-38" y2="-30" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <text x="10" y="3" fontSize="8" fontFamily="sans-serif" fontWeight="700" letterSpacing="0.12em" opacity="0.75">
              SHORT-TERM CYCLE
            </text>
          </g>

          <g transform="translate(265, 350)" fill="currentColor">
            <line x1="0" y1="0" x2="110" y2="-12" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <text x="0" y="18" fontSize="8" fontFamily="sans-serif" fontWeight="700" letterSpacing="0.12em" opacity="0.7">
              LONG-TERM CYCLE
            </text>
          </g>
        </motion.g>
      </g>

      <motion.g style={{ opacity: strokeOpacity }} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="60" y1="60" x2="60" y2="430" />
        <line x1="60" y1="430" x2="805" y2="430" />
        <path d="M 56 74 L 60 60 L 64 74" />
        <path d="M 790 426 L 805 430 L 790 434" />
      </motion.g>
    </svg>
  )
}