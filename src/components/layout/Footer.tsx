import { Link } from 'react-router-dom'

const navigationLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/modelo-crediticio', label: 'Modelo Crediticio' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/productos', label: 'Productos' },
]

const companyLinks = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
]

export default function Footer() {
  return (
    <footer className="relative z-20 w-full min-h-screen flex flex-col bg-transparent -mt-12 md:-mt-20">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LAYER BACKGROUND (Cekungan Bolong & Warna Solid) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className="relative z-10 w-full h-12 md:h-20 text-bronze -mb-[1px]">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 L0,100 L1440,100 L1440,0 C1100,0 950,85 720,85 C490,85 340,0 0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="relative z-0 w-full flex-1 bg-bronze" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPACER ATAS (Mengosongkan area kurva agar tidak tertutup konten) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full h-12 md:h-20 shrink-0 relative z-10 pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* KONTEN FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 px-5 md:px-10 lg:px-20 pb-8 flex-1 flex flex-col">

        {/* Teks dan Navigasi */}
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative z-10">
          
          {/* ===== CTA Section ===== */}
          <div className="flex-1 flex flex-col justify-center items-center py-16 text-center border-b border-navy/20">
            <div className="max-w-6xl mx-auto space-y-10 md:space-y-14 mb-8 md:mb-12">
              <h2 className="font-display text-4xl md:text-6xl lg:text-[6rem] text-navy leading-[1.05] tracking-tight uppercase">
                ¿Listo para estructurar su crecimiento?
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
                <a
                  href="https://calendly.com/corporativo-dimafinance/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-navy text-white font-bold text-sm tracking-widest uppercase hover:bg-navy/90 transition-all duration-300"
                >
                  Consulta
                </a>
                <Link
                  to="/productos"
                  className="px-10 py-4 border border-navy text-navy font-bold text-sm tracking-widest uppercase hover:bg-navy hover:text-white transition-all duration-300"
                >
                  Ver Productos
                </Link>
              </div>
            </div>
          </div>

          {/* ===== Bagian Bawah: Link & Copyright ===== */}
          <div className="shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-14">
              <div className="col-span-2 md:col-span-1">
                <img
                  src="/logo/orange_black.svg"
                  alt="DIMA Finance"
                  className="h-8 w-auto"
                />
              </div>

              <div className="col-span-1">
                <h4 className="font-display text-xs text-navy tracking-widest uppercase mb-4 font-bold">
                  Navegación
                </h4>
                <ul className="space-y-3">
                  {navigationLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-navy hover:opacity-60 transition-opacity duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-1">
                <h4 className="font-display text-xs text-navy tracking-widest uppercase mb-4 font-bold">
                  Empresa
                </h4>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-navy hover:opacity-60 transition-opacity duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h4 className="font-display text-xs text-navy tracking-widest uppercase mb-4 font-bold">
                  Contacto
                </h4>
                <ul className="space-y-3 text-sm text-navy">
                  <li>
                    <a
                      href="mailto:corporativo@dimafinance.com.mx"
                      className="hover:opacity-60 transition-opacity duration-300"
                    >
                      corporativo@dimafinance.com.mx
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/5213319717871"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-60 transition-opacity duration-300"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://calendly.com/corporativo-dimafinance/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-60 transition-opacity duration-300"
                    >
                      Agendar Videollamada
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="order-2 md:order-1">
                <p className="text-xs text-navy">
                  &copy; {new Date().getFullYear()} DIMA Finance.
                </p>
              </div>
              <div className="flex gap-6 order-1 md:order-2">
                <Link
                  to="/aviso-legal"
                  className="text-xs text-navy hover:opacity-60 transition-opacity duration-300 uppercase tracking-wider"
                >
                  Aviso Legal
                </Link>
                <Link
                  to="/privacidad"
                  className="text-xs text-navy hover:opacity-60 transition-opacity duration-300 uppercase tracking-wider"
                >
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}