import { Link } from 'react-router-dom'
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

const WlSession = ({ data, slugLog, slugExercise }) => {
  const [showTotalVolume, setShowTotalVolume] = useState(true)
  const [showJunkVolume, setShowJunkVolume] = useState(true)
  const [showWorkVolume, setShowWorkVolume] = useState(true)

  const chartData = {
    labels: data.exerciseAggregate.map(item =>
      new Date(item.wlsessions.createdDate).toLocaleDateString()
    ),
    datasets: [
      showTotalVolume && {
        label: 'Total Volume',
        data: data.exerciseAggregate.map(item => item.wlsessions.totalVolume),
        backgroundColor: '#ddd6cfff'
      },
      showJunkVolume && {
        label: 'Junk Volume',
        data: data.exerciseAggregate.map(item => item.wlsessions.junkVolume),
        backgroundColor: '#353636ff'
      },
      showWorkVolume && {
        label: 'Work Volume',
        data: data.exerciseAggregate.map(item => item.wlsessions.workingVolume),
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
        text: 'Volume Over Time',
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
        }
      },
      y: {
        title: {
          display: true,
          text: 'Volume',
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
        }
      }
    }
  }

  return (
    <>
      <ul className='sessions__list'>
        {data.exerciseAggregate.length > 0 &&
          data.exerciseAggregate.map(item => (
            <li key={item.wlsessions._id} className='sessions__item'>
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
                      <td colSpan='3'>Work Volume</td>
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
                        <td>{set.isHard ? <span>&#10003;</span> : '-'}</td>
                        <td>{set.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Link>
            </li>
          ))}
      </ul>
      <div className='sessions__label-container'>
        <p className='sessions__text'>show bar:</p>
        <label className='sessions__label'>
          <input
            className='sessions__input-checkbox'
            type='checkbox'
            checked={showTotalVolume}
            onChange={() => setShowTotalVolume(!showTotalVolume)}
          />
          &#160;Total Volume
        </label>
        <label className='sessions__label'>
          <input
            className='sessions__input-checkbox'
            type='checkbox'
            checked={showJunkVolume}
            onChange={() => setShowJunkVolume(!showJunkVolume)}
          />
          &#160;Junk Volume
        </label>
        <label className='sessions__label'>
          <input
            className='sessions__input-checkbox'
            type='checkbox'
            checked={showWorkVolume}
            onChange={() => setShowWorkVolume(!showWorkVolume)}
          />
          &#160;Work Volume
        </label>
      </div>
      <div className='sessions__chart'>
        <div className='sessions__chart-scroll'>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </>
  )
}

export default WlSession
