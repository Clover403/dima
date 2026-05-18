import { motion } from 'framer-motion'

interface DalioChartProps {
  drawProgress: any
  fillOpacity: any
}

export function DalioEconomicChart({ drawProgress, fillOpacity }: DalioChartProps) {
  const bellCurve = 'M 50 400 C 300 400, 350 80, 500 80 C 650 80, 700 400, 950 400'

  return (
    <svg 
      viewBox="0 0 1000 500" 
      className="w-full h-auto text-[#030035] overflow-visible drop-shadow-xl z-10"
    >
      <defs>
        {/* ISIAN CREAM TETAP DIPERTAHANKAN BIAR MATCH SAMA CARDS */}
        <linearGradient id="dalio-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCF8F1" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FCF8F1" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FCF8F1" stopOpacity="0.4" />
        </linearGradient>
        
        <filter id="dalio-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
        
        <pattern id="chart-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        </pattern>

        {/* ARSIRAN DIUBAH KE WARNA GELAP (currentColor) AGAR TERLIHAT */}
        <pattern id="dalio-hatch" patternUnits="userSpaceOnUse" width="10" height="10">
          <line 
            x1="5" y1="0" 
            x2="5" y2="10" 
            stroke="currentColor" 
            strokeWidth="1" 
            opacity="0.25" 
          />
          <line 
            x1="0" y1="0" 
            x2="10" y2="10" 
            stroke="currentColor" 
            strokeWidth="1" 
            opacity="0.15" 
          />
        </pattern>
      </defs>

      <rect x="0" y="0" width="1000" height="500" fill="url(#chart-grid)" />

      <motion.g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        
        <motion.line
          x1="50"
          y1="400"
          x2="950"
          y2="400"
          strokeWidth="1"
          opacity="0.2"
          strokeDasharray="1000"
          style={{ pathLength: drawProgress }}
        />

        {/* Layer Arsiran */}
        <motion.path 
          d={`${bellCurve} L 950 400 L 50 400 Z`}
          fill="url(#dalio-hatch)"
          stroke="none"
          style={{ opacity: fillOpacity }}
        />
        
        {/* Layer Gradient Cream */}
        <motion.path 
          d={`${bellCurve} L 950 400 L 50 400 Z`}
          fill="url(#dalio-gradient)"
          stroke="none"
          style={{ opacity: fillOpacity }}
        />

        <motion.path 
          d={bellCurve}
          strokeWidth="6" 
          opacity="1"
          filter="url(#dalio-shadow)"
          strokeDasharray="1000"
          style={{ pathLength: drawProgress }}
        />
        
        {/* Garis putih di atas kurva */}
        <motion.path 
          d={bellCurve}
          strokeWidth="3" 
          stroke="#FCF8F1"
          opacity="0.9"
          strokeDasharray="1000"
          style={{ pathLength: drawProgress }}
        />

        {/* Lekukan Bawah dikembalikan ke gelap tipis agar selaras dengan ukiran */}
        <motion.g style={{ opacity: fillOpacity }}>
          {Array.from({ length: 18 }).map((_, index) => {
            const x = 70 + index * 52
            return (
              <path
                key={`engrave-${index}`}
                d={`M ${x} 404 Q ${x + 10} 392, ${x + 24} 400`}
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.3"
                fill="none"
              />
            )
          })}
        </motion.g>

        <text x="260" y="240" textAnchor="end" dominantBaseline="middle" className="font-serif" fontSize="26" fill="currentColor" style={{ opacity: fillOpacity }} fontWeight="500" stroke="none">Rise</text>
        <text x="500" y="40" textAnchor="middle" dominantBaseline="middle" className="font-serif" fontSize="30" fill="currentColor" style={{ opacity: fillOpacity }} fontWeight="600" stroke="none">Empire</text>
        <text x="740" y="240" textAnchor="start" dominantBaseline="middle" className="font-serif" fontSize="26" fill="currentColor" style={{ opacity: fillOpacity }} fontWeight="500" stroke="none">Decline</text>
        
      </motion.g>
    </svg>
  )
}