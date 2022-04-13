import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'

const PublicHeader = () => {
  const { pathname: path } = useLocation()
  return (
    <Box
      position='absolute'
      top='0'
      left='0'
      right='0'
      ml='0'
      height='40px'
      width='100%'
      display='flex'
      py='20px'
      justifyContent='space-between'
    >
      {/* logo stuff at the left */}
      <Box ml='20px'>
        <Link to='/'>
          <Typography variant='span' fontSize='2rem' fontWeight='600'>
            GTrack
          </Typography>
        </Link>
      </Box>
      {/* buttons at the right */}
      {path === '/' && (
        <Box mr='20px'>
          <Button sx={{ m: 1 }} size='large'>
            <Link to='/login'>Log in</Link>
          </Button>
          <Button sx={{ m: 1 }} variant='contained' size='large'>
            <Link to='/signup'>Sign up</Link>
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PublicHeader
