import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../slices/usersApiSlice'
import { logout } from '../../slices/authSlice'
// import './Navbar.css'

const Navbar = () => {
  const { userInfo } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutMutation] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutMutation().unwrap()
      dispatch(logout())
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const [toggleOpen, setToggleOpen] = useState(false)

  const handleOpen = e => {
    setToggleOpen(!toggleOpen)
    if (!toggleOpen) {
      e.currentTarget.setAttribute('aria-expanded', 'true')
    } else {
      e.currentTarget.setAttribute('aria-expanded', 'false')
    }
  }
  const toggle = () => setToggleOpen(!toggleOpen)

  return (
    <header>
      <nav>
        <div className='nav-img-div'>
          <button
            onClick={e => handleOpen(e)}
            aria-expanded='false'
            className={`hamburger ${toggleOpen ? 'active' : ''}`}
          >
            <span className='bar' aria-hidden='true'></span>
            <span className='bar' aria-hidden='true'></span>
            <span className='bar' aria-hidden='true'></span>
            <span className='screen-reader-text'>Menu</span>
          </button>
        </div>
        <div>
          <ul className={`nav-ul ${toggleOpen ? 'show' : ''}`}>
            <li className='nav-li'>
              <NavLink className='navlink' to='/about' onClick={toggle}>
                ABOUT
              </NavLink>
            </li>
          </ul>
          <ul>
            {userInfo ? (
              <>
                <li>
                  <b>{userInfo.username}</b>
                </li>
                <li>
                  <Link to='/profile'>profile</Link>
                </li>
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <Link to='/new'>create blog</Link>
                    </li>
                  </>
                )}
                <li className='logout' onClick={logoutHandler}>
                  logout
                </li>
              </>
            ) : (
              <>
                {/* <li>
              <Link to='/register'>register</Link>
            </li> */}
                <li>
                  <Link to='/login'>login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
