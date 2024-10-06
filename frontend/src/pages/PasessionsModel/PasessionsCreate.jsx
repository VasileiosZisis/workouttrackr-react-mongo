import { useForm } from 'react-hook-form'
import { useCreatePasessionMutation } from '../../../slices/pasessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

const PasessionCreate = () => {
  const navigate = useNavigate()
  const { slugLog, slugExercise } = useParams()

  const {
    data: exerciseData,
    isLoading: exerciseLoading,
    error: exerciseError
  } = useGetExerciseSlugQuery({ slugLog, slugExercise })

  const defaultDate = new Date().toISOString().slice(0, 10)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      createdDate: defaultDate
    }
  })

  const [createPasession, { isLoading }] = useCreatePasessionMutation()

  const onSubmit = async data => {
    try {
      const res = await createPasession({
        ...data,
        slugLog: slugLog,
        slugExercise: slugExercise
      }).unwrap()
      navigate(`/logs/${slugLog}/${slugExercise}`)
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
        <label htmlFor='time' name='time'>
          time
        </label>
        <input type='number' {...register('time')} />
        <p>{errors.time?.message}</p>
        <label htmlFor='distance' name='distance'>
          distance
        </label>
        <input type='number' {...register('distance')} />
        <p>{errors.distance?.message}</p>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={submitHandler}>Go Back</button>
    </>
  )
}

export default PasessionCreate
