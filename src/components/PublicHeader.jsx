import { LinearProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useUserContext } from '../hooks/ContextHooks'

const PublicHeader = ({ loading }) => {
  const { pathname: path } = useLocation()
  const { user } = useUserContext()

  const whoAmI = () => {
    return !user ? 'guest' : { name: user.name, status: user.status }
  }

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
        <Link to='/'>
          <Typography variant='span' fontSize='2rem' fontWeight='600'>
            GTrack
          </Typography>
        </Link>
      </Box>
      {/* buttons at the right */}
      {path === '/' && (
        <Box mr='50px'>
          <Button
            sx={{ m: 1 }}
            size='large'
            onClick={() => console.log(whoAmI())}
          >
            Who am I
          </Button>
          <Button sx={{ m: 1 }} size='large'>
            <Link to='/pi/grants/dashboard'>PI Dashboard</Link>
          </Button>
          <Button sx={{ m: 1 }} size='large'>
            <Link to='/dean/dashboard'>Dean Dashboard</Link>
          </Button>
          <Button sx={{ m: 1 }} size='large'>
            <Link to='/login'>Log in</Link>
          </Button>
          <Button sx={{ m: 1 }} variant='contained' size='large'>
            <Link to='/signup'>Sign up</Link>
          </Button>
        </Box>
      )}
      {loading && <LinearProgress />}
    </Box>
  )
}

PublicHeader.defaultProps = {
  loading: false,
}

export default PublicHeader
