import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../../slices/authSlice'
import { useLoginMutation } from '../../../slices/usersApiSlice'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import '../ModelMain.css'
import '../ModelForms.css'

const Login = () => {
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': 'This field is required',
        'string.email': 'Not a valid email format'
      }),
    password: Joi.string().required().messages({
      'string.empty': 'This field is required'
    })
  })

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  const onSubmit = async data => {
    try {
      const res = await login(data).unwrap()
      dispatch(setCredentials(res))
      navigate('/logs')
      toast.success('Logged in Successfully')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>User Login</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <p className='form__error-text'>{errors?.username?.message}</p>
        <label htmlFor='email' name='email'>
          Email
        </label>
        <input
          className='form__input-text'
          type='email'
          {...register('email')}
        />
        <p className='form__error-text'>{errors?.email?.message}</p>
        <label htmlFor='password' name='password'>
          Password
        </label>
        <input
          className='form__input-text'
          type='password'
          {...register('password')}
        />
        <p className='form__error-text'>{errors.password?.message}</p>
        <Link className='form__link' to='/forgot-password'>
          Forgot Password
        </Link>
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

export default Login
