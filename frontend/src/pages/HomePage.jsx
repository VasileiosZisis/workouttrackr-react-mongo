import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <Link to={'/logs'}>Go to Logs</Link>
    </div>
  )
}

export default HomePage
