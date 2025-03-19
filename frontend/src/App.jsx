import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import { HelmetProvider } from 'react-helmet-async'
import './toast.css'

function App () {
  return (
    <HelmetProvider>
      <Navbar />
      <Outlet />
      <ToastContainer
        position='top-center'
        transition:Slide
        draggable={false}
        theme='colored'
        autoClose={2500}
      />
    </HelmetProvider>
  )
}

export default App
