import {
  useGetLogSlugQuery,
  useDeleteLogMutation
} from '../../../slices/logsApiSlice'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import Pagination from '../../components/Pagination'
import Label from '../../components/Label'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import '../ModelMain.css'

const LogSlugShow = () => {
  const { slugLog } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Math.max(1, Number(searchParams.get('limit')) || 12)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  const [isDeleted, setIsDeleted] = useState(false)

  const { data, isLoading, error } = useGetLogSlugQuery(
    {
      slugLog,
      limit,
      page
    },
    { skip: isDeleted }
  )

  const [deleteLog, { isLoading: loadingDelete }] = useDeleteLogMutation()

  const { userInfo } = useSelector(state => state.auth)

  const handleLimitChange = e => {
    const newLimit = Math.max(1, Number(e.target.value))
    searchParams.set('limit', newLimit)
    searchParams.set('page', 1)
    navigate(`?${searchParams.toString()}`, { replace: true })
  }

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        setIsDeleted(true)
        await deleteLog(slugLog).unwrap()
        toast.success('Log deleted')
        navigate('/logs', { replace: true })
      } catch (err) {
        setIsDeleted(false)
        toast.error(err?.data?.message || err.error)
      }
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
        <title>{data.log.title}</title>
      </Helmet>
      <main className='model'>
        <div className='model__container'>
          <Link className='model__link-goBack' to='/logs'>
            &#160;&#160;Logs
          </Link>
        </div>
        <div className='model__container'>
          <div className='title-container'>
            <h1 className='title-container__title'>{data.log.title}</h1>
            <div className='title-container__link-container'>
              <Link
                className='title-container__link'
                to={`/logs/edit/${data.log._id}`}
              >
                Edit
              </Link>
            </div>
            <div className='title-container__button-container'>
              <button
                disabled={loadingDelete}
                className='title-container__button'
                onClick={() => deleteHandler(slugLog)}
              >
                Delete
              </button>
              {loadingDelete && <Loader />}
            </div>
          </div>
        </div>
        <div className='model__container'>
          <h2 className='model__subtitle'>Exercises</h2>
          <div className='model__contents'>
            <Label limit={limit} handleLimitChange={handleLimitChange} />
            <ul className='model__list'>
              {data.logAggregate.length > 0 &&
                data.logAggregate.map(item => (
                  <li className='model__item' key={item.exercises._id}>
                    <ProtectedRoute
                      condition={userInfo._id === data.log.author}
                    >
                      <Link
                        className='model__link'
                        to={`/logs/${slugLog}/${item.exercises.slugExercise}`}
                      >
                        {item.exercises.title}
                      </Link>
                    </ProtectedRoute>
                  </li>
                ))}
            </ul>
          </div>
          <Pagination
            totalPages={data.pagination.totalPages}
            initialPage={page || 1}
          />
          <Link
            className='model__button'
            to={`/logs/${slugLog}/create-new-exercise`}
          >
            Create new
          </Link>
        </div>
      </main>
    </>
  )
}

export default LogSlugShow
