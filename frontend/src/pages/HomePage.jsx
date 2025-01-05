import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <Link to={'/logs'}>Go to Logs</Link>
      <Link to={'/login'}>Go to login</Link>
      <Link to={'/register'}>Go to Register</Link>
      <Link className='model__button' to={'/logs/create-new-log'}>
        Create new
      </Link>
    </div>
  )
}

export default HomePage
