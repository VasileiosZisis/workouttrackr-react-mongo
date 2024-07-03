import { useGetLogDetailsQuery } from '../../../slices/logsApiSlice'
import { useParams } from 'react-router-dom'

const LogDetails = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useGetLogDetailsQuery(id)

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <div className=''>{data.title}</div>
      )}
    </>
  )
}

export default LogDetails