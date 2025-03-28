import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useResetPasswordMutation } from '../../../slices/usersApiSlice'
import { useNavigate } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import '../ModelMain.css'
import '../ModelForms.css'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation()

  const schema = Joi.object({
    password: Joi.string().min(6).required().messages({
      'string.empty': 'This field is required',
      'string.min': 'Password must be at least 6 characters'
    })
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  const onSubmit = async data => {
    try {
      await resetPassword({ token, password: data.password }).unwrap()
      reset()
      navigate('/login')
      toast.success('Password Updated Successfully')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <main className='model'>
        <div className='model__container'>
          <div className='title-container'>
            <h2 className='title-container__title'>Reset Password</h2>
          </div>
        </div>
        <div className='model__container'>
          <form className='form' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='password' name='password'>
              Password
            </label>
            <input
              className='form__input-text'
              type='password'
              {...register('password')}
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
        </div>
      </main>
    </>
  )
}

export default ResetPassword
