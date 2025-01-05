import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, condition }) => {
  return condition ? children : <Navigate to='/' />
}

export default ProtectedRoute
