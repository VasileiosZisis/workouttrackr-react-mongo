import { useForm } from 'react-hook-form'
import { useCreateLogMutation } from '../../../slices/logsApiSlice'

const LogCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [createLog, { isLoading }] = useCreateLogMutation()

  const onSubmit = async data => {
    try {
      await createLog(data).unwrap()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='title' name='title'>
        Title
      </label>
      <input type='text' {...register('title')} />
      <p>{errors.title?.message}</p>
      <button type='submit'>Submit</button>
    </form>
  )
}

export default LogCreate
