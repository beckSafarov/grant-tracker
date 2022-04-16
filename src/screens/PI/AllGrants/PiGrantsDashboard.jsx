import React from 'react'
import PublicHeader from '../../../components/PublicHeader'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { getUserAuth, logout } from '../../../firebase/auth'
import { useUserContext } from '../../../hooks/ContextHooks'

const PiGrantsDashboard = () => {
  const navigate = useNavigate()
  const { logoutFromContext } = useUserContext()

  const handleLogout = async () => {
    await logout()
    logoutFromContext()
    navigate('/')
  }

  return (
    <>
      <PublicHeader />
      <Box mt='100px'>
        <h1>Welcome to PI Grants Dashboard</h1>
        <Button type='button' onClick={handleLogout}>
          Logout
        </Button>
        <Button type='button' onClick={() => console.log(getUserAuth())}>
          Get Curr User
        </Button>
      </Box>
    </>
  )
}

export default PiGrantsDashboard
