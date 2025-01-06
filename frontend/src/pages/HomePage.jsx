import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
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
    <main className='homepage-main'>
      <div className='hero-section'>
        <img
          className='hero-section__img'
          src='https://res.cloudinary.com/dmdbza74n/image/upload/v1681755285/training%20app/victor-freitas-vjkM-0m34KU-unsplash_cjlnkj.webp'
        />
        <div className='hero-section__title-container'>
          <h1 className='hero-section__title'>
            <span className='hero-section__title--big'>Log </span>your training
            <br />
            <span className='hero-section__title--big'>Track </span>
            your progress
          </h1>
          <Link className='hero-section__button' to='/register'>
            Register
          </Link>
        </div>
      </div>
      <div className='logs-section'>
        <div>
          <h2 className='logs-section__title'>Start Logging</h2>
          <p className='logs-section__subtitle'>Your training plan.</p>
          <p className='logs-section__subtitle'>A new goal.</p>
        </div>
        <div>
          <img
            className='logs-section__img'
            src='https://res.cloudinary.com/dmdbza74n/image/upload/v1681755281/training%20app/logs_ah9o6f.webp'
          />
        </div>
      </div>
      <div className='exercises-section'>
        <div>
          <img
            className='exercises-section__img'
            src='https://res.cloudinary.com/dmdbza74n/image/upload/v1681755282/training%20app/exercises_j9o1sv.webp'
          />
        </div>
        <div>
          <h2 className='exercises-section__title'>Name your exercises</h2>
          <p className='exercises-section__subtitle'>No premade lists.</p>
          <p className='exercises-section__subtitle'>Set your custom labels.</p>
        </div>
      </div>
      <div className='sessions-section'>
        <div className='sessions-section__img-container--left'>
          <img
            className='sessions-section__img'
            src='https://res.cloudinary.com/dmdbza74n/image/upload/v1681755282/training%20app/session_s2h5xi.webp'
          />
        </div>
        <div>
          <h2 className='h2-home-black'>Track your progress</h2>
          <p className='p-home-black'>Add your sessions.</p>
          <p className='p-home-black'>Visualize your progress.</p>
        </div>
        <div className='sessions-section__img-container--right'>
          <img
            className='sessions-section__img'
            src='https://res.cloudinary.com/dmdbza74n/image/upload/v1681755282/training%20app/sessions_cwjmun.webp'
          />
        </div>
      </div>
      <div className='bottom-section'>
        <div className='bottom-section__text-container'>
          <p className='bottom-section__text'>
            The project is still in the early stages, and new features and
            metrics will be added over time.
          </p>
        </div>
        {/* <div className='bottom-section__contact-container'>
          <div>
            <h2 className='bottom-section__title'>Request a feature</h2>
          </div>
          <div>
            <Link className='bottom-section__button' to='/contact'>
              Contact
            </Link>
          </div>
        </div> */}
      </div>
    </main>
  )
}

export default HomePage
