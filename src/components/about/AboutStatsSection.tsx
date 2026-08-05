import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import HoverTrailOverlay from '../HoverTrailOverlay';

const STATS = [
  {
    value: 'SOFOM',
    sub: 'E.N.R.',
    label: 'Entidad financiera no bancaria regulada. Operamos con la agilidad que los bancos no tienen — y con la rigurosidad que el mercado exige.',
    mono: true,
  },
  {
    value: 'Rechazos',
    sub: '',
    label: 'Ninguna empresa es descartada. Aquellas que no califican son intervenidas estratégicamente hasta alcanzar la solvencia necesaria.',
    mono: false,
  },
  {
    value: 'Nodos',
    sub: '',
    label: 'Etapas del proceso crediticio. Un modelo de ingeniería económica que diagnostica, evalúa y estructura cada crédito desde la causa, no desde el síntoma.',
    mono: false,
  },
  {
    value: 'Sectores',
    sub: '',
    label: 'La elegibilidad no depende del giro ni del tamaño — depende de la capacidad de pago real y verificable de la entidad.',
    mono: false,
  },
];

const TICKER_TEXT = 'SOFOM • México • Ingeniería Financiera • Ray Dalio Framework • Arquitectos de Equilibrio • Crédito Empresarial • Análisis Macroeconómico • ';

