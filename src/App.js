import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'
import LoginScreen from './screens/LoginScreen'
import DeanDashboard from './screens/DeanDashboard'

const routes = [
  { path: '/', element: <LandingScreen /> },
  { path: '/signup', element: <SignUpScreen /> },
  { path: '/login', element: <LoginScreen /> },
  { path: '/dean/dashboard', element: <DeanDashboard /> },
]

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, i) => (
          <Route path={route.path} key={i} element={route.element} />
        ))}
      </Routes>
    </Router>
  )
}

export default App
