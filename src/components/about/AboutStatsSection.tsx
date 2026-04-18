const STATS = [
  {
    value: 'SOFOM',
    sub: 'E.N.R.',
    label: 'Entidad financiera no bancaria regulada. Operamos con la agilidad que los bancos no tienen — y con la rigurosidad que el mercado exige.',
    mono: true,
  },
  {
    value: '0',
    sub: 'rechazos',
    label: 'Ninguna empresa es descartada. Aquellas que no califican son intervenidas estratégicamente hasta alcanzar la solvencia necesaria.',
    mono: false,
  },
  {
    value: '6',
    sub: 'nodos',
    label: 'Etapas del proceso crediticio. Un modelo de ingeniería económica que diagnostica, evalúa y estructura cada crédito desde la causa, no desde el síntoma.',
    mono: false,
  },
  {
    value: '∞',
    sub: 'sectores',
    label: 'La elegibilidad no depende del giro ni del tamaño — depende de la capacidad de pago real y verificable de la entidad.',
    mono: false,
  },
];

const TICKER_TEXT = 'SOFOM • México • Ingeniería Financiera • Ray Dalio Framework • Arquitectos de Equilibrio • Crédito Empresarial • Análisis Macroeconómico • ';

export default function AboutStatsSection() {
  return (
    <section className="stats-section relative w-full bg-[#F4F4F5] border-t border-[#030035]/5 overflow-hidden">

      {/* Ticker top */}
      <div className="w-full overflow-hidden border-b border-[#030035]/5 py-3">
        <div className="flex whitespace-nowrap">
          <div
            className="ticker-top flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-[#030035]/20 font-mono"
            style={{ animation: 'ticker 40s linear infinite' }}
          >
            {Array(8).fill(TICKER_TEXT).map((txt, i) => (
              <span key={i} className="flex items-center gap-4">
                {txt}
                <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0L10 5L5 10L0 5Z" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.6" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Left — Compass instrument */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-full max-w-[380px] aspect-square">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(229,153,123,0.06) 0%, transparent 70%)',
                }}
              />
              <svg className="compass-svg w-full h-full" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="92" stroke="#030035" strokeWidth="0.2" strokeOpacity="0.12" strokeDasharray="1 5" />
                <circle cx="100" cy="100" r="86" stroke="#030035" strokeWidth="0.5" strokeOpacity="0.08" />
                {Array.from({ length: 72 }).map((_, i) => {
                  const isMajor = i % 9 === 0;
                  const angle = (i * 5 * Math.PI) / 180;
                  const r1 = isMajor ? 80 : 83;
                  const x1 = 100 + r1 * Math.cos(angle - Math.PI / 2);
                  const y1 = 100 + r1 * Math.sin(angle - Math.PI / 2);
                  const x2 = 100 + 86 * Math.cos(angle - Math.PI / 2);
                  const y2 = 100 + 86 * Math.sin(angle - Math.PI / 2);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#030035" strokeWidth={isMajor ? "0.6" : "0.3"} strokeOpacity={isMajor ? "0.3" : "0.12"} />;
                })}
                <circle cx="100" cy="100" r="68" stroke="#030035" strokeWidth="0.3" strokeOpacity="0.1" strokeDasharray="3 6" />
                <circle cx="100" cy="100" r="50" stroke="#030035" strokeWidth="0.2" strokeOpacity="0.08" />
                <line x1="100" y1="10" x2="100" y2="190" stroke="#030035" strokeWidth="0.2" strokeOpacity="0.1" />
                <line x1="10" y1="100" x2="190" y2="100" stroke="#030035" strokeWidth="0.2" strokeOpacity="0.1" />
                <line x1="36" y1="36" x2="164" y2="164" stroke="#030035" strokeWidth="0.15" strokeOpacity="0.06" />
                <line x1="164" y1="36" x2="36" y2="164" stroke="#030035" strokeWidth="0.15" strokeOpacity="0.06" />
                <path d="M100 18 L106 90 L180 100 L106 110 L100 182 L94 110 L20 100 L94 90 Z" stroke="#E5997B" strokeWidth="0.7" strokeOpacity="0.45" fill="none" />
                <path d="M148 52 L108 96 M52 52 L92 96 M52 148 L92 104 M148 148 L108 104" stroke="#E5997B" strokeWidth="0.4" strokeOpacity="0.25" />
                <path d="M100 18 L100 100 L106 90 Z" fill="#E5997B" fillOpacity="0.06" />
                <path d="M100 182 L100 100 L94 110 Z" fill="#E5997B" fillOpacity="0.04" />
                <circle cx="100" cy="100" r="14" stroke="#030035" strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
                <circle cx="100" cy="100" r="6" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
                <circle cx="100" cy="100" r="2.5" fill="#E5997B" fillOpacity="0.6" />
                {[
                  { x: 100, y: 8, t: 'N' }, { x: 100, y: 196, t: 'S' },
                  { x: 6, y: 103, t: 'W' }, { x: 194, y: 103, t: 'E' },
                ].map((p) => (
                  <text key={p.t} x={p.x} y={p.y} fill="#030035" fillOpacity="0.2" fontSize="7" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">{p.t}</text>
                ))}
              </svg>
            </div>

            {/* Left column descriptor */}
            <div className="text-center flex flex-col gap-3 max-w-[280px]">
              <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#030035]/25">
                Institución de Pensamiento Aplicado
              </p>
              <div className="w-8 h-px bg-[#E5997B]/20 mx-auto" />
              <p className="text-[#030035]/30 text-xs leading-relaxed font-light" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                Un modelo crediticio que no se limita a evaluar — interviene, estructura y acompaña.
              </p>
            </div>
          </div>

          {/* Right — Stats list */}
          <div className="flex flex-col divide-y divide-[#030035]/6">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item group py-8 flex items-start gap-8">
                {/* Bronze accent */}
                <div className="flex flex-col items-center gap-2 pt-3 flex-shrink-0">
                  <div className="w-px h-4 bg-[#E5997B]/30 group-hover:bg-[#E5997B]/60 transition-colors duration-500" />
                  <div className="w-1 h-1 bg-[#E5997B]/30 group-hover:bg-[#E5997B]/70 transition-colors duration-500" />
                </div>

                {/* Value + label */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-serif text-5xl md:text-6xl text-[#030035] font-light leading-none tracking-tight"
                      style={stat.mono ? { fontFamily: "'Inter Tight', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', letterSpacing: '-0.02em' } : {}}
                    >
                      {stat.value}
                    </span>
                    {stat.sub && (
                      <span className="font-mono text-[10px] text-[#E5997B]/55 tracking-widest uppercase">
                        {stat.sub}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-[#030035]/40 text-xs leading-[1.85] font-light max-w-xs"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>

                {/* Index */}
                <div className="pt-3 font-mono text-[8px] text-[#030035]/15 tracking-[0.3em] flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker bottom */}
      <div className="w-full overflow-hidden border-t border-[#030035]/5 py-3">
        <div className="flex whitespace-nowrap">
          <div
            className="ticker-bottom flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-[#030035]/20 font-mono"
            style={{ animation: 'ticker 40s linear infinite reverse' }}
          >
            {Array(8).fill(TICKER_TEXT).map((txt, i) => (
              <span key={i} className="flex items-center gap-4">
                {txt}
                <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0L10 5L5 10L0 5Z" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.6" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}