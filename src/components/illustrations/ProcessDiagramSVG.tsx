import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// --- Types & Data (Tetap) ---
type NodeDef = {
  id: string; phase: 1 | 2 | 3 | 'iterate'; x: number; y: number; r: number;
  label: string; title: string; description: string;
}

const NODES: NodeDef[] = [
  { id: '1', phase: 1, x: 130, y: 210, r: 54, label: '01', title: 'Diagnóstico Estructural de Prospección', description: 'Revisión integral del perfil corporativo y los requerimientos de la entidad. Se analizan escalabilidad, contexto y mapeo preliminar para alinear necesidades con una factibilidad técnica inicial mediante un ejercicio de empatía financiera.' },
  { id: '2', phase: 1, x: 270, y: 120, r: 54, label: '02', title: 'Sincronización de Condiciones Técnicas', description: 'Se determina el producto financiero preliminar con base en la evaluación del Nodo 1. Intercambio directo de métricas financieras detalladas. Se establecen parámetros fiduciarios preliminares: valuaciones de activos, tasas institucionales, plazos de amortización y esquemas de garantía necesarios.' },
  { id: '3', phase: 1, x: 270, y: 360, r: 54, label: '03', title: 'Sincronización con Fondeadores Institucionales', description: 'Alineación técnico-estratégica con SOFOMEs y entidades financieras aliadas. Se presenta el vehículo financiero preliminar ante comités de crédito para pre-aprobación. DIMA actúa como enlace técnico, asegurando que las condiciones estructurales cumplan los criterios de elegibilidad y fondeo institucional.' },
  { id: '4', phase: 2, x: 490, y: 180, r: 52, label: '04', title: 'Ejecución de Filtros de Exclusión', description: 'Evaluación crítica de criterios de exclusión. Validaciones de integridad reputacional y buró de crédito para determinar viabilidad, previniendo avances frente a factores de riesgo sistémico insalvables.' },
  { id: '5', phase: 2, x: 560, y: 400, r: 52, label: '05', title: 'Integración y Evaluación Macroeconómica', description: 'Due diligence multidisciplinaria integral (legal, fiscal, contable, financiera) y aplicación del modelo de ingeniería económica financiera derivado de la adaptación de Ray Dalio. Determina la viabilidad estructural y la solvencia.' },
  { id: 'iterate', phase: 'iterate', x: 780, y: 300, r: 78, label: 'ITERA', title: 'Protocolo de Reconfiguración y Alineación', description: 'No es un rechazo — es una Intervención Estratégica. Cuando la Evaluación de Causalidad Productiva indica una solvencia subóptima, DIMA ejecuta una transformación del balance hasta que la entidad alcance la solvencia y resiliencia operativa necesarias. Es el filtro de solvencia — ninguna entidad avanza a la Fase 3 sin superar esta evaluación.' },
  { id: '6', phase: 3, x: 1040, y: 300, r: 62, label: '06', title: 'Organización Documental y Mapeo Financiero', description: 'Organización y formalización del expediente crediticio auditable. Todos los componentes multidisciplinarios se estructuran para el análisis final. Se aplica el Modelo de Ingeniería Económica y Financiera para el mapeo integral de la genética financiera del negocio — validando solvencia y determinando el qué, cómo, cuánto, dónde y por qué de la generación de valor.' },
]

const CONNECTIONS = [
  { from: '1', to: '2' }, { from: '1', to: '3' }, { from: '2', to: '3' },
  { from: '2', to: '4' }, { from: '3', to: '5' }, { from: '4', to: '5' },
  { from: '4', to: 'iterate' }, { from: '5', to: 'iterate' }, { from: 'iterate', to: '6' },
]

const THEME = {
  navy: '#0f172a',
  bronze: '#E5997B',
  darkBronze: '#9c5e46',
  lightGray: '#F8FAFC', // Background yang lebih clean
  white: '#ffffff',
  black: '#000000',
};

