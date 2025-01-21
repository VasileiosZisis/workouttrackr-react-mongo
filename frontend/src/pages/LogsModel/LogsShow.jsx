import { useGetLogsQuery } from '../../../slices/logsApiSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import Pagination from '../../components/Pagination'
import '../ModelMain.css'

const LogsShow = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))

  const { data, isLoading, error } = useGetLogsQuery({
    limit,
    page
  })

  const { userInfo } = useSelector(state => state.auth)

  const handleLimitChange = e => {
    const newLimit = Number(e.target.value)
    searchParams.set('limit', newLimit)
    searchParams.set('page', 1)
    navigate(`?${searchParams.toString()}`, { replace: true })
  }

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <div className='title-container'>
        <h1 className='title-container__title'>Logs</h1>
      </div>
      <div className='model__contents'>
        <label className='model__label'>
          per page:&emsp;
          <select
            className='model__select'
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={13}>13</option>
            <option value={26}>26</option>
            <option value={52}>52</option>
          </select>
        </label>
        <ul className='model__list'>
          <li className='model__item'>
            {data.logs.length > 0 &&
              data.logs.map(log => (
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
      {data.pagination.totalPages > 1 && (
        <Pagination
          totalPages={data.pagination.totalPages}
          initialPage={Number(searchParams.get('page'))}
        />
      )}
      <Link className='model__button' to={'/logs/create-new-log'}>
        Create new
      </Link>
    </main>
  )
}

export default LogsShow
