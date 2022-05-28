import { Box } from '@mui/system'

const FullyCentered = ({ children, top, left, hidden }) => {
  return (
    <>
      {!hidden && (
        <Box
          sx={{ transform: 'translate(-50%, -50%)' }}
          position='absolute'
          top={top}
          left={left}
          textAlign='center'
        >
          {children}
        </Box>
      )}
    </>
  )
}

FullyCentered.defaultProps = {
  top: '40%',
  left: '50%',
  hidden: false,
}

export default FullyCentered
