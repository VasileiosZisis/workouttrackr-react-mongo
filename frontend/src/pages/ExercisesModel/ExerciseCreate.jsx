import { useForm } from 'react-hook-form'
import { useCreateExerciseMutation } from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

const ExerciseCreate = () => {
  const navigate = useNavigate()
  const { slugLog } = useParams()
  const {
    data: logData,
    isLoading: getLogLoading,
    error
  } = useGetLogSlugQuery(slugLog)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [createExercise, { isLoading }] = useCreateExerciseMutation()

  const onSubmit = async data => {
    try {
      await createExercise({ ...data, slugLog: slugLog }).unwrap()
      navigate(`/logs/${slugLog}`)
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}`)
  }

  if (getLogLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <>
      <h1>Create Exercise</h1>
      <h2>{logData.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='title' name='title'>
          Title
        </label>
        <input type='text' {...register('title')} />
        <p>{errors.title?.message}</p>
        <h3>session</h3>
        <input type='checkbox' {...register('session')} />
        <label htmlFor='wlsession' name='wlsession'>
          reps * kgs = vol
        </label>
        <input type='checkbox' {...register('session')} />
        <label htmlFor='aesession' name='aesession'>
          dist, pace, time
        </label>
        <p>{errors.session?.message}</p>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={submitHandler}>Go Back</button>
    </>
  )
}

export default ExerciseCreate
