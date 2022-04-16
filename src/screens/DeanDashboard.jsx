import { Button } from '@mui/material'
import React from 'react'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader'
import { logout } from '../firebase/auth'
import { useUserContext } from '../hooks/ContextHooks'

const DeanDashboard = () => {
  const navigate = useNavigate()
  const { logoutFromContext, user } = useUserContext()

  const handleLogout = async () => {
    await logout()
    logoutFromContext()
    navigate('/')
  }
  return (
    <>
      <PublicHeader />
      <Box mt='100px'>
        <h1>Welcome to Dean HomeScreen</h1>
        <Button type='button' onClick={handleLogout}>
          Logout
        </Button>
        <Button type='button' onClick={() => console.log(user)}>
          Get Curr User
        </Button>
      </Box>
    </>
  )
}

export default DeanDashboard
