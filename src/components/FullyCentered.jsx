import { Box } from '@mui/system'

const FullyCentered = ({ children }) => {
  return (
    <Box
      sx={{ transform: 'translate(-50%, -50%)' }}
      position='absolute'
      top='40%'
      left='50%'
      textAlign='center'
    >
      {children}
    </Box>
  )
}

export default FullyCentered
