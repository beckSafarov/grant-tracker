import { Alert, Box } from '@mui/material'

const AlertBox = ({ hidden, children, severity, ...rest }) => {
  return (
    <>
      {!hidden && (
        <Box {...rest}>
          <Alert severity={severity}>{children}</Alert>
        </Box>
      )}
    </>
  )
}

AlertBox.defaultProps = {
  hidden: false,
  severity: 'error',
  rest: { sx: { my: 2 } },
}

export default AlertBox
