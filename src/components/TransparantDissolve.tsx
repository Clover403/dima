import { Children, type ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TriangleDissolveProps = {
  children: ReactNode
  cellSize?: number
  pinDistance?: string | number
  className?: string
}

const shuffle = <T,>(items: T[]) => {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function TriangleDissolve({
  children,
  cellSize = 150,
  pinDistance = '+=120%',
  className,
}: TriangleDissolveProps) {
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const childArray = Children.toArray(children)

  if (childArray.length < 2) {
    return <>{children}</>
  }

  const heroSection = childArray[0]
  const followingSections = childArray.slice(1)

  useLayoutEffect(() => {
    if (!pinContainerRef.current || !overlayRef.current) return

    const overlay = overlayRef.current
    let resizeTimer: number | null = null
    let timeline: gsap.core.Timeline | null = null
    let cells: HTMLDivElement[] = []

    const setup = () => {
      if (timeline) {
        timeline.kill()
        timeline = null
      }

      const width = window.innerWidth
      const height = window.innerHeight

      let seed = 12345
      const rand = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }

      const baseCols = Math.max(6, Math.floor(width / cellSize))
      const baseRows = Math.max(4, Math.floor(height / cellSize))
      const cX = width / baseCols
      const cY = height / baseRows

      const pts: Array<Array<[number, number]>> = []
      for (let r = 0; r <= baseRows; r++) {
        pts[r] = []
        for (let c = 0; c <= baseCols; c++) {
          const noiseX = (c === 0 || c === baseCols) ? 0 : (rand() - 0.5) * cX * 0.45
          const noiseY = (r === 0 || r === baseRows) ? 0 : (rand() - 0.5) * cY * 0.45
          pts[r][c] = [
            (c / baseCols) * 100 + (noiseX / width) * 100,
            (r / baseRows) * 100 + (noiseY / height) * 100,
          ]
        }
      }

      overlay.innerHTML = ''
      overlay.style.display = 'block'
      cells = []

      for (let r = 0; r < baseRows; r++) {
        for (let c = 0; c < baseCols; c++) {
          const p1 = pts[r][c]
          const p2 = pts[r][c + 1]
          const p3 = pts[r + 1][c]
          const p4 = pts[r + 1][c + 1]

          const tri1 = document.createElement('div')
          tri1.style.cssText = `
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: #e8e8e8;
            clip-path: polygon(${p1[0]}% ${p1[1]}%, ${p2[0]}% ${p2[1]}%, ${p3[0]}% ${p3[1]}%);
            will-change: opacity;
          `
          overlay.appendChild(tri1)
          cells.push(tri1)

          const tri2 = document.createElement('div')
          tri2.style.cssText = `
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: #ffffff;
            clip-path: polygon(${p2[0]}% ${p2[1]}%, ${p4[0]}% ${p4[1]}%, ${p3[0]}% ${p3[1]}%);
            will-change: opacity;
          `
          overlay.appendChild(tri2)
          cells.push(tri2)
        }
      }

      const randomCells = shuffle(cells)

      // Awal: semua triangle tidak kelihatan
      gsap.set(randomCells, { opacity: 0 })

      timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: 'top top',
          end: pinDistance,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            // Hapus semua triangle dari DOM — paling reliable di production
            overlay.innerHTML = ''
          },
          onEnterBack: () => {
            // Rebuild triangle ketika scroll balik
            setup()
            ScrollTrigger.refresh()
          },
        },
      })

      // Triangle muncul satu-satu secara acak sampai nutupin semua hero
      timeline.to(randomCells, {
        opacity: 1,
        stagger: { amount: 1.8, from: 'random' },
        ease: 'power2.inOut',
        duration: 0.5,
      }, 0)
    }

    setup()

    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setup()
        ScrollTrigger.refresh()
      }, 180)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) window.clearTimeout(resizeTimer)
      if (timeline) timeline.kill()
    }
  }, [cellSize, pinDistance])

  return (
    <div className={className}>
      <div
        ref={pinContainerRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Hero di belakang */}
        <div className="absolute inset-0 z-10">
          {heroSection}
        </div>

        {/* Triangle-triangle muncul di atas hero */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        />
      </div>

      {followingSections}
    </div>
  )
}