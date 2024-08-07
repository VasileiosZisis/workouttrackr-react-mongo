import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'

const ExerciseSlugShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise } = useParams()

  const { data, isLoading, error } = useGetExerciseSlugQuery({
    slugLog,
    slugExercise
  })

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <h1>ExerciseSlugShow</h1>
      <h2 className=''>{data.title}</h2>
      <Link to={`/logs/${slugLog}/edit/${data._id}`}>Edit</Link>
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
