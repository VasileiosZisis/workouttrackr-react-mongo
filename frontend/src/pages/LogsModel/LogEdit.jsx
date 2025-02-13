import {
  useUpdateLogIdMutation,
  useGetLogIdQuery
} from '../../../slices/logsApiSlice'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const LogsEdit = () => {
  const { id } = useParams()
  const { userInfo } = useSelector(state => state.auth)

  const { data, isLoading, error, refetch } = useGetLogIdQuery(id)

  const [updateLog, { isLoading: loadingUpdate }] = useUpdateLogIdMutation()

  const navigate = useNavigate()

  const schema = Joi.object({
    title: Joi.string()
      .pattern(/^[a-z]+$/)
      .required()
      .messages({
        'string.empty': 'This field is required',
        'string.pattern.base':
          'Letters, numbers, spaces, dashes and underscores allowed'
      })
  })

  const {
    register,
    setValue,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm({ resolver: joiResolver(schema) })

  useEffect(() => {
    if (data) {
      setValue('title', data.title)
      setFocus('title')
    }
  }, [data, setFocus])

  const onSubmit = async data => {
    try {
      await updateLog({
        ...data,
        _id: id
      }).unwrap()
      refetch()
      navigate(`/logs`)
      toast.success('Log updated')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  if (isLoading) return <Loader />
  if (error) return <div>{error?.data?.message || error.error}</div>

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <ProtectedRoute condition={userInfo._id === data.author}>
        <div className='title-container'>
          <h2 className='title-container__title'>Edit Log</h2>
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
          <button
            className='form__button-submit'
            type='submit'
            disabled={loadingUpdate}
          >
            Submit
          </button>
          {loadingUpdate && <Loader />}
        </form>
      </ProtectedRoute>
    </main>
  )
}

export default LogsEdit
