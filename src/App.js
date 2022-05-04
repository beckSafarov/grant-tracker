import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'
import LoginScreen from './screens/LoginScreen'
import DeanScreen from './screens/DeanScreen'
import ProtectedRoute from './components/ProtectedRoute'
import PiAllGrants from './screens/PI/PiAllGrants'
import NewGrantFormsScreen from './screens/PI/NewGrantFormsScreen'
import Spinner from './components/Spinner'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserContext } from './hooks/ContextHooks'
import { isEmptyObj } from './helpers'
import TestScreen from './screens/TestScreen'
import ResearchBaseScreen from './screens/PI/ResearchBaseScreen'
import TokenEnterScreen from './screens/TokenEnterScreen'
const auth = getAuth()

const getDeanRoutes = () => {
  return ['dashboard', 'researchers', 'pastResearches'].map((page) => ({
    path: `/dean/${page}`,
    element: <DeanScreen />,
    allowedStatuses: ['dean', 'depDean'],
  }))
}
const getExpenseRoutes = () => {
  return ['dashboard', 'milestones', 'expenses', 'publications'].map(
    (page) => ({
      path: `/pi/research/:id/${page}`,
      element: <ResearchBaseScreen />,
      allowedStatuses: ['pi', 'coResearcher'],
    })
  )
}

const routes = [
  { path: '/', element: <LandingScreen />, unloggedOnly: true },
  { path: '/signup', element: <SignUpScreen />, unloggedOnly: true },
  { path: '/login', element: <LoginScreen />, unloggedOnly: true },
  { path: '/confirmToken', element: <TokenEnterScreen />, unloggedOnly: true },
  {
    path: '/pi/grants/all',
    element: <PiAllGrants />,
    allowedStatuses: ['pi', 'coResearcher'],
  },
  {
    path: '/pi/grants/new',
    element: <NewGrantFormsScreen />,
    allowedStatuses: ['pi', 'coResearcher'],
  },
  ...getDeanRoutes(),
  ...getExpenseRoutes(),
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
          <Routes>
            <Route path={'/test'} element={<TestScreen />} />
          </Routes>
        </Router>
      )}
    </>
  )
}

export default App
