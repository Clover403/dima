export default function AboutCTASection() {
  return (
    <section className="cta-section relative w-full min-h-[85vh] bg-[#030035] flex items-center justify-center overflow-hidden">

      {/* Engineering grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(229,153,123,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229,153,123,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial bronze halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(229,153,123,0.07) 0%, transparent 60%)',
        }}
      />

      {/* Corner brackets */}
      <svg className="absolute top-10 left-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M0 20 L0 0 L20 0" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>
      <svg className="absolute top-10 right-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M40 20 L40 0 L20 0" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>
      <svg className="absolute bottom-10 left-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M0 20 L0 40 L20 40" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>
      <svg className="absolute bottom-10 right-10 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none">
        <path d="M40 20 L40 40 L20 40" stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.3" />
      </svg>

      {/* Horizontal rule lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5997B]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5997B]/15 to-transparent" />

      {/* CTA content */}
      <div className="cta-content relative z-10 w-full max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center gap-10">

        {/* Eyebrow */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-px bg-[#E5997B]/40" />
          <span className="font-mono text-[9px] tracking-[0.6em] uppercase text-[#E5997B]/55">
            Siguiente Paso
          </span>
          <div className="w-8 h-px bg-[#E5997B]/40" />
        </div>

        {/* Main heading */}
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-[clamp(3rem,7vw,6.5rem)] text-[#F4F4F5] font-light leading-[1.0] tracking-tight">
            Hablemos de
          </h2>
          <h2 className="font-display italic text-[clamp(3rem,7vw,6.5rem)] text-[#E5997B] font-light leading-[1.0] tracking-tight">
            su empresa.
          </h2>
        </div>

        {/* Descriptor */}
        <div className="flex flex-col items-center gap-4 max-w-md">
          <div className="w-8 h-px bg-[#E5997B]/25" />
          <p
            className="text-[#F4F4F5]/35 text-sm md:text-base leading-[1.9] font-light"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Agende una sesión de 30 minutos con nuestro equipo. Diagnóstico preliminar sin costo — sin compromiso.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button className="btn-reveal flex-1 px-8 py-4 bg-[#E5997B] text-[#030035] font-medium text-xs uppercase tracking-[0.2em] hover:bg-[#d4856a] transition-colors duration-300">
            Agendar Consulta
          </button>
          <button className="btn-reveal flex-1 px-8 py-4 bg-transparent border border-[#F4F4F5]/15 text-[#F4F4F5]/60 font-light text-xs uppercase tracking-[0.2em] hover:border-[#E5997B]/50 hover:text-[#E5997B]/80 transition-all duration-300">
            Nuestro Modelo
          </button>
        </div>

        {/* Fine print */}
        <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#F4F4F5]/15">
          Sesión de 30 minutos · Sin compromiso · Video conferencia
        </p>

        {/* Bottom decorative balance SVG */}
        <div className="mt-4 opacity-[0.07]">
          <svg viewBox="0 0 200 60" fill="none" className="w-48 h-auto">
            <line x1="100" y1="5" x2="100" y2="55" stroke="#E5997B" strokeWidth="1"/>
            <line x1="20" y1="5" x2="180" y2="5" stroke="#E5997B" strokeWidth="1.2"/>
            <line x1="20" y1="5" x2="5" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <line x1="20" y1="5" x2="35" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <path d="M2 40 C 2 55, 38 55, 38 40 Z" stroke="#E5997B" strokeWidth="0.8"/>
            <line x1="180" y1="5" x2="165" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <line x1="180" y1="5" x2="195" y2="40" stroke="#E5997B" strokeWidth="0.6"/>
            <path d="M162 40 C 162 55, 198 55, 198 40 Z" stroke="#E5997B" strokeWidth="0.8"/>
            <rect x="94" y="53" width="12" height="6" stroke="#E5997B" strokeWidth="0.6"/>
          </svg>
        </div>
      </div>

      {/* Bottom metadata */}
      <div className="absolute bottom-0 left-0 right-0 py-4 px-8 md:px-16 flex items-center justify-between border-t border-[#F4F4F5]/5">
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">
          DIMA Finance — SOFOM E.N.R.
        </span>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">
          México — MMXXIV
        </span>
      </div>
    </section>
  );
}