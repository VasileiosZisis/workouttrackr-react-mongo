import {
  useGetExerciseIdQuery,
  useUpdateExerciseIdMutation
} from '../../../slices/exercisesApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
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

  const schema = Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'This field is required',
      'string.alphanum': 'Title can contain only letters and numbers'
    })
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

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
        <p className='form__error-text'>{errors?.title?.message}</p>
        <input
          className='form__input-text'
          type='text'
          {...register('title')}
        />
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
      </form>
    </main>
  )
}

export default ExerciseEdit
