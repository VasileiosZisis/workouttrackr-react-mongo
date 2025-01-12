import { useGetLogsQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import '../ModelMain.css'

const LogsShow = () => {
  const { data, isLoading, error } = useGetLogsQuery()

  const { userInfo } = useSelector(state => state.auth)

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <div className='title-container'>
        <h1 className='title-container__title'>Logs</h1>
      </div>
      <div className='model__contents'>
        <ul className='model__list'>
          <li className='model__item'>
            {data.length > 0 &&
              data.map(log => (
                <ProtectedRoute
                  key={log._id}
                  condition={userInfo._id === log.author}
                >
                  <Link className='model__link' to={`/logs/${log.slugLog}`}>
                    {log.title}
                  </Link>
                </ProtectedRoute>
              ))}
          </li>
        </ul>
      </div>
      <Link className='model__button' to={'/logs/create-new-log'}>
        Create new
      </Link>
    </main>
  )
}

export default LogsShow
