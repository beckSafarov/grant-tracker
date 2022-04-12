import { Box } from '@mui/system'
import PublicHeader from '../components/PublicHeader'

const LandingScreen = () => {
  return (
    <>
      <PublicHeader />
      <Box
        sx={{ transform: 'translate(-50%, -50%)' }}
        position='absolute'
        top='40%'
        left='50%'
        textAlign='center'
      >
        <h1>Welcome to Grant Tracker</h1>
      </Box>
    </>
  )
}

export default LandingScreen
