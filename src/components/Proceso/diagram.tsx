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
  theme: "bronze" | "dark";
  textLines: string[];
  textPos: { x: number; y: number; align: "start" | "middle" | "end" };
}

const C = {
  navy: "#030035",
  bronze: "#E5997B",
  white: "#F4F4F5",
  lightgray: "#D1D5DB",
  lineGlow: "rgba(244, 244, 245, 0.25)",
};

const NODES: NodeDef[] = [
  { id: "1", label: "", title: "Diagnóstico Estructural Prospectivo", phase: "identificacion", tag: "Fase de Identificación", description: 'Revisión integral del perfil corporativo y los requerimientos de la entidad. Se analiza escalabilidad, contexto y mapeo preliminar para alinear necesidades con la viabilidad técnica inicial, a través de un ejercicio de empatía financiera.', cx: 180, cy: 520, r: 28, theme: "bronze", textLines: ["Enlace", "Institucional"], textPos: { x: 180, y: 470, align: "middle" } },
  { id: "2", label: "1", title: "Sincronización de Condiciones Técnicas", phase: "identificacion", tag: "Fase de Identificación", description: "Se determina el producto financiero preliminar y sus componentes estructurales con base en el diagnóstico. Intercambio directo de métricas detalladas: valuaciones fiduciarias, tasas, plazos y garantías, estableciendo las reglas de gobernanza antes del análisis de riesgo.", cx: 300, cy: 440, r: 28, theme: "bronze", textLines: ["Diagnóstico y", "Alineación"], textPos: { x: 340, y: 435, align: "start" } },
  { id: "3", label: "2", title: "Sincronización con Fondeadores Institucionales", phase: "identificacion", tag: "Fase de Identificación", description: "Ejecución de un protocolo de alineación estratégico-técnico con SOFOMEs e instituciones financieras aliadas. El vehículo financiero preliminar se presenta ante los comités de crédito para obtener una pre-aprobación técnica.", cx: 390, cy: 220, r: 28, theme: "bronze", textLines: ["Sincronización"], textPos: { x: 345, y: 225, align: "end" } },
  { id: "4", label: "3", title: "Ejecución de Filtros de Exclusión", phase: "identificacion", tag: "Fase de Identificación", description: "Evaluación crítica de los criterios de exclusión del sistema financiero. Se realizan validaciones de buró de crédito e integridad reputacional para determinar la viabilidad de la solicitud, bloqueando el avance ante factores de riesgo sistémico insalvables.", cx: 460, cy: 400, r: 32, theme: "bronze", textLines: ["Recopilación y", "Validación"], textPos: { x: 505, y: 395, align: "start" } },
  { id: "5", label: "4", title: "Integración y Evaluación Macroeconómica", phase: "pivot", tag: "Punto de Inflexión", description: "Recopilación integral de información para due diligence multidisciplinario (legal, fiscal, contable y financiero) y aplicación del Modelo de Ingeniería Económica derivado de la adaptación del modelo de Ray Dalio. Este análisis determina la viabilidad estructural y solvencia de la entidad solicitante.", cx: 620, cy: 560, r: 28, theme: "bronze", textLines: ["Evaluación"], textPos: { x: 575, y: 565, align: "end" } },
  { id: "iterate", label: "", title: "Protocolo de Reconfiguración", phase: "iterate", tag: "Protocolo de Reconfiguración", description: "Mecanismo de ajuste técnico diseñado para entidades con indicadores de solvencia subóptimos. No representa un rechazo, sino una Intervención Estratégica. DIMA ejecuta una transformación del balance y la estructura corporativa, refinando la arquitectura hasta alcanzar la solvencia y resiliencia operativa necesarias.", cx: 730, cy: 270, r: 32, theme: "bronze", textLines: ["Intervención", "Estratégica"], textPos: { x: 730, y: 215, align: "middle" } },
  { id: "6", label: "5", title: "Integración Documental", phase: "consolidacion", tag: "Fase de Consolidación", description: "Ejecución del protocolo de organización, refinamiento y formalización del expediente crediticio auditable. Se aplica el Modelo de Ingeniería Económica para mapear la genética financiera del negocio, determinando el qué, cómo, cuánto y por qué de la generación de valor.", cx: 867, cy: 287, r: 28, theme: "dark", textLines: ["Integración"], textPos: { x: 910, y: 292, align: "start" } },
  { id: "7", label: "6", title: "Formalización y Protección Fiduciaria", phase: "consolidacion", tag: "Fase de Consolidación", description: "Estructuración legal integral de la transacción. Se establecen las garantías y fideicomisos necesarios, creando un marco legal robusto que garantiza la transparencia operativa y protege el capital desplegado frente a fluctuaciones del mercado.", cx: 980, cy: 240, r: 28, theme: "dark", textLines: ["Formalización"], textPos: { x: 1025, y: 245, align: "start" } },
  { id: "8", label: "7", title: "Dispersión de Capital Productivo", phase: "consolidacion", tag: "Fase de Consolidación", description: "Despliegue técnico de los recursos financieros. La inyección de liquidez se ejecuta como un adelanto estratégico de gasto, activando un apalancamiento diseñado exclusivamente para la adquisición de activos y la expansión operativa.", cx: 1140, cy: 400, r: 28, theme: "dark", textLines: ["Dispersión"], textPos: { x: 1095, y: 405, align: "end" } },
  { id: "9", label: "8", title: "Gobernanza y Consultoría de Ciclos", phase: "consolidacion", tag: "Fase de Consolidación", description: "La relación no termina con la dispersión — escala junto con el negocio. DIMA da seguimiento al cumplimiento de covenants y a la eficiencia del capital, si es necesario, preparando a la empresa para ciclos crediticios futuros más eficientes.", cx: 980, cy: 560, r: 28, theme: "dark", textLines: ["Gobernanza y", "Escalabilidad"], textPos: { x: 980, y: 615, align: "middle" } },
];

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
    <div className="min-h-screen w-full bg-[#030035] text-[#F4F4F5] font-sans pt-20 pb-20 flex flex-col justify-between overflow-x-hidden">
      
      <div className="w-full relative flex flex-col items-center justify-center mb-16 px-6 lg:px-12">
        
        {/* Tombol Cerrar */}
        <div className="w-full md:w-auto md:absolute md:left-20 md:top-10 flex justify-center mb-6 md:mb-0 z-20">
          <button 
            onClick={() => setSeqIndex(-1)} 
            className={`px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/70 hover:text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 backdrop-blur-md shadow-lg ${
              seqIndex === -1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* DIAGRAM SVG UTAMA - Digeser sedikit ke kanan (ml-4 md:ml-8) */}
        <div className="w-full flex justify-center px-2 ml-4 md:ml-8">
          <svg viewBox="0 0 1350 720" className="w-full max-w-[1500px] h-auto overflow-visible select-none">
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
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 2 1 L 8 5 L 2 9" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
              <marker id="arrow-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#F4F4F5" />
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
                .fade-line { animation: lineFadeIn 0.4s ease-in-out forwards; }
                @keyframes lineFadeIn { from { opacity: 0; } to { opacity: 1; } }
              `}</style>
            </defs>

            {/* ═ BACKGROUND STATIC ELEMENTS ═ */}
            
            <line x1="80" y1="120" x2="80" y2="620" stroke="#F4F4F5" strokeWidth="1" opacity="0.3" />
            <g transform="translate(60, 260) rotate(-90)">
              <text x="0" y="0" textAnchor="middle" fill="#F4F4F5" fontSize="18" letterSpacing="3">PRÁCTICA</text>
            </g>
            <g transform="translate(60, 510) rotate(-90)">
              <text x="0" y="0" textAnchor="middle" fill="#F4F4F5" fontSize="18" letterSpacing="3">TEORÍA</text>
            </g>

            <line x1="80" y1="400" x2="1250" y2="400" stroke="#F4F4F5" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="545" y1="120" x2="545" y2="600" stroke="#F4F4F5" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
            <line x1="800" y1="120" x2="800" y2="600" stroke="#FFFFFF" strokeWidth="4" opacity="0.15" />

            <path d="M 120 120 L 780 120" stroke="#F4F4F5" strokeWidth="0.5" markerStart="url(#arrow-head)" markerEnd="url(#arrow-head)" opacity="0.7" />
            <text x="450" y="110" textAnchor="middle" fill="#F4F4F5" fontSize="22">Evaluación</text>
            
            <path d="M 820 120 L 1250 120" stroke="#F4F4F5" strokeWidth="0.5" markerStart="url(#arrow-head)" markerEnd="url(#arrow-head)" opacity="0.7" />
            <text x="1035" y="110" textAnchor="middle" fill="#F4F4F5" fontSize="22">Consolidación</text>

            <text x="300" y="650" textAnchor="middle" fill="#E5997B" fontSize="20" fontWeight="500">Fase de Identificación</text>
            <line x1="120" y1="665" x2="480" y2="665" stroke="#E5997B" strokeWidth="2" opacity="0.4" />
            <text x="300" y="685" textAnchor="middle" fill="#E5997B" fontSize="15" opacity="0.6">Diagnóstico estructural e ideación</text>
            
            <text x="880" y="650" textAnchor="middle" fill="#F4F4F5" fontSize="20" fontWeight="500">Fase de implementación de gobernanza y valor</text>
            <line x1="500" y1="665" x2="1250" y2="665" stroke="#F4F4F5" strokeWidth="2" opacity="0.4" />
            <text x="680" y="685" textAnchor="middle" fill="#E5997B" fontSize="15" opacity="0.8">Diligencia y reingeniería de riesgos</text>
            <text x="1080" y="685" textAnchor="middle" fill="#F4F4F5" fontSize="15" opacity="0.6">Modelado, implementación y escalabilidad</text>

            <path d="M 180 520 C 220 520, 260 500, 300 440 C 320 380, 340 220, 390 220 C 410 220, 440 320, 460 400" fill="none" stroke="#E5997B" strokeWidth="2" opacity="0.4" />
            
            <circle cx="620" cy="400" r="160" fill="none" stroke="#E5997B" strokeWidth="3" opacity="0.8" />
            <circle cx="980" cy="400" r="160" fill="none" stroke="#F4F4F5" strokeWidth="3" opacity="0.8" />

            <polygon points="800,375 830,425 770,425" fill="#030035" stroke="#E5997B" strokeWidth="3" />
            <text x="800" y="360" textAnchor="middle" fill="#F4F4F5" fontSize="13">¿Viabilidad / Intervención?</text>
            <text x="800" y="445" textAnchor="middle" fill="#F4F4F5" fontSize="13">Transformación</text>
            <text x="790" y="300" textAnchor="middle" fill="#F4F4F5" fontSize="22" fontWeight="bold" transform="rotate(45, 790, 300)" opacity="0.9">ITERAR</text>

            {/* ═ ANIMATED PATH ACTIVE ═ */}
            {seqIndex !== -1 && (() => {
              let pathD = "";
              if (active === "iterate") return null;

              if (seqIndex === 0) pathD = "M 80 520 L 180 520";
              else if (seqIndex === 1) pathD = "M 180 520 C 220 520, 260 500, 300 440";
              else if (seqIndex === 2) pathD = "M 300 440 C 320 380, 340 220, 390 220";
              else if (seqIndex === 3) pathD = "M 390 220 C 410 220, 440 320, 460 400";
              else if (seqIndex === 4) pathD = "M 460 400 A 160 160 0 0 0 620 560";
              else if (seqIndex === 5) pathD = "M 620 560 A 160 160 0 0 0 800 400 A 160 160 0 0 1 867 287";
              else if (seqIndex === 6) pathD = "M 867 287 A 160 160 0 0 1 980 240";
              else if (seqIndex === 7) pathD = "M 980 240 A 160 160 0 0 1 1140 400";
              else if (seqIndex === 8) pathD = "M 1140 400 A 160 160 0 0 1 980 560";
              else if (seqIndex === 10) pathD = "M 460 400 A 160 160 0 0 0 620 560";
              else if (seqIndex === 11) pathD = "M 620 560 A 160 160 0 0 0 800 400 A 160 160 0 0 1 867 287";
              else if (seqIndex === 12) pathD = "M 867 287 A 160 160 0 0 1 980 240";
              else if (seqIndex === 13) pathD = "M 980 240 A 160 160 0 0 1 1140 400";
              else if (seqIndex === 14) pathD = "M 1140 400 A 160 160 0 0 1 980 560";

              return pathD ? (
                <path key={seqIndex} d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="4" filter="url(#brightGlow)" markerEnd="url(#arrow)" strokeLinecap="round" className="fade-line" />
              ) : null;
            })()}

            {/* ═ INTERACTIVE NODES ═ */}
            {NODES.map((n) => {
              const isActive = active === n.id;
              const isDark = n.theme === "dark";
              
              // Memberikan background warna solid (lightgray atau bronze), bukan tembus pandang
              const fillColor = isDark ? C.lightgray : C.bronze;
              const textColor = C.navy;

              // Logika opacity: Semua tetap solid (1) meskipun tidak diklik, 
              // KECUALI poin awal (1 dan 2) yang tetap menggunakan efek meredup (0.6)
              let nodeOpacity = 1;
              if (active && !isActive) {
                if (n.id === "1" || n.label === "1" || n.label === "2") {
                  nodeOpacity = 0.6;
                } else {
                  nodeOpacity = 1;
                }
              }

              return (
                <g 
                  key={n.id} 
                  onClick={() => handleNodeClick(n.id)} 
                  className="cursor-pointer transition-all duration-300" 
                  style={{ opacity: nodeOpacity }}
                >
                  {isActive && (
                    <>
                      <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={C.bronze} className="wave-ring" filter="url(#brightGlow)" />
                      <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={C.bronze} strokeWidth="3" opacity="0.9" />
                    </>
                  )}
                  
                  <circle cx={n.cx} cy={n.cy} r={n.r} fill={fillColor} />
                  
                  {n.label && (
                    <text x={n.cx} y={n.cy + 6} textAnchor="middle" fill={textColor} fontSize="20" fontWeight="bold">
                      {n.label}
                    </text>
                  )}

                  <text x={n.textPos.x} y={n.textPos.y} textAnchor={n.textPos.align} fill="#F4F4F5" fontSize="15" fontWeight="600" opacity={isActive ? 1 : 0.9}>
                    {n.textLines.map((line, i) => (
                      <tspan x={n.textPos.x} dy={i === 0 ? 0 : 20} key={i}>{line}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tombol Navigasi Bawah / Kanan */}
        <div className="w-full md:w-auto md:absolute md:right-16 md:top-[45%] flex justify-center mt-6 md:mt-0 z-20">
          <div className={`flex md:flex-col flex-row gap-4 transition-all duration-300 ${seqIndex === -1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button onClick={handlePrev} className="px-5 py-3 rounded-full border border-[#E5997B]/30 bg-[#E5997B]/5 text-[#E5997B] hover:bg-[#E5997B]/20 font-mono text-xs uppercase tracking-widest transition-all backdrop-blur-md min-w-[120px]">
              ↑ Prev
            </button>
            <button onClick={handleNext} className="px-5 py-3 rounded-full bg-[#E5997B] text-[#030035] font-bold hover:bg-opacity-90 font-mono text-xs uppercase tracking-widest transition-all shadow-md shadow-[#E5997B]/20 min-w-[120px]">
              Next ↓
            </button>
          </div>
        </div>
      </div>

      {/* ═ DESKRIPSI BAWAH ═ */}
      <div className="w-full max-w-none grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start px-8 md:px-16 xl:px-24">
        {/* Teks statis kiri - turun jadi text-lg lg:text-xl */}
        <div className="w-full flex flex-col gap-4 text-white/50 text-lg lg:text-xl leading-relaxed text-justify">
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
              {/* Teks judul statis (default) - turun jadi text-3xl lg:text-4xl */}
              <h2 className="text-3xl lg:text-4xl font-serif italic text-[#E5997B]">Explorar el proceso</h2>
              {/* Deskripsi statis - turun jadi text-lg lg:text-xl */}
              <p className="text-white/60 text-lg lg:text-xl leading-relaxed font-light">
                Seleccione cualquier nodo en el diagrama superior para ver los detalles y especificaciones de cada fase operativa de DIMA.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <span className="text-sm tracking-[0.3em] uppercase font-mono text-[#E5997B] font-bold">
                  {activeNode.tag}
                </span>
                {/* Teks judul interaktif - turun jadi text-4xl lg:text-5xl */}
                <h2 className="text-4xl lg:text-5xl font-serif mt-4 mb-6 text-white leading-tight">
                  {activeNode.title}
                </h2>
                <div className="h-px w-24 bg-[#E5997B]/50 mb-8" />
                {/* Deskripsi interaktif per node - turun jadi text-xl lg:text-2xl */}
                <p className="text-white/80 text-xl lg:text-2xl leading-relaxed font-light text-justify">
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