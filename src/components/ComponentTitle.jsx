import { useTheme } from '@emotion/react'
import { Typography } from '@mui/material'
import React from 'react'

const ComponentTitle = ({ children, fontSize, color }) => {
  const { text } = useTheme()

  return (
    <Typography fontSize={fontSize} color={color || text.blue} fontWeight='500'>
      {children}
    </Typography>
  )
}

ComponentTitle.defaultProps = {
  fontSize: '1rem',
}

export default ComponentTitle
