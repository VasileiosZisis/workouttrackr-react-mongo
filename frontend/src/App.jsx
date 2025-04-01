import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hamburger from './components/Hamburger'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { HelmetProvider } from 'react-helmet-async'
import './toast.css'

function App () {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <HelmetProvider>
      <Hamburger toggleNav={toggleNav} />
      <Navbar isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <Outlet />
      <ToastContainer
        position='top-right'
        transition:Slide
        draggable={false}
        theme='colored'
        autoClose={4000}
      />
    </HelmetProvider>
  )
}

export default App
