import {
  useGetLogSlugQuery,
  useDeleteLogMutation
} from '../../../slices/logsApiSlice'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import Pagination from '../../components/Pagination'
import '../ModelMain.css'

const LogSlugShow = () => {
  const { slugLog } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))

  const { data, isLoading, error } = useGetLogSlugQuery({
    slugLog,
    limit,
    page
  })

  const [deleteLog, { isLoading: loadingDelete }] = useDeleteLogMutation()

  const { userInfo } = useSelector(state => state.auth)

  const handleLimitChange = e => {
    const newLimit = Number(e.target.value)
    searchParams.set('limit', newLimit)
    searchParams.set('page', 1)
    navigate(`?${searchParams.toString()}`, { replace: true })
  }

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteLog(slugLog)
        refetch()
        navigate('/logs')
      } catch (err) {
        console.log(err)
      }
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate('/logs')
  }

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>
  if (loadingDelete) return <p>loading</p>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go back
      </button>
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
            className='title-container__button'
            onClick={() => deleteHandler(slugLog)}
          >
            Delete
          </button>
        </div>
      </div>
      <h2 className='model__subtitle'>Exercises</h2>
      <div className='model__contents'>
        <label className='model__label'>
          per page:&emsp;
          <select
            className='model__select'
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </label>
        <ul className='model__list'>
          <li className='model__item'>
            {data.logAggregate.length > 0 &&
              data.logAggregate.map(item => (
                <ProtectedRoute
                  key={item.exercises._id}
                  condition={userInfo._id === data.log.author}
                >
                  <Link
                    className='model__link'
                    to={`/logs/${slugLog}/${item.exercises.slugExercise}`}
                  >
                    {item.exercises.title}
                  </Link>
                </ProtectedRoute>
              ))}
          </li>
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
    </main>
  )
}

export default LogSlugShow
