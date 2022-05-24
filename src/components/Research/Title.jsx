import Typography from '@mui/material/Typography'
import React from 'react'

const Title = ({ children, color, fontSize }) => {
  const size = fontSize || '2rem'
  return (
    <Typography color={color} fontSize={size} fontWeight='600'>
      {children}
    </Typography>
  )
}

export default Title
