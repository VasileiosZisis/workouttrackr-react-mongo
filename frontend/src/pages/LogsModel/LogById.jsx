import { useGetLogIdQuery } from '../../../slices/logsApiSlice'
import { useParams } from 'react-router-dom'

const LogById = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useGetLogIdQuery(id)

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

export default LogById
