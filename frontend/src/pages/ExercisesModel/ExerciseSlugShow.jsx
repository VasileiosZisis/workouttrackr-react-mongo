import {
  useGetExerciseSlugQuery,
  useDeleteExerciseMutation
} from '../../../slices/exercisesApiSlice'
import { useGetLogSlugQuery } from '../../../slices/logsApiSlice'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from '../../components/ProtectedRoute'
import '../ModelMain.css'

const ExerciseSlugShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise } = useParams()

  const { refetch } = useGetLogSlugQuery(slugLog)

  const { data, isLoading, error } = useGetExerciseSlugQuery({
    slugLog,
    slugExercise
  })

  const [deleteExercise, { isLoading: loadingDelete }] =
    useDeleteExerciseMutation()

  const { userInfo } = useSelector(state => state.auth)

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

  if (isLoading) return <p>loading</p>
  if (error) return <div>{error?.data?.message || error.error}</div>
  if (loadingDelete) return <p>loading</p>

  return (
    <ProtectedRoute condition={userInfo._id === data.exercise.author}>
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
          </div>
        </div>
        <h2 className='model__subtitle'>Sessions</h2>
        {data.exercise.session === 'wlsession' ? (
          <div className='sessions'>
            <ul className='sessions__list'>
              {data.exerciseAggregate.length > 0 &&
                data.exerciseAggregate.map(item => (
                  <li className='sessions__item' key={item.wlsessions._id}>
                    <Link
                      className='sessions__link'
                      to={`/logs/${slugLog}/${slugExercise}/wl/${item.wlsessions.slugSession}`}
                    >
                      <table className='sessions__table'>
                        <tbody>
                          <tr>
                            <th colSpan='5' scope='col'>
                              {new Date(
                                item.wlsessions.createdDate
                              ).toLocaleDateString()}
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                          </tr>
                          <tr>
                            <td colSpan='3' scope='col'>
                              Total Volume
                            </td>
                            <th colSpan='2' scope='col'>
                              {item.wlsessions.totalVolume}
                            </th>
                          </tr>
                          <tr>
                            <td colSpan='3' scope='col'>
                              Junk Volume
                            </td>
                            <th colSpan='2' scope='col'>
                              {item.wlsessions.junkVolume}
                            </th>
                          </tr>
                          <tr>
                            <td colSpan='3' scope='col'>
                              Working Volume
                            </td>
                            <th colSpan='2' scope='col'>
                              {item.wlsessions.workingVolume}
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                          </tr>
                          <tr>
                            <td>Set</td>
                            <td>Reps</td>
                            <td>KGs</td>
                            <td>Hard</td>
                            <td>volume</td>
                          </tr>
                          {item.wlsessions.set.map((set, index) => (
                            <tr key={set._id}>
                              <td>{index + 1}</td>
                              <th>{set.repetitions}</th>
                              <th>{set.kilograms}</th>
                              <th>
                                {set.isHard ? (
                                  <span>true</span>
                                ) : (
                                  <span>false</span>
                                )}
                              </th>
                              <th>{set.volume}</th>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Link>
                  </li>
                ))}
            </ul>
            <Link
              className='model__button'
              to={`/logs/${slugLog}/${slugExercise}/wl/create-new-session`}
            >
              Create New
            </Link>
          </div>
        ) : data.exercise.session === 'pasession' ? (
          <div className='sessions'>
            <ul className='sessions__list'>
              {data.exerciseAggregatePa.length > 0 &&
                data.exerciseAggregatePa.map(item => (
                  <li className='sessions__item' key={item.pasessions._id}>
                    <Link
                      className='sessions__link'
                      to={`/logs/${slugLog}/${slugExercise}/pa/${item.pasessions.slugSession}`}
                    >
                      <table className='sessions__table'>
                        <tbody>
                          <tr>
                            <th colSpan='5' scope='col'>
                              {new Date(
                                item.pasessions.createdDate
                              ).toLocaleDateString()}
                            </th>
                          </tr>
                          <tr>
                            <th></th>
                          </tr>
                          <tr>
                            <td colSpan='2' scope='col'>
                              Pace
                            </td>
                            <th colSpan='2' scope='col'>
                              {item.pasessions.paceSeconds > 10
                                ? `${item.pasessions.paceMinutes}:${item.pasessions.paceSeconds} `
                                : `${item.pasessions.paceMinutes}:0${item.pasessions.paceSeconds} `}
                              <span className='sessions__span'>min/km</span>
                            </th>
                          </tr>
                          <tr>
                            <td colSpan='2' scope='col'>
                              Speed
                            </td>
                            <th colSpan='2' scope='col'>
                              {item.pasessions.speed}{' '}
                              <span className='sessions__span'>km/min</span>
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
                            <th>{item.pasessions.time.hours}</th>
                            <th>{item.pasessions.time.minutes}</th>
                            <th>{item.pasessions.time.seconds}</th>
                            <th>{item.pasessions.distance}</th>
                          </tr>
                        </tbody>
                      </table>
                    </Link>
                  </li>
                ))}
            </ul>
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
    </ProtectedRoute>
  )
}

export default ExerciseSlugShow
