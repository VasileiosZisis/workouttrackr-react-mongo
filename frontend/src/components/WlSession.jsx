import ProtectedRoute from './ProtectedRoute'
import { Link } from 'react-router-dom'

const WlSession = ({ data, userInfo, slugLog, slugExercise }) => {
  return (
    <ul className='sessions__list'>
      {data.exerciseAggregate.length > 0 &&
        data.exerciseAggregate.map(item => (
          <li key={item.wlsessions._id} className='sessions__item'>
            <ProtectedRoute condition={userInfo._id === data.exercise.author}>
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
                      <td colSpan='3'>Total Volume</td>
                      <th colSpan='2'>{item.wlsessions.totalVolume}</th>
                    </tr>
                    <tr>
                      <td colSpan='3'>Junk Volume</td>
                      <th colSpan='2'>{item.wlsessions.junkVolume}</th>
                    </tr>
                    <tr>
                      <td colSpan='3'>Working Volume</td>
                      <th colSpan='2'>{item.wlsessions.workingVolume}</th>
                    </tr>
                    <tr>
                      <td>Set</td>
                      <td>Reps</td>
                      <td>KGs</td>
                      <td>Hard</td>
                      <td>Volume</td>
                    </tr>
                    {item.wlsessions.set.map((set, index) => (
                      <tr key={set._id}>
                        <td>{index + 1}</td>
                        <td>{set.repetitions}</td>
                        <td>{set.kilograms}</td>
                        <td>{set.isHard ? '&#10003;' : '-'}</td>
                        <td>{set.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Link>
            </ProtectedRoute>
          </li>
        ))}
    </ul>
  )
}

export default WlSession
