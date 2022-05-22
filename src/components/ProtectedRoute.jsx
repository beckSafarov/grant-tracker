import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { Routes, Route, useLocation } from 'react-router-dom'
import { areEqualUrls } from '../helpers'
import { defaultHomePages } from '../config'

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
  const getHomeRoute = () => {
    return defaultHomePages[user.status]
  }

  const sendBackHome = useCallback(() => {
    if (user.status) {
      setRedirect(getHomeRoute())
      setPermit(false)
    }
  }, [user])

  const handleUnloggedOnly = () => {
    const logged = Boolean(user && user.status)
    logged ? sendBackHome() : setPermit(true)
  }

  const handleAccessDenial = () => {
    setRedirect('/login')
    setPermit(false)
  }

  const isValidPerson = () => {
    if (!allowedStatuses) return true
    return Boolean(allowedStatuses.find((status) => status === user.status))
  }

  const handleLoggedOnly = () =>
    !Boolean(user) ? handleAccessDenial() : setPermit(isValidPerson())

  useEffect(() => {
    if (!areEqualUrls(path, rest.path)) return
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
}

export default ProtectedRoute
