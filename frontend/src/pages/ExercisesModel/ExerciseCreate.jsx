import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useCreateExerciseMutation } from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const ExerciseCreate = () => {
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))

  const { slugLog } = useParams()
  const {
    isLoading: getLogLoading,
    error,
    refetch
  } = useGetLogSlugQuery({
    slugLog,
    limit,
    page
  })

  const schema = Joi.object({
    title: Joi.string()
      .pattern(/^[A-Za-z0-9-_ ]+$/)
      .required()
      .messages({
        'string.empty': 'This field is required',
        'string.pattern.base':
          'Letters, numbers, spaces, dashes and underscores allowed'
      }),
    session: Joi.string().required().valid('wlsession', 'pasession').messages({
      'any.only': 'You must choose an option'
    })
  })

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  useEffect(() => {
    setFocus('title')
  }, [setFocus])

  const [createExercise, { isLoading }] = useCreateExerciseMutation()

  const onSubmit = async data => {
    try {
      await createExercise({ ...data, slugLog: slugLog }).unwrap()
      refetch()
      navigate(`/logs/${slugLog}`)
      toast.success('Exercise created')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}`)
  }

  if (getLogLoading) return <Loader />
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>New Exercise</h2>
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
        <h4>Metrics</h4>
        <p className='form__error-text'>{errors?.session?.message}</p>
        <div className='form__radio-container'>
          <div>
            <input
              type='radio'
              className='form_radio-input'
              {...register('session')}
              value='wlsession'
            />
            <label
              className='form__radio-label'
              htmlFor='wlsession'
              name='session'
            >
              reps * kgs = vol
            </label>
          </div>
          <div>
            <input
              className='form_radio-input'
              type='radio'
              {...register('session')}
              value='pasession'
            />
            <label
              className='form__radio-label'
              htmlFor='pasession'
              name='session'
            >
              dist, pace, time
            </label>
          </div>
        </div>
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
        {isLoading && <Loader />}
      </form>
    </main>
  )
}

export default ExerciseCreate
