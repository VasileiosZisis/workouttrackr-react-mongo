import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { useCreateWlsessionMutation } from '../../../slices/wlsessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import '../ModelMain.css'
import '../ModelForms.css'

const WlsessionCreate = () => {
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))

  const { slugLog, slugExercise } = useParams()

  const {
    isLoading: getExerciseLoading,
    error: exerciseError,
    refetch
  } = useGetExerciseSlugQuery({ slugLog, slugExercise, limit, page })

  const defaultDate = new Date().toISOString().slice(0, 10)

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
  })

  const {
    register,
    handleSubmit,
    control,
    setFocus,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      createdDate: defaultDate,
      set: [{ repetitions: 0, kilograms: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'set'
  })

  useEffect(() => {
    setFocus('set.0.repetitions')
  }, [])

  const [createWlsession, { isLoading }] = useCreateWlsessionMutation()

  const onSubmit = async data => {
    try {
      await createWlsession({
        ...data,
        slugLog: slugLog,
        slugExercise: slugExercise
      }).unwrap()
      refetch()
      navigate(`/logs/${slugLog}/${slugExercise}`)
      toast.success('Session created')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  if (getExerciseLoading) return <Loader />
  if (exerciseError)
    return (
      <div className='model__error'>
        {exerciseError?.data?.message || exerciseError.error}
      </div>
    )

  return (
    <>
      <Helmet>
        <title>New Session</title>
      </Helmet>
      <main className='model'>
        <Link
          className='model__link-goBack'
          to={`/logs/${slugLog}/${slugExercise}`}
        >
          &#160;&#160;Sessions
        </Link>
        <div className='title-container'>
          <h2 className='title-container__title'>New Session</h2>
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
          <ul>
            {fields.map((item, index) => {
              return (
                <li className='form__item' key={item.id}>
                  <h4>Set {index + 1}</h4>
                  <div className='form__item-pair'>
                    <label htmlFor='repetitions' name='repetitions'>
                      Repetitions
                    </label>
                    <input
                      step={0.1}
                      ref={`set.${index}.repetitions`}
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
                append({ repetitions: 0, kilograms: 0 })
              }}
            >
              Add Set
            </button>
          </div>
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
    </>
  )
}

export default WlsessionCreate
