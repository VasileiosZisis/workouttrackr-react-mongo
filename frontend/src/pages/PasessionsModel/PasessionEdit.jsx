import {
  useGetPasessionByIdQuery,
  useUpdatePasessionIdMutation
} from '../../../slices/pasessionsApiSlice'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const PasessionEdit = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector(state => state.auth)
  const { slugLog, slugExercise, pasessionId } = useParams()

  const { refetch } = useGetExerciseSlugQuery({ slugLog, slugExercise })

  const { data, isLoading, error } = useGetPasessionByIdQuery({
    slugLog,
    slugExercise,
    pasessionId
  })

  const [updatePasessionId, { isLoading: loadingUpdate }] =
    useUpdatePasessionIdMutation()

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
  }).options({ allowUnknown: true })

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      createdDate: ''
    }
  })

  useEffect(() => {
    if (data) {
      reset(data)
      setValue(
        'createdDate',
        new Date(data.createdDate).toISOString().slice(0, 10)
      )
    }
  }, [data, reset, setValue])

  const onSubmit = async dataForm => {
    try {
      await updatePasessionId({
        slugLog,
        slugExercise,
        data: { ...dataForm, _id: pasessionId }
      }).unwrap()
      console.log(dataForm)
      refetch()
      navigate(`/logs/${slugLog}/${slugExercise}`)
      toast.success('Session updated')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}/${slugExercise}`)
  }

  if (isLoading) return <Loader />
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <ProtectedRoute condition={userInfo._id === data.author}>
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
          <p className='form__error-text'>{errors?.createdDate?.message}</p>
          <div className='form__item-pair'>
            <label htmlFor='hours' name='hours'>
              Hours
            </label>
            <input
              className='form__input-number'
              type='number'
              {...register('time.hours')}
            />
            <p className='form__error-text'>{errors?.time?.hours?.message}</p>
            <label htmlFor='minutes' name='minutes'>
              Minutes
            </label>
            <input
              className='form__input-number'
              type='number'
              {...register('time.minutes')}
            />
            <p className='form__error-text'>{errors?.time?.minutes?.message}</p>
            <label htmlFor='seconds' name='seconds'>
              Seconds
            </label>
            <input
              step='0.001'
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
              className='form__input-number'
              type='number'
              {...register('distance')}
            />
            <p>{errors?.distance?.message}</p>
          </div>
          <button className='form__button-submit' type='submit'>
            Submit
          </button>
          {loadingUpdate && <Loader />}
        </form>
      </ProtectedRoute>
    </main>
  )
}

export default PasessionEdit
