import { useForm } from 'react-hook-form'
import { useCreatePasessionMutation } from '../../../slices/pasessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import '../ModelMain.css'
import '../ModelForms.css'

const PasessionCreate = () => {
  const navigate = useNavigate()
  const { slugLog, slugExercise } = useParams()

  const {
    data,
    isLoading: exerciseLoading,
    error: exerciseError
  } = useGetExerciseSlugQuery({ slugLog, slugExercise })

  const defaultDate = new Date().toISOString().slice(0, 10)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
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

  const [createPasession, { isLoading }] = useCreatePasessionMutation()

  const onSubmit = async data => {
    try {
      const res = await createPasession({
        ...data,
        slugLog: slugLog,
        slugExercise: slugExercise
      }).unwrap()
      navigate(`/logs/${slugLog}/${slugExercise}`)
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}/${slugExercise}`)
  }

  if (exerciseLoading) return <p>loading</p>
  if (exerciseError)
    return <div>{exerciseError?.data?.message || exerciseError.error}</div>

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

export default PasessionCreate
