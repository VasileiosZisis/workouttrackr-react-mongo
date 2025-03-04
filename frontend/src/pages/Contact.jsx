import { Helmet } from 'react-helmet-async'
import './Contact.css'

const Contact = () => {
  const goBack = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <main className='contact'>
        <div>
          <p className='contact__text'>
            You can message me directly at: vasil.zisis@gmail.com
          </p>
        </div>
        <div>
          <p className='contact__text'>
            You can visit my portfolio at:&#160;
            <a
              className='contact__link'
              href='https://www.vasiliszisis.me/'
              target='_blank'
            >
              www.vasiliszisis.me
            </a>
          </p>
        </div>
        <div>
          <button className='contact__button' onClick={goBack}>
            Go Back
          </button>
        </div>
      </main>
    </>
  )
}
export default Contact
