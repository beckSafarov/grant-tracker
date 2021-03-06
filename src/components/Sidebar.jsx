import React, { useState } from 'react'
import { Box } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import { Divider, Stack, Typography } from '@mui/material'
import SVGAvatar from './SVGAvatar'
import { useTheme } from '@emotion/react'
import AccountModal from './Modals/AccountModal'

const LinkStack = ({ link, sb }) => {
  const { pathname: path } = useLocation()
  return (
    <Stack
      direction='row'
      spacing={2}
      alignItems='center'
      py='10px'
      pl='5px'
      borderRadius='5px'
      backgroundColor={path === link.path ? sb.active.div : 'inherit'}
      color={path === link.path ? sb.active.text : 'inherit'}
      sx={{ cursor: 'pointer', display: link.hidden ? 'none' : '' }}
      onClick={() => link.onClick && link.onClick()}
    >
      {link.icon}
      <p>{link.label}</p>
    </Stack>
  )
}

const Sidebar = ({ links, user, width, children }) => {
  const [modalClicked, setModalClicked] = useState(false)
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
        className='lightenOnHover'
        id='account-stack'
        direction='row'
        spacing={2}
        alignItems='center'
        sx={{ cursor: 'pointer', padding: '5px', borderRadius: '5px' }}
        onClick={() => setModalClicked(true)}
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

      <AccountModal
        open={modalClicked}
        onClose={() => setModalClicked(false)}
      />

      {/* page links */}
      <Box mt='40px'>
        {links
          .filter((link) => link.path)
          .map((link, i) => (
            <Link key={i} to={link.path}>
              <LinkStack link={link} sb={sb} />
            </Link>
          ))}
        <Divider sx={{ borderColor: sb.lighten }} />
        {links
          .filter((link) => link.onClick)
          .map((link, i) => (
            <LinkStack key={i} link={link} sb={sb} />
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
