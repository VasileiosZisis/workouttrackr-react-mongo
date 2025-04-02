import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()

  const { userInfo } = useSelector(state => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate(`/logs`)
    }
  }, [userInfo])

  return (
    <>
      <Helmet>
        <meta
          name='description'
          content='Workout tracker is a web app where you can log your training and track your progress.'
        />
        <meta
          property='og:description'
          content='Workout tracker is a web app where you can log your training and track your progress.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://www.workouttrackr.com/' />
        <meta
          property='og:image'
          content='https://res.cloudinary.com/dmdbza74n/image/upload/v1743512104/portfolio/workout_znfosb.webp'
        />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:width' content='900' />
        <meta property='og:image:height' content='365' />
        <title>Workout Tracker | workouttrackr</title>
      </Helmet>
      <main className='homepage'>
        <div className='hero'>
          <img
            className='hero__img'
            src='https://res.cloudinary.com/dmdbza74n/image/upload/v1681755285/training%20app/victor-freitas-vjkM-0m34KU-unsplash_cjlnkj.webp'
          />
          <div className='hero__title-container'>
            <h1 className='hero__title'>
              <span className='hero__title'>Log </span>your training
              <br />
              <span className='hero__title'>Track </span>
              your progress
            </h1>
            <Link className='hero__button' to='/register'>
              Register
            </Link>
          </div>
        </div>
        <div className='hLogs'>
          <div className='hLogs-left--end'>
            <h2 className='hLogs__title'>Start Logging</h2>
            <p className='hLogs__subtitle'>Your training plan.</p>
            <p className='hLogs__subtitle'>A new goal.</p>
          </div>
          <div className='hLogs-right'>
            <img
              className='hLogs__img'
              src='https://res.cloudinary.com/dmdbza74n/image/upload/v1740923832/training%20app/logsv2_xoiyfv.webp'
            />
          </div>
        </div>
        <div className='hExercises'>
          <div>
            <img
              className='hExercises__img'
              src='https://res.cloudinary.com/dmdbza74n/image/upload/v1740923970/training%20app/exercisesv2_hkgttw.webp'
            />
          </div>
          <div>
            <h2 className='hExercises__title'>Name your exercises</h2>
            <p className='hExercises__subtitle'>No premade lists.</p>
            <p className='hExercises__subtitle'>Set your custom labels.</p>
          </div>
        </div>
        <div className='hSessions'>
          <div className='hSessions__img-container-left'>
            <img
              className='hSessions__img'
              src='https://res.cloudinary.com/dmdbza74n/image/upload/v1740924881/training%20app/sessionv2_xnogxa.webp'
            />
          </div>
          <div>
            <h2 className='hSessions__title'>Track your progress</h2>
            <p className='hSessions__subtitle'>Add your hSessions.</p>
            <p className='hSessions__subtitle'>Visualize your progress.</p>
          </div>
          <div className='hSessions__img-container-right'>
            <img
              className='hSessions__img'
              src='https://res.cloudinary.com/dmdbza74n/image/upload/v1740924921/training%20app/graphv2_vdqj2m.webp'
            />
          </div>
        </div>
        <footer className='footer'>
          <p className='footer__text'>
            Created by&#160;
            <a
              className='footer__link'
              href='https://www.vasiliszisis.me/'
              target='_blank'
            >
              Vasilis Zisis
            </a>
          </p>
        </footer>
      </main>
    </>
  )
}

export default HomePage
