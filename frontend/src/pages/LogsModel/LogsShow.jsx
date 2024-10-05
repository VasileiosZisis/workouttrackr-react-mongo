import { useGetLogsQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'

const LogsShow = () => {
  const { data, isLoading, error } = useGetLogsQuery()

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <>
      <Link to={'/logs/create-new-log'}>Go to Create New Log</Link>
      <div className=''>
        {data.length > 0 &&
          data.map(log => (
            <Link key={log._id} className='' to={`/logs/${log.slugLog}`}>
              {log.title}
            </Link>
          ))}
      </div>
    </>
  )
}

export default LogsShow
