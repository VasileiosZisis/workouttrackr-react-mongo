import {
  useGetExerciseIdQuery,
  useUpdateExerciseIdMutation
} from '../../../slices/exercisesApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const ExerciseEdit = () => {
  const { slugLog, exerciseId } = useParams()

  const { data, isLoading, error, refetch } = useGetExerciseIdQuery({
    slugLog,
    exerciseId
  })

  const [updateExerciseId, { isLoading: loadingUpdate }] =
    useUpdateExerciseIdMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      setValue('title', data.title)
    }
  }, [data])

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async dataForm => {
    try {
      await updateExerciseId({
        slugLog,
        data: { ...dataForm, _id: exerciseId }
      }).unwrap()
      navigate(`/logs/${slugLog}`)
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  if (loadingUpdate) return <p>loading</p>
  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='title' name='title'>
          Title
        </label>
        <input type='text' {...register('title')} />
        <p>{errors.title?.message}</p>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default ExerciseEdit
