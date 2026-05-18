/* ─────────────────────────────────────────────────────────────────────────────
   EngravingIllustrations.tsx
   Ilustrasi SVG gaya engraving/sketch untuk produk & elemen brand DIMA Finance
   Dengan penambahan GRADASI PUTIH (#FFFFFF) agar lebih "engraving" & 3D
───────────────────────────────────────────────────────────────────────────── */
const S = '#E5997B'   // bronze stroke
const SW = 1          // stroke width standar

interface IllustProps {
  className?: string
  opacity?: number
  color?: string
}

export interface ProductPointIconProps {
  index?: number
  drawProgress: any
}

// =========================================================================================
// ── HELPER: DEFINISI GRADASI PUTIH ──
// =========================================================================================
const EngravingGradients = () => (
  <defs>
    {/* Gradasi Putih Pudar ke Bawah (Vertikal) */}
    <linearGradient id="grad-white-down" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>

    {/* Gradasi Putih Pudar ke Atas (Vertikal) */}
    <linearGradient id="grad-white-up" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>

    {/* Gradasi Radial (Terang di Tengah, Pudar di Pinggir) */}
    <radialGradient id="grad-white-radial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </radialGradient>

    {/* Gradasi Diagonal Kanan Bawah */}
    <linearGradient id="grad-white-diag" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
  </defs>
)

const productPointIcons = [
  IllustSimpleCredit,
  IllustBridgeCredit,
  IllustCurrentAccount,
  IllustAgroCredit,
  IllustLeasing,
  IllustFactoring,
]

export function ProductPointIcon({ index = 0, drawProgress }: ProductPointIconProps) {
  const Icon = productPointIcons[index % productPointIcons.length] ?? IllustSimpleCredit
  void drawProgress

  return (
    <div className="relative w-[76vw] max-w-[760px] md:w-[46vw] lg:w-[42vw] h-auto">
      <Icon className="w-full h-auto" color="#E5997B" />
    </div>
  )
}

/* ── 01 Crédito Simple — gedung bertumbuh ── */
export function IllustSimpleCredit({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <line x1="20" y1="172" x2="180" y2="172" stroke={color} strokeWidth={SW} />
      <rect x="62" y="80" width="76" height="92" stroke={color} strokeWidth={SW} />
      <line x1="62" y1="112" x2="138" y2="112" stroke={color} strokeWidth="0.5" />
      <line x1="62" y1="140" x2="138" y2="140" stroke={color} strokeWidth="0.5" />
      <rect x="72" y="89" width="14" height="14" stroke={color} strokeWidth="0.7" />
      <line x1="72" y1="89" x2="86" y2="103" stroke={color} strokeWidth="0.35" />
      <line x1="76" y1="89" x2="86" y2="99"  stroke={color} strokeWidth="0.35" />
      <rect x="114" y="89" width="14" height="14" stroke={color} strokeWidth="0.7" />
      <line x1="114" y1="89" x2="128" y2="103" stroke={color} strokeWidth="0.35" />
      <line x1="118" y1="89" x2="128" y2="99"  stroke={color} strokeWidth="0.35" />
      <rect x="72" y="118" width="14" height="14" stroke={color} strokeWidth="0.7" />
      <rect x="114" y="118" width="14" height="14" stroke={color} strokeWidth="0.7" />
      <line x1="72" y1="118" x2="86" y2="132" stroke={color} strokeWidth="0.35" />
      <line x1="114" y1="118" x2="128" y2="132" stroke={color} strokeWidth="0.35" />
      <rect x="89" y="148" width="22" height="24" rx="2" stroke={color} strokeWidth="0.8" />
      <rect x="28" y="120" width="12" height="52" stroke={color} strokeWidth="0.8" />
      <line x1="28" y1="130" x2="40" y2="130" stroke={color} strokeWidth="0.35" />
      <line x1="28" y1="140" x2="40" y2="140" stroke={color} strokeWidth="0.35" />
      <line x1="28" y1="150" x2="40" y2="150" stroke={color} strokeWidth="0.35" />
      <line x1="28" y1="160" x2="40" y2="160" stroke={color} strokeWidth="0.35" />
      <rect x="44" y="100" width="12" height="72" stroke={color} strokeWidth="0.8" />
      <line x1="44" y1="110" x2="56" y2="110" stroke={color} strokeWidth="0.35" />
      <line x1="44" y1="120" x2="56" y2="120" stroke={color} strokeWidth="0.35" />
      <line x1="44" y1="130" x2="56" y2="130" stroke={color} strokeWidth="0.35" />
      <line x1="44" y1="140" x2="56" y2="140" stroke={color} strokeWidth="0.35" />
      <line x1="44" y1="150" x2="56" y2="150" stroke={color} strokeWidth="0.35" />
      <line x1="44" y1="160" x2="56" y2="160" stroke={color} strokeWidth="0.35" />
      <line x1="100" y1="74" x2="100" y2="28" stroke={color} strokeWidth={SW} />
      <line x1="100" y1="28" x2="93"  y2="38" stroke={color} strokeWidth={SW} />
      <line x1="100" y1="28" x2="107" y2="38" stroke={color} strokeWidth={SW} />
    </svg>
  )
}

