import { motion } from 'framer-motion'

export const DalioChartIcon = ({ drawProgress, className = "" }: { drawProgress: any, className?: string }) => {
  return (
    <svg viewBox="0 0 300 150" className={`w-full h-auto text-[#030035] opacity-90 drop-shadow-md ${className}`}>
      <motion.g style={{ pathLength: drawProgress }} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 20 10 L 20 130 L 280 130" strokeWidth="1.5" opacity="0.3" />
        <path d="M 20 130 L 280 20" strokeWidth="2" strokeDasharray="6 6" opacity="0.7" />
        <path d="M 20 130 Q 70 30 110 95 T 200 50 T 280 20" strokeWidth="2.5" />
        <circle cx="110" cy="95" r="4" fill="#E5997B" stroke="none" />
        <circle cx="200" cy="50" r="4" fill="#E5997B" stroke="none" />
      </motion.g>
    </svg>
  )
}
