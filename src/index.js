import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
)
