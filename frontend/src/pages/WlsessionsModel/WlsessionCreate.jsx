import { useForm, useFieldArray } from 'react-hook-form'
import { useCreateWlsessionMutation } from '../../../slices/wlsessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

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
    <>
      <h1>Create Session</h1>
      <h2>{exerciseData.exercise.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='createdDate' name='createdDate'>
          createdDate
        </label>
        <input type='date' {...register('createdDate')} />
        <p>{errors.createdDate?.message}</p>
        <label>Set</label>
        <ul>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <label htmlFor='repetitions' name='repetitions'>
                  repetitions
                </label>
                <input
                  type='number'
                  {...register(`set.${index}.repetitions`)}
                />
                <p>{errors.set?.[i].repetitions?.message}</p>
                <label htmlFor='kilograms' name='kilograms'>
                  kilograms
                </label>
                <input type='number' {...register(`set.${index}.kilograms`)} />
                <p>{errors.set?.[i].kilograms?.message}</p>
                <label htmlFor='isHard' name='isHard'>
                  isHard
                </label>
                <input type='checkbox' {...register(`set.${index}.isHard`)} />
              </li>
            )
          })}
        </ul>
        <button
          type='button'
          onClick={() => {
            append({ repetitions: '', kilograms: '' })
          }}
        >
          append
        </button>
        <button type='button' onClick={() => remove(1)}>
          remove at
        </button>
        <button type='submit'>Submit</button>
      </form>
      <button onClick={submitHandler}>Go Back</button>
    </>
  )
}

export default WlsessionCreate
