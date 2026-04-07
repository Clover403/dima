import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationOptions {
  animation: (el: HTMLElement, tl: gsap.core.Timeline) => void
  trigger?: string
  start?: string
  end?: string
  scrub?: boolean | number
  once?: boolean
}

export function useScrollAnimation(options: ScrollAnimationOptions) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: options.trigger ? el.querySelector(options.trigger) : el,
        start: options.start || 'top 80%',
        end: options.end || 'bottom 20%',
        scrub: options.scrub ?? false,
        once: options.once ?? false,
      },
    })

    options.animation(el, tl)

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el || el.contains(st.trigger as Node)) {
          st.kill()
        }
      })
    }
  }, [])

  return ref
}
