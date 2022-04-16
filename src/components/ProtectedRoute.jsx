import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { Routes, Route, useLocation } from 'react-router-dom'

const homePageLookUp = {
  pi: '/pi/grants/dashboard',
  dean: '/dean/deashboard',
  depDean: '/dean/deashboard',
  coResearcher: '/pi/grants/dashboard',
}

const ProtectedRoute = ({
  unloggedOnly,
  allowedStatuses,
  user,
  element: Element,
  ...rest
}) => {
  const [permit, setPermit] = useState(null)
  const [redirect, setRedirect] = useState('/')
  const { pathname: path } = useLocation()

  const handleAccessDenial = (authState = 'unlogged') => {
    setRedirect(
      authState === 'unlogged' ? '/login' : homePageLookUp[user.status]
    )
    setPermit(false)
  }

  const handleUnloggedOnly = () => {
    const logged = Boolean(user) && user.hasOwnProperty('status')
    if (logged) {
      handleAccessDenial('logged')
      return
    }
    setPermit(true)
  }

  const isValidPerson = () => {
    return Boolean(allowedStatuses.find((status) => status === user.status))
  }

  const handleLoggedOnly = () => {
    !Boolean(user) ? handleAccessDenial() : setPermit(isValidPerson())
  }

  useEffect(() => {
    if (path !== rest.path) return
    unloggedOnly ? handleUnloggedOnly() : handleLoggedOnly()
  }, [unloggedOnly, user, allowedStatuses, path, rest.path])

  return (
    <Routes>
      <Route
        {...rest}
        element={
          permit === null ? (
            <Spinner color='secondary' />
          ) : permit === false ? (
            <Navigate to={redirect} />
          ) : (
            Element
          )
        }
      />
    </Routes>
  )
}

ProtectedRoute.defaultProps = {
  unloggedOnly: false,
  allowedStatuses: [],
}

export default ProtectedRoute
