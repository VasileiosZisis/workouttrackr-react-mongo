import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const LogSlugShow = () => {
  const { slugLog } = useParams()
  const { data, isLoading, error } = useGetLogSlugQuery(slugLog)

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <>
          <h1>LogSlugShow</h1>
          <div className=''>{data.title}</div>
          <div className=''>{data._id}</div>
          <Link to={`/logs/edit/${data._id}`}>Edit</Link>
        </>
      )}
    </>
  )
}

export default LogSlugShow
