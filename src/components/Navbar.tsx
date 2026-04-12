import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/modelo-crediticio', label: 'Modelo' },
  { to: '/productos', label: 'Productos' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="section-padding flex items-center justify-between h-20">
        {/* Logo — swaps between light version (on dark hero) and dark version (on light bg) */}
        <Link to="/" className="relative z-50">
          <img
            src={scrolled ? '/logo/orange_black.svg' : '/logo/orange_white.svg'}
            alt="DIMA Finance"
            className="h-8 md:h-10 w-auto transition-opacity duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm tracking-wide transition-colors duration-300 hover:text-bronze ${
                location.pathname === link.to
                  ? 'text-bronze'
                  : scrolled
                  ? 'text-navy/65'
                  : 'text-lightgray/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-px transition-all duration-300 ${
              scrolled ? 'bg-navy' : 'bg-lightgray'
            } ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`}
          />
          <span
            className={`block w-6 h-px transition-all duration-300 ${
              scrolled ? 'bg-navy' : 'bg-lightgray'
            } ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden fixed inset-0 bg-navy/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                <Link
                  to={link.to}
                  className={`font-display text-3xl transition-colors duration-300 hover:text-bronze ${
                    location.pathname === link.to
                      ? 'text-bronze'
                      : 'text-lightgray'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
