import {
  useGetExerciseSlugQuery,
  useDeleteExerciseMutation
} from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Pagination from '../../components/Pagination'
import WlSession from '../../components/WlSession'
import PaSession from '../../components/PaSession'
import Label from '../../components/Label'
import Loader from '../../components/Label'
import '../ModelMain.css'

const ExerciseSlugShow = () => {
  const { slugLog, slugExercise } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const limit = Number(searchParams.get('limit'))
  const page = Number(searchParams.get('page'))

  const { refetch } = useGetLogSlugQuery({
    slugLog,
    limit,
    page
  })

  const { data, isLoading, error } = useGetExerciseSlugQuery({
    slugLog,
    slugExercise,
    limit,
    page
  })

  const [deleteExercise, { isLoading: loadingDelete }] =
    useDeleteExerciseMutation()

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
        await deleteExercise({ slugLog, slugExercise })
        refetch()
        navigate(`/logs/${slugLog}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}`)
  }

  if (isLoading) return <Loader />
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <div className='title-container'>
        <h1 className='title-container__title'>{`${data.exercise.title}`}</h1>
        <div className='title-container__link-container'>
          <Link
            className='title-container__link'
            to={`/logs/${slugLog}/edit/${data.exercise._id}`}
          >
            Edit
          </Link>
        </div>
        <div className='title-container__button-container'>
          <button
            className='title-container__button'
            onClick={() => deleteHandler(slugExercise)}
          >
            Delete
          </button>
          {loadingDelete && <Loader />}
        </div>
      </div>
      <h2 className='model__subtitle'>Sessions</h2>
      {data.exercise.session === 'wlsession' ? (
        <div className='sessions'>
          <Label limit={limit} handleLimitChange={handleLimitChange} />
          <WlSession
            data={data}
            userInfo={userInfo}
            slugLog={slugLog}
            slugExercise={slugExercise}
          />
          <Pagination
            totalPages={data.pagination.totalWlPages}
            initialPage={page || 1}
          />
          <Link
            className='model__button'
            to={`/logs/${slugLog}/${slugExercise}/wl/create-new-session`}
          >
            Create New
          </Link>
        </div>
      ) : data.exercise.session === 'pasession' ? (
        <div className='sessions'>
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
          <PaSession
            data={data}
            userInfo={userInfo}
            slugLog={slugLog}
            slugExercise={slugExercise}
          />
          <Pagination
            totalPages={data.pagination.totalPaPages}
            initialPage={page || 1}
          />
          <Link
            className='model__button'
            to={`/logs/${slugLog}/${slugExercise}/pa/create-new-session`}
          >
            Create New
          </Link>
        </div>
      ) : (
        <h1>NOTHING</h1>
      )}
    </main>
  )
}

export default ExerciseSlugShow
