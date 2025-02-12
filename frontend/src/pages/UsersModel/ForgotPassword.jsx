import { useForm } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { useForgotPasswordMutation } from '../../../slices/usersApiSlice'
import { useNavigate } from 'react-router-dom'
import '../ModelMain.css'
import '../ModelForms.css'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': 'This field is required',
        'string.email': 'Not a valid email format'
      })
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: joiResolver(schema) })

  const onSubmit = async data => {
    try {
      await forgotPassword(data).unwrap()
      reset()
      toast.success('You will receive an email shortly')
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
        <h2 className='title-container__title'>Forgot Password</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='email' name='email'>
          Email
        </label>
        <input
          className='form__input-text'
          type='email'
          placeholder='Enter your email'
          {...register('email')}
        />
        <p className='form__error-text'>{errors?.email?.message}</p>
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

export default ForgotPassword
