export default function ProductVisual({ index, isActive = false, inverted = false }: { index: number; isActive?: boolean; inverted?: boolean }) {
  const stroke = inverted ? '#F4F4F5' : '#030035'
  const dim2 = 'rgba(229,153,123,0.7)'
  const activeFill = isActive 
    ? (inverted ? 'rgba(244,244,245,0.1)' : 'rgba(3,0,53,0.1)') 
    : (inverted ? 'rgba(244,244,245,0.03)' : 'rgba(3,0,53,0.03)')
  const activeStroke = isActive ? 1 : 0.4
  const activeDim = isActive ? 0.9 : 0.5
  const textColorDim = '#E5997B'

  const visuals = [
    // 01
    <svg key="s" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="15" y="70" width="16" height="55" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="15" y="85" width="16" height="40" rx="2" fill={activeFill} />
      <rect x="43" y="45" width="16" height="80" rx="2" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <rect x="43" y="60" width="16" height="65" rx="2" fill={activeFill} />
      <rect x="71" y="25" width="16" height="100" rx="2" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="71" y="40" width="16" height="85" rx="2" fill={activeFill} />
      <rect x="99" y="55" width="16" height="70" rx="2" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <rect x="99" y="70" width="16" height="55" rx="2" fill={activeFill} />
      <path d="M23 65 L51 40 L79 20 L107 50" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="107" cy="50" r="4" fill={textColorDim} />
    </svg>,

    // 02
    <svg key="b" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="18" y="75" width="22" height="55" rx="1" stroke={stroke} strokeOpacity={activeStroke} strokeWidth="1.5" />
      <rect x="18" y="95" width="22" height="35" fill={activeFill} />
      <rect x="100" y="55" width="22" height="75" rx="1" stroke={dim2} strokeOpacity={activeDim} strokeWidth="1.5" />
      <path d="M40 75 Q70 15 100 55" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="40" y1="75" x2="40" y2="130" stroke={stroke} strokeOpacity={activeDim} strokeDasharray="3 4" />
      <line x1="100" y1="55" x2="100" y2="130" stroke={dim2} strokeOpacity={activeDim} strokeDasharray="3 4" />
      <text x="29" y="68" fill={stroke} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>COST</text>
      <text x="111" y="48" fill={textColorDim} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeDim}>REV</text>
    </svg>,

    // 03
    <svg key="c" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="35" y="20" width="70" height="100" rx="2" stroke={stroke} strokeWidth="2" strokeOpacity={activeStroke} />
      <rect x="35" y="65" width="70" height="55" fill={activeFill} />
      <path d="M35 65 Q52 58 70 65 T105 65" stroke={dim2} strokeWidth="2" fill="none" />
      <line x1="112" y1="35" x2="125" y2="35" stroke={stroke} strokeOpacity={activeStroke} />
      <polygon points="122,30 130,35 122,40" fill={textColorDim} fillOpacity={activeDim} />
      <text x="28" y="90" fill={stroke} fontSize="7" textAnchor="end" fontFamily="monospace">LIQ</text>
      <text x="28" y="40" fill={textColorDim} fontSize="7" textAnchor="end" fontFamily="monospace" opacity={activeDim}>USE</text>
    </svg>,

    // 04
    <svg key="a" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <circle cx="105" cy="30" r="14" fill={activeFill} stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <line x1="70" y1="125" x2="70" y2="55" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M70 85 Q50 72 42 50" stroke={dim2} strokeWidth="2" fill="none" />
      <path d="M70 75 Q90 62 98 40" stroke={dim2} strokeWidth="2" fill="none" />
      <ellipse cx="42" cy="45" rx="7" ry="14" fill={activeFill} stroke={stroke} strokeWidth="1" strokeOpacity={activeStroke} />
      <ellipse cx="98" cy="35" rx="7" ry="14" fill={activeFill} stroke={stroke} strokeWidth="1" strokeOpacity={activeStroke} />
      <circle cx="35" cy="125" r="3" fill={textColorDim} fillOpacity={activeDim} />
      <circle cx="70" cy="125" r="3" fill={stroke} fillOpacity={activeStroke} />
      <circle cx="105" cy="125" r="3" fill={textColorDim} fillOpacity={activeDim} />
    </svg>,

    // 05
    <svg key="f" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="12" y="42" width="34" height="48" rx="3" stroke={dim2} strokeWidth="1.5" strokeOpacity={activeDim} />
      <line x1="20" y1="58" x2="38" y2="58" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <line x1="20" y1="68" x2="34" y2="68" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <line x1="20" y1="78" x2="30" y2="78" stroke={dim2} strokeWidth="2" strokeOpacity={activeDim} />
      <path d="M55 66 L85 66" stroke={stroke} strokeWidth="2.5" strokeDasharray="4 4" />
      <polygon points="80,60 92,66 80,72" fill={textColorDim} />
      <circle cx="115" cy="66" r="18" stroke={stroke} strokeWidth="2" fill={activeFill} />
      <text x="115" y="70" fill={stroke} fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">$</text>
      <text x="115" y="108" fill={textColorDim} fontSize="6" textAnchor="middle" fontFamily="monospace" opacity={activeDim}>ACTIVO</text>
    </svg>,

    // 06
    <svg key="l" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="40" y="22" width="60" height="42" rx="4" stroke={stroke} strokeWidth="1.5" fill={activeFill} strokeOpacity={activeStroke} />
      <rect x="48" y="30" width="18" height="12" fill={dim2} opacity={activeDim} />
      <rect x="74" y="30" width="18" height="12" fill={dim2} opacity={activeDim} />
      <circle cx="55" cy="72" r="6" stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <circle cx="85" cy="72" r="6" stroke={stroke} strokeWidth="1.5" strokeOpacity={activeStroke} />
      <rect x="15" y="92" width="110" height="10" rx="5" fill={stroke} fillOpacity={0.05} stroke={dim2} strokeWidth="0.5" />
      <rect x="15" y="92" width="78" height="10" rx="5" fill={textColorDim} fillOpacity={activeDim} />
      <text x="70" y="120" fill={stroke} fontSize="7" textAnchor="middle" fontFamily="monospace" opacity={activeStroke}>LIQUIDEZ INMEDIATA</text>
    </svg>,
  ]

  return visuals[index] ?? null
}
