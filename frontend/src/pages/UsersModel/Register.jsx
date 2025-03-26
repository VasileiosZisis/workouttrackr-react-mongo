import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation } from '../../../slices/usersApiSlice'
import { setCredentials } from '../../../slices/authSlice'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { Turnstile } from '@marsidev/react-turnstile'
import '../ModelMain.css'
import '../ModelForms.css'

const Register = () => {
  const dispatch = useDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()
  const [nonce] = useState(() => window.__nonce__)
  const [turnstileToken, setTurnstileToken] = useState('')

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
    if (!turnstileToken) {
      toast.error('Please complete the CAPTCHA verification')
      return
    }
    try {
      const res = await register({ ...data, turnstileToken }).unwrap()
      dispatch(setCredentials(res))
      navigate('/logs')
      toast.success('Registered Successfully')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Create New Account</title>
      </Helmet>
      <main className='model'>
        <div className='model__container'>
          <Link className='model__link-goBack' to={'/'}>
            &#160;&#160;Home
          </Link>
        </div>
        <div className='model__container'>
          <div className='title-container'>
            <h2 className='title-container__title'>Create New Account</h2>
          </div>
        </div>
        <div className='model__container'>
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
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              options={{
                theme: 'dark'
              }}
              onSuccess={token => setTurnstileToken(token)}
              nonce={nonce}
            />
            <button
              className='form__button-submit'
              type='submit'
              disabled={isLoading || !turnstileToken}
            >
              Submit
            </button>
            {isLoading && <Loader />}
          </form>
        </div>
      </main>
    </>
  )
}

export default Register
