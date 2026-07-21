import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function SpotlightGridBackground({ isHighContrast = false }: { isHighContrast?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightGridRef = useRef<HTMLDivElement>(null)
  const spotlightDotsRef = useRef<HTMLDivElement>(null)

  const gridAlpha = isHighContrast ? 0.55 : 0.35
  const gridOpacity = isHighContrast ? 1 : 0.85
  const shadowBlur = isHighContrast ? '2px' : '1px'
  const shadowAlpha = isHighContrast ? 0.3 : 0.1

  useEffect(() => {
    const ctx = gsap.context(() => {
      const gridAngleProxy = { angle: 0 }
      const dotsAngleProxy = { angle: 0 }

      gsap.set(spotlightGridRef.current, { '--grid-angle': '0deg' })
      gsap.set(spotlightDotsRef.current, { '--dots-angle': '0deg' })

      // Grid spotlight: clockwise
      gsap.to(gridAngleProxy, {
        angle: "+=360",
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (spotlightGridRef.current) {
            spotlightGridRef.current.style.setProperty('--grid-angle', `${gridAngleProxy.angle}deg`)
          }
        }
      })

      // Dots spotlight: counter-clockwise
      gsap.to(dotsAngleProxy, {
        angle: "-=360",
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (spotlightDotsRef.current) {
            spotlightDotsRef.current.style.setProperty('--dots-angle', `${dotsAngleProxy.angle}deg`)
          }
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Spotlight Grid Layer */}
      <div
        ref={spotlightGridRef}
        className="absolute inset-0 w-full h-full z-[1]"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%), conic-gradient(from calc(var(--grid-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%), conic-gradient(from calc(var(--grid-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'intersect',
          '--grid-angle': '0deg',
        } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[100vw] h-[100vh]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(211,211,211,${gridAlpha}) 1px, transparent 1px), 
              linear-gradient(to bottom, rgba(211,211,211,${gridAlpha}) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
            backgroundPosition: '36px 36px',
            maskImage: 'radial-gradient(circle at center, transparent 8px, black 12px)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 8px, black 12px)',
            maskSize: '72px 72px',
            WebkitMaskSize: '72px 72px',
            opacity: gridOpacity,
          }}
        />
      </div>

      {/* Spotlight Dots Layer */}
      <div
        ref={spotlightDotsRef}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{
          maskImage: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%), conic-gradient(from calc(var(--dots-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%), conic-gradient(from calc(var(--dots-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'intersect',
          '--dots-angle': '0deg',
        } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[100vw] h-[100vh]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 36px 36px, rgba(211,211,211,${gridAlpha}) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '72px 72px',
            backgroundPosition: '0px 0px',
            filter: `drop-shadow(0 0 ${shadowBlur} rgba(211,211,211,${shadowAlpha}))`,
          }}
        />
      </div>
    </div>
  )
}
