import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ link, width, label, fontSize }) => {
  const root = window?.location?.origin
  return (
    <Link to={link}>
      <Stack
        direction='row'
        justifyContent='center'
        spacing={1}
        alignItems='center'
      >
        <img width={width} src={`${root}/logo.png`} alt='Logo' />
        <Typography variant='span' fontSize={fontSize} fontWeight='600'>
          {label}
        </Typography>
      </Stack>
    </Link>
  )
}

Logo.defaultProps = {
  link: '/',
  width: 40,
  label: 'GTrack',
  fontSize: '2rem',
}

export default Logo
