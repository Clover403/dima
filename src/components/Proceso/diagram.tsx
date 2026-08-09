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
  { id: "iterate", label: "", title: "Protocolo de Reconfiguración", phase: "iterate", tag: "Protocolo de Reconfiguración", description: "Mecanismo de ajuste técnico diseñado para entidades con indicadores de solvencia subóptimos. No representa un rechazo, sino una Intervención Estratégica. DIMA ejecuta una transformación del balance y la estructura corporativa, refinando la arquitectura hasta alcanzar la solvencia y resiliencia operativa necesarias.", cx: 710, cy: 320, r: 24, theme: "bronze", textLines: ["Intervención", "Estratégica"], textPos: { x: 710, y: 265, align: "middle" } },
  { id: "6", label: "5", title: "Integración Documental", phase: "consolidacion", tag: "Fase de Consolidación", description: "Ejecución del protocolo de organización, refinamiento y formalización del expediente crediticio auditable. Se aplica el Modelo de Ingeniería Económica para mapear la genética financiera del negocio, determinando el qué, cómo, cuánto y por qué de la generación de valor.", cx: 827, cy: 287, r: 28, theme: "dark", textLines: ["Integración"], textPos: { x: 870, y: 292, align: "start" } },
  { id: "7", label: "6", title: "Formalización y Protección Fiduciaria", phase: "consolidacion", tag: "Fase de Consolidación", description: "Estructuración legal integral de la transacción. Se establecen las garantías y fideicomisos necesarios, creando un marco legal robusto que garantiza la transparencia operativa y protege el capital desplegado frente a fluctuaciones del mercado.", cx: 940, cy: 240, r: 28, theme: "dark", textLines: ["Formalización"], textPos: { x: 985, y: 245, align: "start" } },
  { id: "8", label: "7", title: "Dispersión de Capital Productivo", phase: "consolidacion", tag: "Fase de Consolidación", description: "Despliegue técnico de los recursos financieros. La inyección de liquidez se ejecuta como un adelanto estratégico de gasto, activando un apalancamiento diseñado exclusivamente para la adquisición de activos y la expansión operativa.", cx: 1100, cy: 400, r: 28, theme: "dark", textLines: ["Dispersión"], textPos: { x: 1055, y: 405, align: "end" } },
  { id: "9", label: "8", title: "Gobernanza y Consultoría de Ciclos", phase: "consolidacion", tag: "Fase de Consolidación", description: "La relación no termina con la dispersión — escala junto con el negocio. DIMA da seguimiento al cumplimiento de covenants y a la eficiencia del capital, si es necesario, preparando a la empresa para ciclos crediticios futuros más eficientes.", cx: 940, cy: 560, r: 28, theme: "dark", textLines: ["Gobernanza y", "Escalabilidad"], textPos: { x: 940, y: 500, align: "middle" } },
];

const NAV_SEQUENCE: NodeId[] = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", 
  "iterate", 
  "4", "5", "6", "7", "8", "9"
];

