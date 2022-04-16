import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'
import LoginScreen from './screens/LoginScreen'
import DeanDashboard from './screens/DeanDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import PiGrantsDashboard from './screens/PI/AllGrants/PiGrantsDashboard'
import Spinner from './components/Spinner'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserContext } from './hooks/ContextHooks'
import { isEmptyObj } from './helpers'
const auth = getAuth()

const routes = [
  { path: '/', element: <LandingScreen />, unloggedOnly: true },
  { path: '/signup', element: <SignUpScreen />, unloggedOnly: true },
  { path: '/login', element: <LoginScreen />, unloggedOnly: true },
  {
    path: '/dean/dashboard',
    element: <DeanDashboard />,
    allowedStatuses: ['dean', 'depDean'],
  },
  {
    path: '/pi/grants/dashboard',
    element: <PiGrantsDashboard />,
    allowedStatuses: ['pi', 'coResearcher'],
  },
]

function App() {
  const [user, setUser] = useState({})

  const { user: userFromContext, error, getUserData } = useUserContext()

  const loading = isEmptyObj(user) && !error

  const handleSetUser = () => setUser(userFromContext)

  const handleAuthStateChange = async (authData) => {
    authData ? await getUserData(authData.uid) : setUser(null)
  }

  const handleUserDataRetrieval = async () => {
    if (auth?.currentUser) {
      await getUserData(auth.currentUser.uid)
      return
    }
    onAuthStateChanged(auth, handleAuthStateChange)
  }

  useEffect(() => {
    userFromContext ? handleSetUser() : handleUserDataRetrieval()

    if (error) console.error(error)
  }, [auth, user, userFromContext, error])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Router>
          {routes.map((route, i) => (
            <ProtectedRoute
              key={i}
              path={route.path}
              element={route.element}
              unloggedOnly={route.unloggedOnly}
              allowedStatuses={route.allowedStatuses}
              user={user}
            />
          ))}
        </Router>
      )}
    </>
  )
}

export default App