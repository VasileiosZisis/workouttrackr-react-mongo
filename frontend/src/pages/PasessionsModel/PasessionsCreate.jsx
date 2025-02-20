import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useCreatePasessionMutation } from '../../../slices/pasessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const PasessionCreate = () => {
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))

  const { slugLog, slugExercise } = useParams()

  const {
    isLoading: getExerciseLoading,
    error: exerciseError,
    refetch
  } = useGetExerciseSlugQuery({ slugLog, slugExercise, limit, page })

  const defaultDate = new Date().toISOString().slice(0, 10)

  const schema = Joi.object({
    createdDate: Joi.date()
      .required()
      .messages({ 'date.base': 'Must be a valid date' }),
    time: Joi.object({
      hours: Joi.number().min(0).required().messages({
        'any.required': 'This field is required',
        'number.base': 'Hours must be a number',
        'number.min': 'Hours must be at least 0'
      }),
      minutes: Joi.number().min(0).required().messages({
        'any.required': 'This field is required',
        'number.base': 'Minutes must be a number',
        'number.min': 'Minutes must be at least 0'
      }),
      seconds: Joi.number().min(0).required().messages({
        'any.required': 'This field is required',
        'number.base': 'Seconds must be a number',
        'number.min': 'Seconds must be at least 0'
      })
    }),
    distance: Joi.number().min(0).required().messages({
      'any.required': 'This field is required',
      'number.base': 'Distance must be a number',
      'number.min': 'Distance must be at least 0'
    })
  })

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      createdDate: defaultDate,
      distance: 0,
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  })

  useEffect(() => {
    setFocus('time.hours')
  }, [])

  const [createPasession, { isLoading }] = useCreatePasessionMutation()

  const onSubmit = async data => {
    try {
      await createPasession({
        ...data,
        slugLog: slugLog,
        slugExercise: slugExercise
      }).unwrap()
      refetch()
      navigate(`/logs/${slugLog}/${slugExercise}`)
      toast.success('Session created')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  if (getExerciseLoading) return <Loader />
  if (exerciseError)
    return (
      <div className='model__error'>
        {exerciseError?.data?.message || exerciseError.error}
      </div>
    )

  return (
    <main className='model'>
      <Link
        className='model__link-goBack'
        to={`/logs/${slugLog}/${slugExercise}`}
      >
        &#160;&#160;Sessions
      </Link>
      <div className='title-container'>
        <h2 className='title-container__title'>New Session</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='createdDate' name='createdDate'>
          Date
        </label>
        <input
          className='form__input-date'
          type='date'
          {...register('createdDate')}
        />
        <p className='form__error-text'>{errors.createdDate?.message}</p>
        <div className='form__item-pair'>
          <label htmlFor='hours' name='hours'>
            Hours
          </label>
          <input
            step={0.1}
            className='form__input-number'
            type='number'
            {...register('time.hours')}
          />
          <p className='form__error-text'>{errors?.time?.hours?.message}</p>
          <label htmlFor='minutes' name='minutes'>
            Minutes
          </label>
          <input
            step={0.1}
            className='form__input-number'
            type='number'
            {...register('time.minutes')}
          />
          <p className='form__error-text'>{errors?.time?.minutes?.message}</p>
          <label htmlFor='seconds' name='seconds'>
            Seconds
          </label>
          <input
            step={0.1}
            className='form__input-number'
            type='number'
            {...register('time.seconds')}
          />
          <p className='form__error-text'>{errors?.time?.seconds?.message}</p>
        </div>
        <div className='form__item-pair'>
          <label htmlFor='distance' name='distance'>
            Distance
          </label>
          <input
            step={0.1}
            className='form__input-number'
            type='number'
            {...register('distance')}
          />
          <p className='form__error-text'>{errors?.distance?.message}</p>
        </div>
        <button
          className='form__button-submit'
          type='submit'
          disabled={isLoading}
        >
          Submit
        </button>
        {isLoading && <Loader />}
      </form>
    </main>
  )
}

export default PasessionCreate
