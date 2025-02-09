import { Link } from 'react-router-dom'

const PaSession = ({ data, slugLog, slugExercise }) => {
  return (
    <ul className='sessions__list'>
      {data.exerciseAggregatePa.length > 0 &&
        data.exerciseAggregatePa.map(item => (
          <li key={item.pasessions._id} className='sessions__item'>
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
                    <td colSpan='1' scope='col'>
                      Pace
                    </td>
                    <th colSpan='3' scope='col'>
                      {item.pasessions.paceSeconds > 10
                        ? `${item.pasessions.paceMinutes}:${item.pasessions.paceSeconds} `
                        : `${item.pasessions.paceMinutes}:0${item.pasessions.paceSeconds} `}
                      <span className='sessions__span'>min/km</span>
                    </th>
                  </tr>
                  <tr>
                    <td colSpan='1' scope='col'>
                      Speed
                    </td>
                    <th colSpan='3' scope='col'>
                      {item.pasessions.speed.toFixed(3)}
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
  )
}

export default PaSession
