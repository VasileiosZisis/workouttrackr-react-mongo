import {
  useGetExerciseIdQuery,
  useUpdateExerciseIdMutation
} from '../../../slices/exercisesApiSlice'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useSelector } from 'react-redux'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import '../ModelMain.css'
import '../ModelForms.css'

const ExerciseEdit = () => {
  const { slugLog, exerciseId } = useParams()
  const { userInfo } = useSelector(state => state.auth)

  const { refetch } = useGetLogSlugQuery({ slugLog })

  const { data, isLoading, error } = useGetExerciseIdQuery({
    slugLog,
    exerciseId
  })

  const [updateExerciseId, { isLoading: loadingUpdate }] =
    useUpdateExerciseIdMutation()

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

  const onSubmit = async dataForm => {
    try {
      await updateExerciseId({
        slugLog,
        data: { ...dataForm, _id: exerciseId }
      }).unwrap()
      refetch()
      navigate(`/logs/${slugLog}`)
      toast.success('Exercise updated')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  if (isLoading) return <Loader />
  if (error)
    return (
      <div className='model__error'>{error?.data?.message || error.error}</div>
    )

  return (
    <>
      <Helmet>
        <title>Edit Exercise</title>
      </Helmet>
      <main className='model'>
        <div className='model__container'>
          <Link
            className='model__link-goBack'
            to={`/logs/${slugLog}/${data.slugExercise}`}
          >
            &#160;&#160;{data.title}
          </Link>
        </div>
        <ProtectedRoute condition={userInfo._id === data.author}>
          <div className='model__container'>
            <div className='title-container'>
              <h2 className='title-container__title'>Edit Exercise</h2>
            </div>
          </div>
          <div className='model__container'>
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
                disabled={isLoading}
              >
                Submit
              </button>
              {loadingUpdate && <Loader />}
            </form>
          </div>
        </ProtectedRoute>
      </main>
    </>
  )
}

export default ExerciseEdit