/* ── 02 Crédito Puente — jembatan konstruksi ── */
export function IllustBridgeCredit({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <line x1="10"  y1="155" x2="190" y2="155" stroke={color} strokeWidth="0.4" strokeDasharray="6 4" />
      <line x1="10"  y1="161" x2="190" y2="161" stroke={color} strokeWidth="0.3" strokeDasharray="4 6" />
      <line x1="10"  y1="167" x2="190" y2="167" stroke={color} strokeWidth="0.3" strokeDasharray="5 5" />
      <line x1="10" y1="120" x2="190" y2="120" stroke={color} strokeWidth={SW} />
      <rect x="28" y="60" width="16" height="60" stroke={color} strokeWidth={SW} />
      <line x1="28" y1="72" x2="44" y2="72" stroke={color} strokeWidth="0.5" />
      <line x1="28" y1="84" x2="44" y2="84" stroke={color} strokeWidth="0.5" />
      <line x1="28" y1="96" x2="44" y2="96" stroke={color} strokeWidth="0.5" />
      <line x1="28" y1="108" x2="44" y2="108" stroke={color} strokeWidth="0.5" />
      <polygon points="36,48 28,60 44,60" stroke={color} strokeWidth="0.8" />
      <rect x="156" y="60" width="16" height="60" stroke={color} strokeWidth={SW} />
      <line x1="156" y1="72" x2="172" y2="72" stroke={color} strokeWidth="0.5" />
      <line x1="156" y1="84" x2="172" y2="84" stroke={color} strokeWidth="0.5" />
      <line x1="156" y1="96" x2="172" y2="96" stroke={color} strokeWidth="0.5" />
      <line x1="156" y1="108" x2="172" y2="108" stroke={color} strokeWidth="0.5" />
      <polygon points="164,48 156,60 172,60" stroke={color} strokeWidth="0.8" />
      <path d="M36 50 Q100 85 164 50" stroke={color} strokeWidth="0.8" />
      {[60, 80, 100, 120, 140].map(x => {
        const t  = (x - 36) / (164 - 36)
        const cy = 50 + 35 * 4 * t * (1 - t)
        return <line key={x} x1={x} y1={cy} x2={x} y2={120} stroke={color} strokeWidth="0.5" />
      })}
      <line x1="120" y1="28" x2="120" y2="120" stroke={color} strokeWidth="0.8" />
      <line x1="120" y1="28" x2="150" y2="28"  stroke={color} strokeWidth="0.8" />
      <line x1="150" y1="28" x2="150" y2="80"  stroke={color} strokeWidth="0.6" strokeDasharray="3 3" />
      <path d="M148 80 Q145 86 150 88 Q155 90 153 84" stroke={color} strokeWidth="0.7" />
    </svg>
  )
}

