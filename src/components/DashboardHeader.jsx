import { useCallback } from 'react'
import Box from '@mui/system/Box'
import { Stack, Typography, useTheme } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useUserContext } from '../hooks/ContextHooks'
import { logout } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'

const DashboardHeader = ({ title, titleLink }) => {
  const { user } = useUserContext()
  const theme = useTheme()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    const msg = 'Are you sure to logout?'
    if (window.confirm(msg)) {
      await logout()
      window.location.reload()
    }
  }, [])

  const handleTitleClick = useCallback(() => {
    return titleLink && navigate(titleLink)
  }, [titleLink])

  return (
    <Box
      position='sticky'
      backgroundColor={theme.page.grey}
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
      <Typography
        fontWeight='600'
        fontSize='1.2rem'
        onClick={handleTitleClick}
        sx={{ cursor: titleLink && 'pointer' }}
      >
        {title}
      </Typography>
      <Stack spacing={2} direction='row' fontSize='1.2rem' color='#9E9E9E'>
        <button
          type='button'
          onClick={() => navigate('/pi/research/10/dashboard')}
        >
          PI research
        </button>
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

DashboardHeader.defaultProps = {
  title: 'Dashboard',
}
export default DashboardHeader
