import {
  useGetWlsessionSlugQuery,
  useDeleteWlsessionMutation
} from '../../../slices/wlsessionsApiSlice'
import { Link } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'

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
    <>
      <button onClick={submitHandler}>Go Back</button>
      <h1>WlsessionSlugShow</h1>
      <h2 className=''>
        {new Date(data.wlsession.createdDate).toLocaleDateString()}
      </h2>
      <Link to={`/logs/${slugLog}/${slugExercise}/edit/${data.wlsession._id}`}>
        Edit
      </Link>
      <button onClick={() => deleteHandler(slugSession)}>Delete</button>
      <table className=''>
        <tbody>
          <tr>
            <td>Set</td>
            <td>reps</td>
            <td>kgs</td>
            <td>volume</td>
          </tr>
          {data.wlsession.set.map((set, index) => (
            <tr key={set._id}>
              <td>{index + 1}</td>
              <th>{set.repetitions}</th>
              <th>{set.kilograms}</th>
              <th>{set.volume}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default WlsessionShow
