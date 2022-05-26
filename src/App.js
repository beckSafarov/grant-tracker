import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'
import LoginScreen from './screens/LoginScreen'
import DeanLayoutScreen from './screens/DeanLayoutScreen'
import ProtectedRoute from './components/ProtectedRoute'
import AllGrantsScreen from './screens/PI/AllGrantsScreen'
import NewGrantFormsScreen from './screens/PI/NewGrantFormsScreen'
import Spinner from './components/Spinner'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserContext } from './hooks/ContextHooks'
import { isEmptyObj } from './helpers'
import TestScreen from './screens/TestScreen'
import ResearchLayoutScreen from './screens/PI/ResearchLayoutScreen'
import TokenEnterScreen from './screens/TokenEnterScreen'
const auth = getAuth()

const getDeanRoutes = () => {
  return [
    'dashboard',
    'researchers',
    'pastResearches',
    'publications',
    'user/:id',
  ].map((page) => ({
    path: `/dean/${page}`,
    element: <DeanLayoutScreen />,
    allowedStatuses: ['dean', 'depDean'],
  }))
}
const getResearchRoutes = () => {
  return ['dashboard', 'milestones', 'expenses', 'publications'].map(
    (page) => ({
      path: `/research/:id/${page}`,
      element: <ResearchLayoutScreen />,
    })
  )
}

const routes = [
  { path: '/', element: <LandingScreen />, unloggedOnly: true },
  { path: '/signup', element: <SignUpScreen />, unloggedOnly: true },
  { path: '/login', element: <LoginScreen />, unloggedOnly: true },
  { path: '/confirmToken', element: <TokenEnterScreen />, unloggedOnly: true },
  {
    path: '/grants/all',
    element: <AllGrantsScreen />,
  },
  {
    path: '/grants/new',
    element: <NewGrantFormsScreen />,
  },
  ...getDeanRoutes(),
  ...getResearchRoutes(),
]

function App() {
  const [user, setUser] = useState({})
  const { user: userFromContext, error, getCurrUserById } = useUserContext()
  const loading = isEmptyObj(user) && !error

  const handleSetUser = () => setUser(userFromContext)
  const handleAuthStateChange = async (authData) => {
    authData ? await getCurrUserById(authData.uid) : setUser(null)
  }
  const handleUserDataRetrieval = async () => {
    if (auth?.currentUser) {
      await getCurrUserById(auth.currentUser.uid)
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
