import { Link } from 'react-router-dom'
import Pagination from './Pagination'
import Label from './Label'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const PaSession = ({
  data,
  slugLog,
  slugExercise,
  page,
  limit,
  handleLimitChange
}) => {
  const [showPace, setShowPace] = useState(true)
  const [showSpeed, setShowSpeed] = useState(true)

  const chartData = {
    labels: data.exerciseAggregatePa.map(item =>
      new Date(item.pasessions.createdDate).toLocaleDateString()
    ),
    datasets: [
      showPace && {
        label: 'Pace (min/km)',
        data: data.exerciseAggregatePa.map(
          item => item.pasessions.paceMinutes + item.pasessions.paceSeconds / 60
        ),
        backgroundColor: '#ddd6cfff'
      },
      showSpeed && {
        label: 'Speed (km/min)',
        data: data.exerciseAggregatePa.map(item => item.pasessions.speed),
        backgroundColor: '#f5f65fff'
      }
    ].filter(Boolean)
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f2f2f2',
          font: () => {
            return {
              family: 'Roboto, sans-serif',
              size: window.innerWidth < 800 ? '12px' : '16px'
            }
          }
        }
      },
      title: {
        display: true,
        text: 'Pace & Speed Over Time',
        color: '#f2f2f2',
        font: () => {
          return {
            family: 'Roboto, sans-serif',
            size: window.innerWidth < 800 ? '28px' : '32px'
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#f2f2f2',
          font: () => {
            return {
              family: 'Roboto, sans-serif',
              size: window.innerWidth < 800 ? '16px' : '20px'
            }
          }
        },
        ticks: {
          color: '#f2f2f2',
          font: () => {
            return {
              family: 'Roboto, sans-serif',
              size: window.innerWidth < 800 ? '12px' : '16px'
            }
          }
        },
        grid: {
          color: '#424949'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Metrics',
          color: '#f2f2f2',
          font: () => {
            return {
              family: 'Roboto, sans-serif',
              size: window.innerWidth < 800 ? '16px' : '20px'
            }
          }
        },
        ticks: {
          color: '#f2f2f2',
          font: () => {
            return {
              family: 'Roboto, sans-serif',
              size: window.innerWidth < 800 ? '12px' : '16px'
            }
          }
        },
        grid: {
          color: '#424949'
        }
      }
    }
  }

  return (
    <>
      <div className='model__container'>
        <h2 className='model__subtitle'>Sessions</h2>
        <Label limit={limit} handleLimitChange={handleLimitChange} />
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
                          {item.pasessions.paceMinutes}:
                          {item.pasessions.paceSeconds
                            .toString()
                            .padStart(2, '0')}
                          <span className='sessions__span'> min:sec</span>
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
        <Pagination
          totalPages={data.pagination.totalWlPages}
          initialPage={page || 1}
        />
        <Link
          className='model__button'
          to={`/logs/${slugLog}/${slugExercise}/pa/create-new-session`}
        >
          Create New
        </Link>
      </div>
      <div className='model__container'>
        <div className='sessions__label-container'>
          <p className='sessions__text'>show bar:</p>
          <label className='sessions__label'>
            <input
              className='sessions__input-checkbox'
              type='checkbox'
              checked={showPace}
              onChange={() => setShowPace(!showPace)}
            />
            &#160;Pace
          </label>
          <label className='sessions__label'>
            <input
              className='sessions__input-checkbox'
              type='checkbox'
              checked={showSpeed}
              onChange={() => setShowSpeed(!showSpeed)}
            />
            &#160;Speed
          </label>
        </div>
        <div className='sessions__chart'>
          <div className='sessions__chart-scroll'>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </>
  )
}

export default PaSession
