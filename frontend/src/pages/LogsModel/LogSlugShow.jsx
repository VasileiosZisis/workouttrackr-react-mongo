import {
  useGetLogSlugQuery,
  useDeleteLogMutation
} from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const LogSlugShow = () => {
  const { slugLog } = useParams()
  const { data, isLoading, error } = useGetLogSlugQuery(slugLog)

  const [deleteLog, { isLoading: loadingDelete }] = useDeleteLogMutation()

  const deleteHandler = async id => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteLog(slugLog)
      } catch (err) {
        console.log(err)
      }
    }
  }

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>
  if (loadingDelete) return <p>loading</p>

  return (
    <>
      <h1>LogSlugShow</h1>
      <div className=''>{data.title}</div>
      <Link to={`/logs/edit/${data._id}`}>Edit</Link>
      <button onClick={() => deleteHandler(slugLog)}>Delete</button>
    </>
  )
}

export default LogSlugShow
