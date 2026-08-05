/* ─────────────────────────────────────────────────────────────────────────────
   EngravingIllustrations.tsx
   Ilustrasi SVG gaya High-End Engraving/Sketch untuk DIMA Finance.
   Menggunakan TRI-COLOR SYSTEM dengan teknik Arsiran Padat (Hatching).
   
   ⚠️ TRUE DRAWLINE EFFECT: Menggunakan teknik MASKING untuk efek "blueprint tracing".
───────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from 'react'

const N = '#F4F4F5'   // Navy (Deep Shadows, Outlines, Etching)
const S = '#E5997B'   // Bronze (Midtones, Texture, Accents)
const W = '#030035'   // White (Highlights, Base)

interface IllustProps {
  className?: string
  opacity?: number
  color?: string
}

export interface ProductPointIconProps {
  index?: number
  //drawProgress harus dikirim dari parent (0.0 sampai 1.0)
  drawProgress?: any
}

// =========================================================================================
// ── HELPER: DEFINISI ASSET UKIRAN & POLA (MASK DIHAPUS) ──
// =========================================================================================
const EngravingAssets = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <pattern id="pattern-s-hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke={S} strokeWidth="0.5" opacity="0.8"/>
      </pattern>
      <pattern id="pattern-n-cross" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(25)">
        <line x1="0" y1="0" x2="0" y2="3" stroke={N} strokeWidth="0.4" opacity="0.6"/>
        <line x1="0" y1="0" x2="3" y2="0" stroke={N} strokeWidth="0.4" opacity="0.6"/>
      </pattern>
      <radialGradient id="grad-white-soft" cx="50%" cy="50%" r="80%">
        <stop offset="0%" stopColor={W} stopOpacity="0.6" />
        <stop offset="100%" stopColor={W} stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const TexturedShape = ({ d, type = 's-hatch', ...props }: { d: string, type?: 's-hatch' | 'n-cross', [key: string]: any }) => (
  <path d={d} fill={type === 's-hatch' ? "url(#pattern-s-hatch)" : "url(#pattern-n-cross)"} {...props} />
)

// =========================================================================================
// ── KOMPONEN RENDER UTAMA (EFEK SLIDING DOOR CSS) ──
// =========================================================================================
const productPointIcons = [
  IllustSimpleCredit,
  IllustBridgeCredit,
  IllustStrategicPlanning,
  IllustAgroCredit,
  IllustLeasing,
  IllustFactoring,
]

export function ProductPointIcon({ index = 0, drawProgress = 1 }: ProductPointIconProps) {
  const Icon = productPointIcons[index % productPointIcons.length] ?? IllustSimpleCredit
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inject progress ke variable --p
    const updateProgress = (v: number) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--p', String(Math.max(0, Math.min(1, v))))
      }
    }
    
    let initialV = 1
    if (typeof drawProgress === 'number') initialV = drawProgress
    else if (typeof drawProgress?.get === 'function') initialV = drawProgress.get()
    updateProgress(initialV)

    if (typeof drawProgress?.on === 'function') {
      return drawProgress.on('change', updateProgress)
    }
  }, [drawProgress])

  return (
    <div ref={containerRef} className="relative w-full h-full flex justify-center items-center">
      <EngravingAssets />
      
      <div 
        className="relative w-full h-full max-w-none drop-shadow-xl aspect-square"
        // INI KUNCINYA: Efek pintu geser (wipe) dari bawah ke atas menggunakan CSS clip-path
        style={{ 
          clipPath: 'inset(calc((1 - var(--p)) * 100%) 0 0 0)',
          WebkitClipPath: 'inset(calc((1 - var(--p)) * 100%) 0 0 0)',
          transition: 'clip-path 0.1s ease-out'
        } as React.CSSProperties}
      >
        <Icon className="w-full h-auto" />
      </div>
    </div>
  )
}

// =========================================================================================
// ── 01 CRÉDITO SIMPLE (Gedung Bertumbuh / Etched Architecture) ──
// =========================================================================================
export function IllustSimpleCredit({ className = '', opacity = 1 }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <rect x="20" y="170" width="160" height="15" fill="url(#pattern-n-cross)" rx="2" stroke={N} strokeWidth="0.5"/>
      <rect x="65" y="70" width="70" height="100" stroke={N} strokeWidth="1.5" fill="url(#pattern-s-hatch)" />
      <rect x="125" y="70" width="10" height="100" fill="url(#pattern-n-cross)" opacity="0.8" />
      <path d="M 60 70 L 140 70 L 135 60 L 65 60 Z" fill={N} stroke={N} />
      {[63, 66].map(y => <line key={y} x1="68" y1={y} x2="132" y2={y} stroke={W} strokeWidth="0.5"/>)}
      {[ [75,85], [110,85], [75,115], [110,115] ].map(([x,y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="15" height="18" stroke={N} strokeWidth="1" fill={W} />
          <line x1={x+7.5} y1={y} x2={x+7.5} y2={y+18} stroke={N} strokeWidth="0.5"/>
          <line x1={x} y1={y+9} x2={x+15} y2={y+9} stroke={N} strokeWidth="0.5"/>
        </g>
      ))}
      <rect x="90" y="145" width="20" height="25" rx="1" fill={N} stroke={N} />
      <circle cx="95" cy="158" r="1" fill={W}/>
      <g>
        <rect x="30" y="120" width="10" height="50" stroke={N} strokeWidth="1" fill="url(#pattern-s-hatch)" />
        <rect x="45" y="100" width="10" height="70" stroke={N} strokeWidth="1" fill="url(#pattern-s-hatch)" />
        <path d="M 100 50 L 100 20 M 100 20 L 93 28 M 100 20 L 107 28" stroke={S} strokeWidth="2" strokeLinecap="round"/>
      </g>
      <circle cx="100" cy="60" r="50" fill="url(#grad-white-soft)" opacity="0.5"/>
    </svg>
  )
}

// =========================================================================================
// ── 02 CRÉDITO PUENTE (Jembatan Ukir / Engraved Infrastructure) ──
// =========================================================================================
export function IllustBridgeCredit({ className = '', opacity = 1 }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <TexturedShape d="M 5 150 Q 50 140 100 150 Q 150 160 195 150 L 195 190 L 5 190 Z" type="n-cross" opacity="0.7" />
      <path d="M 5 150 Q 50 140 100 150 Q 150 160 195 150" stroke={N} strokeWidth="1" />
      <path d="M 10 160 Q 50 155 100 160 Q 150 165 190 160" stroke={S} strokeWidth="0.5" strokeDasharray="4 2"/>
      {[35, 145].map(x => (
        <g key={x}>
          <rect x={x} y="60" width="20" height="95" stroke={N} strokeWidth="1.2" fill="url(#pattern-s-hatch)" />
          <path d={`M ${x} 80 L ${x+20} 100 M ${x} 100 L ${x+20} 80 M ${x} 120 L ${x+20} 140 M ${x} 140 L ${x+20} 120`} stroke={N} strokeWidth="0.5" opacity="0.5"/>
          <rect x={x-2} y="55" width="24" height="6" fill={N} rx="1"/>
        </g>
      ))}
      <rect x="10" y="115" width="180" height="8" rx="1" fill={N} stroke={N} />
      <line x1="10" y1="119" x2="190" y2="119" stroke={W} strokeWidth="0.5" strokeDasharray="5 3"/>
      <path d="M 45 60 Q 100 100 155 60" stroke={N} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 45 57 Q 100 97 155 57" stroke={S} strokeWidth="1" fill="none"/>
      {[65, 82, 100, 118, 135].map(x => {
        const t = (x - 45) / 110;
        const yCurve = 60 + (4 * 40 * t * (1-t));
        return <line key={x} x1={x} y1={yCurve} x2={x} y2="115" stroke={N} strokeWidth="0.8"/>
      })}
      <g transform="translate(150, 20)">
        <rect x="0" y="0" width="3" height="40" fill={S}/>
        <rect x="-15" y="0" width="25" height="3" fill={S}/>
        <path d="M 8 3 L 8 20 Q 8 25 12 25" stroke={N} strokeWidth="1" fill="none"/>
        <rect x="11" y="24" width="4" height="6" fill={N}/>
      </g>
    </svg>
  )
}

// =========================================================================================
// ── 03 STRATEGIC PLANNING (Papan Target Bersih & Grafik / Clean Target) ──
// =========================================================================================
// Ikon 3: Cuma target dan grafik, gedung bank sudah dihapus bersih.
export function IllustStrategicPlanning({ className = '', opacity = 1 }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      {/* Background Skala Grid */}
      <g opacity="0.4">
        {[40, 60, 80, 100, 120, 140, 160].map(y => <line key={`h${y}`} x1="20" y1={y} x2="180" y2={y} stroke={N} strokeWidth="0.5" />)}
        {[40, 60, 80, 100, 120, 140, 160].map(x => <line key={`v${x}`} x1={x} y1="20" x2={x} y2="180" stroke={N} strokeWidth="0.5" />)}
      </g>
      
      {/* Grafik Pertumbuhan */}
      <polyline points="20,150 50,120 80,130 130,60 170,30" fill="none" stroke={S} strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points="20,150 50,120 80,130 130,60 170,30" fill="none" stroke={W} strokeWidth="0.5" strokeLinejoin="round" />
      {[ [20,150], [50,120], [80,130], [130,60], [170,30] ].map(([x,y], i) => (
        <circle key={`pt-${i}`} cx={x} cy={y} r="3" fill={N} stroke={W} strokeWidth="0.5" />
      ))}

      {/* Target (Bullseye) */}
      <circle cx="100" cy="100" r="45" fill={W} stroke={N} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="35" fill="url(#pattern-s-hatch)" stroke={N} strokeWidth="1" />
      <circle cx="100" cy="100" r="22" fill={W} stroke={N} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="10" fill={N} stroke={N} strokeWidth="1" />
      <circle cx="100" cy="100" r="4" fill={S} />

      {/* Anak Panah */}
      <line x1="150" y1="50" x2="102" y2="98" stroke={N} strokeWidth="2" strokeLinecap="round" />
      <line x1="148" y1="52" x2="102" y2="98" stroke={W} strokeWidth="0.5" />
      <line x1="135" y1="55" x2="145" y2="65" stroke={S} strokeWidth="1.5" />
      <line x1="140" y1="50" x2="150" y2="60" stroke={S} strokeWidth="1.5" />
      <line x1="145" y1="45" x2="155" y2="55" stroke={S} strokeWidth="1.5" />
    </svg>
  )
}

