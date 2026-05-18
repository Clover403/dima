import 'react'

declare module 'react' {
  // Allow animated SVG/style props (framer-motion MotionValue assignments)
  interface CSSProperties {
    pathLength?: any
    strokeDashoffset?: any
    fillOpacity?: any
    // allow arbitrary animated props to avoid repetitive casts
    [key: string]: any
  }
}
