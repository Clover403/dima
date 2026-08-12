import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'

import { productsData } from '../../data/productos'
import { servicesData } from '../../data/servicios'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/modelo-crediticio', label: 'Modelo' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/productos', label: 'Productos' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
]

interface DropdownItem {
  to: string
  label: string
}

interface NavDropdownProps {
  label: string
  baseTo: string
  items: DropdownItem[]
  isActive: boolean
}

function NavDropdown({ label, baseTo, items, isActive }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [location.pathname])

  return (
    <div 
      className="relative flex items-center h-full"
      ref={dropdownRef}
    >
      <Link
        to={baseTo}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full font-body text-xs lg:text-[13px] transition-all duration-300 select-none ${
          isActive 
            ? 'bg-white/60 text-[#E5997B] font-bold shadow-sm' 
            : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-black/5'
        }`}
      >
        {label}
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="cursor-pointer flex items-center justify-center p-0.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 pt-2 w-48 z-50"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_32px_rgba(3,0,53,0.08)] p-1.5 overflow-hidden">
              <div className="flex flex-col">
                {items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-3 py-2 text-xs font-body text-gray-600 hover:text-gray-900 hover:bg-black/5 rounded-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)

  const productDropdownItems = productsData.map(p => ({
    to: `/productos/${p.slug}`,
    label: p.label
  }))

  const serviceDropdownItems = servicesData.map(s => ({
    to: `/servicios/${s.slug}`,
    label: s.name
  }))

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [location])

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 md:px-6 pointer-events-none">
        
        <nav className="pointer-events-auto flex items-center justify-between gap-3 md:gap-5 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] w-full max-w-4xl transition-all duration-300">
          
          <Link to="/" className="flex items-center pr-3 md:pr-4 border-r border-gray-300/50 shrink-0">
            <img 
              src="/logo/orange_black.svg" 
              alt="DIMA Finance" 
              className="h-6 md:h-7 w-auto object-contain" 
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isProductosActive = location.pathname === link.to || (link.to === '/productos' && location.pathname.startsWith('/productos/'))
              const isServiciosActive = location.pathname === link.to || (link.to === '/servicios' && location.pathname.startsWith('/servicios/'))
              const isActive = link.to === '/productos' ? isProductosActive : (link.to === '/servicios' ? isServiciosActive : location.pathname === link.to)

              if (link.to === '/productos') {
                return (
                  <NavDropdown 
                    key={link.to} 
                    label={link.label} 
                    baseTo={link.to} 
                    items={productDropdownItems} 
                    isActive={isActive} 
                  />
                )
              }

              if (link.to === '/servicios') {
                return (
                  <NavDropdown 
                    key={link.to} 
                    label={link.label} 
                    baseTo={link.to} 
                    items={serviceDropdownItems} 
                    isActive={isActive} 
                  />
                )
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2.5 py-1.5 rounded-full font-body text-xs lg:text-[13px] transition-all duration-300 select-none ${
                    isActive 
                      ? 'bg-white/60 text-[#E5997B] font-bold shadow-sm' 
                      : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* PERUBAHAN: Ditambahkan hidden lg:inline-flex agar sembunyi di mobile/tab tapi tetap ada di desktop */}
          <Link
            to="/contacto"
            className="group hidden lg:inline-flex items-center justify-center text-center bg-bronze/90 hover:bg-bronze text-white font-body text-xs lg:text-[13px] font-medium px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-bronze/30 hover:scale-[1.02] active:scale-[0.98] shrink-0 ml-auto"
          >
            <span>Contacto</span>
          </Link>

          <button
            className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 focus:outline-none rounded-full ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-white/80 backdrop-blur-lg z-[90] flex flex-col items-center justify-center gap-6 p-4"
          >
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              {navLinks.map((link, i) => {
                const isProductosActive = location.pathname === link.to || (link.to === '/productos' && location.pathname.startsWith('/productos/'))
                const isServiciosActive = location.pathname === link.to || (link.to === '/servicios' && location.pathname.startsWith('/servicios/'))
                const isActive = link.to === '/productos' ? isProductosActive : (link.to === '/servicios' ? isServiciosActive : location.pathname === link.to)

                if (link.to === '/productos') {
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                      className="w-full text-center"
                    >
                      <div
                        className={`relative flex items-center justify-center py-1.5 rounded-xl transition-all w-full ${
                          isActive || mobileProductsOpen
                            ? 'bg-black/10 text-gray-900 font-bold' 
                            : 'text-gray-600 font-medium hover:bg-black/5'
                        }`}
                      >
                        <Link
                          to={link.to}
                          className="py-1 px-4 text-lg hover:text-gray-900"
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setMobileProductsOpen(!mobileProductsOpen)
                          }}
                          className="absolute right-2 p-2 rounded-full hover:bg-black/10"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-1.5"
                          >
                            <div className="flex flex-col items-center gap-1.5 py-2 bg-black/5 rounded-xl">
                              {productDropdownItems.map(item => (
                                <Link
                                  key={item.to}
                                  to={item.to}
                                  className="py-1.5 px-5 text-sm text-gray-600 hover:text-gray-900 w-full"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                }

                if (link.to === '/servicios') {
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                      className="w-full text-center"
                    >
                      <div
                        className={`relative flex items-center justify-center py-1.5 rounded-xl transition-all w-full ${
                          isActive || mobileServicesOpen
                            ? 'bg-black/10 text-gray-900 font-bold' 
                            : 'text-gray-600 font-medium hover:bg-black/5'
                        }`}
                      >
                        <Link
                          to={link.to}
                          className="py-1 px-4 text-lg hover:text-gray-900"
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setMobileServicesOpen(!mobileServicesOpen)
                          }}
                          className="absolute right-2 p-2 rounded-full hover:bg-black/10"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-1.5"
                          >
                            <div className="flex flex-col items-center gap-1.5 py-2 bg-black/5 rounded-xl">
                              {serviceDropdownItems.map(item => (
                                <Link
                                  key={item.to}
                                  to={item.to}
                                  className="py-1.5 px-5 text-sm text-gray-600 hover:text-gray-900 w-full"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3 }}
                    className="w-full text-center"
                  >
                    <Link
                      to={link.to}
                      className={`inline-block py-2.5 px-5 rounded-xl text-lg transition-all w-full ${
                        isActive 
                          ? 'bg-black/10 text-gray-900 font-bold' 
                          : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-black/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
              
              {/* PERUBAHAN: Tombol Contacto ditambahkan di bagian paling bawah menu mobile dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1, duration: 0.3 }}
                className="w-full text-center mt-4"
              >
                <Link
                  to="/contacto"
                  onClick={() => setMobileOpen(false)}
                  className="inline-block w-full py-3 px-5 rounded-xl text-lg font-bold bg-[#E5997B]/90 hover:bg-[#E5997B] text-white shadow-md transition-all active:scale-[0.98]"
                >
                  Contacto
                </Link>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}