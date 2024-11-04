import {
  useGetExerciseSlugQuery,
  useDeleteExerciseMutation
} from '../../../slices/exercisesApiSlice'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../ModelShow.css'

const ExerciseSlugShow = () => {
  const navigate = useNavigate()

  const { slugLog, slugExercise } = useParams()

  const { data, isLoading, error } = useGetExerciseSlugQuery({
    slugLog,
    slugExercise
  })

  const [deleteExercise, { isLoading: loadingDelete }] =
    useDeleteExerciseMutation()

  const deleteHandler = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteExercise({ slugLog, slugExercise })
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
        <div className=''>
          {data.exerciseAggregate.length > 0 &&
            data.exerciseAggregate.map(item => (
              <Link
                key={item.wlsessions._id}
                className=''
                to={`/logs/${slugLog}/${slugExercise}/${item.wlsessions.slugSession}`}
              >
                <table className=''>
                  <tbody>
                    <tr>
                      <th colSpan='4' scope='col'>
                        {new Date(
                          item.wlsessions.createdDate
                        ).toLocaleDateString()}
                      </th>
                    </tr>
                    {/* <tr>
                        <td colSpan="3" scope="col">
                            Total Volume
                        </td>
                        <!-- const result = exerciseItem.trsessions.weights.map((a) => a.volume); 
                         const totalVolume = result.reduce((acc, cur) => acc + cur, 0);  -->
                        <th colSpan="1" scope="col" class="totalVolume"
                            data-totalvolume='<%= exerciseItem.trsessions.totalVolume %>'>
                            <%= exerciseItem.trsessions.totalVolume %>
                        </th>
                    </tr> */}
                    <tr>
                      <th></th>
                    </tr>
                    <tr>
                      <td>Set</td>
                      <td>reps</td>
                      <td>kgs</td>
                      <td>volume</td>
                    </tr>
                    {item.wlsessions.set.map((set, index) => (
                      <tr key={set._id}>
                        <td>{index + 1}</td>
                        <th>{set.repetitions}</th>
                        <th>{set.kilograms}</th>
                        <th>{set.volume}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Link>
            ))}
          <Link to={`/logs/${slugLog}/${slugExercise}/wl/create-new-session`}>
            Go to Create Session
          </Link>
        </div>
      ) : data.exercise.session === 'pasession' ? (
        <>
          <Link to={`/logs/${slugLog}/${slugExercise}/pa/create-new-session`}>
            Go to Create Session
          </Link>
        </>
      ) : (
        <>no</>
      )}
    </main>
  )
}

export default ExerciseSlugShow