// =========================================================================================
// ── 04 CRÉDITO AGROINDUSTRIAL (Tanaman Ukir / Etched Harvest) ──
// =========================================================================================
export function IllustAgroCredit({ className = '', opacity = 1 }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <path d="M 15 160 Q 100 145 185 160 L 185 185 L 15 185 Z" fill="url(#pattern-n-cross)" rx="2" />
      <path d="M 15 160 Q 100 145 185 160" stroke={N} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="97" y="40" width="6" height="115" rx="1" fill={N} />
      <line x1="100" y1="42" x2="100" y2="153" stroke={W} strokeWidth="0.5" opacity="0.6"/>
      {[
        {ty: 50, rot: -30}, {ty: 70, rot: -35}, {ty: 90, rot: -40}
      ].map((grain, i) => (
        <g key={`gl-${i}`} transform={`translate(98, ${grain.ty}) rotate(${grain.rot})`}>
          <path d="M 0 0 C -15 -5, -25 -20, -10 -35 C -5 -25, 0 -10, 0 0 Z" fill="url(#pattern-s-hatch)" stroke={N} strokeWidth="0.8"/>
          <path d="M -2 -10 Q -10 -20 -8 -30" stroke={N} strokeWidth="0.4" opacity="0.7"/>
        </g>
      ))}
      {[
        {ty: 50, rot: 30}, {ty: 70, rot: 35}, {ty: 90, rot: 40}
      ].map((grain, i) => (
        <g key={`gr-${i}`} transform={`translate(102, ${grain.ty}) rotate(${grain.rot})`}>
          <path d="M 0 0 C 15 -5, 25 -20, 10 -35 C 5 -25, 0 -10, 0 0 Z" fill="url(#pattern-s-hatch)" stroke={N} strokeWidth="0.8"/>
          <path d="M 2 -10 Q 10 -20 8 -30" stroke={N} strokeWidth="0.4" opacity="0.7"/>
        </g>
      ))}
      <g transform="translate(100, 30)">
        <circle cx="0" cy="0" r="10" fill={S} stroke={N} strokeWidth="1"/>
        <circle cx="0" cy="0" r="7" fill="url(#pattern-s-hatch)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <line key={a} x1="0" y1="0" x2={16 * Math.cos(a * Math.PI/180)} y2={16 * Math.sin(a * Math.PI/180)} stroke={S} strokeWidth="1" strokeLinecap="round"/>
        ))}
      </g>
    </svg>
  )
}

