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
    error,
    refetch
  } = useGetLogSlugQuery(slugLog)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [createExercise, { isLoading }] = useCreateExerciseMutation()

  const onSubmit = async data => {
    try {
      const res = await createExercise({ ...data, slugLog: slugLog }).unwrap()
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  if (getLogLoading) return <p>loading</p>

  return (
    <>
      <h1>Create Exercise</h1>
      <h2>{logData.title}</h2>
      {error && <div>{error?.data?.message || error.error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='title' name='title'>
          Title
        </label>
        <input type='text' {...register('title')} />
        <p>{errors.title?.message}</p>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={submitHandler}>Go Back</button>
    </>
  )
}

export default ExerciseCreate
