import { useForm, useFieldArray } from 'react-hook-form'
import { useCreateWlsessionMutation } from '../../../slices/wlsessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import '../ModelMain.css'
import '../ModelForms.css'

const WlsessionCreate = () => {
  const navigate = useNavigate()
  const { slugLog, slugExercise } = useParams()

  const {
    data: exerciseData,
    isLoading: exerciseLoading,
    error: exerciseError
  } = useGetExerciseSlugQuery({ slugLog, slugExercise })

  const defaultDate = new Date().toISOString().slice(0, 10)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      createdDate: defaultDate,
      set: [{ repetitions: '', kilograms: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'set'
  })

  const [createWlsession, { isLoading }] = useCreateWlsessionMutation()

  const onSubmit = async data => {
    try {
      const res = await createWlsession({
        ...data,
        slugLog: slugLog,
        slugExercise: slugExercise
      }).unwrap()
      navigate(`/logs/${slugLog}/${slugExercise}`)
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}/${slugExercise}`)
  }

  if (exerciseLoading) return <p>loading</p>
  if (exerciseError)
    return <div>{exerciseError?.data?.message || exerciseError.error}</div>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h2 className='title-container__title'>New Session</h2>
      </div>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='createdDate' name='createdDate'>
          Date
        </label>
        <input
          className='form__input-date'
          type='date'
          {...register('createdDate')}
        />
        <p>{errors.createdDate?.message}</p>
        <ul>
          {fields.map((item, index) => {
            return (
              <li className='form__item' key={item.id}>
                <h4>Set {index + 1}</h4>
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
                <div className='form__item-pair'>
                  <label htmlFor='repetitions' name='repetitions'>
                    Repetitions
                  </label>
                  <input
                    className='form__input-number'
                    type='number'
                    {...register(`set.${index}.repetitions`)}
                  />
                  <p>{errors.set?.[i].repetitions?.message}</p>
                </div>
                <div className='form__item-pair'>
                  <label htmlFor='kilograms' name='kilograms'>
                    Kilograms
                  </label>
                  <input
                    className='form__input-number'
                    type='number'
                    {...register(`set.${index}.kilograms`)}
                  />
                  <p>{errors.set?.[i].kilograms?.message}</p>
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
        <button className='form__button-submit' type='submit'>
          Submit
        </button>
      </form>
    </main>
  )
}

export default WlsessionCreate
