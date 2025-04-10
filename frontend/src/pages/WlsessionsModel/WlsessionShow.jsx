import {
  useGetWlsessionSlugQuery,
  useDeleteWlsessionMutation
} from '../../../slices/wlsessionsApiSlice'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import '../ModelMain.css'
import '../ModelForms.css'

const WlsessionShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise, slugSession } = useParams()

  const [isDeleted, setIsDeleted] = useState(false)

  const { data, isLoading, error } = useGetWlsessionSlugQuery(
    {
      slugLog,
      slugExercise,
      slugSession
    },
    { skip: isDeleted }
  )

  const [deleteWlsession, { isLoading: loadingDelete }] =
    useDeleteWlsessionMutation()

  const { userInfo } = useSelector(state => state.auth)

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        setIsDeleted(true)
        await deleteWlsession({ slugLog, slugExercise, slugSession }).unwrap()
        navigate(`/logs/${slugLog}/${slugExercise}`, { replace: true })
        toast.success('Session deleted')
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
        <title>
          {new Date(data.wlsession.createdDate).toLocaleDateString()}
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
        <ProtectedRoute condition={userInfo._id === data.wlsession.author}>
          <div className='model__container'>
            <div className='title-container'>
              <h1 className='title-container__title'>
                {new Date(data.wlsession.createdDate).toLocaleDateString()}
              </h1>
              <div className='title-container__link-container'>
                <Link
                  className='title-container__link'
                  to={`/logs/${slugLog}/${slugExercise}/wl/edit/${data.wlsession._id}`}
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
                  <td colSpan='3'>Total Volume</td>
                  <th colSpan='2'>{data.wlsession.totalVolume}</th>
                </tr>
                <tr>
                  <td colSpan='3'>Junk Volume</td>
                  <th colSpan='2'>{data.wlsession.junkVolume}</th>
                </tr>
                <tr>
                  <td colSpan='3'>Work Volume</td>
                  <th colSpan='2'>{data.wlsession.workingVolume}</th>
                </tr>
                <tr>
                  <th></th>
                </tr>
                <tr>
                  <td>Set</td>
                  <td>Reps</td>
                  <td>KGs</td>
                  <td>Hard</td>
                  <td>Volume</td>
                </tr>
                {data.wlsession.set.map((set, index) => (
                  <tr key={set._id}>
                    <td>{index + 1}</td>
                    <td>{set.repetitions}</td>
                    <td>{set.kilograms}</td>
                    <td>{set.isHard ? <span>&#10003;</span> : '-'}</td>
                    <td>{set.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ProtectedRoute>
      </main>
    </>
  )
}

export default WlsessionShow
