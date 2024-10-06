import {
  useGetExerciseSlugQuery,
  useDeleteExerciseMutation
} from '../../../slices/exercisesApiSlice'
import { useParams, useNavigate, Link } from 'react-router-dom'

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
    <>
      <button onClick={submitHandler}>Go Back</button>
      <h1>ExcerciseSlugShow</h1>
      <h2 className=''>{`${data.exercise.title}`}</h2>
      <Link to={`/logs/${slugLog}/edit/${data.exercise._id}`}>Edit</Link>
      <button onClick={() => deleteHandler(slugExercise)}>Delete</button>

      {data.exercise.session === 'wlsession' ? (
        <div className=''>
          <Link to={`/logs/${slugLog}/${slugExercise}/wl/create-new-session`}>
            Go to Create Session
          </Link>
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
    </>
  )
}

export default ExerciseSlugShow
