import {
  useGetLogSlugQuery,
  useDeleteLogMutation
} from '../../../slices/logsApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import '../ModelMain.css'

const LogSlugShow = () => {
  const navigate = useNavigate()

  const { slugLog } = useParams()

  const { data, isLoading, error, refetch } = useGetLogSlugQuery(slugLog)

  const [deleteLog, { isLoading: loadingDelete }] = useDeleteLogMutation()

  const { userInfo } = useSelector(state => state.auth)

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
        <Link
          className='model__button'
          to={`/logs/${slugLog}/create-new-exercise`}
        >
          Create new
        </Link>
      </div>
    </main>
  )
}

export default LogSlugShow
