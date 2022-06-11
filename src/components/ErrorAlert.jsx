import { Alert, Box } from '@mui/material'
import { useEffect, useState } from 'react'

const ErrorAlert = ({ error, hidden, onError, ...rest }) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (error && !hidden) {
      console.error(error)
      setMessage(error.toString())
      onError()
    }
  }, [error])

  return (
    <>
      {message && (
        <Box {...rest}>
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
  rest: { sx: { my: 2 } },
}

export default ErrorAlert
