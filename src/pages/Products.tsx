import PageTransition from '../components/PageTransition'

export default function Products() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center section-padding pt-32">
        <div className="text-center max-w-3xl">
          <p className="text-bronze font-body text-sm tracking-widest uppercase mb-6">
            Productos
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-tight mb-8">
            Soluciones que
            <br />
            <span className="text-bronze italic">construyen</span>
          </h1>
          <p className="text-lightgray/60 text-lg leading-relaxed">
            Cada producto está diseñado como una pieza de ingeniería financiera.
            No vendemos créditos — estructuramos crecimiento.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
