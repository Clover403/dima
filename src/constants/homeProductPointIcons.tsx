import {
  IllustSimpleCredit,
  IllustBridgeCredit,
  IllustStrategicPlanning,
  IllustAgroCredit,
  IllustLeasing,
  IllustFactoring,
} from './Engravingillustrations'
import { motion } from 'framer-motion'
import DiamondGeometricSVG from '../components/illustrations/DiamondGeometricSVG'
import BalanceScaleSVG from '../components/illustrations/BalanceScaleSVG'
import ArchitecturalColumnSVG from '../components/illustrations/ArchitecturalColumnSVG'

export const ProductPointIcon = ({ index = 0, drawProgress }: any) => {
  void drawProgress

  const icons = [
    IllustSimpleCredit,
    IllustBridgeCredit,
    IllustStrategicPlanning,
    IllustAgroCredit,
    IllustLeasing,
    IllustFactoring,
  ]

  const Icon = icons[index % icons.length] ?? IllustSimpleCredit

  return (
    <div className="relative w-[76vw] max-w-[760px] md:w-[46vw] lg:w-[42vw] h-auto product-point-icon-drawline">
      <style>{`
        .product-point-icon-drawline svg * {
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: dima-drawline 2.4s ease forwards;
        }

        .product-point-icon-drawline svg *[fill]:not([fill="none"]) {
          animation: dima-drawline-fill 2.4s ease forwards;
        }

        @keyframes dima-drawline {
          0% { stroke-dashoffset: 1800; opacity: 0.2; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes dima-drawline-fill {
          0% { opacity: 0; }
          65% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0.85, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ filter: 'drop-shadow(0 18px 34px rgba(3,0,53,0.16))' }}
      >
        <Icon className="w-full h-auto" color="#E5997B" />
      </motion.div>
    </div>
  )
}

export const IconMacroSystem = (props: any) => (
  <ArchitecturalColumnSVG {...props} className={`w-full h-auto ${props?.className ?? ''}`.trim()} />
)

export const IconEquilibriumScale = (props: any) => (
  <BalanceScaleSVG {...props} className={`w-full h-auto ${props?.className ?? ''}`.trim()} />
)

export const IconFoundationDiamond = (props: any) => (
  <DiamondGeometricSVG {...props} className={`w-full h-auto ${props?.className ?? ''}`.trim()} />
)




// export type ProductPointIconProps = {
//   index: number
//   drawProgress: any
// }

// const drawAnim: any = {
//   hidden: { pathLength: 0, opacity: 0 },
//   visible: { pathLength: 1, opacity: 1, transition: { duration: 1.8, ease: 'easeInOut' } },
// }

// export const IconMacroSystem = () => (
//   <motion.svg viewBox="0 0 100 100" className="w-28 h-28 md:w-36 md:h-36 mb-8 opacity-80" fill="none">
//     <motion.circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.ellipse cx="50" cy="50" rx="45" ry="15" stroke="currentColor" strokeWidth="1.5" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.ellipse cx="50" cy="50" rx="15" ry="45" stroke="currentColor" strokeWidth="1.5" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.line x1="50" y1="5" x2="50" y2="95" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
//   </motion.svg>
// )

// export const IconEquilibriumScale = ({ pathLength, opacity }: any) => {
//   const customStyle = pathLength ? { pathLength, opacity } : {}
//   const motionProps = pathLength 
//     ? { style: customStyle } 
//     : { variants: drawAnim, initial: "hidden", animate: "visible" }

//   return (
//     <motion.svg viewBox="0 0 200 200" className="w-full h-auto drop-shadow-md" fill="none" style={pathLength ? { opacity } : { opacity: 0.9 }}>
//       {/* Geometric structural background */}
//       <motion.circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" {...motionProps} />
//       <motion.circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" {...motionProps} />
//       <motion.path d="M 100 10 L 190 100 L 100 190 L 10 100 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.3" {...motionProps} />
      
//       {/* Main pillar */}
//       <motion.path d="M 90 170 L 110 170 L 105 40 L 95 40 Z" stroke="currentColor" strokeWidth="1.5" {...motionProps} />
//       <motion.path d="M 80 170 L 120 170 L 120 180 L 80 180 Z" stroke="currentColor" strokeWidth="1.5" {...motionProps} />
//       <motion.circle cx="100" cy="35" r="5" stroke="currentColor" strokeWidth="1.5" {...motionProps} />

//       {/* The Scale Beam */}
//       <motion.line x1="30" y1="50" x2="170" y2="50" stroke="#E5997B" strokeWidth="2.5" {...motionProps} />
//       <motion.circle cx="30" cy="50" r="4" fill="#E5997B" {...motionProps} />
//       <motion.circle cx="170" cy="50" r="4" fill="#E5997B" {...motionProps} />

//       {/* Left Pan */}
//       <motion.path d="M 30 50 L 15 110 L 45 110 Z" stroke="currentColor" strokeWidth="1" {...motionProps} />
//       <motion.path d="M 15 110 Q 30 125 45 110" stroke="currentColor" strokeWidth="1.5" {...motionProps} />
//       <motion.line x1="20" y1="110" x2="40" y2="110" stroke="currentColor" strokeWidth="0.5" {...motionProps} />
      
//       {/* Right Pan */}
//       <motion.path d="M 170 50 L 155 110 L 185 110 Z" stroke="currentColor" strokeWidth="1" {...motionProps} />
//       <motion.path d="M 155 110 Q 170 125 185 110" stroke="currentColor" strokeWidth="1.5" {...motionProps} />
//       <motion.line x1="160" y1="110" x2="180" y2="110" stroke="currentColor" strokeWidth="0.5" {...motionProps} />
      
//       {/* Inner decorative engraving lines */}
//       <motion.path d="M 95 40 L 95 170 M 105 40 L 105 170" stroke="currentColor" strokeWidth="0.5" {...motionProps} />
//     </motion.svg>
//   )
// }

// export const IconCycleChart = () => (
//   <motion.svg viewBox="0 0 200 200" className="w-28 h-28 md:w-36 md:h-36 mb-6 opacity-90 drop-shadow-md" fill="none">
//     {/* Geometric structural background */}
//     <motion.circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" variants={drawAnim} initial="hidden" animate="visible" />
    
//     {/* Grid Lines (Graph Background) */}
//     <motion.path d="M 30 100 L 170 100 M 100 30 L 100 170" stroke="currentColor" strokeWidth="0.5" opacity="0.3" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.path d="M 50 100 L 50 105 M 75 100 L 75 105 M 125 100 L 125 105 M 150 100 L 150 105" stroke="currentColor" strokeWidth="1" variants={drawAnim} initial="hidden" animate="visible" />
    
//     {/* Coordinate Axes */}
//     <motion.polyline points="30,40 30,160 170,160" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={drawAnim} initial="hidden" animate="visible" />
    
//     {/* Cycle Curve (Sine Wave) with Engraving Hatching below it */}
//     <g>
//       <clipPath id="sine-clip">
//         <path d="M 30 100 C 50 40, 80 40, 100 100 C 120 160, 150 160, 170 100 L 170 160 L 30 160 Z" />
//       </clipPath>
//       <motion.g clipPath="url(#sine-clip)" variants={drawAnim} initial="hidden" animate="visible">
//         {/* Hatching lines inside the curve */}
//         {Array.from({ length: 20 }).map((_, i) => (
//           <line key={i} x1={30 + i * 7} y1="30" x2={30 + i * 7} y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
//         ))}
//       </motion.g>
//     </g>
    
//     {/* Main Cycle Curve */}
//     <motion.path d="M 30 100 C 50 40, 80 40, 100 100 C 120 160, 150 160, 170 100" stroke="#E5997B" strokeWidth="3" strokeLinecap="round" variants={drawAnim} initial="hidden" animate="visible" />
    
//     {/* Data Points on the Curve */}
//     <motion.circle cx="30" cy="100" r="4" fill="#030035" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.circle cx="65" cy="55" r="4" fill="#030035" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.circle cx="100" cy="100" r="4" fill="#030035" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.circle cx="135" cy="145" r="4" fill="#030035" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.circle cx="170" cy="100" r="4" fill="#030035" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
    
//     {/* Outer decorative ring */}
//     <motion.circle cx="100" cy="100" r="95" stroke="#E5997B" strokeWidth="0.5" opacity="0.5" variants={drawAnim} initial="hidden" animate="visible" />
//   </motion.svg>
// )

// export const IconLogicalNodes = () => (
//   <motion.svg viewBox="0 0 100 100" className="w-28 h-28 md:w-36 md:h-36 mb-8 opacity-90" fill="none">
//     <motion.circle cx="35" cy="35" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.circle cx="65" cy="65" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.path d="M 35 35 L 65 65" stroke="#E5997B" strokeWidth="2.5" variants={drawAnim} initial="hidden" animate="visible" />
//   </motion.svg>
// )

// export const IconFoundationDiamond = () => (
//   <motion.svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 opacity-90" fill="none">
//     <motion.path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" stroke="currentColor" strokeWidth="1.5" variants={drawAnim} initial="hidden" animate="visible" />
//     <motion.path d="M 50 10 L 70 50 L 50 90 L 30 50 Z" stroke="#E5997B" strokeWidth="2" variants={drawAnim} initial="hidden" animate="visible" />
//   </motion.svg>
// )

// const Hatching = ({ angle, progress, color, density, thickness }: any) => {
//   return (
//     <g transform={`rotate(${angle} 50 50)`}>
//       {Array.from({ length: density }).map((_, idx) => (
//         <motion.line
//           key={idx}
//           x1="-50"
//           y1={-20 + idx * (140 / density)}
//           x2="150"
//           y2={-20 + idx * (140 / density)}
//           stroke={color}
//           strokeWidth={thickness}
//           style={{ pathLength: progress }}
//         />
//       ))}
//     </g>
//   )
// }

// function getShape(index: number) {
//   const i = index % 6

//   switch (i) {
//     case 0:
//       return <path d="M 50 10 L 90 85 L 10 85 Z" />
//     case 1:
//       return <circle cx="50" cy="50" r="40" />
//     case 2:
//       return <path d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z" />
//     case 3:
//       return <path d="M 25 20 L 75 20 L 50 50 L 75 80 L 25 80 Z" />
//     case 4:
//       return <path d="M 10 50 C 30 10, 70 10, 90 50 C 70 90, 30 90, 10 50 Z" />
//     case 5:
//       return <path d="M 10 20 L 50 10 L 90 20 L 90 50 C 90 75, 50 95, 50 95 C 50 95, 10 75, 10 50 Z" />
//     default:
//       return <circle cx="50" cy="50" r="40" />
//   }
// }

// export function ProductPointIcon({ index, drawProgress }: ProductPointIconProps) {
//   const i = index % 6
//   const clipId = `engrave-clip-${index}`
//   const shape = getShape(index)

//   return (
//     <svg viewBox="0 0 100 100" className="w-[60vw] max-w-[500px] md:w-[35vw] h-auto drop-shadow-2xl overflow-visible">
//       <defs>
//         <clipPath id={clipId}>
//           {shape}
//         </clipPath>
//       </defs>

//       <g clipPath={`url(#${clipId})`}>
//         <Hatching angle={45} progress={drawProgress} color="#030035" density={35} thickness="0.3" />
//         <Hatching angle={-45} progress={drawProgress} color="#E5997B" density={25} thickness="0.4" />
//         <Hatching angle={0} progress={drawProgress} color="#030035" density={60} thickness="0.15" />
//       </g>

//       <motion.g stroke="#030035" strokeWidth="1.5" fill="none" style={{ pathLength: drawProgress }}>
//         {shape}
//       </motion.g>

//       <motion.g stroke="#E5997B" strokeWidth="1" fill="none" style={{ pathLength: drawProgress }}>
//         {i === 0 && <path d="M 50 10 L 50 85 M 10 85 L 90 85" strokeDasharray="2 2" />}
//         {i === 1 && (
//           <>
//             <ellipse cx="50" cy="50" rx="40" ry="15" />
//             <ellipse cx="50" cy="50" rx="15" ry="40" />
//           </>
//         )}
//         {i === 2 && <path d="M 50 50 L 50 90 M 50 50 L 15 30 M 50 50 L 85 30" />}
//         {i === 3 && <line x1="10" y1="50" x2="90" y2="50" strokeDasharray="2 2" />}
//         {i === 4 && <circle cx="50" cy="50" r="20" />}
//         {i === 5 && <path d="M 50 10 L 50 95 M 10 20 L 90 20" strokeDasharray="2 2" />}
//       </motion.g>

//       <motion.g stroke="#030035" strokeWidth="0.5" fill="none" style={{ pathLength: drawProgress }}>
//         <circle cx="50" cy="50" r="48" strokeDasharray="2 4" />
//         <circle cx="50" cy="2" r="2" fill="#E5997B" />
//         <circle cx="50" cy="98" r="2" fill="#E5997B" />
//       </motion.g>
//     </svg>
//   )
// }

// export const PRODUCT_POINT_ICON_COUNT = 6