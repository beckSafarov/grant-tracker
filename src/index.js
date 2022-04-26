import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { UserProvider } from './context/UserContext'
import ContextProviders from './context/ContextProviders'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ContextProviders>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ContextProviders>
  </React.StrictMode>
)