export default function ProcesodiagramaSimple() {
  const [seqIndex, setSeqIndex] = useState<number>(-1);
  const [zoom, setZoom] = useState<number>(1);
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  return (
    <div className="min-h-screen w-full bg-[#030035] text-[#F4F4F5] font-sans pt-20 pb-20 flex flex-col justify-between overflow-x-hidden">
      
      <div className="w-full relative flex flex-col items-center justify-center mb-16 px-0 lg:px-12">
        
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

        {/* --- KONTROL ZOOM (HANYA TAMPIL DI MOBILE/TAB) --- */}
        <div className="lg:hidden flex items-center justify-center gap-4 w-full mb-6 z-30 px-6">
          <span className="text-[#E5997B] text-xs font-mono uppercase tracking-widest">Zoom Diagrama</span>
          <button 
            onClick={handleZoomOut} 
            disabled={zoom <= 1}
            className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xl pb-1 transition-all ${zoom <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
          >
            -
          </button>
          <button 
            onClick={handleZoomIn} 
            disabled={zoom >= 3}
            className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xl pb-1 transition-all ${zoom >= 3 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
          >
            +
          </button>
        </div>

        {/* --- WRAPPER DIAGRAM DENGAN SCROLL/SLIDER --- */}
        <div className="w-full overflow-x-auto custom-scrollbar pb-6 flex justify-start lg:justify-center px-4 md:px-8">
          <div 
            className="transition-all duration-300 ease-out origin-left flex-shrink-0"
            style={{ width: zoom > 1 ? `${zoom * 100}%` : '100%', minWidth: '100%' }}
          >
            <svg viewBox="0 0 1350 720" className="w-full max-w-[1500px] lg:mx-auto h-auto overflow-visible select-none">
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
                  
                  /* Custom Slider/Scrollbar untuk Mobile */
                  .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(244, 244, 245, 0.05); border-radius: 4px; margin: 0 20px; }
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(229, 153, 123, 0.5); border-radius: 4px; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(229, 153, 123, 0.8); }
                `}</style>
              </defs>

              <line x1="80" y1="120" x2="80" y2="620" stroke="#F4F4F5" strokeWidth="1" opacity="0.3" />
              <line x1="80" y1="620" x2="1250" y2="620" stroke="#F4F4F5" strokeWidth="1" opacity="0.3" />
              
              <g transform="translate(60, 260) rotate(-90)">
                <text x="0" y="0" textAnchor="middle" fill="#F4F4F5" fontSize="18" letterSpacing="3">PRÁCTICA</text>
              </g>
              <g transform="translate(60, 510) rotate(-90)">
                <text x="0" y="0" textAnchor="middle" fill="#F4F4F5" fontSize="18" letterSpacing="3">TEORÍA</text>
              </g>

              <line x1="80" y1="400" x2="1250" y2="400" stroke="#F4F4F5" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              
              <line x1="490" y1="120" x2="490" y2="600" stroke="#F4F4F5" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
              <line x1="740" y1="120" x2="740" y2="600" stroke="#FFFFFF" strokeWidth="4" opacity="0.15" />

              <path d="M 120 120 L 720 120" stroke="#F4F4F5" strokeWidth="0.5" markerStart="url(#arrow-head)" markerEnd="url(#arrow-head)" opacity="0.7" />
              <text x="420" y="110" textAnchor="middle" fill="#F4F4F5" fontSize="22">Evaluación</text>
              
              <path d="M 760 120 L 1250 120" stroke="#F4F4F5" strokeWidth="0.5" markerStart="url(#arrow-head)" markerEnd="url(#arrow-head)" opacity="0.7" />
              <text x="1005" y="110" textAnchor="middle" fill="#F4F4F5" fontSize="22">Consolidación</text>

              <text x="300" y="650" textAnchor="middle" fill="#E5997B" fontSize="20" fontWeight="500">Fase de Identificación</text>
              <line x1="120" y1="665" x2="480" y2="665" stroke="#E5997B" strokeWidth="2" opacity="0.4" />
              <text x="300" y="685" textAnchor="middle" fill="#E5997B" fontSize="15" opacity="0.6">Diagnóstico estructural e ideación</text>
              
              <text x="860" y="650" textAnchor="middle" fill="#F4F4F5" fontSize="20" fontWeight="500">Fase de implementación de gobernanza y valor</text>
              <line x1="500" y1="665" x2="1250" y2="665" stroke="#F4F4F5" strokeWidth="2" opacity="0.4" />
              <text x="660" y="685" textAnchor="middle" fill="#E5997B" fontSize="15" opacity="0.8">Diligencia y reingeniería de riesgos</text>
              <text x="1060" y="685" textAnchor="middle" fill="#F4F4F5" fontSize="15" opacity="0.6">Modelado, implementación y escalabilidad</text>

              <g transform="translate(-40, -60) scale(1.08)">
                <path d="M 180 520 C 220 520, 260 500, 300 440 C 320 380, 340 220, 390 220 C 410 220, 440 320, 460 400" fill="none" stroke="#E5997B" strokeWidth="2" opacity="0.4" />
                
                <circle cx="620" cy="400" r="160" fill="none" stroke="#E5997B" strokeWidth="3" opacity="0.8" />
                <circle cx="940" cy="400" r="160" fill="none" stroke="#F4F4F5" strokeWidth="3" opacity="0.8" />

                {seqIndex !== -1 && (() => {
                  let pathD = "";
                  if (active === "iterate") return null;

                  if (seqIndex === 0) pathD = "M 80 520 L 180 520";
                  else if (seqIndex === 1) pathD = "M 180 520 C 220 520, 260 500, 300 440";
                  else if (seqIndex === 2) pathD = "M 300 440 C 320 380, 340 220, 390 220";
                  else if (seqIndex === 3) pathD = "M 390 220 C 410 220, 440 320, 460 400";
                  else if (seqIndex === 4) pathD = "M 460 400 A 160 160 0 0 0 620 560";
                  else if (seqIndex === 5) pathD = "M 620 560 A 160 160 0 0 0 780 400 A 160 160 0 0 1 827 287";
                  else if (seqIndex === 6) pathD = "M 827 287 A 160 160 0 0 1 940 240";
                  else if (seqIndex === 7) pathD = "M 940 240 A 160 160 0 0 1 1100 400";
                  else if (seqIndex === 8) pathD = "M 1100 400 A 160 160 0 0 1 940 560";
                  else if (seqIndex === 10) pathD = ""; 
                  else if (seqIndex === 11) pathD = "M 460 400 A 160 160 0 0 0 620 560"; 
                  else if (seqIndex === 12) pathD = "M 620 560 A 160 160 0 0 0 780 400 A 160 160 0 0 1 827 287";
                  else if (seqIndex === 13) pathD = "M 827 287 A 160 160 0 0 1 940 240";
                  else if (seqIndex === 14) pathD = "M 940 240 A 160 160 0 0 1 1100 400";
                  else if (seqIndex === 15) pathD = "M 1100 400 A 160 160 0 0 1 940 560";

                  return pathD ? (
                    <path key={seqIndex} d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="4" filter="url(#brightGlow)" markerEnd="url(#arrow)" strokeLinecap="round" className="fade-line" />
                  ) : null;
                })()}

                <polygon points="780,388 792,412 768,412" fill="#D1D5DB" stroke="#E5997B" strokeWidth="3" />
                <text x="760" y="385" textAnchor="end" fill="#F4F4F5" fontSize="13">Transformación</text>
                <text x="760" y="435" textAnchor="end" fill="#F4F4F5" fontSize="13">¿Viabilidad / Intervención?</text>
                <text x="680" y="340" textAnchor="middle" fill="#F4F4F5" fontSize="18" fontWeight="bold" transform="rotate(45, 680, 340)" opacity="0.9">ITERAR</text>

                {NODES.map((n) => {
                  const isActive = active === n.id;
                  const isDark = n.theme === "dark";
                  const fillColor = isDark ? C.lightgray : C.bronze;
                  const textColor = C.navy;

                  return (
                    <g 
                      key={n.id} 
                      onClick={() => handleNodeClick(n.id)} 
                      className="cursor-pointer transition-all duration-300"
                      style={{ opacity: 1 }}
                    >
                      {isActive && (
                        <>
                          <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={C.bronze} className="wave-ring" filter="url(#brightGlow)" />
                          <circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke={C.bronze} strokeWidth="3" opacity="0.9" />
                        </>
                      )}
                      
                      {n.id === "iterate" ? (
                        <g>
                          <polygon 
                            points="600,240 630,225 630,255" 
                            fill={C.navy} 
                            stroke={C.bronze} 
                            strokeWidth="3" 
                            strokeLinejoin="round" 
                          />
                          <circle cx={n.cx - 20} cy={n.cy - 18} r={10} fill={fillColor} />
                          <circle cx={n.cx} cy={n.cy} r={18} fill={fillColor} />
                        </g>
                      ) : (
                        <circle cx={n.cx} cy={n.cy} r={n.r} fill={fillColor} />
                      )}
                      
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
              </g>
            </svg>
          </div>
        </div>

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

      {/* --- GRID TEKS BAWAH --- */}
      <div className="w-full max-w-none flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-start px-8 md:px-16 xl:px-24">
        
        {/* DESKRIPSI STATIS (Pindah ke bawah di mobile/tab dengan order-2) */}
        <div className="order-2 lg:order-1 w-full flex flex-col gap-4 text-white/50 text-lg lg:text-xl leading-relaxed text-justify">
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

        {/* DESKRIPSI POIN AKTIF (Pindah ke atas/langsung di bawah diagram di mobile/tab dengan order-1) */}
        <div className="order-1 lg:order-2 w-full flex flex-col min-h-[350px]">
          {!activeNode ? (
            <div className="animate-fade-in flex flex-col gap-4">
<h2 className="text-2xl lg:text-4xl font-serif italic text-[#E5997B]">Explorar el proceso</h2>
              {/* Ukuran disamakan jadi text-lg lg:text-xl */}
              <p className="text-white/60 text-lg lg:text-xl leading-relaxed font-light">
                Seleccione cualquier nodo en el diagrama superior para ver los detalles y especificaciones de cada fase operativa de DIMA.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
<span className="text-xs lg:text-sm tracking-[0.3em] uppercase font-mono text-[#E5997B] font-bold">
                    {activeNode.tag}
                </span>
                <h2 className="text-2xl lg:text-5xl font-serif mt-3 lg:mt-4 mb-4 lg:mb-6 text-white leading-tight">
  {activeNode.title}
</h2>
<div className="h-px w-24 bg-[#E5997B]/50 mb-4 lg:mb-8" />
                {/* Ukuran disamakan jadi text-lg lg:text-xl */}
                <p className="text-white/80 text-lg lg:text-xl leading-relaxed font-light text-justify">
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