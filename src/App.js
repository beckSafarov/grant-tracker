import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'
import LoginScreen from './screens/LoginScreen'

const routes = [
  { path: '/', element: <LandingScreen />, exact: true },
  { path: '/signup', element: <SignUpScreen /> },
  { path: '/login', element: <LoginScreen /> },
]

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, i) => (
          <Route
            path={route.path}
            key={i}
            element={route.element}
            exact={route.exact}
          />
        ))}
      </Routes>
    </Router>
  )
}

export default App
