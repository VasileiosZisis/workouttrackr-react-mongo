const ProtectedRoute = ({ children, condition }) => {
  return condition && children
}

export default ProtectedRoute
