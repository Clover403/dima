import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLenis } from '../hooks/useLenis'

export default function Layout() {
  useLenis()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
