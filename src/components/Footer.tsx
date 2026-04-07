import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/modelo-crediticio', label: 'Modelo Crediticio' },
  { to: '/productos', label: 'Productos' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5">
      <div className="section-padding py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <img
              src="/logo/orange_white.svg"
              alt="DIMA Finance"
              className="h-10 w-auto"
            />
            <p className="text-lightgray/50 text-sm leading-relaxed max-w-xs">
              Ingeniería financiera para el crecimiento real.
              Estructuramos soluciones basadas en equilibrio macroeconómico.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm text-bronze tracking-widest uppercase mb-6">
              Navegación
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-lightgray/50 hover:text-bronze transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm text-bronze tracking-widest uppercase mb-6">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-lightgray/50">
              <li>
                <a
                  href="mailto:contacto@dimafinance.mx"
                  className="hover:text-bronze transition-colors duration-300"
                >
                  contacto@dimafinance.mx
                </a>
              </li>
              <li>
                <a
                  href="tel:+525512345678"
                  className="hover:text-bronze transition-colors duration-300"
                >
                  +52 55 1234 5678
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/525512345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bronze transition-colors duration-300"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-lightgray/30">
            &copy; {new Date().getFullYear()} DIMA Finance. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              to="/aviso-legal"
              className="text-xs text-lightgray/30 hover:text-bronze transition-colors duration-300"
            >
              Aviso Legal
            </Link>
            <Link
              to="/privacidad"
              className="text-xs text-lightgray/30 hover:text-bronze transition-colors duration-300"
            >
              Aviso de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
