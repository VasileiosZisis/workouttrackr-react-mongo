import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useCreateLogMutation } from '../../../slices/logsApiSlice'
import { useNavigate } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import '../ModelMain.css'
import '../ModelForms.css'

const LogCreate = () => {
  const navigate = useNavigate()

  const schema = Joi.object({
    title: Joi.string()
      .pattern(/^[A-Za-z0-9-_ ]+$/)
      .required()
      .messages({
        'string.empty': 'This field is required',
        'string.pattern.base':
          'Letters, numbers, spaces, dashes and underscores allowed'
      })
  })

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  useEffect(() => {
    setFocus('title')
  }, [setFocus])

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
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>New Log</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='title' name='title'>
          Title
        </label>
        <p className='form__error-text'>{errors?.title?.message}</p>
        <input
          className='form__input-text'
          type='text'
          {...register('title')}
        />
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
      </form>
    </main>
  )
}

export default LogCreate
