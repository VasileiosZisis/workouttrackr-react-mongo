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

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteLog(slugLog)
        navigate('/logs')
      } catch (err) {
        console.log(err)
      }
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate('/logs')
  }

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>
  if (loadingDelete) return <p>loading</p>

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <h1>LogSlugShow</h1>
      <h2 className=''>{data.log.title}</h2>
      <Link to={`/logs/edit/${data.log._id}`}>Edit</Link>
      <button onClick={() => deleteHandler(slugLog)}>Delete</button>
      <Link to={`/logs/${slugLog}/create-new-exercise`}>
        Go to Create Exercise
      </Link>
      <div className=''>
        {data.logAggregate.length > 0 &&
          data.logAggregate.map(item => (
            <Link
              key={item.exercises._id}
              className=''
              to={`/logs/${slugLog}/${item.exercises.slugExercise}`}
            >
              {item.exercises.title}
            </Link>
          ))}
      </div>
    </>
  )
}

export default LogSlugShow
