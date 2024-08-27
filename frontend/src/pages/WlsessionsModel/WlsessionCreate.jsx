import { useForm } from 'react-hook-form'
import { useCreateWlsessionMutation } from '../../../slices/wlsessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

const WlsessionCreate = () => {
  const navigate = useNavigate()
  const { slugLog, slugExercise } = useParams()

  const {
    data: exerciseData,
    isLoading: exerciseLoading,
    error: exerciseError
  } = useGetExerciseSlugQuery({ slugLog, slugExercise })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [createWlsession, { isLoading }] = useCreateWlsessionMutation()

  const onSubmit = async data => {
    console.log(data)
    try {
      const res = await createWlsession({
        ...data,
        slugLog: slugLog,
        slugExercise: slugExercise
      }).unwrap()
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}/${slugExercise}`)
  }

  if (exerciseLoading) return <p>loading</p>
  if (exerciseError)
    return <div>{exerciseError?.data?.message || exerciseError.error}</div>

  return (
    <>
      <h1>Create Session</h1>
      <h2>{exerciseData.exercise.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='createdDate' name='createdDate'>
          createdDate
        </label>
        <input type='date' {...register('createdDate')} />
        <p>{errors.createdDate?.message}</p>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={submitHandler}>Go Back</button>
    </>
  )
}

export default WlsessionCreate
