import { useGetLogIdQuery } from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const LogIdShow = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useGetLogIdQuery(id)

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <>
          <h1>LogIdShow</h1>
          <div className=''>{data.title}</div>
          <div className=''>{data._id}</div>
          {/* <Link to={`/logs/${data._id}/edit`}>Edit</Link> */}
        </>
      )}
    </>
  )
}

export default LogIdShow
