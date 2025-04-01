import { NavLink } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useLogoutMutation } from '../../slices/usersApiSlice'
import { logout } from '../../slices/authSlice'
import './Navbar.css'

const Navbar = ({ isNavOpen, toggleNav }) => {
  const { userInfo } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutMutation] = useLogoutMutation()

  const navbarRef = useRef(null)

  const logoutHandler = async () => {
    try {
      await logoutMutation().unwrap()
      dispatch(logout())
      navigate('/')
      toast.success('You are now logged out')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const closeNavbar = () => {
    if (isNavOpen) {
      toggleNav()
    }
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isNavOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        !event.target.closest('.hamburger__btn')
      ) {
        toggleNav()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNavOpen, toggleNav])

  return (
    <header>
      <nav ref={navbarRef} className={`navbar ${isNavOpen ? 'show' : ''}`}>
        <div className='navbar__icon'>
          <button className='navbar__close-btn' onClick={toggleNav}>
            <span className='navbar__bar'></span>
            <span className='navbar__bar'></span>
            <span className='navbar__bar'></span>
            <span className='screen-reader-text'>Menu</span>
          </button>
        </div>
        <ul className='navbar__list'>
          <li className='navbar__item'>
            <NavLink className='navbar__link' to='/' onClick={closeNavbar}>
              Home
            </NavLink>
          </li>
          <li className='navbar__item'>
            <NavLink
              className='navbar__link'
              to='/contact'
              onClick={closeNavbar}
            >
              Contact
            </NavLink>
          </li>
          {userInfo ? (
            <>
              <li className='navbar__item mt'>
                <NavLink
                  className='navbar__link'
                  to='/profile'
                  onClick={closeNavbar}
                >
                  Profile
                </NavLink>
              </li>
              {userInfo.isAdmin && (
                <li className='navbar__item'>
                  <NavLink
                    className='navbar__link'
                    to='/'
                    onClick={closeNavbar}
                  >
                    Admin
                  </NavLink>
                </li>
              )}
              <li className='navbar__item' onClick={closeNavbar}>
                <button className='navbar__button' onClick={logoutHandler}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className='navbar__item'>
                <NavLink
                  className='navbar__link'
                  to='/login'
                  onClick={closeNavbar}
                >
                  Login
                </NavLink>
              </li>
              <li className='navbar__item'>
                <NavLink
                  className='navbar__link'
                  to='/register'
                  onClick={closeNavbar}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
