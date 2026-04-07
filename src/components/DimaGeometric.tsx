import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function DimaGeometric() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll('.geo-path')

    // Set initial state — paths invisible via stroke-dashoffset
    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      })
    })

    // Animate draw-in
    const tl = gsap.timeline({ delay: 0.8 })

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: 'power2.out',
      stagger: 0.3,
    })

    // Gentle floating animation after draw
    tl.to(
      svgRef.current,
      {
        y: -8,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      },
      '+=0.5'
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      className="w-full h-full max-w-[400px] max-h-[400px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top-left diamond (pointing down) */}
      <path
        className="geo-path"
        d="M60 60 L160 60 L160 100 L110 155 L60 100 Z"
        stroke="#E5997B"
        strokeWidth="1"
        fill="none"
        opacity="0"
      />
      {/* Top-right diamond (pointing down) */}
      <path
        className="geo-path"
        d="M240 60 L340 60 L340 100 L290 155 L240 100 Z"
        stroke="#E5997B"
        strokeWidth="1"
        fill="none"
        opacity="0"
      />
      {/* Bottom-left diamond (pointing up) */}
      <path
        className="geo-path"
        d="M60 340 L160 340 L160 300 L110 245 L60 300 Z"
        stroke="#E5997B"
        strokeWidth="1"
        fill="none"
        opacity="0"
      />
      {/* Bottom-right diamond (pointing up) */}
      <path
        className="geo-path"
        d="M240 340 L340 340 L340 300 L290 245 L240 300 Z"
        stroke="#E5997B"
        strokeWidth="1"
        fill="none"
        opacity="0"
      />

      {/* Center cross lines */}
      <line
        className="geo-path"
        x1="200" y1="80" x2="200" y2="320"
        stroke="#E5997B"
        strokeWidth="0.5"
        opacity="0"
      />
      <line
        className="geo-path"
        x1="80" y1="200" x2="320" y2="200"
        stroke="#E5997B"
        strokeWidth="0.5"
        opacity="0"
      />

      {/* Outer diamond frame */}
      <path
        className="geo-path"
        d="M200 30 L370 200 L200 370 L30 200 Z"
        stroke="#E5997B"
        strokeWidth="0.5"
        fill="none"
        opacity="0"
      />
    </svg>
  )
}
