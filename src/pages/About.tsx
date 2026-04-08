import PageTransition from '../components/PageTransition'

export default function About() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center section-padding pt-32">
        <div className="text-center max-w-3xl">
          <p className="text-bronze font-body text-sm tracking-widest uppercase mb-6">
            Nosotros
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-navy leading-tight mb-8">
            Arquitectos del
            <br />
            <span className="text-bronze italic">equilibrio</span>
          </h1>
          <p className="text-navy/60 text-lg leading-relaxed">
            Somos un equipo multidisciplinario de ingenieros financieros,
            economistas y estrategas comprometidos con transformar
            el panorama crediticio en México.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