/* ── 03 Cuenta Corriente — siklus berputar ── */
export function IllustCurrentAccount({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <circle cx="100" cy="100" r="72" stroke={color} strokeWidth="0.7" strokeDasharray="4 5" />
      <circle cx="100" cy="100" r="58" stroke={color} strokeWidth={SW} />
      <path d="M100 42 A58 58 0 0 1 158 100" stroke={color} strokeWidth={SW} />
      <polygon points="158,100 148,88 162,86" stroke={color} strokeWidth="0.8" />
      <path d="M100 158 A58 58 0 0 1 42 100" stroke={color} strokeWidth={SW} />
      <polygon points="42,100 52,112 38,114" stroke={color} strokeWidth="0.8" />
      <circle cx="100" cy="100" r="30" stroke={color} strokeWidth="0.8" />
      <line x1="100" y1="80" x2="100" y2="120" stroke={color} strokeWidth={SW} />
      <path d="M88 90 Q100 84 112 90 Q118 96 112 102 Q100 108 88 102 Q82 96 88 90" stroke={color} strokeWidth="0.9" />
      <line x1="84" y1="90" x2="116" y2="90" stroke={color} strokeWidth="0.6" />
      <line x1="84" y1="110" x2="116" y2="110" stroke={color} strokeWidth="0.6" />
      <line x1="70" y1="70" x2="78" y2="78" stroke={color} strokeWidth="0.4" />
      <line x1="74" y1="66" x2="82" y2="74" stroke={color} strokeWidth="0.3" />
      <line x1="122" y1="122" x2="130" y2="130" stroke={color} strokeWidth="0.4" />
      <line x1="118" y1="126" x2="126" y2="134" stroke={color} strokeWidth="0.3" />
    </svg>
  )
}

/* ── 04 Crédito Agroindustrial — tanaman & panen ── */
export function IllustAgroCredit({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <line x1="10" y1="148" x2="190" y2="148" stroke={color} strokeWidth={SW} />
      <path d="M100 148 Q88 162 80 172"  stroke={color} strokeWidth="0.8" />
      <path d="M100 148 Q112 162 120 172" stroke={color} strokeWidth="0.8" />
      <path d="M100 148 Q90 170 90 180"  stroke={color} strokeWidth="0.6" />
      <path d="M100 148 Q110 170 110 180" stroke={color} strokeWidth="0.6" />
      <path d="M100 148 Q100 168 100 180" stroke={color} strokeWidth="0.7" />
      <line x1="100" y1="28" x2="100" y2="148" stroke={color} strokeWidth={SW} />
      <ellipse cx="80" cy="60" rx="10" ry="18" stroke={color} strokeWidth="0.9" transform="rotate(-20 80 60)" />
      <line x1="84" y1="50" x2="76" y2="70" stroke={color} strokeWidth="0.35" />
      <line x1="80" y1="48" x2="80" y2="72" stroke={color} strokeWidth="0.35" />
      <ellipse cx="74" cy="84" rx="9"  ry="16" stroke={color} strokeWidth="0.9" transform="rotate(-25 74 84)" />
      <line x1="78" y1="75" x2="70" y2="93" stroke={color} strokeWidth="0.35" />
      <ellipse cx="70" cy="108" rx="8" ry="14" stroke={color} strokeWidth="0.9" transform="rotate(-28 70 108)" />
      <ellipse cx="120" cy="60" rx="10" ry="18" stroke={color} strokeWidth="0.9" transform="rotate(20 120 60)" />
      <line x1="116" y1="50" x2="124" y2="70" stroke={color} strokeWidth="0.35" />
      <line x1="120" y1="48" x2="120" y2="72" stroke={color} strokeWidth="0.35" />
      <ellipse cx="126" cy="84" rx="9"  ry="16" stroke={color} strokeWidth="0.9" transform="rotate(25 126 84)" />
      <line x1="122" y1="75" x2="130" y2="93" stroke={color} strokeWidth="0.35" />
      <ellipse cx="130" cy="108" rx="8" ry="14" stroke={color} strokeWidth="0.9" transform="rotate(28 130 108)" />
      <circle cx="100" cy="30" r="12" stroke={color} strokeWidth="0.9" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
        const r  = Math.PI * deg / 180
        const x1 = 100 + 14 * Math.cos(r)
        const y1 = 30  + 14 * Math.sin(r)
        const x2 = 100 + 20 * Math.cos(r)
        const y2 = 30  + 20 * Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.6" />
      })}
    </svg>
  )
}

