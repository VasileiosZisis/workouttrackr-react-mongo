import {
  useGetPasessionByIdQuery,
  useUpdatePasessionIdMutation
} from '../../../slices/pasessionsApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import '../ModelMain.css'
import '../ModelForms.css'

const PasessionEdit = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise, pasessionId } = useParams()

  const { data, isLoading, error, refetch } = useGetPasessionByIdQuery({
    slugLog,
    slugExercise,
    pasessionId
  })

  const [updatePasessionId, { isLoading: loadingUpdate }] =
    useUpdatePasessionIdMutation()

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
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
      navigate(`/logs/${slugLog}/${slugExercise}`)
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}/${slugExercise}`)
  }

  if (loadingUpdate) return <p>loading</p>
  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
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
        <p>{errors.createdDate?.message}</p>
        <div className='form__item-pair'>
          <label htmlFor='hours' name='hours'>
            Hours
          </label>
          <input
            className='form__input-number'
            type='number'
            {...register('time.hours')}
          />
          <p>{errors.hours?.message}</p>
          <label htmlFor='minutes' name='minutes'>
            Minutes
          </label>
          <input
            className='form__input-number'
            type='number'
            {...register('time.minutes')}
          />
          <p>{errors.minutes?.message}</p>
          <label htmlFor='seconds' name='seconds'>
            Seconds
          </label>
          <input
            step='0.001'
            className='form__input-number'
            type='number'
            {...register('time.seconds')}
          />
          <p>{errors.seconds?.message}</p>
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
          <p>{errors.distance?.message}</p>
        </div>
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
      </form>
    </main>
  )
}

export default PasessionEdit
