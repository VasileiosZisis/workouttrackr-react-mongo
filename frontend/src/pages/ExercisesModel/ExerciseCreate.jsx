import { useForm } from 'react-hook-form'
import { useCreateExerciseMutation } from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import '../ModelMain.css'
import '../ModelForms.css'

const ExerciseCreate = () => {
  const navigate = useNavigate()
  const { slugLog } = useParams()
  const {
    data: logData,
    isLoading: getLogLoading,
    error
  } = useGetLogSlugQuery(slugLog)

  const schema = Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'This field is required',
      'string.alphanum': 'Title can contain only letters and numbers'
    }),
    session: Joi.string().required().valid('wlsession', 'pasession').messages({
      'any.only': 'You must choose an option'
    })
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  const [createExercise, { isLoading }] = useCreateExerciseMutation()

  const onSubmit = async data => {
    try {
      const res = await createExercise({ ...data, slugLog: slugLog }).unwrap()
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
            <input type='radio' {...register('session')} value='wlsession' />
            <label
              className='form__label-radio'
              htmlFor='wlsession'
              name='session'
            >
              reps * kgs = vol
            </label>
          </div>
          <div>
            <input type='radio' {...register('session')} value='pasession' />
            <label
              className='form__label-radio'
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
      </form>
    </main>
  )
}

export default ExerciseCreate
