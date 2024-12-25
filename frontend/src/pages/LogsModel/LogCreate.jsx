import { useForm } from 'react-hook-form'
import { useCreateLogMutation } from '../../../slices/logsApiSlice'
import { useNavigate } from 'react-router-dom'
import '../ModelMain.css'
import '../ModelForms.css'

const LogCreate = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [createLog, { isLoading }] = useCreateLogMutation()

  const onSubmit = async data => {
    try {
      await createLog(data).unwrap()
      navigate('/logs')
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate('/logs')
  }

  if (isLoading) return <p>loading</p>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>New Log</h2>
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

export default LogCreate
