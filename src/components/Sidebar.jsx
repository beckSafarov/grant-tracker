import React from 'react'
import { Box } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import SVGAvatar from './SVGAvatar'

const Sidebar = ({ links, user, width }) => {
  const { pathname: path } = useLocation()
  return (
    <Box
      width={width}
      height='100%'
      position='fixed'
      top='0'
      left='0'
      backgroundColor='#233044'
      color='#eee'
      p='20px'
    >
      {/* profile section*/}
      <Stack direction='row' spacing={2} alignItems='center'>
        <SVGAvatar fullName={user.name} width={50} bg='#00AFB9' color='#fff' />
        <Typography fontWeight='500' fontSize='1.1rem'>
          {user.name}
        </Typography>
      </Stack>

      {/* page links */}
      <Box mt='40px'>
        {links.map((link, i) => (
          <Link to={link.path} key={i}>
            <Stack
              direction='row'
              spacing={2}
              alignItems='center'
              py='10px'
              pl='5px'
              borderRadius='5px'
              backgroundColor={path === link.path ? '#344865' : 'inherit'}
              color={path === link.path ? '#00cc66' : 'inherit'}
            >
              {link.icon}
              <p>{link.label}</p>
            </Stack>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

Sidebar.defaultProps = {
  links: [],
  user: {},
  width: '240px',
}

export default Sidebar
