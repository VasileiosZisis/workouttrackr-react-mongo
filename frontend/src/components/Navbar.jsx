import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../../slices/usersApiSlice'
import { logout } from '../../slices/authSlice'
import './Navbar.css'

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

  return (
    <header>
      <nav className='navbar'>
        <ul className='navbar__list'>
          <li className='navbar__item'>
            <NavLink className='navbar__link' to='/'>
              Home
            </NavLink>
          </li>
          <li className='navbar__item'>
            <NavLink className='navbar__link' to='/contact'>
              Contact
            </NavLink>
          </li>
        </ul>
        <ul className='navbar__list'>
          {userInfo ? (
            <>
              <li className='navbar__item'>
                <NavLink className='navbar__link' to='/profile'>
                  {userInfo.username}
                </NavLink>
              </li>
              {userInfo.isAdmin && (
                <li className='navbar__item'>
                  <NavLink className='navbar__link' to='/'>
                    admin
                  </NavLink>
                </li>
              )}
              <li className='navbar__item' onClick={logoutHandler}>
                <button className='navbar__button'>logout</button>
              </li>
            </>
          ) : (
            <>
              <li className='navbar__item'>
                <NavLink className='navbar__link' to='/login'>
                  login
                </NavLink>
              </li>
              <li className='navbar__item'>
                <NavLink className='navbar__link' to='/register'>
                  register
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