// =========================================================================================
// ── 05 ARRENDAMIENTO (Roda Gigi Industri / Etched Mechanics) ──
// =========================================================================================
export function IllustLeasing({ className = '', opacity = 1 }: IllustProps) {
  const makeGearPath = (cx: number, cy: number, outerR: number, teeth: number, toothH: number) => {
    let d = "";
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (Math.PI * 2 * i) / (teeth * 2);
      const r = i % 2 === 0 ? outerR : outerR - toothH;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      d += (i === 0 ? "M " : "L ") + x + " " + y;
    }
    d += " Z";
    return d;
  }
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <path d={makeGearPath(90, 90, 65, 12, 10)} fill="url(#pattern-s-hatch)" stroke={N} strokeWidth="1.5"/>
      <circle cx="90" cy="90" r="35" fill={W} stroke={N} strokeWidth="1"/>
      <circle cx="90" cy="90" r="30" fill="url(#pattern-n-cross)" stroke={N} strokeWidth="0.5" opacity="0.8" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <line key={a} x1="90" y1="90" x2={90 + 35 * Math.cos(a*Math.PI/180)} y2={90 + 35 * Math.sin(a*Math.PI/180)} stroke={N} strokeWidth="2" strokeLinecap="round"/>
      ))}
      <circle cx="90" cy="90" r="8" fill={S} stroke={N} strokeWidth="1"/>
      <path d={makeGearPath(150, 140, 35, 8, 7)} fill={N} stroke={N} strokeWidth="1"/>
      <circle cx="150" cy="140" r="15" fill={W} stroke={N} strokeWidth="0.8"/>
      <circle cx="150" cy="140" r="10" fill="url(#pattern-s-hatch)" stroke={S} strokeWidth="0.5"/>
      <g transform="translate(30, 140) rotate(-45)">
        <rect x="0" y="0" width="8" height="60" rx="2" fill={S} stroke={N} strokeWidth="1"/>
        <circle cx="4" cy="4" r="8" fill={S} stroke={N} strokeWidth="1"/>
        <rect x="0" y="-1" width="8" height="5" fill={W}/>
      </g>
      <ellipse cx="70" cy="70" rx="30" ry="15" transform="rotate(-45 70 70)" fill="url(#grad-white-soft)" opacity="0.5"/>
    </svg>
  )
}