const getVisual = (index: number) => {
  const strokeDark = "#060030";
  const strokePeach = "#E5997B";
  const fillPeach = "rgba(229, 153, 123, 0.15)";
  const strokeWidth = "1.5";

  const visuals = [
    <svg key="s" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="15" y="70" width="16" height="55" rx="2" stroke={strokeDark} strokeWidth={strokeWidth} />
      <rect x="15" y="85" width="16" height="40" rx="2" fill={fillPeach} />
      <rect x="43" y="45" width="16" height="80" rx="2" stroke={strokeDark} strokeWidth={strokeWidth} />
      <rect x="43" y="60" width="16" height="65" rx="2" fill={fillPeach} />
      <rect x="71" y="25" width="16" height="100" rx="2" stroke={strokePeach} strokeWidth={strokeWidth} />
      <rect x="71" y="40" width="16" height="85" rx="2" fill={fillPeach} />
      <rect x="99" y="55" width="16" height="70" rx="2" stroke={strokeDark} strokeWidth={strokeWidth} />
      <rect x="99" y="70" width="16" height="55" rx="2" fill={fillPeach} />
      <path d="M23 65 L51 40 L79 20 L107 50" stroke={strokePeach} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="107" cy="50" r="4" fill={strokePeach} />
    </svg>,
    <svg key="b" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="18" y="75" width="22" height="55" rx="1" stroke={strokeDark} strokeWidth={strokeWidth} />
      <rect x="18" y="95" width="22" height="35" fill={fillPeach} />
      <rect x="100" y="55" width="22" height="75" rx="1" stroke={strokePeach} strokeWidth={strokeWidth} />
      <path d="M40 75 Q70 15 100 55" stroke={strokeDark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="40" y1="75" x2="40" y2="130" stroke={strokeDark} strokeOpacity="0.4" strokeDasharray="3 4" />
      <line x1="100" y1="55" x2="100" y2="130" stroke={strokePeach} strokeOpacity="0.4" strokeDasharray="3 4" />
      <text x="29" y="68" fill={strokeDark} fontSize="8" textAnchor="middle" fontFamily="monospace">COST</text>
      <text x="111" y="48" fill={strokePeach} fontSize="8" textAnchor="middle" fontFamily="monospace">REV</text>
    </svg>,
    <svg key="c" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <rect x="35" y="20" width="70" height="100" rx="2" stroke={strokeDark} strokeWidth={strokeWidth} />
      <rect x="35" y="65" width="70" height="55" fill={fillPeach} />
      <path d="M35 65 Q52 58" stroke={strokePeach} strokeWidth="2" fill="none" />
      <line x1="112" y1="35" x2="125" y2="35" stroke={strokePeach} strokeWidth={strokeWidth} />
      <polygon points="122,30 130,35 122,40" fill={strokePeach} />
      <text x="28" y="90" fill={strokeDark} fontSize="8" textAnchor="end" fontFamily="monospace">LIQ</text>
      <text x="28" y="40" fill={strokePeach} fontSize="8" textAnchor="end" fontFamily="monospace">USE</text>
    </svg>,
    <svg key="a" viewBox="0 0 140 140" className="w-full h-full" fill="none">
      <circle cx="105" cy="30" r="14" fill={fillPeach} stroke={strokePeach} strokeWidth={strokeWidth} />
      <line x1="70" y1="125" x2="70" y2="55" stroke={strokeDark} strokeWidth="3" strokeLinecap="round" />
      <path d="M70 85 Q50 72 42 50" stroke={strokeDark} strokeWidth="2" fill="none" />
      <path d="M70 75 Q90 62 98 40" stroke={strokeDark} strokeWidth="2" fill="none" />
      <ellipse cx="42" cy="45" rx="7" ry="14" fill={fillPeach} stroke={strokePeach} strokeWidth="1" />
      <ellipse cx="98" cy="35" rx="7" ry="14" fill={fillPeach} stroke={strokePeach} strokeWidth="1" />
      <circle cx="35" cy="125" r="3" fill={strokePeach} />
      <circle cx="70" cy="125" r="3" fill={strokeDark} />
      <circle cx="105" cy="125" r="3" fill={strokePeach} />
    </svg>
  ];

  return visuals[index % visuals.length];
};

export default function AboutStatsSection() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // ── HOOKS MULTI-LAYER MOUSE PARALLAX & 3D TILT ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.5 });

  // Canvas Grid (Background Layer) - Mundur
  const backX = useTransform(smoothMouseX, [-0.5, 0.5], [15, -15]);
  const backY = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);

  // Polaroid Images (Foreground Layer) - Maju
  const frontX = useTransform(smoothMouseX, [-0.5, 0.5], [-25, 25]);
  const frontY = useTransform(smoothMouseY, [-0.5, 0.5], [-25, 25]);

  // Flip Cards (Mid Layer) - Sedikit maju
  const gridX = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);
  const gridY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);

  // 3D Tilt untuk elemen depan
  const tiltX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const tiltY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  // ────────────────────────────────────────────────

  useLayoutEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;

    const drawBackground = () => {
      bgCanvas.width = bgCanvas.offsetWidth;
      bgCanvas.height = bgCanvas.offsetHeight;
      const ctx2d = bgCanvas.getContext('2d');
      if (!ctx2d) return;

      const cols = 28;
      const rows = 18;
      const cX = bgCanvas.width / cols;
      const cY = bgCanvas.height / rows;
      let seed = 42;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      const pts: [number, number][][] = [];
      for (let r = 0; r <= rows; r++) {
        pts[r] = [];
        for (let c = 0; c <= cols; c++) {
          pts[r][c] = [
            c * cX + ((c === 0 || c === cols) ? 0 : (rand() - 0.5) * cX * 0.40),
            r * cY + ((r === 0 || r === rows) ? 0 : (rand() - 0.5) * cY * 0.40),
          ];
        }
      }

      const triangles: [number, number][][] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          triangles.push([pts[r][c], pts[r][c + 1], pts[r + 1][c]]);
          triangles.push([pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]]);
        }

      const NAVY_CRACK = '#060030';
      ctx2d.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx2d.fillStyle = NAVY_CRACK;
      ctx2d.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

      triangles.forEach((tri) => {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
        const shade = 0.92 + Math.random() * 0.08;
        ctx2d.save();
        ctx2d.translate(cx, cy);
        ctx2d.scale(0.97, 0.97);
        ctx2d.translate(-cx, -cy);
        ctx2d.beginPath();
        ctx2d.moveTo(tri[0][0], tri[0][1]);
        ctx2d.lineTo(tri[1][0], tri[1][1]);
        ctx2d.lineTo(tri[2][0], tri[2][1]);
        ctx2d.closePath();
        ctx2d.fillStyle = `rgb(${Math.round(3 * shade)},0,${Math.round(53 * shade)})`;
        ctx2d.fill();
        ctx2d.strokeStyle = 'rgba(0,0,10,0.65)';
        ctx2d.lineWidth = 0.7;
        ctx2d.stroke();
        ctx2d.restore();
      });
    };

    drawBackground();
    const resizeBg = () => drawBackground();
    window.addEventListener('resize', resizeBg);
    return () => window.removeEventListener('resize', resizeBg);
  }, []);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="stats-section relative w-full bg-[#030035] border-t border-white/10 overflow-hidden"
    >
      
      {/* Background Layer (Canvas) */}
      <motion.div className="absolute inset-[-5%] pointer-events-none z-0" style={{ x: backX, y: backY }}>
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.9 }}
        />
      </motion.div>

      {/* Ticker Top */}
      <div className="relative z-10 w-full overflow-hidden border-b border-white/10 py-3 bg-[#030035]/80 backdrop-blur-md">
        <div className="flex whitespace-nowrap">
          <div
            className="ticker-top flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-[#E5997B]/70 font-mono"
            style={{ animation: 'ticker 40s linear infinite' }}
          >
            {Array(8).fill(TICKER_TEXT).map((txt, i) => (
              <span key={i} className="flex items-center gap-4">
                {txt}
                <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0L10 5L5 10L0 5Z" fill="#E5997B" fillOpacity="0.8" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[110rem] mx-auto px-6 md:px-16 lg:px-24 py-24 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-20 lg:gap-56 xl:gap-64 items-center">

          {/* Polaroid Images Container */}
          <div className="relative w-full h-[650px] md:h-[800px] flex justify-center items-center mt-10 lg:mt-0 perspective-1000 cursor-none">
            <HoverTrailOverlay theme="navy" className="absolute inset-0 z-30 pointer-events-auto w-full h-full" />
            {/* Wrapper Parallax untuk kedua polaroid, tanpa preserve-3d agar Z-Index tidak error */}
            <motion.div style={{ x: frontX, y: frontY, rotateX: tiltX, rotateY: tiltY }} className="relative w-full h-full flex justify-center items-center">
              
              {/* Polaroid 1 (Belakang) */}
              <div className="absolute z-10 transform -rotate-12 -translate-x-36 md:-translate-x-48 -translate-y-12 md:-translate-y-24 bg-[#fdfdfd] p-5 pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[360px] md:w-[480px] border border-white/10 transition-transform duration-700 hover:-translate-y-32 hover:rotate-[-8deg]">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-36 h-8 bg-white/40 backdrop-blur-sm rotate-3 shadow-[0_1px_3px_rgba(0,0,0,0.1)] opacity-80" />
                <div className="bg-[#E5997B]/20 w-full aspect-square overflow-hidden border border-black/5">
                  <img src="foto/raydalio1.png" alt="Ray Dalio 1" className="w-full h-full object-cover grayscale opacity-90 contrast-125 mix-blend-multiply" />
                </div>
              </div>

              {/* Polaroid 2 (Depan) */}
              <div className="absolute z-20 transform rotate-6 translate-x-26 md:translate-x-48 translate-y-16 md:translate-y-24 bg-[#fdfdfd] p-5 pb-20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] w-[380px] md:w-[520px] border border-white/10 transition-transform duration-700 hover:translate-y-20 hover:rotate-4 hover:scale-105">
                <div className="absolute -top-5 left-1/3 -translate-x-1/2 w-40 h-8 bg-white/50 backdrop-blur-sm -rotate-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)] opacity-90" />
                <div className="bg-[#E5997B]/20 w-full aspect-square overflow-hidden border border-black/5">
                  <img src="foto/raydalio.png" alt="Ray Dalio 2" className="w-full h-full object-cover grayscale opacity-90 contrast-125 mix-blend-multiply" />
                </div>
              </div>

            </motion.div>
          </div>

          {/* 3D Flip Cards Grid dengan Parallax Mid */}
          <motion.div style={{ x: gridX, y: gridY }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full perspective-[2000px] lg:translate-x-20">            
            {STATS.map((stat, i) => (
              <div key={i} className="group relative w-full h-[360px] md:h-[400px] [perspective:1500px] cursor-pointer">
                
                <div className="relative w-full h-full transition-all duration-[800ms] ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)_translateY(-10px)]">
                  
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-3xl p-8 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50">
                    <div className="flex justify-between items-start w-full">
                      <div className="font-sans text-sm font-bold text-[#E5997B] bg-[#E5997B]/10 px-3 py-1.5 rounded-md">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="w-24 h-24 md:w-28 md:h-28">
                        {getVisual(i)}
                      </div>
                    </div>

                    <div className="mt-auto pt-2 flex flex-col gap-1">
                      <h3 
                        className="font-serif text-3xl md:text-4xl text-[#060030] tracking-tight"
                        style={stat.mono ? { fontFamily: "'Inter Tight', sans-serif" } : {}}
                      >
                        {stat.value}
                      </h3>
                      {stat.sub && (
                        <span className="font-mono text-xs text-[#060030]/50 uppercase tracking-widest">
                          {stat.sub}
                        </span>
                      )}
                      <p className="text-[#060030]/70 text-sm mt-2 leading-relaxed line-clamp-3">
                        {stat.label}
                      </p>
                    </div>
                  </div>

                  {/* BACK FACE - Teks diubah menjadi PUTIH (#FFFFFF / #F4F4F5) */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#E5997B] rounded-3xl p-8 flex flex-col justify-between shadow-xl border-none">
                    <div className="text-white/20 font-serif text-7xl leading-none select-none pointer-events-none h-6">
                      “
                    </div>
                    <p className="relative z-10 text-[#F4F4F5] text-xl md:text-2xl leading-relaxed font-medium text-center w-full px-2 my-auto" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                      {stat.label}
                    </p>
                    <div className="text-white/20 font-serif text-7xl leading-none select-none pointer-events-none h-6 text-right rotate-180">
                      “
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Ticker Bottom */}
      <div className="relative z-10 w-full overflow-hidden border-t border-white/10 py-3 bg-[#030035]/80 backdrop-blur-md">
        <div className="flex whitespace-nowrap">
          <div
            className="ticker-bottom flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-[#E5997B]/70 font-mono"
            style={{ animation: 'ticker 40s linear infinite reverse' }}
          >
            {Array(8).fill(TICKER_TEXT).map((txt, i) => (
              <span key={i} className="flex items-center gap-4">
                {txt}
                <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0L10 5L5 10L0 5Z" fill="#E5997B" fillOpacity="0.8" />
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