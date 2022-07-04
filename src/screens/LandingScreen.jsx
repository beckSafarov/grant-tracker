import { Box, Stack, Typography } from '@mui/material'
import PublicHeader from '../components/PublicHeader'

const LandingScreen = () => {
  return (
    <div className='landingBackground'>
      <PublicHeader logoColor='#fff' />
      <Box
        position='absolute'
        sx={{
          transform: 'translate(-10%, -50%)',
          top: '40%',
          left: '10%',
        }}
      >
        <Stack spacing={2}>
          <Typography
            fontSize='4rem'
            fontWeight='800'
            sx={{ letterSpacing: '10px', color: '#fff' }}
          >
            Welcome to Gtrack
          </Typography>
          <Typography
            fontSize='2rem'
            fontWeight='500'
            sx={{ color: '#fff', letterSpacing: '5px' }}
          >
            Hub for managing and tracking your research
          </Typography>
        </Stack>
      </Box>
    </div>
  )
}

export default LandingScreen
