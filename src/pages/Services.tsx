import PageTransition from '../components/PageTransition'

export default function Services() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center section-padding pt-32">
        <div className="text-center max-w-3xl">
          <p className="text-bronze font-body text-sm tracking-widest uppercase mb-6">
            Servicios
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-tight mb-8">
            Acompañamiento
            <br />
            <span className="text-bronze italic">estratégico</span>
          </h1>
          <p className="text-lightgray/60 text-lg leading-relaxed">
            Más allá de los productos, ofrecemos un ecosistema de servicios
            diseñados para fortalecer la estructura financiera de nuestros clientes.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
