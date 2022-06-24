import { useCallback } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useUserContext } from '../hooks/ContextHooks'
import { logout } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const AllGrantsHeader = ({ title, titleLink }) => {
  const { user } = useUserContext()
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
    <Navbar>
      <Typography
        fontWeight='600'
        fontSize='1.2rem'
        onClick={handleTitleClick}
        sx={{ cursor: titleLink && 'pointer' }}
      >
        {title}
      </Typography>
      <Stack spacing={2} direction='row' fontSize='1.2rem' color='#9E9E9E'>
        <Button
          type='button'
          onClick={handleLogout}
          variant='outlined'
          color={'error'}
        >
          Logout
        </Button>
      </Stack>
    </Navbar>
  )
}

AllGrantsHeader.defaultProps = {
  title: 'Dashboard',
}
export default AllGrantsHeader
