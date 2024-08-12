import {
  useGetExerciseSlugQuery,
  useDeleteExerciseMutation
} from '../../../slices/exercisesApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'

const ExerciseSlugShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise } = useParams()

  const { data, isLoading, error } = useGetExerciseSlugQuery({
    slugLog,
    slugExercise
  })

  const [deleteExercise, { isLoading: loadingDelete }] =
    useDeleteExerciseMutation()

  const deleteHandler = async () => {
    console.log(slugLog)
    if (window.confirm('Are you sure?')) {
      try {
        await deleteExercise({ slugLog, slugExercise })
        navigate(`/logs/${slugLog}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>
  if (loadingDelete) return <p>loading</p>

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <h1>ExerciseSlugShow</h1>
      <h2 className=''>{data.title}</h2>
      <Link to={`/logs/${slugLog}/edit/${data._id}`}>Edit</Link>
      <button onClick={() => deleteHandler(slugExercise)}>Delete</button>
      {/* <Link to={`/logs/${slugLog}/create-new-exercise`}>
        Go to Create Exercise
      </Link>
      <div className=''>
        {data.logAggregate.length > 0 &&
          data.logAggregate.map(item => (
            <p key={item._id} className=''>
              <Link className='' to={`/logs/${log.slugLog}`}>
              {item.exercises.slugExercise}
              </Link>
            </p>
          ))}
      </div> */}
    </>
  )
}

export default ExerciseSlugShow
