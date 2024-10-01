import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation } from '../../../slices/usersApiSlice'
import { setCredentials } from '../../../slices/authSlice'

const Register = () => {
  const dispatch = useDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()
  const {
    register: regForm,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onFormSubmit = async data => {
    try {
      const res = await register(data).unwrap()
      dispatch(setCredentials(res))
      navigate('/')
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
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <label htmlFor='username' name='username'>
          username
        </label>
        <input type='text' {...regForm('username')} />
        <p>{errors.username?.message}</p>
        <label htmlFor='email' name='email'>
          Email
        </label>
        <input type='email' {...regForm('email')} />
        <p>{errors.email?.message}</p>
        <label htmlFor='password' name='password'>
          Password
        </label>
        <input type='password' {...regForm('password')} />
        <p>{errors.password?.message}</p>
        <button className='btn-submit' type='submit'>
          Submit
        </button>
      </form>
    </>
  )
}

export default Register
