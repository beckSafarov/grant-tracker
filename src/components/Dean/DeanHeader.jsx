import { useCallback } from 'react'
import { Stack, Typography } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useUserContext } from '../../hooks/ContextHooks'
import { logout } from '../../firebase/auth'
import Navbar from '../Navbar'

const DeanHeader = ({ title }) => {
  const { user } = useUserContext()

  const handleLogout = useCallback(async () => {
    const msg = 'Are you sure to logout?'
    if (window.confirm(msg)) {
      await logout()
      window.location.reload()
    }
  }, [])

  return (
    <Navbar border={'1px solid #ccc'} py={'10px'}>
      <Typography fontSize='1.2rem'>
        <strong>{title}</strong>
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
    </Navbar>
  )
}

DeanHeader.defaultProps = {
  title: 'Dashboard',
}
export default DeanHeader
