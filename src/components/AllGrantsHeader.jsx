import { useCallback } from 'react'
import { Button, Stack } from '@mui/material'
import { logout } from '../firebase/auth'
import Navbar from './Navbar'
import Logo from './Logo'

const AllGrantsHeader = ({ title, titleLink }) => {
  const handleLogout = useCallback(async () => {
    const msg = 'Are you sure to logout?'
    if (window.confirm(msg)) {
      await logout()
      window.location.reload()
    }
  }, [])

  return (
    <Navbar>
      <Logo label={title} fontSize='1.2rem' link={titleLink} />
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
