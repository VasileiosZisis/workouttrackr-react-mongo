import { useForm } from 'react-hook-form'
import { useCreateExerciseMutation } from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [createExercise, { isLoading }] = useCreateExerciseMutation()

  const onSubmit = async data => {
    try {
      const res = await createExercise({ ...data, slugLog: slugLog }).unwrap()
      console.log(res)
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
        <input
          className='form__input-text'
          type='text'
          {...register('title')}
        />
        <p>{errors.title?.message}</p>
        <h4>Metrics</h4>
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
          <p>{errors.session?.message}</p>
        </div>
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
      </form>
    </main>
  )
}

export default ExerciseCreate
