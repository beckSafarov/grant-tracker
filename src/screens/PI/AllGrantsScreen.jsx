import { useEffect } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import DashboardHeader from '../../components/DashboardHeader'
import FullyCentered from '../../components/FullyCentered'
import FloatingAddButton from '../../components/FloatingAddButton'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../hooks/ContextHooks'

const PiAllGrants = () => {
  const { user } = useUserContext()
  const grants = user?.grants ? [...user.grants] : []
  const navigate = useNavigate()

  useEffect(() => {
    if (grants.length > 0) {
      navigate(`/research/${grants.pop().id}/dashboard`)
    }
  }, [grants])

  return (
    <Box height='100vh'>
      <DashboardHeader title='All Grants' />
      <Divider sx={{ color: '#F7F9FC' }} />
      <Box px={'40px'} mt='50px'>
        <FullyCentered>
          <Typography fontSize='2rem' color='gray'>
            No Grants Yet
          </Typography>
        </FullyCentered>
        <FloatingAddButton onClick={() => navigate('/grants/new')} />
      </Box>
    </Box>
  )
}

export default PiAllGrants
