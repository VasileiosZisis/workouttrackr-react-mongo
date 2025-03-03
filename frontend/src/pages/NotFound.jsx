import { Helmet } from 'react-helmet-async'
import './NotFound.css'

const NotFound = () => {
  const goBack = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <>
      <Helmet>
        <title>Error Page</title>
      </Helmet>
      <main className='error'>
        <div>
          <h1 className='error__title'>This page does not exist</h1>
        </div>
        <div>
          <button className='error__button' onClick={goBack}>
            Go Back
          </button>
        </div>
      </main>
    </>
  )
}
export default NotFound
