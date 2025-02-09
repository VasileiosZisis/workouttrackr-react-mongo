import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import './toast.css'

function App () {
  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer transition:Slide draggable={false} theme='colored' />
    </>
  )
}

export default App