/* ── 05 Arrendamiento Financiero — mesin & roda gigi ── */
export function IllustLeasing({ className = '', opacity = 1, color = S }: IllustProps) {
  const teeth = 10
  const outerR = 58, innerR = 46, toothH = 10
  const pts = Array.from({ length: teeth * 2 }, (_, i) => {
    const angle  = (Math.PI * 2 * i) / (teeth * 2) - Math.PI / 2
    const r      = i % 2 === 0 ? outerR : outerR - toothH
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
  }).join(' ')

  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <polygon points={pts} stroke={color} strokeWidth={SW} />
      <circle cx="100" cy="100" r={outerR} stroke={color} strokeWidth="0.4" strokeDasharray="2 6" />
      <circle cx="100" cy="100" r={innerR} stroke={color} strokeWidth="0.7" />
      <circle cx="100" cy="100" r="16" stroke={color} strokeWidth={SW} />
      <circle cx="100" cy="100" r="6"  stroke={color} strokeWidth="0.8" />
      {[0, 60, 120, 180, 240, 300].map(deg => {
        const r  = Math.PI * deg / 180
        const x1 = 100 + 16 * Math.cos(r)
        const y1 = 100 + 16 * Math.sin(r)
        const x2 = 100 + innerR * Math.cos(r)
        const y2 = 100 + innerR * Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.8" />
      })}
      <circle cx="158" cy="60" r="20" stroke={color} strokeWidth="0.8" />
      <circle cx="158" cy="60" r="12" stroke={color} strokeWidth="0.6" />
      <circle cx="158" cy="60" r="4"  stroke={color} strokeWidth="0.7" />
      {[0,45,90,135,180,225,270,315].map(deg => {
        const r  = Math.PI * deg / 180
        return <line key={deg}
          x1={158 + 12 * Math.cos(r)} y1={60 + 12 * Math.sin(r)}
          x2={158 + 20 * Math.cos(r)} y2={60 + 20 * Math.sin(r)}
          stroke={color} strokeWidth="0.6"
        />
      })}
      <line x1="138" y1="72" x2="148" y2="80" stroke={color} strokeWidth="0.7" strokeDasharray="2 3" />
      <line x1="60" y1="170" x2="140" y2="170" stroke={color} strokeWidth={SW} />
      <line x1="80" y1="158" x2="80"  y2="170" stroke={color} strokeWidth="0.9" />
      <line x1="120" y1="158" x2="120" y2="170" stroke={color} strokeWidth="0.9" />
      <line x1="60" y1="170" x2="50"  y2="180" stroke={color} strokeWidth="0.7" />
      <line x1="140" y1="170" x2="150" y2="180" stroke={color} strokeWidth="0.7" />
    </svg>
  )
}

/* ── 06 Factoring — dokumen & aliran kas ── */
export function IllustFactoring({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <path d="M40 30 L130 30 L160 60 L160 170 L40 170 Z" stroke={color} strokeWidth={SW} />
      <path d="M130 30 L130 60 L160 60" stroke={color} strokeWidth="0.8" />
      {[80, 95, 110, 125, 140].map(y => (
        <line key={y} x1="58" y1={y} x2={y < 125 ? 142 : 110} y2={y} stroke={color} strokeWidth="0.6" />
      ))}
      <line x1="58" y1="50" x2="118" y2="50" stroke={color} strokeWidth="0.8" />
      <circle cx="130" cy="130" r="22" stroke={color} strokeWidth="0.8" />
      <circle cx="130" cy="130" r="16" stroke={color} strokeWidth="0.5" strokeDasharray="2 3" />
      <path d="M120 130 L126 138 L142 122" stroke={color} strokeWidth="1.2" />
      <line x1="160" y1="100" x2="192" y2="100" stroke={color} strokeWidth={SW} />
      <line x1="192" y1="100" x2="182" y2="92"  stroke={color} strokeWidth={SW} />
      <line x1="192" y1="100" x2="182" y2="108" stroke={color} strokeWidth={SW} />
      <circle cx="192" cy="72"  r="12" stroke={color} strokeWidth="0.8" />
      <ellipse cx="192" cy="72"  rx="12" ry="4" stroke={color} strokeWidth="0.6" />
      <circle cx="192" cy="64"  r="12" stroke={color} strokeWidth="0.8" />
      <ellipse cx="192" cy="64"  rx="12" ry="4" stroke={color} strokeWidth="0.6" />
      <circle cx="192" cy="56"  r="12" stroke={color} strokeWidth="0.8" />
      {[83, 90, 97, 104].map(y => (
        <line key={y} x1="60" y1={y} x2="90" y2={y - 6} stroke={color} strokeWidth="0.25" opacity="0.5" />
      ))}
    </svg>
  )
}

