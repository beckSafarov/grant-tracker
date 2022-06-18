import { Box } from '@mui/system'
import React from 'react'
import ErrorAlert from './ErrorAlert'
import PublicHeader from './PublicHeader'
import Spinner from './Spinner'

const AuthFormsBase = ({ title, loading, alert, children }) => {
  return (
    <>
      <PublicHeader />
      <Spinner hidden={!loading} />
      <Box
        fullWidth
        height='100%'
        pt='100px'
        display='flex'
        justifyContent='center'
      >
        <Box
          display='flex'
          flexDirection={'column'}
          width='450px'
          background='blue'
          textAlign='center'
        >
          <h1>{title}</h1>
          <ErrorAlert error={alert} />
          {children}
        </Box>
      </Box>
    </>
  )
}

AuthFormsBase.defaultProps = {
  loading: false,
  alert: null,
  title: '',
}

export default AuthFormsBase
