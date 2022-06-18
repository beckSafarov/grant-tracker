import { Alert, Box } from '@mui/material'
import { useEffect, useState } from 'react'

const ErrorAlert = ({ error, hidden, onError, sx }) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(error ? error.toString() : '')
    if (error && !hidden) {
      console.error(error)
      onError()
    }
  }, [error])

  return (
    <>
      {message && (
        <Box {...sx}>
          <Alert severity='error'>{message}</Alert>
        </Box>
      )}
    </>
  )
}

ErrorAlert.defaultProps = {
  error: null,
  hidden: false,
  onError: () => void 0,
  sx: { mb: 2 },
}

export default ErrorAlert