/* ── DIAMOND brand mark — engraving style ── */
export function IllustDiamond({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <polygon points="100,20 180,100 100,180 20,100" stroke={color} strokeWidth={SW} />
      <polygon points="100,50 150,100 100,150 50,100" stroke={color} strokeWidth="0.7" />
      <line x1="100" y1="20"  x2="100" y2="180" stroke={color} strokeWidth="0.4" strokeDasharray="3 5" />
      <line x1="20"  y1="100" x2="180" y2="100" stroke={color} strokeWidth="0.4" strokeDasharray="3 5" />
      <line x1="100" y1="20"  x2="100" y2="100" stroke={color} strokeWidth="0.6" />
      <line x1="180" y1="100" x2="100" y2="100" stroke={color} strokeWidth="0.6" />
      <polygon points="100,20 150,100 100,100 50,100" stroke={color} strokeWidth="0.5" opacity="0.5" />
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={55 + i * 9} y1={100 + i * 9} x2={55 + i * 9 + 9} y2={100} stroke={color} strokeWidth="0.35" />
      ))}
      <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="0.35" strokeDasharray="2 8" />
    </svg>
  )
}

/* ── BALANCE SCALES — equilibrium ── */
export function IllustBalance({ className = '', opacity = 1, color = S }: IllustProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={{ opacity }}>
      <EngravingGradients />

      {/* ORIGINAL CODE */}
      <line x1="70" y1="180" x2="130" y2="180" stroke={color} strokeWidth={SW} />
      <line x1="100" y1="180" x2="100" y2="50"  stroke={color} strokeWidth={SW} />
      <line x1="30"  y1="80" x2="170" y2="80" stroke={color} strokeWidth={SW} />
      <circle cx="100" cy="80" r="5" stroke={color} strokeWidth="0.9" />
      <line x1="40"  y1="80" x2="30"  y2="110" stroke={color} strokeWidth="0.8" />
      <line x1="40"  y1="80" x2="60"  y2="110" stroke={color} strokeWidth="0.8" />
      <path d="M28 110 Q45 118 62 110" stroke={color} strokeWidth="0.9" />
      <ellipse cx="45" cy="107" rx="10" ry="3"  stroke={color} strokeWidth="0.7" />
      <ellipse cx="45" cy="103" rx="10" ry="3"  stroke={color} strokeWidth="0.7" />
      <ellipse cx="45" cy="99"  rx="10" ry="3"  stroke={color} strokeWidth="0.7" />
      <line x1="160" y1="80" x2="150" y2="110" stroke={color} strokeWidth="0.8" />
      <line x1="160" y1="80" x2="170" y2="110" stroke={color} strokeWidth="0.8" />
      <path d="M148 110 Q160 118 172 110" stroke={color} strokeWidth="0.9" />
      <rect x="150" y="100" width="20" height="10" stroke={color} strokeWidth="0.7" />
      <line x1="150" y1="104" x2="170" y2="104" stroke={color} strokeWidth="0.4" />
      {[0,1,2,3].map(i => (
        <line key={i} x1={72 + i * 8} y1={180} x2={72 + i * 8} y2={188} stroke={color} strokeWidth="0.5" />
      ))}
    </svg>
  )
}