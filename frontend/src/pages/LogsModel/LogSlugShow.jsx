import {
  useGetLogSlugQuery,
  useDeleteLogMutation
} from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'

const LogSlugShow = () => {
  const navigate = useNavigate()

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

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <h1>LogSlugShow</h1>
      <h2 className=''>{data.title}</h2>
      <Link to={`/logs/edit/${data._id}`}>Edit</Link>
      <button onClick={() => deleteHandler(slugLog)}>Delete</button>
      <Link to={`/logs/${slugLog}/new-exercise`}>Go to Create Exercise</Link>
      <div className=''>
        {data.logAggregate.length > 0 &&
          data.logAggregate.map(item => (
            <p key={item._id} className=''>
              {/* <Link className='' to={`/logs/${log.slugLog}`}> */}
              {item.exercises.slugExercise}
              {/* </Link> */}
            </p>
          ))}
      </div>
    </>
  )
}

export default LogSlugShow
