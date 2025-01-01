import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import { useDispatch, useSelector } from 'react-redux'
import { useProfileMutation } from '../../../slices/usersApiSlice'
import { setCredentials } from '../../../slices/authSlice'

const UpdateProfile = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { userInfo } = useSelector(state => state.auth)

  const [profile, { isLoading }] = useProfileMutation()

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
      })
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      username: userInfo.username,
      email: userInfo.email
    }
  })

  const onFormSubmit = async data => {
    try {
      const response = await profile(data).unwrap()
      dispatch(setCredentials(response))
      navigate(`/logs`)
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
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>Update User Profile</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onFormSubmit)}>
        <label htmlFor='username' name='username'>
          Username
        </label>
        <input
          className='form__input-text'
          type='text'
          {...register('username')}
        />
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
        <button className='form__button-submit' type='submit'>
          Update
        </button>
      </form>
    </main>
  )
}

export default UpdateProfile
