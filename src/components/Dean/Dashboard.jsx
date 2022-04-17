import React from 'react'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../firebase/auth'
import { useUserContext } from '../../hooks/ContextHooks'

const Dashboard = () => {
  const navigate = useNavigate()
  const { logoutFromContext, user } = useUserContext()

  const handleLogout = async () => {
    await logout()
    logoutFromContext()
    navigate('/')
  }

  return (
    <Box ml='240px' mt='100px'>
      <h1>Welcome to Dean HomeScreen</h1>
      <Button type='button' onClick={handleLogout}>
        Logout
      </Button>
      <Button type='button' onClick={() => console.log(user)}>
        Get Curr User
      </Button>
    </Box>
  )
}

export default Dashboard
