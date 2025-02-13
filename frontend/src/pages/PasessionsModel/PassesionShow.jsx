import {
  useGetPasessionSlugQuery,
  useDeletePasessionMutation
} from '../../../slices/pasessionsApiSlice'
import { useGetExerciseSlugQuery } from '../../../slices/exercisesApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import '../ModelMain.css'
import '../ModelForms.css'

const PasessionShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise, slugSession } = useParams()

  const { refetch } = useGetExerciseSlugQuery({ slugLog, slugExercise })

  const { data, isLoading, error } = useGetPasessionSlugQuery({
    slugLog,
    slugExercise,
    slugSession
  })

  const [deletePasession, { isLoading: loadingDelete }] =
    useDeletePasessionMutation()

  const { userInfo } = useSelector(state => state.auth)

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        await deletePasession({ slugLog, slugExercise, slugSession })
        refetch()
        navigate(`/logs/${slugLog}/${slugExercise}`)
        toast.success('Session deleted')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(-1)
  }

  if (isLoading) return <Loader />
  if (error) return <div>{error?.data?.message || error.error}</div>

  return (
    <main className='model'>
      <button className='model__button-goback' onClick={submitHandler}>
        Go Back
      </button>
      <ProtectedRoute condition={userInfo._id === data.pasession.author}>
        <div className='title-container'>
          <h1 className='title-container__title'>
            {new Date(data.pasession.createdDate).toLocaleDateString()}
          </h1>
          <div className='title-container__link-container'>
            <Link
              className='title-container__link'
              to={`/logs/${slugLog}/${slugExercise}/pa/edit/${data.pasession._id}`}
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
        <table className='sessions__table'>
          <tbody>
            <tr>
              <td colSpan='1' scope='col'>
                Pace
              </td>
              <th colSpan='3' scope='col'>
                {data.pasession.paceSeconds > 10
                  ? `${data.pasession.paceMinutes}:${data.pasession.paceSeconds} `
                  : `${data.pasession.paceMinutes}:0${data.pasession.paceSeconds} `}
                <span className='sessions__span'>min/km</span>
              </th>
            </tr>
            <tr>
              <td colSpan='1' scope='col'>
                Speed
              </td>
              <th colSpan='3' scope='col'>
                {data.pasession.speed.toFixed(3)}
                <span className='sessions__span'> km/min</span>
              </th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr>
              <td>Hours</td>
              <td>Minutes</td>
              <td>Seconds</td>
              <td>Distance</td>
            </tr>
            <tr>
              <th>{data.pasession.time.hours}</th>
              <th>{data.pasession.time.minutes}</th>
              <th>{data.pasession.time.seconds}</th>
              <th>{data.pasession.distance}</th>
            </tr>
          </tbody>
        </table>
      </ProtectedRoute>
    </main>
  )
}

export default PasessionShow
