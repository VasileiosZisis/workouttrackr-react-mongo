import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../../slices/authSlice'
import { useLoginMutation } from '../../../slices/usersApiSlice'

const Login = () => {
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async data => {
    try {
      const res = await login(data).unwrap()
      dispatch(setCredentials(res))
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate('/')
  }

  if (isLoading) return <p>loading</p>

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='username' name='username'>
          username
        </label>
        <input type='text' {...register('username')} />
        <p>{errors.username?.message}</p>
        <label htmlFor='email' name='email'>
          email
        </label>
        <input type='email' {...register('email')} />
        <p>{errors.email?.message}</p>
        <label htmlFor='password' name='password'>
          password
        </label>
        <input type='password' {...register('password')} />
        <p>{errors.password?.message}</p>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}

export default Login