export default function ProcessDiagramSVG() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.connector-line', { strokeDashoffset: 1000, duration: 2, stagger: 0.1, ease: 'power3.inOut', scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%' } })
      gsap.from('.node-group', { scale: 0.8, opacity: 0, duration: 1, stagger: 0.1, ease: 'back.out(1.7)', scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%' } })
      gsap.to('.energy-pulse', { strokeDashoffset: -100, repeat: -1, duration: 5, ease: 'none' })
    }, wrapperRef)
    return () => ctx.revert()
  }, [])

  const activeNode = useMemo(() => NODES.find(n => n.id === activeId), [activeId])

  return (
    <div ref={wrapperRef} className="relative w-full py-20 select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 540"
        className="w-full h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="nodeShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={THEME.navy} floodOpacity="0.1" />
          </filter>
          
          {/* Enhanced Bronze Ambient Glow */}
          <filter id="bronzeAura" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="pulseGradBronze" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={THEME.bronze} stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Connections */}
        {CONNECTIONS.map((c, i) => {
          const from = NODES.find(n => n.id === c.from)!
          const to = NODES.find(n => n.id === c.to)!
          return (
            <g key={i}>
              <path d={`M${from.x} ${from.y} L${to.x} ${to.y}`} stroke={THEME.navy} strokeOpacity="0.06" strokeWidth="1" />
              <path
                className="energy-pulse transition-opacity duration-700"
                d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                stroke="url(#pulseGradBronze)"
                strokeWidth="1.5"
                strokeDasharray="30 70"
                style={{ opacity: activeId ? (activeId === from.id || activeId === to.id ? 1 : 0.05) : 0.3 }}
              />
            </g>
          )
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const isFocused = activeId === n.id
          const isOthersActive = activeId !== null && !isFocused
          const isIterate = n.phase === 'iterate'
          
          return (
            <g
              key={n.id}
              className="node-group cursor-pointer"
              onMouseEnter={() => setActiveId(n.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              {/* --- 1. AMBIENT BRONZE GLOW --- */}
              <motion.circle
                cx={n.x} cy={n.y}
                r={n.r + 10}
                fill={THEME.bronze}
                animate={{
                  opacity: isFocused ? 0.5 : (isOthersActive ? 0 : 0.15),
                  scale: isFocused ? 1.3 : 1,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{ filter: 'blur(18px)' }}
              />

              {/* --- 2. NODE BODY --- */}
              <motion.circle
                cx={n.x} cy={n.y} r={n.r}
                animate={{
                  fill: isFocused 
                    ? (isIterate ? THEME.darkBronze : THEME.navy) 
                    : (isIterate ? THEME.bronze : THEME.white),
                  stroke: isFocused ? THEME.bronze : (isIterate ? THEME.bronze : "#CBD5E1"),
                  strokeWidth: isFocused ? 2 : 1,
                }}
                style={{ filter: 'url(#nodeShadow)' }}
              />
              
              <text
                x={n.x} y={n.y + 6}
                fill={isIterate ? THEME.white : (isFocused ? THEME.white : THEME.navy)}
                fontSize={isIterate ? "20" : "16"}
                fontFamily={isIterate ? "Playfair Display" : "Inter Tight"}
                fontWeight={isFocused ? "700" : "400"}
                textAnchor="middle"
                className="pointer-events-none transition-colors duration-300"
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* --- FOOTER CONTENT AREA (The "Niat" Part) --- */}
      <div className="relative mt-8 w-full max-w-4xl mx-auto px-6 h-[260px]">
        <AnimatePresence mode="wait">
          {!activeNode ? (
            // DEFAULT VIEW: Professional & Structured
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full flex flex-col items-center justify-center text-center p-10 border border-navy/5 bg-navy/[0.02] rounded-[2rem] backdrop-blur-sm shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-12 bg-bronze" />
                <span className="text-[10px] tracking-[0.6em] text-navy font-bold uppercase">Metodología DIMA</span>
                <div className="h-px w-12 bg-bronze" />
              </div>
              <h2 className="text-3xl font-display text-navy mb-4 font-semibold italic">Protocolo de Ingeniería Económica</h2>
              <p className="text-navy/50 font-body text-sm max-w-2xl leading-relaxed">
                Nuestra arquitectura operativa garantiza la solvencia y resiliencia de cada entidad financiera. 
                <span className="text-bronze font-semibold block mt-2">Explore cada nodo para desglosar la genética de nuestro proceso.</span>
              </p>
            </motion.div>
          ) : (
            // ACTIVE VIEW: High-End Description Layout
            <motion.div
              key={activeId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="w-full h-full grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 bg-white border border-navy/10 rounded-[2rem] shadow-[0_40px_80px_rgba(15,23,42,0.08)] p-10 relative overflow-hidden"
            >
              {/* Decorative Navy Accent pas Hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-navy/[0.03] rounded-bl-full pointer-events-none" />
              
              {/* Left Column: Title & Phase */}
              <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-navy/5 pb-6 md:pb-0 md:pr-8">
                <span className="text-[10px] tracking-[0.4em] text-bronze font-black uppercase mb-3">
                  {activeNode.phase === 'iterate' ? 'Operational Core' : `Fase 0${activeNode.phase}`}
                </span>
                <h3 className="text-2xl font-display text-navy font-bold leading-tight">
                  {activeNode.title}
                </h3>
              </div>

              {/* Right Column: Detailed Description */}
              <div className="flex flex-col justify-center pl-0 md:pl-4">
                <div className="relative">
                  <div className="absolute left-[-20px] top-0 w-1 h-full bg-bronze/30 rounded-full" />
                  <p className="text-navy/70 text-base leading-relaxed font-body italic">
                    "{activeNode.description}"
                  </p>
                </div>
                <div className="mt-6 flex gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-navy/20" />
                   <div className="h-1.5 w-1.5 rounded-full bg-navy/20" />
                   <div className="h-1.5 w-1.5 rounded-full bg-bronze" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}