import './NotFound.css'

const NotFound = () => {
  const goBack = e => {
    e.preventDefault()
    navigate(-1)
  }

  return (
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
  )
}
export default NotFound
