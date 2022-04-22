import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { Routes, Route, useLocation } from 'react-router-dom'

const homePageLookUp = {
  pi: '/pi/grants/allGrants',
  dean: '/dean/dashboard',
  depDean: '/dean/dashboard',
  coResearcher: '/pi/grants/allGrants',
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

  const sendBackHome = () => {
    const homePage = homePageLookUp[user.status]
    setRedirect(homePage)
    setPermit(false)
  }

  const handleUnloggedOnly = () => {
    const logged = Boolean(user) && user.hasOwnProperty('status')
    if (logged) {
      sendBackHome()
      return
    }
    setPermit(true)
  }

  const handleAccessDenial = () => {
    setRedirect('/login')
    setPermit(false)
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
