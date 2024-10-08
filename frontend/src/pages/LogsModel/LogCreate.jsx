import { useForm } from 'react-hook-form'
import { useCreateLogMutation } from '../../../slices/logsApiSlice'
import { useNavigate } from 'react-router-dom'

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
    <>
      <button onClick={submitHandler}>Go Back</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='title' name='title'>
          Title
        </label>
        <input type='text' {...register('title')} />
        <p>{errors.title?.message}</p>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default LogCreate
