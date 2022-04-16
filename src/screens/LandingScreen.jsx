import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import FullyCentered from '../components/FullyCentered'
import PublicHeader from '../components/PublicHeader'

const LandingScreen = () => {
  return (
    <>
      <PublicHeader />
      <FullyCentered>
        <Typography variant='span' fontSize='3rem' fontWeight='600'>
          Welcome to Grant Tracker
        </Typography>
      </FullyCentered>
    </>
  )
}

export default LandingScreen
