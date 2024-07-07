import {
  useUpdateLogIdMutation,
  useGetLogIdQuery
} from '../../../slices/logsApiSlice'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const LogsEdit = () => {
  const { id } = useParams()

  const { data: logData, isLoading, error, refetch } = useGetLogIdQuery(id)

  const [updateLog, { isLoading: loadingUpdate }] = useUpdateLogIdMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if (logData) {
      setValue('title', logData.title)
    }
  }, [logData])

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async data => {
    console.log(data)
    try {
      const res = await updateLog({
        ...data,
        _id: id
      }).unwrap()
      console.log(res)
      navigate(`/logs`)
      refetch()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {loadingUpdate && <p>loading</p>}
      {isLoading ? (
        <p>loading</p>
      ) : error ? (
        <div>{error?.data?.message || error.error}</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='title' name='title'>
            Title
          </label>
          <input type='text' {...register('title')} />
          <p>{errors.title?.message}</p>
          <button type='submit'>Submit</button>
        </form>
      )}
    </>
  )
}

export default LogsEdit
