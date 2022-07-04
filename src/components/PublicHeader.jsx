import { Box } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import Logo from './Logo'

const PublicHeader = ({ logoColor }) => {
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
      <Box ml='50px'>
        <Logo color={logoColor} />
      </Box>
      {/* buttons at the right */}
      {path === '/' && (
        <Box mr='50px'>
          <Button sx={{ m: 1 }} color={'info'} size='large' variant='outlined'>
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

PublicHeader.defaultProps = {
  loading: false,
}

export default PublicHeader
