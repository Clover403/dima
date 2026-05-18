import { motion } from 'framer-motion'

/**
 * Premium Engraving-style classical facade with columns — institutional, formal.
 * Upgraded with Ionic capitals, detailed entablature, pediment ornaments, 
 * and engraving depth hatching.
 * Animated drawing effect using Framer Motion.
 */
export default function ArchitecturalColumnSVG({
  className = '',
  stroke = '#E5997B',
}: {
  className?: string
  stroke?: string
}) {
  const columnXs = [90, 170, 250, 330, 410]

  // Konfigurasi animasi untuk setiap garis
  const drawAnim: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (customDelay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2, bounce: 0, delay: customDelay * 0.05 },
        opacity: { duration: 0.1, delay: customDelay * 0.05 }
      }
    })
  }

  // Counter indeks global buatan agar animasi mengalir runut dari elemen pertama ke terakhir
  let animIndex = 0
  const getIndex = () => animIndex++

  return (
    <motion.svg
      className={className}
      viewBox="0 0 500 550"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      initial="hidden"
      whileInView="visible" // Akan mulai animasi saat muncul di layar (viewport)
      viewport={{ once: true, margin: "-100px" }} // Animasi jalan sekali saja
    >
      {/* 1. Background Wall Engraving Hatching */}
      {[...Array(15)].map((_, i) => (
        <motion.path
          key={`bg-${i}`}
          d={`M40 ${220 + i * 14} L460 ${220 + i * 14}`}
          stroke={stroke}
          strokeWidth="0.3"
          strokeOpacity="0.3"
          variants={drawAnim}
          custom={getIndex()}
        />
      ))}

      {/* 2. Pediment (Atap Segitiga Klasik) */}
      <motion.path variants={drawAnim} custom={getIndex()} d="M30 150 L250 25 L470 150 Z" stroke={stroke} strokeWidth="1.5" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M40 150 L250 35 L460 150" stroke={stroke} strokeWidth="1" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M60 145 L250 45 L440 145 Z" stroke={stroke} strokeWidth="1.2" />
      
      {[...Array(12)].map((_, i) => (
        <motion.path
          key={`tym-${i}`}
          d={`M${100 + i * 12} 145 L250 ${65 + i * 6} L${400 - i * 12} 145`}
          stroke={stroke}
          strokeWidth="0.4"
          strokeOpacity="0.6"
          variants={drawAnim}
          custom={getIndex()}
        />
      ))}
      <motion.path variants={drawAnim} custom={getIndex()} d="M250 25 L250 10 M240 15 L250 5 L260 15" stroke={stroke} strokeWidth="1.5" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M30 150 L20 140 L30 135 M470 150 L480 140 L470 135" stroke={stroke} strokeWidth="1.2" />

      {/* 3. Entablature */}
      <motion.path variants={drawAnim} custom={getIndex()} d="M35 150 L465 150 L465 158 L35 158 Z" stroke={stroke} strokeWidth="1.2" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M40 162 L460 162" stroke={stroke} strokeWidth="2.5" strokeDasharray="4 4" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M45 166 L455 166 L455 186 L45 186 Z" stroke={stroke} strokeWidth="1.2" />
      
      {[50, 130, 210, 290, 370, 440].map((x, i) => (
        <g key={`tri-${i}`}>
          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x} 166 L${x} 186 M${x + 4} 166 L${x + 4} 186 M${x + 8} 166 L${x + 8} 186`} stroke={stroke} strokeWidth="0.8" />
          {i < 5 && <motion.circle variants={drawAnim} custom={getIndex()} cx={x + 40} cy="176" r="4" stroke={stroke} strokeWidth="0.8" />}
        </g>
      ))}
      <motion.path variants={drawAnim} custom={getIndex()} d="M45 186 L455 186 L455 200 L45 200 Z" stroke={stroke} strokeWidth="1.2" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M45 190 L455 190 M45 195 L455 195" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.6" />

      {/* 4. Columns */}
      {columnXs.map((x, i) => (
        <g key={`col-${i}`}>
          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x - 22} 200 L${x + 22} 200 L${x + 18} 210 L${x - 18} 210 Z`} stroke={stroke} strokeWidth="1" />
          <motion.circle variants={drawAnim} custom={getIndex()} cx={x - 18} cy="210" r="4.5" stroke={stroke} strokeWidth="1.2" />
          <motion.circle variants={drawAnim} custom={getIndex()} cx={x + 18} cy="210" r="4.5" stroke={stroke} strokeWidth="1.2" />
          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x - 14} 210 L${x + 14} 210 M${x - 12} 214 L${x + 12} 214`} stroke={stroke} strokeWidth="0.8" />

          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x - 15} 215 L${x - 16} 420`} stroke={stroke} strokeWidth="1.2" />
          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x + 15} 215 L${x + 16} 420`} stroke={stroke} strokeWidth="1.2" />

          {[-10, -5, 0, 5, 10].map((offset) => (
            <motion.path
              key={`flute-${offset}`}
              d={`M${x + offset} 215 L${x + (offset * 1.05)} 420`}
              stroke={stroke}
              strokeWidth="0.5"
              strokeOpacity="0.6"
              variants={drawAnim}
              custom={getIndex()}
            />
          ))}

          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x - 18} 420 L${x + 18} 420 L${x + 22} 428 L${x - 22} 428 Z`} stroke={stroke} strokeWidth="1.2" />
          <motion.path variants={drawAnim} custom={getIndex()} d={`M${x - 24} 428 L${x + 24} 428 L${x + 24} 435 L${x - 24} 435 Z`} stroke={stroke} strokeWidth="1.2" />
        </g>
      ))}

      {/* 5. Stylobate (Fondasi) */}
      <motion.path variants={drawAnim} custom={getIndex()} d="M35 435 L465 435 L465 450 L35 450 Z" stroke={stroke} strokeWidth="1.2" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M25 450 L475 450 L475 465 L25 465 Z" stroke={stroke} strokeWidth="1.2" />
      <motion.path variants={drawAnim} custom={getIndex()} d="M10 465 L490 465 L490 485 L10 485 Z" stroke={stroke} strokeWidth="1.5" />

      {/* Arsiran Kedalaman Tangga */}
      {[...Array(30)].map((_, i) => (
        <motion.path key={`step1-${i}`} variants={drawAnim} custom={getIndex()} d={`M${35 + i * 14.5} 435 L${35 + i * 14.5} 450`} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.4" />
      ))}
      {[...Array(32)].map((_, i) => (
        <motion.path key={`step2-${i}`} variants={drawAnim} custom={getIndex()} d={`M${25 + i * 14.5} 450 L${25 + i * 14.5} 465`} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.4" />
      ))}
      {[...Array(34)].map((_, i) => (
        <motion.path key={`step3-${i}`} variants={drawAnim} custom={getIndex()} d={`M${10 + i * 14.5} 465 L${10 + i * 14.5} 485`} stroke={stroke} strokeWidth="0.4" strokeOpacity="0.4" />
      ))}
    </motion.svg>
  )
}