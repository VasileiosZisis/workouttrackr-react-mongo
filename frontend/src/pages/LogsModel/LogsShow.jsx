import { useGetLogsQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'

const LogsShow = () => {
  const { data, isLoading, error } = useGetLogsQuery()

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <div className=''>
      {data.length > 0 &&
        data.map(log => (
          <p key={log._id} className=''>
            <Link className='' to={`/logs/${log.slugLog}`}>
              {log.title}
            </Link>
          </p>
        ))}
    </div>
  )
}

export default LogsShow
