import PageTransition from '../components/PageTransition'

export default function Contact() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center section-padding pt-32">
        <div className="text-center max-w-3xl">
          <p className="text-bronze font-body text-sm tracking-widest uppercase mb-6">
            Contacto
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-tight mb-8">
            Hablemos de tu
            <br />
            <span className="text-bronze italic">crecimiento</span>
          </h1>
          <p className="text-lightgray/60 text-lg leading-relaxed mb-12">
            Agenda una videollamada o envíanos un mensaje.
            Nuestro equipo está listo para estructurar tu siguiente paso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="btn-bronze">
              Agenda una Videollamada
            </a>
            <a href="mailto:contacto@dimafinance.mx" className="btn-bronze-fill">
              Enviar Mensaje
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