// =========================================================================================
// ── 06 FACTORING (Dokumen & Aliran Kas / Etched Ledger) ──
// =========================================================================================
export function IllustFactoring({ className = '', opacity = 1 }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <path d="M 50 30 L 130 30 L 160 60 L 160 170 L 50 170 Z" fill="url(#pattern-s-hatch)" stroke={N} strokeWidth="1.2" />
      <path d="M 130 30 L 130 60 L 160 60 Z" fill={N} stroke={N} />
      <path d="M 130 60 L 155 35" stroke={W} strokeWidth="0.5" opacity="0.5"/>
      <g transform="translate(65, 80)">
        {[0, 15, 30, 45, 60].map(y => (
          <line key={y} x1="0" y1={y} x2={y > 30 ? 50 : 80} y2={y} stroke={N} strokeWidth="1" opacity="0.8"/>
        ))}
        <rect x="0" y="-30" width="50" height="4" fill={S} rx="1"/>
        <rect x="0" y="-20" width="80" height="2" fill={N} rx="0.5"/>
      </g>
      <g transform="translate(130, 130)">
        <circle cx="0" cy="0" r="25" fill={W} stroke={N} strokeWidth="1"/>
        <circle cx="0" cy="0" r="20" fill="url(#pattern-n-cross)" opacity="0.2" stroke={S} strokeWidth="0.5" strokeDasharray="2 1"/>
        <path d="M -10 0 L -3 8 L 12 -10" stroke={S} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M -10 0 L -3 8 L 12 -10" stroke={W} strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
      </g>
      {[ [170, 90, 10], [175, 105, 12], [165, 120, 10] ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={N} stroke={N} strokeWidth="1"/>
          <circle cx={cx} cy={cy} r={r-3} stroke={S} strokeWidth="0.5" fill="url(#pattern-s-hatch)" opacity="0.6"/>
          <path d={`M ${cx} ${cy-r+5} L ${cx} ${cy+r-5} M ${cx-3} ${cy-3} Q ${cx+3} ${cy-3} ${cx} ${cy} Q ${cx-3} ${cy+3} ${cx+3} ${cy+3}`} stroke={W} strokeWidth="0.8" opacity="0.9"/>
        </g>
      ))}
    </svg>
  )
}