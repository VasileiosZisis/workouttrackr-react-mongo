import './Hamburger.css'

const Hamburger = ({ toggleNav }) => {
  return (
    <div className='hamburger'>
      <button className='hamburger__btn' onClick={toggleNav}>
        <span className='bar'></span>
        <span className='bar'></span>
        <span className='bar'></span>
        <span className='screen-reader-text'>Menu</span>
      </button>
      <p className='hamburder__brand'>Workout Trackr</p>
    </div>
  )
}

export default Hamburger
