import { motion, useTransform } from 'framer-motion'

export const GreekEngravingBackground = ({ scrollYProgress }: { scrollYProgress: any }) => {
  const rotate = useTransform(scrollYProgress, [0.60, 0.75], [0, 35])
  const scale = useTransform(scrollYProgress, [0.60, 0.75], [0.85, 1.05])

  const EngravingCorner = ({ style, className }: any) => (
    <svg viewBox="-40 -40 592 592" className={`absolute w-[300px] md:w-[450px] lg:w-[550px] h-auto text-[#030035] opacity-[0.20] overflow-visible ${className}`} style={style}>
      <path d="M495.2 60.1c-15.5-12.7-36.9-19-61.1-14.7-22.1 3.9-42.3 16.4-58.8 33.7-18.7 19.5-33.8 43.1-42.5 69-4.8 14.1-7.8 28.9-8.4 43.8-17.8-19.6-38.6-36.5-62.8-46.6-26.6-11.1-56.1-13.4-84.1-5.1-15 4.4-29.4 11.5-42.3 21-17.5 13.1-31.4 30.2-40.2 49.9-8.4 18.7-11.7 39.5-8.5 59.8 2.6 16.7 9.8 32.5 21 45.8 14.2 16.9 33.9 27.6 55.4 31 16.2 2.6 32.8.2 47.7-6.5 13.6-6.1 25.5-15.2 34.6-26.3-9 2-18.4 2.2-27.4.3-13.5-2.8-25.5-10.4-33.6-21.4-8-10.9-11.8-24.5-10.4-38.1 1.5-15 8.7-28.7 19.8-38.6 11.3-10 25.8-15.5 41-15.1 14.7.4 28.7 6.4 39.6 16.6 10.1 9.4 16.4 22.3 17.6 36.1 1 11.7-2.7 23.4-10.1 32.5-4.2 5.2-9.4 9.6-15.3 12.8 14.1 8 30.6 11.1 46.9 9.3 18.7-2.1 36.1-10.3 50.1-22.8 15.6-14 26.6-32.9 31.7-53.5 3.3-13.6 4.4-27.8 3.5-41.8 11.8 16.2 28.2 28.7 47.4 34.8 18.3 5.8 38.3 5.4 56.4-1.3 16.8-6.2 31.4-17.3 41.5-31.6 9.4-13.3 14.5-29.4 14.2-45.7-.3-17.5-6.8-34.1-18.1-47.5-13.7-16.1-33.1-26.6-54.2-29.3-16.8-2.1-33.9 1.1-48.9 9.3 14.8-13.8 32.9-23.7 52.8-28.4 22.7-5.3 47.1-2.4 67.9 9.2 8.7 4.9 16.4 10.9 23.2 17.8 6.5-13.4 8.7-28.8 6.1-43.9-3-17.7-13.3-33-27.7-43.2z" fill="url(#hatch)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M211.3 268.4c-4.4 7-10.6 12.7-17.8 16.3-7.7 3.9-16.5 5.6-25.2 4.7-9-.9-17.5-4.5-24.4-10.2-6.5-5.3-11.4-12.4-14.1-20.2-2.7-8.1-3.2-16.9-1.2-25.1 2.3-9.5 7.8-17.9 15.3-23.6 8-6 17.8-9.3 27.8-9.1 9.4.2 18.5 3.8 25.6 10 6.6 5.8 11.3 13.5 13.3 22.1 1.8 8 .5 16.5-3.6 23.5-3.4 5.9-8.4 10.8-14.5 14.1-4 .2-8 .1-11.9-.3 5.5-2.2 10.3-5.9 14.1-10.5 3.8-4.6 6.4-10.2 7.4-16.2.9-5.5.4-11.2-1.7-16.3-2.3-5.5-6.1-10.2-11-13.6-5.4-3.7-11.9-5.7-18.4-5.6-6.4.1-12.6 2.3-17.8 6.2-4.9 3.7-8.6 8.7-10.5 14.3-1.8 5.4-2.1 11.3-.8 16.8 1.4 6.2 4.7 11.8 9.3 16 5.2 4.7 11.8 7.6 18.7 8.3 6.3.6 12.8-.5 18.5-3.3 5-2.4 9.3-6 12.4-10.4 2.8-3.9 4.6-8.5 5.1-13.3 1.9 4.3 2.5 9 1.7 13.6z" fill="url(#hatch)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M386.4 151.7c-5.8 6.4-13.4 11-21.9 13.2-8.9 2.2-18.4 1.7-27.1-1.6-8.2-3.1-15.3-8.6-20.4-15.5-4.8-6.6-7.7-14.6-8.2-22.8-.5-8.7 1.7-17.3 6.2-24.5 5.1-8.2 12.7-14.5 21.6-17.8 9.4-3.5 19.8-3.9 29.5-1 9 2.7 16.9 8.3 22.4 15.6 5.1 6.8 8.1 15.1 8.5 23.6.4 7.9-1.8 15.7-6.1 22.3-3.6 5.6-8.6 10.1-14.5 13.1-3.6-1.5-7.1-3.4-10.3-5.7 4.3-3.6 7.8-8.3 10.1-13.7 2.4-5.6 3.4-11.8 2.8-17.8-.7-6.2-2.9-12.1-6.4-17.2-3.8-5.5-9.1-9.7-15.2-12.2-6.5-2.7-13.8-3.4-20.7-2-6.5 1.3-12.5 4.5-17.3 9.2-4.4 4.3-7.5 9.8-8.8 15.9-1.2 5.9-1 12 .7 17.7 1.9 6.2 5.6 11.7 10.6 15.8 5.6 4.5 12.5 7 19.5 7.1 6.3.1 12.5-1.5 18-4.7 5-2.9 9.1-7.1 11.9-12 2.5-4.3 3.9-9.3 4-14.3 2 3.6 3.1 7.7 3.2 11.8z" fill="url(#hatch)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,0,53,0.06)_100%)]">
      <svg className="absolute w-0 h-0"><defs><pattern id="hatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="6" stroke="#030035" strokeWidth="1.2" opacity="0.6" /></pattern></defs></svg>
      <motion.svg style={{ rotate, scale }} viewBox="0 0 1000 1000" className="absolute w-[180vw] md:w-[120vw] max-w-[1400px] h-auto text-[#030035] opacity-[0.06]">
        <g stroke="currentColor" strokeWidth="0.8" fill="none">
          {Array.from({ length: 36 }).map((_, i) => (<ellipse key={`out-${i}`} cx="500" cy="500" rx="460" ry="120" transform={`rotate(${i * 10} 500 500)`} />))}
          {Array.from({ length: 18 }).map((_, i) => (<ellipse key={`in-${i}`} cx="500" cy="500" rx="280" ry="60" transform={`rotate(${i * 20} 500 500)`} />))}
          <circle cx="500" cy="500" r="490" strokeWidth="1.5" /><circle cx="500" cy="500" r="480" strokeWidth="1" strokeDasharray="4 8" /><circle cx="500" cy="500" r="210" strokeWidth="1" strokeDasharray="2 4" />
        </g>
      </motion.svg>
      
      <EngravingCorner className="top-[-2%] left-[-2%]" style={{ transformOrigin: 'top left' }} />
      <EngravingCorner className="top-[-2%] right-[-2%]" style={{ transformOrigin: 'top right', transform: 'scaleX(-1)' }} />
      <EngravingCorner className="bottom-[-2%] left-[-2%]" style={{ transformOrigin: 'bottom left', transform: 'scaleY(-1)' }} />
      <EngravingCorner className="bottom-[-2%] right-[-2%]" style={{ transformOrigin: 'bottom right', transform: 'scale(-1, -1)' }} />
    </div>
  )
}
