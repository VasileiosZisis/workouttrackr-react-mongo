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
    data: exerciseData,
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
        <div className='model__container'>
          <Link
            className='model__link-goBack'
            to={`/logs/${slugLog}/${slugExercise}`}
          >
            &#160;&#160;Sessions
          </Link>
        </div>
        <div className='model__grid'>
          <div className='model__left-side'>
            <div className='model__container'>
              <div className='title-container'>
                <h2 className='title-container__title'>Previous Session</h2>
              </div>
              {exerciseData.latestWlsession.length > 0 && (
                <table className='sessions__table'>
                  <tbody>
                    <tr>
                      <td colSpan='3'>Total Volume</td>
                      <th colSpan='2'>
                        {exerciseData.latestWlsession[0].wlsessions.totalVolume}
                      </th>
                    </tr>
                    <tr>
                      <td colSpan='3'>Junk Volume</td>
                      <th colSpan='2'>
                        {exerciseData.latestWlsession[0].wlsessions.junkVolume}
                      </th>
                    </tr>
                    <tr>
                      <td colSpan='3'>Work Volume</td>
                      <th colSpan='2'>
                        {
                          exerciseData.latestWlsession[0].wlsessions
                            .workingVolume
                        }
                      </th>
                    </tr>
                    <tr>
                      <th></th>
                    </tr>
                    <tr>
                      <td>Set</td>
                      <td>Reps</td>
                      <td>KGs</td>
                      <td>Hard</td>
                      <td>Volume</td>
                    </tr>
                    {exerciseData.latestWlsession[0].wlsessions.set.map(
                      (set, index) => (
                        <tr key={set._id}>
                          <td>{index + 1}</td>
                          <td>{set.repetitions}</td>
                          <td>{set.kilograms}</td>
                          <td>{set.isHard ? <span>&#10003;</span> : '-'}</td>
                          <td>{set.volume}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className='model__right-side'>
            <div className='model__container'>
              <div className='title-container'>
                <h2 className='title-container__title'>New Session</h2>
              </div>
              <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor='createdDate' name='createdDate'>
                  Date
                </label>
                <p className='form__error-text'>
                  {errors?.createdDate?.message}
                </p>
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
                            step={0.01}
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
                            step={0.01}
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
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default WlsessionCreate
