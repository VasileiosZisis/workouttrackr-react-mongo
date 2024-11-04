import { useGetLogsQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import '../ModelShow.css'

const LogsShow = () => {
  const { data, isLoading, error } = useGetLogsQuery()

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <div className='title-container'>
        <h1 className='title-container__title'>Logs</h1>
      </div>
      <div className='model__contents'>
        <ul className='model__list'>
          {data.length > 0 &&
            data.map(log => (
              <li key={log._id} className='model__item'>
                <Link className='model__link' to={`/logs/${log.slugLog}`}>
                  {log.title}
                </Link>
              </li>
            ))}
        </ul>
        <Link className='model__button' to={'/logs/create-new-log'}>
          Create new
        </Link>
      </div>
    </main>
  )
}

export default LogsShow
