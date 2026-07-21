import { useState } from "react";

type NodeId = "1" | "2" | "3" | "4" | "5" | "iterate" | "6" | "7" | "8" | "9";

interface NodeDef {
  id: NodeId;
  label: string;
  title: string;
  phase: string;
  tag: string;
  description: string;
  cx: number;
  cy: number;
  r: number;
}

const C = {
  navy: "#030035",
  bronze: "#E5997B",
  white: "#F4F4F5",
  lineGlow: "rgba(244, 244, 245, 0.25)",
};

const NODES: NodeDef[] = [
  { id: "1", label: "01", title: "Diagnóstico Estructural Prospectivo", phase: "identificacion", tag: "Fase de Identificación", description: 'Revisión integral del perfil corporativo y los requerimientos de la entidad. Se analiza escalabilidad, contexto y mapeo preliminar para alinear necesidades con la viabilidad técnica inicial, a través de un ejercicio de empatía financiera.', cx: 140, cy: 420, r: 25 },
  { id: "2", label: "02", title: "Sincronización de Condiciones Técnicas", phase: "identificacion", tag: "Fase de Identificación", description: "Se determina el producto financiero preliminar y sus componentes estructurales con base en el diagnóstico. Intercambio directo de métricas detalladas: valuaciones fiduciarias, tasas, plazos y garantías, estableciendo las reglas de gobernanza antes del análisis de riesgo.", cx: 220, cy: 290, r: 25 },
  { id: "3", label: "03", title: "Sincronización con Fondeadores Institucionales", phase: "identificacion", tag: "Fase de Identificación", description: "Ejecución de un protocolo de alineación estratégico-técnico con SOFOMEs e instituciones financieras aliadas. El vehículo financiero preliminar se presenta ante los comités de crédito para obtener una pre-aprobación técnica.", cx: 310, cy: 130, r: 25 },
  { id: "4", label: "04", title: "Ejecución de Filtros de Exclusión", phase: "identificacion", tag: "Fase de Identificación", description: "Evaluación crítica de los criterios de exclusión del sistema financiero. Se realizan validaciones de buró de crédito e integridad reputacional para determinar la viabilidad de la solicitud, bloqueando el avance ante factores de riesgo sistémico insalvables.", cx: 410, cy: 280, r: 30 },
  { id: "5", label: "05", title: "Integración y Evaluación Macroeconómica", phase: "pivot", tag: "Punto de Inflexión", description: "Recopilación integral de información para due diligence multidisciplinario (legal, fiscal, contable y financiero) y aplicación del Modelo de Ingeniería Económica derivado de la adaptación del modelo de Ray Dalio. Este análisis determina la viabilidad estructural y solvencia de la entidad solicitante.", cx: 560, cy: 430, r: 25 },
  { id: "iterate", label: "ITERAR", title: "Protocolo de Reconfiguración", phase: "iterate", tag: "Protocolo de Reconfiguración", description: "Mecanismo de ajuste técnico diseñado para entidades con indicadores de solvencia subóptimos. No representa un rechazo, sino una Intervención Estratégica. DIMA ejecuta una transformación del balance y la estructura corporativa, refinando la arquitectura hasta alcanzar la solvencia y resiliencia operativa necesarias.", cx: 560, cy: 280, r: 35 },
  { id: "6", label: "06", title: "Integración Documental", phase: "consolidacion", tag: "Fase de Consolidación", description: "Ejecución del protocolo de organización, refinamiento y formalización del expediente crediticio auditable. Se aplica el Modelo de Ingeniería Económica para mapear la genética financiera del negocio, determinando el qué, cómo, cuánto y por qué de la generación de valor.", cx: 740, cy: 190, r: 25 },
  { id: "7", label: "07", title: "Formalización y Protección Fiduciaria", phase: "consolidacion", tag: "Fase de Consolidación", description: "Estructuración legal integral de la transacción. Se establecen las garantías y fideicomisos necesarios, creando un marco legal robusto que garantiza la transparencia operativa y protege el capital desplegado frente a fluctuaciones del mercado.", cx: 910, cy: 130, r: 25 },
  { id: "8", label: "08", title: "Dispersión de Capital Productivo", phase: "consolidacion", tag: "Fase de Consolidación", description: "Despliegue técnico de los recursos financieros. La inyección de liquidez se ejecuta como un adelanto estratégico de gasto, activando un apalancamiento diseñado exclusivamente para la adquisición de activos y la expansión operativa.", cx: 1010, cy: 280, r: 25 },
  { id: "9", label: "09", title: "Gobernanza y Consultoría de Ciclos", phase: "consolidacion", tag: "Fase de Consolidación", description: "La relación no termina con la dispersión — escala junto con el negocio. DIMA da seguimiento al cumplimiento de covenants y a la eficiencia del capital, si es necesario, preparando a la empresa para ciclos crediticios futuros más eficientes.", cx: 860, cy: 430, r: 25 },
];
// Urutan looping: 1-9 -> iterate -> 4-9 -> loop back 1
const NAV_SEQUENCE: NodeId[] = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", 
  "iterate", 
  "4", "5", "6", "7", "8", "9"
];

