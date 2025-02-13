import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation } from '../../../slices/usersApiSlice'
import { setCredentials } from '../../../slices/authSlice'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const Register = () => {
  const dispatch = useDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()

  const schema = Joi.object({
    username: Joi.string().required().messages({
      'string.empty': 'This field is required'
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': 'This field is required',
        'string.email': 'Not a valid email format'
      }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'This field is required',
      'string.min': 'Password must be at least 6 characters'
    })
  })

  const {
    register: regForm,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  useEffect(() => {
    setFocus('username')
  }, [setFocus])

  const onFormSubmit = async data => {
    try {
      const res = await register(data).unwrap()
      dispatch(setCredentials(res))
      navigate('/logs')
      toast.success('Registered Successfully')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>Create New Account</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onFormSubmit)}>
        <label htmlFor='username' name='username'>
          Username
        </label>
        <input
          className='form__input-text'
          type='text'
          {...regForm('username')}
        />
        <p className='form__error-text'>{errors?.username?.message}</p>
        <label htmlFor='email' name='email'>
          Email
        </label>
        <input
          className='form__input-text'
          type='email'
          {...regForm('email')}
        />
        <p className='form__error-text'>{errors?.email?.message}</p>
        <label htmlFor='password' name='password'>
          Password
        </label>
        <input
          className='form__input-text'
          type='password'
          {...regForm('password')}
        />
        <p className='form__error-text'>{errors?.password?.message}</p>
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

export default Register
