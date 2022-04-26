import { Alert as MuiAlert, Box } from '@mui/material'

const Alert = ({ hidden, children, severity, ...rest }) => {
  return (
    <>
      {!hidden && (
        <Box {...rest}>
          <MuiAlert severity={severity}>{children}</MuiAlert>
        </Box>
      )}
    </>
  )
}

Alert.defaultProps = {
  hidden: false,
  severity: 'danger',
  rest: { my: 2 },
}

export default Alert
