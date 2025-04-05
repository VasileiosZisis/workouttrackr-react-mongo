import {
  useGetPasessionSlugQuery,
  useDeletePasessionMutation
} from '../../../slices/pasessionsApiSlice'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import '../ModelMain.css'
import '../ModelForms.css'

const PasessionShow = () => {
  const navigate = useNavigate()
  const { slugLog, slugExercise, slugSession } = useParams()

  const [isDeleted, setIsDeleted] = useState(false)

  const { data, isLoading, error } = useGetPasessionSlugQuery(
    {
      slugLog,
      slugExercise,
      slugSession
    },
    { skip: isDeleted }
  )

  const [deletePasession, { isLoading: loadingDelete }] =
    useDeletePasessionMutation()

  const { userInfo } = useSelector(state => state.auth)

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        setIsDeleted(true)
        await deletePasession({ slugLog, slugExercise, slugSession }).unwrap()
        navigate(`/logs/${slugLog}/${slugExercise}`)
        toast.success('Session deleted', { replace: true })
      } catch (err) {
        setIsDeleted(true)
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
        <title>
          {new Date(data.pasession.createdDate).toLocaleDateString()}
        </title>
      </Helmet>
      <main className='model'>
        <div className='model__container'>
          <Link
            className='model__link-goBack'
            to={`/logs/${slugLog}/${slugExercise}`}
          >
            &#160;&#160;Sessions
          </Link>
        </div>
        <ProtectedRoute condition={userInfo._id === data.pasession.author}>
          <div className='model__container'>
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
          </div>
          <div className='model__container'>
            <table className='sessions__table'>
              <tbody>
                <tr>
                  <td colSpan='1' scope='col'>
                    Pace
                  </td>
                  <th colSpan='3' scope='col'>
                    {data.pasession.paceMinutes}:
                    {data.pasession.paceSeconds.toString().padStart(2, '0')}
                    <span className='sessions__span'> min:sec</span>
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
          </div>
        </ProtectedRoute>
      </main>
    </>
  )
}

export default PasessionShow
