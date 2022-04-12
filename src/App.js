import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import SignUpScreen from './screens/SignUpScreen'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingScreen />} exact />
        <Route path='/signup' element={<SignUpScreen />} exact />
      </Routes>
    </Router>
  )
}

export default App
