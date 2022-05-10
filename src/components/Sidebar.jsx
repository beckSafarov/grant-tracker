import React from 'react'
import { Box } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import SVGAvatar from './SVGAvatar'
import { useTheme } from '@emotion/react'

const Sidebar = ({ links, user, width, children }) => {
  const { pathname: path } = useLocation()
  const { components } = useTheme()
  const { sidebar: sb, avatar } = components
  return (
    <Box
      width={width}
      height='100%'
      position='fixed'
      top='0'
      left='0'
      backgroundColor={sb.bg}
      color={sb.text}
      p='20px'
    >
      {/* profile section*/}
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        // backgroundColor={sb.lighten}
      >
        <SVGAvatar
          fullName={user.name}
          width={50}
          bg={avatar.bg}
          color={avatar.text}
        />
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
              backgroundColor={path === link.path ? sb.active.div : 'inherit'}
              color={path === link.path ? sb.active.text : 'inherit'}
            >
              {link.icon}
              <p>{link.label}</p>
            </Stack>
          </Link>
        ))}
      </Box>
      {children}
    </Box>
  )
}

Sidebar.defaultProps = {
  links: [],
  user: {},
  width: '240px',
  children: <></>,
}

export default Sidebar
