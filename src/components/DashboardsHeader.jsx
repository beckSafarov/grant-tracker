import { Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { capitalize } from 'lodash'
import { useLocation } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { useGrantContext } from '../hooks/ContextHooks'
import DashboardOptionsDropdown from './DashboardOptionsDropdown'

const DashboardsHeader = ({ title, grants, isAdmin }) => {
  const { pathname: path } = useLocation()
  const { grant } = useGrantContext()
  const [currGrant, setCurrGrant] = useState('')

  useEffect(() => {
    setCurrGrant(path.match(/dean/) ? '' : grant)
  }, [path])

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <Navbar border={'1px solid #ccc'} py={'10px'}>
      <Stack spacing={2} direction='row' alignItems='center'>
        <Typography fontSize='1.2rem'>
          <strong>{capitalize(title)}</strong>
        </Typography>
      </Stack>
      <button onClick={handleLogout}>Logout</button>
      <DashboardOptionsDropdown
        grants={grants}
        isAdmin={isAdmin}
        currGrant={currGrant}
      />
    </Navbar>
  )
}
DashboardsHeader.defaultProps = {
  title: 'Dashboard',
  isAdmin: false,
}

export default DashboardsHeader