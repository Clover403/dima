import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  { id: 'servicio-01', number: '01', name: 'Reingeniería de Deuda' },
  { id: 'servicio-02', number: '02', name: 'Estrategia Financiera Cíclica' },
  { id: 'servicio-03', number: '03', name: 'Tesorería Avanzada' },
  { id: 'servicio-04', number: '04', name: 'Valuación Estratégica' },
  { id: 'servicio-05', number: '05', name: 'Auditoría de Activos' },
  { id: 'servicio-06', number: '06', name: 'Gobernanza Financiera' },
]

export default function ServiciosNav() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.nav-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleClick = (id: string) => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={sectionRef} className="bg-cream py-16 md:py-24 section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-6">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleClick(service.id)}
              className="nav-card group flex-shrink-0 w-44 md:w-auto text-left p-5 md:p-6 transition-all duration-500 hover:bg-white/60"
            >
              <span className="block font-display text-2xl md:text-3xl text-bronze/30 group-hover:text-bronze/60 transition-colors duration-500 mb-3">
                {service.number}
              </span>
              <span className="block font-body text-sm md:text-base text-navy font-medium leading-snug">
                {service.name}
              </span>
              {/* Underline on hover */}
              <div className="mt-3 h-px bg-bronze scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
