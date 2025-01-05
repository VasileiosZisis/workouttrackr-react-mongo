import {
  useGetWlsessionSlugQuery,
  useDeleteWlsessionMutation
} from '../../../slices/wlsessionsApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import '../ModelMain.css'
import '../ModelForms.css'

const WlsessionShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise, slugSession } = useParams()

  const { data, isLoading, error } = useGetWlsessionSlugQuery({
    slugLog,
    slugExercise,
    slugSession
  })

  const [deleteWlsession, { isLoading: loadingDelete }] =
    useDeleteWlsessionMutation()

  const { userInfo } = useSelector(state => state.auth)

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteWlsession({ slugLog, slugExercise, slugSession })
        navigate(`/logs/${slugLog}/${slugExercise}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const submitHandler = e => {
    e.preventDefault()
    navigate(`/logs/${slugLog}/${slugExercise}`)
  }

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>
  if (loadingDelete) return <p>loading</p>

  return (
    <ProtectedRoute condition={userInfo._id === data.wlsession.author}>
      <main className='model'>
        <button className='model__button-goback' onClick={submitHandler}>
          Go Back
        </button>
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
              className='title-container__button'
              onClick={() => deleteHandler(slugExercise)}
            >
              Delete
            </button>
          </div>
        </div>
        <table className='sessions__table'>
          <tbody>
            <tr>
              <td colSpan='3' scope='col'>
                Total Volume
              </td>
              <th colSpan='2' scope='col'>
                {data.wlsession.totalVolume}
              </th>
            </tr>
            <tr>
              <td colSpan='3' scope='col'>
                Junk Volume
              </td>
              <th colSpan='2' scope='col'>
                {data.wlsession.junkVolume}
              </th>
            </tr>
            <tr>
              <td colSpan='3' scope='col'>
                Working Volume
              </td>
              <th colSpan='2' scope='col'>
                {data.wlsession.workingVolume}
              </th>
            </tr>
            <tr>
              <th></th>
            </tr>
            <tr>
              <td>Set</td>
              <td>reps</td>
              <td>kgs</td>
              <td>isHard</td>
              <td>volume</td>
            </tr>
            {data.wlsession.set.map((set, index) => (
              <tr key={set._id}>
                <td>{index + 1}</td>
                <th>{set.repetitions}</th>
                <th>{set.kilograms}</th>
                <th>{set.isHard ? <span>true</span> : <span>false</span>}</th>
                <th>{set.volume}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </ProtectedRoute>
  )
}

export default WlsessionShow
