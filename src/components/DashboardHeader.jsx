import React from 'react'
import Box from '@mui/system/Box'
import { Stack, Typography } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useUserContext } from '../hooks/ContextHooks'
import { logout } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'

const DashboardHeader = () => {
  const { logoutFromContext, user } = useUserContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (window.confirm('Are you sure to logout?')) {
      await logout()
      logoutFromContext()
      navigate('/')
    }
  }

  return (
    <Box
      position='sticky'
      backgroundColor={'#F7F9FC'}
      py='20px'
      px='40px'
      top='0'
      right='0'
      left='0'
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      // sx={{ boxShadow: '0 4px 10px -1px rgba(0, 0, 0, 0.2)' }}
    >
      <Typography fontWeight='600' fontSize='1.2rem'>
        Dashboard
      </Typography>
      <Stack spacing={2} direction='row' fontSize='1.2rem' color='#9E9E9E'>
        <button type='button' onClick={handleLogout}>
          Logout
        </button>
        <button type='button' onClick={() => console.log(user)}>
          Get Curr user
        </button>
        <NotificationsNoneIcon />
        <MoreVertIcon />
      </Stack>
    </Box>
  )
}

export default DashboardHeader
