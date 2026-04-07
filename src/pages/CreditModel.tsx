import PageTransition from '../components/PageTransition'

export default function CreditModel() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center section-padding pt-32">
        <div className="text-center max-w-3xl">
          <p className="text-bronze font-body text-sm tracking-widest uppercase mb-6">
            Modelo Crediticio
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-tight mb-8">
            Equilibrio como
            <br />
            <span className="text-bronze italic">principio rector</span>
          </h1>
          <p className="text-lightgray/60 text-lg leading-relaxed">
            Nuestro modelo crediticio se fundamenta en los principios macroeconómicos
            de Ray Dalio, adaptados al contexto financiero mexicano. Estructuramos
            cada producto para mantener el equilibrio entre productividad y deuda.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
