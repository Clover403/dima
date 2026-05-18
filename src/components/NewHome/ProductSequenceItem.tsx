import { motion, useTransform } from 'framer-motion'
import { ProductPointIcon } from '../../constants/Engravingillustrations'

export const ProductSequenceItem = ({ product, index, total, scrollYProgress }: any) => {
  const seqStart = 0.27
  const seqLength = 0.30
  const itemLength = seqLength / total

  const start = seqStart + index * itemLength
  const end = start + itemLength
  const dur = itemLength

  const opacity = useTransform(scrollYProgress, [start, start + dur * 0.1, start + dur * 0.9, end], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [start, start + dur * 0.1, start + dur * 0.9, end], [50, 0, 0, -50])
  const drawProgress = useTransform(scrollYProgress, [start + dur * 0.1, start + dur * 0.7], [0, 1])
  const strokeDashoffset = useTransform(scrollYProgress, [start + dur * 0.1, start + dur * 0.7], [1000, 0])
  const fillOpacity = useTransform(scrollYProgress, [start + dur * 0.55, start + dur * 0.85], [0, 1])
  const strokeOpacity = useTransform(scrollYProgress, [start + dur * 0.75, start + dur * 0.85], [1, 0])

  const isEven = index % 2 === 0
  const layoutClass = isEven ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'
  const textAlignment = isEven ? 'text-left items-start' : 'text-right items-end'
  const xPos = isEven ? "0" : "1000"
  const tAnchor = isEven ? "start" : "end"

  const words = product.tagline.split(' ')
  const estimatedLines = Math.min(4, Math.max(1, Math.ceil(product.tagline.length / 20)))
  const targetCharsPerLine = Math.ceil(product.tagline.length / estimatedLines)
  const lineChunks: string[] = words.reduce((lines: string[], word: string) => {
    const currentLine = lines[lines.length - 1]
    if (!currentLine) {
      lines.push(word)
      return lines
    }

    const nextLine = `${currentLine} ${word}`
    if (nextLine.length <= targetCharsPerLine || lines.length >= 4) {
      lines[lines.length - 1] = nextLine
      return lines
    }

    lines.push(word)
    return lines
  }, [])
  const lineCount = lineChunks.length
  const textFontSize = lineCount === 4 ? 96 : lineCount === 3 ? 108 : lineCount === 2 ? 122 : 138
  const textLineDy = lineCount === 4 ? 92 : lineCount === 3 ? 108 : 140

  return (
    <motion.div style={{ opacity, y }} className={`absolute inset-0 flex items-center justify-center pointer-events-none z-40 px-6 sm:px-12 lg:px-24 w-full`}>
      <div className={`w-full max-w-[1600px] flex justify-between gap-12 lg:gap-32 ${layoutClass} items-center`}>
        <div className={`flex-[1.16] min-w-0 flex flex-col w-full max-w-[820px] ${textAlignment}`}>
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-[#E5997B] mb-2 drop-shadow-md bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">Point 0{index + 1} — {product.name}</p>
          <svg viewBox="0 0 1000 600" className="w-full h-auto overflow-visible drop-shadow-sm">
            <motion.text x={xPos} y="155" textAnchor={tAnchor} dominantBaseline="middle" className="font-display" fontSize={textFontSize} fontWeight="400" fill="none" stroke="#030035" strokeWidth="2.5" pathLength="1000" strokeDasharray="1000" style={{ strokeDashoffset, opacity: strokeOpacity }}>
              {lineChunks.map((line: string, idx: number) => (
                <tspan key={`stroke-${idx}`} x={xPos} dy={idx === 0 ? 0 : textLineDy}>{line}</tspan>
              ))}
            </motion.text>
            <motion.text x={xPos} y="155" textAnchor={tAnchor} dominantBaseline="middle" className="font-display" fontSize={textFontSize} fontWeight="400" fill="#030035" stroke="none" style={{ opacity: fillOpacity }}>
              {lineChunks.map((line: string, idx: number) => (
                <tspan key={`fill-${idx}`} x={xPos} dy={idx === 0 ? 0 : textLineDy}>{line}</tspan>
              ))}
            </motion.text>
          </svg>
        </div>
        <div className="flex-[0.84] min-w-0 flex justify-center items-center w-full"><ProductPointIcon index={index} drawProgress={drawProgress} /></div>
      </div>
    </motion.div>
  )
}
