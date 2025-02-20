import {
  useGetWlsessionByIdQuery,
  useUpdateWlsessionIdMutation
} from '../../../slices/wlsessionsApiSlice'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const WlsessionEdit = () => {
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))
  const { userInfo } = useSelector(state => state.auth)
  const { slugLog, slugExercise, wlsessionId } = useParams()

  const { refetch } = useGetExerciseSlugQuery({
    slugLog,
    slugExercise,
    limit,
    page
  })

  const { data, isLoading, error } = useGetWlsessionByIdQuery({
    slugLog,
    slugExercise,
    wlsessionId
  })

  const [updateWlsessionId, { isLoading: loadingUpdate }] =
    useUpdateWlsessionIdMutation()

  const schema = Joi.object({
    createdDate: Joi.date()
      .required()
      .messages({ 'date.base': 'Must be a valid date' }),
    set: Joi.array().items(
      Joi.object({
        isHard: Joi.boolean(),
        repetitions: Joi.number().min(0).required().messages({
          'any.required': 'This field is required',
          'number.base': 'Repetitions must be a number',
          'number.min': 'Repetitions must be at least 0'
        }),
        kilograms: Joi.number().min(0).required().messages({
          'any.required': 'This field is required',
          'number.base': 'Kilograms must be a number',
          'number.min': 'Kilograms must be at least 0'
        })
      })
    )
  }).options({ allowUnknown: true })

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      createdDate: ''
    }
  })

  useEffect(() => {
    if (data) {
      reset(data)
      setValue(
        'createdDate',
        new Date(data.createdDate).toISOString().slice(0, 10)
      )
    }
  }, [data, reset, setValue])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'set'
  })

  const onSubmit = async dataForm => {
    try {
      await updateWlsessionId({
        slugLog,
        slugExercise,
        data: { ...dataForm, _id: wlsessionId }
      }).unwrap()
      refetch()
      navigate(`/logs/${slugLog}/${slugExercise}`)
      toast.success('Session updated')
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
    <main className='model'>
      <Link
        className='model__link-goBack'
        to={`/logs/${slugLog}/${slugExercise}/wl/${new Date(data.createdDate)
          .toISOString()
          .slice(0, 10)}`}
      >
        &#160;&#160;{new Date(data.createdDate).toLocaleDateString()}
      </Link>
      <ProtectedRoute condition={userInfo._id === data.author}>
        <div className='title-container'>
          <h2 className='title-container__title'>Edit Session</h2>
        </div>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='createdDate' name='createdDate'>
            Date
          </label>
          <p className='form__error-text'>{errors?.createdDate?.message}</p>
          <input
            className='form__input-date'
            type='date'
            {...register('createdDate')}
          />
          <p>{errors.createdDate?.message}</p>
          <ul>
            {fields.map((field, index) => {
              return (
                <li className='form__item' key={field.id}>
                  <h4>Set {index + 1}</h4>
                  <div className='form__item-pair'>
                    <label htmlFor='repetitions' name='repetitions'>
                      Repetitions
                    </label>
                    <input
                      step={0.1}
                      className='form__input-number'
                      type='number'
                      {...register(`set.${index}.repetitions`)}
                    />
                    <p className='form__error-text'>
                      {errors?.set?.[index].repetitions?.message}
                    </p>
                  </div>
                  <div className='form__item-pair'>
                    <label htmlFor='kilograms' name='kilograms'>
                      Kilograms
                    </label>
                    <input
                      step={0.1}
                      className='form__input-number'
                      type='number'
                      {...register(`set.${index}.kilograms`)}
                    />
                    <p className='form__error-text'>
                      {errors?.set?.[index].kilograms?.message}
                    </p>
                  </div>
                  <div className='form__item-pair'>
                    <label htmlFor='isHard' name='isHard'>
                      Hard
                    </label>
                    <input
                      className='form__input-checkbox'
                      type='checkbox'
                      {...register(`set.${index}.isHard`)}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className='form__button-container'>
            <button
              className='form__button-delSet'
              type='button'
              onClick={() => remove(1)}
            >
              Delete
            </button>
            <button
              className='form__button-add'
              type='button'
              onClick={() => {
                append({ repetitions: '', kilograms: '' })
              }}
            >
              Add Set
            </button>
          </div>
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

export default WlsessionEdit
