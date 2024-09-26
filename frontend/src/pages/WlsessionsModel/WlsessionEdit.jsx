import {
  useGetWlsessionByIdQuery,
  useUpdateWlsessionIdMutation
} from '../../../slices/wlsessionsApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'

const WlsessionEdit = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise, wlsessionId } = useParams()

  const { data, isLoading, error, refetch } = useGetWlsessionByIdQuery({
    slugLog,
    slugExercise,
    wlsessionId
  })

  const [updateWlsessionId, { isLoading: loadingUpdate }] =
    useUpdateWlsessionIdMutation()

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    reset(data)
  }, [data])

  useEffect(() => {
    if (data) {
      setValue(
        'createdDate',
        new Date(data.createdDate).toISOString().slice(0, 10)
      )
    }
  }, [data])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'set'
  })

  const onSubmit = async dataForm => {
    try {
      const c = await updateWlsessionId({
        slugLog,
        slugExercise,
        data: { ...dataForm, _id: wlsessionId }
      }).unwrap()
      console.log(c)
      //   navigate(`/logs/${slugLog}`)
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  if (loadingUpdate) return <p>loading</p>
  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <>
      <button onClick={submitHandler}>Go Back</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='createdDate' name='createdDate'>
          createdDate
        </label>
        <input type='date' {...register('createdDate')} />
        <p>{errors.createdDate?.message}</p>
        <label>Set</label>
        <ul>
          {fields.map((field, index) => {
            return (
              <li key={field.id}>
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
    </>
  )
}

export default WlsessionEdit
