import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SectionCurtain({
  curtainColor = '#ffffff',
  children,
}: {
  curtainColor?: string
  children: ReactNode
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current || !curtainRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(curtainRef.current, {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
      <div
        ref={curtainRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          backgroundColor: curtainColor,
          willChange: 'transform',
        }}
      />
    </div>
  )
}
