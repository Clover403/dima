import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreditModel from './pages/CreditModel'
import Products from './pages/Products'
import Services from './pages/Services'
import Contact from './pages/Contact'
import About from './pages/About'
import Process from './pages/Process'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/modelo-crediticio" element={<CreditModel />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/proceso" element={<Process />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
