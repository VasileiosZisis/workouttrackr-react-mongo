import { useGetLogsQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'

const LogsShow = () => {
  const { data, isLoading, error, refetch } = useGetLogsQuery()

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
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
      )}
    </>
  )
}

export default LogsShow
