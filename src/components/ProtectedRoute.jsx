import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { Routes, Route, useLocation } from 'react-router-dom'
import { areEqualUrls } from '../helpers'

const homePageLookUp = {
  pi: '/pi/grants/all',
  dean: '/dean/dashboard',
  depDean: '/dean/dashboard',
  coResearcher: '/pi/grants/all',
  regular: '/pi/grants/all',
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
    const logged = Boolean(user && user.status)
    logged ? sendBackHome() : setPermit(true)
  }

  const handleAccessDenial = () => {
    setRedirect('/login')
    setPermit(false)
  }

  const isValidPerson = () =>
    Boolean(allowedStatuses.find((status) => status === user.status))

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
  allowedStatuses: ['pi', 'coResearcher', 'dean', 'depDean'],
}

export default ProtectedRoute