export default function ProcesodiagramaSimple() {
  const [seqIndex, setSeqIndex] = useState<number>(-1);
  const active = seqIndex !== -1 ? NAV_SEQUENCE[seqIndex] : null;
  const activeNode = NODES.find((n) => n.id === active) || null;

  const handleNodeClick = (id: NodeId) => {
    if (active === id) {
      setSeqIndex(-1);
    } else {
      const firstIdx = NAV_SEQUENCE.indexOf(id);
      setSeqIndex(firstIdx !== -1 ? firstIdx : 0);
    }
  };

  const handleNext = () => {
    if (seqIndex === -1) setSeqIndex(0);
    else setSeqIndex((seqIndex + 1) % NAV_SEQUENCE.length);
  };

  const handlePrev = () => {
    if (seqIndex === -1) setSeqIndex(NAV_SEQUENCE.length - 1);
    else setSeqIndex((seqIndex - 1 + NAV_SEQUENCE.length) % NAV_SEQUENCE.length);
  };

  return (
    <div className="min-h-screen w-full bg-[#030035] text-[#F4F4F5] font-sans pt-32 pb-20 flex flex-col justify-between overflow-x-hidden">
      
      {/* ═════ AREA DIAGRAM: DIPERKECIL, DIBATASI LEBAR MAKSIMUM ═════ */}
      <div className="w-full relative flex flex-col md:flex-row items-center justify-center mb-16 px-6 md:px-12">
        
        {/* KIRI: Tombol Cerrar - digeser ke kanan (dari md:left-12 menjadi md:left-24) */}
        <div className="w-full md:w-auto md:absolute md:left-24 flex justify-center mb-6 md:mb-0 z-10">
          <button 
            onClick={() => setSeqIndex(-1)} 
            className={`px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-md shadow-lg ${
              seqIndex === -1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* TENGAH: Diagram digeser ke kiri via margin negatif */}
        <div className="w-full flex justify-center px-4 -ml-10 md:-ml-20">
          <svg viewBox="10 80 1070 420" className="w-full max-w-[1700px] h-auto overflow-visible select-none">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="brightGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Marker Icon '>' Penunjuk Arah Neon */}
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 2 1 L 8 5 L 2 9" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
              
              <style>{`
                @keyframes elegantWave {
                  0% { transform: scale(1); opacity: 1; stroke-width: 4.5; }
                  50% { opacity: 0.6; stroke-width: 2.5; }
                  100% { transform: scale(1.45); opacity: 0; stroke-width: 0.8; }
                }
                .wave-ring {
                  animation: elegantWave 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1);
                  transform-box: fill-box;
                  transform-origin: center;
                }
                /* Efek Animasi Redup Menyala murni (Fade) */
                .fade-line {
                  animation: lineFadeIn 0.4s ease-in-out forwards;
                }
                @keyframes lineFadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
              `}</style>
            </defs>

            {/* Line dari 9 ke 4 dihapus sesuai permintaan */}

            {/* Alur Jalur Garis Utama */}
            <path d="M 60 460 C 100 460, 100 420, 140 420 C 180 420, 180 290, 220 290 C 260 290, 270 130, 310 130 C 360 130, 360 280, 410 280" fill="none" stroke={C.lineGlow} strokeWidth="2.5" filter="url(#glow)" />
            <circle cx="560" cy="280" r="150" fill="none" stroke={C.lineGlow} strokeWidth="2.5" filter="url(#glow)" />
            <circle cx="860" cy="280" r="150" fill="none" stroke={C.lineGlow} strokeWidth="2.5" filter="url(#glow)" />

            <text x="560" y="235" textAnchor="middle" fill="rgba(244,244,245,0.4)" fontSize="12" letterSpacing="1">¿Viabilidad / Intervención?</text>

            {/* LOGIK GARIS MENYALA DENGAN FADE & INDIKATOR UTAMA PANAH */}
            {seqIndex !== -1 && (() => {
              let pathD = "";
              
              // Jika berada di indeks iterate (9), matikan seluruh cahaya line sesuai request
              if (active === "iterate") return null;

              if (seqIndex === 0) pathD = "M 60 460 C 100 460, 100 420, 140 420";
              else if (seqIndex === 1) pathD = "M 140 420 C 180 420, 180 290, 220 290";
              else if (seqIndex === 2) pathD = "M 220 290 C 260 290, 270 130, 310 130";
              else if (seqIndex === 3) pathD = "M 310 130 C 360 130, 360 280, 410 280";
              else if (seqIndex === 4) pathD = "M 410 280 A 150 150 0 0 0 560 430";
              else if (seqIndex === 5) pathD = "M 560 430 C 630 430, 700 320, 740 190";
              else if (seqIndex === 6) pathD = "M 740 190 C 780 140, 850 120, 910 130";
              else if (seqIndex === 7) pathD = "M 910 130 C 970 150, 1010 210, 1010 280";
              else if (seqIndex === 8) pathD = "M 1010 280 A 150 150 0 0 1 860 430";
              // seqIndex 9 = node "9" itu sendiri (tidak ada garis baru di sini)
              // seqIndex 10 = transisi 9 -> 4: garis dihapus sesuai permintaan (tidak digambar)
              else if (seqIndex === 11) pathD = "M 410 280 A 150 150 0 0 0 560 430";
              else if (seqIndex === 12) pathD = "M 560 430 C 630 430, 700 320, 740 190";
              else if (seqIndex === 13) pathD = "M 740 190 C 780 140, 850 120, 910 130";
              else if (seqIndex === 14) pathD = "M 910 130 C 970 150, 1010 210, 1010 280";
              else if (seqIndex === 15) pathD = "M 1010 280 A 150 150 0 0 1 860 430";

              return pathD ? (
                <path 
                  key={seqIndex} // Force re-mount agar animasi fade-in ke-trigger setiap ganti indeks
                  d={pathD} 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="3.5" 
                  filter="url(#brightGlow)" 
                  markerEnd="url(#arrow)"
                  strokeLinecap="round" 
                  className="fade-line" 
                />
              ) : null;
            })()}

            {NODES.map((n) => {
              const isActive = active === n.id;
              return (
                <g 
                  key={n.id} 
                  onClick={() => handleNodeClick(n.id)}
                  className="cursor-pointer transition-all duration-300" 
                  style={{ opacity: active && !isActive ? 0.75 : 1 }}
                >
                  {isActive && (
                    <>
                      <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={C.bronze} className="wave-ring" filter="url(#brightGlow)" />
                      <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={C.bronze} strokeWidth="3" opacity="0.9" />
                    </>
                  )}
                  
                  <circle cx={n.cx} cy={n.cy} r={n.r} fill={C.bronze} />
                  <text x={n.cx} y={n.cy + (n.id === "iterate" ? 4 : 5)} textAnchor="middle" fill={C.navy} fontWeight="bold" fontSize={n.id === "iterate" ? "11" : "14"}>
                    {n.label}
                  </text>
                  <text x={n.cx} y={n.cy + n.r + 18} textAnchor="middle" fill={C.white} fontSize="12" opacity={isActive ? 1 : 0.75}>
                    {n.title.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* KANAN: Navigasi Vertikal - digeser ke kiri (dari md:right-12 menjadi md:right-24) */}
        <div className="w-full md:w-auto md:absolute md:right-24 flex justify-center mt-6 md:mt-0 z-10">
          <div className={`flex flex-col gap-2.5 transition-all duration-300 ${seqIndex === -1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button 
              onClick={handlePrev} 
              className="px-5 py-2.5 rounded-full border border-[#E5997B]/30 bg-[#E5997B]/5 text-[#E5997B] hover:bg-[#E5997B]/20 hover:border-[#E5997B] font-mono text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-md min-w-[100px]"
            >
              ↑ Prev
            </button>
            <button 
              onClick={handleNext} 
              className="px-5 py-2.5 rounded-full bg-[#E5997B] text-[#030035] font-bold hover:bg-opacity-90 font-mono text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#E5997B]/20 min-w-[100px]"
            >
              Next ↓
            </button>
          </div>
        </div>

      </div>

      {/* ═════ AREA BAWAH: PANEL DESKRIPSI ═════ */}
      <div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mt-auto px-8 md:px-16 xl:px-24">
        
        <div className="w-full flex flex-col gap-4 text-white/50 text-xl leading-relaxed text-justify">
  <p>
    Nuestro proceso se organiza en tres fases que integran la comprensión
    macroeconómica de Ray Dalio con la práctica crediticia. No somos un
    intermediario tradicional — somos una institución de pensamiento aplicado
    que mapea, evalúa y consolida la genética financiera de cada entidad.
  </p>
  <p>
    Ninguna empresa avanza sin superar el filtro de solvencia. Cuando no
    califica, no la descartamos — la intervenimos, reconfigurando su
    estructura hasta alcanzar la resiliencia necesaria. La relación no
    termina con el desembolso: escala junto con el negocio.
  </p>
</div>

        <div className="w-full flex flex-col min-h-[350px]">
          {!activeNode ? (
            <div className="animate-fade-in flex flex-col gap-4">
              <h2 className="text-4xl lg:text-5xl font-serif italic text-[#E5997B]">Explorar el proceso</h2>
              <p className="text-white/60 text-xl lg:text-2xl leading-relaxed font-light">
                Seleccione cualquier nodo en el diagrama superior para ver los detalles y especificaciones de cada fase operativa de DIMA.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <span className="text-sm tracking-[0.3em] uppercase font-mono text-[#E5997B] font-bold">
                  {activeNode.tag}
                </span>
                <h2 className="text-5xl lg:text-6xl font-serif mt-4 mb-6 text-white leading-tight">
                  {activeNode.title}
                </h2>
                <div className="h-px w-24 bg-[#E5997B]/50 mb-8" />
                <p className="text-white/80 text-2xl lg:text-3xl leading-relaxed font-light text-justify">
                  {activeNode.description}
                </p>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}