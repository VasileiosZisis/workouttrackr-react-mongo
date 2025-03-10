import {
  useGetExerciseSlugQuery,
  useDeleteExerciseMutation
} from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import WlSession from '../../components/WlSession'
import PaSession from '../../components/PaSession'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
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
        toast.success('Exercise deleted')
      } catch (err) {
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
        <title>{data.exercise.title}</title>
      </Helmet>
      <main className='model'>
        <div className='model__container'>
          <Link className='model__link-goBack' to={`/logs/${slugLog}`}>
            &#160;&#160;Exercises
          </Link>
        </div>
        <ProtectedRoute
          key={data.exercise._id}
          condition={userInfo._id === data.exercise.author}
        >
          <div className='model__container'>
            <div className='title-container'>
              <h1 className='title-container__title'>{data.exercise.title}</h1>
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
                  disabled={loadingDelete}
                  className='title-container__button'
                  onClick={() => deleteHandler(slugExercise)}
                >
                  Delete
                </button>
                {loadingDelete && <Loader />}
              </div>
            </div>
          </div>
          {data.exercise.session === 'wlsession' ? (
            <div className='sessions'>
              <WlSession
                limit={limit}
                handleLimitChange={handleLimitChange}
                data={data}
                slugLog={slugLog}
                slugExercise={slugExercise}
                page={page}
              />
            </div>
          ) : (
            data.exercise.session === 'pasession' && (
              <div className='sessions'>
                <PaSession
                  limit={limit}
                  handleLimitChange={handleLimitChange}
                  data={data}
                  slugLog={slugLog}
                  slugExercise={slugExercise}
                  page={page}
                />
              </div>
            )
          )}
        </ProtectedRoute>
      </main>
    </>
  )
}

export default ExerciseSlugShow
