import {
  useGetExerciseIdQuery,
  useUpdateExerciseIdMutation
} from '../../../slices/exercisesApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import '../ModelMain.css'
import '../ModelForms.css'

const ExerciseEdit = () => {
  const { slugLog, exerciseId } = useParams()

  const { data, isLoading, error, refetch } = useGetExerciseIdQuery({
    slugLog,
    exerciseId
  })

  const [updateExerciseId, { isLoading: loadingUpdate }] =
    useUpdateExerciseIdMutation()

  const navigate = useNavigate()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (data) {
      setValue('title', data.title)
    }
  }, [data])

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
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>Edit Exercise</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='title' name='title'>
          Title
        </label>
        <input
          className='form__input-text'
          type='text'
          {...register('title')}
        />
        <p>{errors.title?.message}</p>
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
      </form>
    </main>
  )
}

export default ExerciseEdit
