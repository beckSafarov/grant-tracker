import { Box } from '@mui/system'
import React from 'react'
import PublicHeader from '../components/PublicHeader'

const SignUpScreen = () => {
  return (
    <>
      <PublicHeader />
      <Box
        mt='150px'
        width='100%'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <h1>Welcome to Signup!</h1>
      </Box>
    </>
  )
}

export default SignUpScreen
