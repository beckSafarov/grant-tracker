import { useTheme } from '@emotion/react'
import Box from '@mui/system/Box'
import React from 'react'

const Navbar = ({ children, ...rest }) => {
  const theme = useTheme()
  return (
    <Box
      position='sticky'
      backgroundColor={theme.page.grey}
      py='20px'
      px='40px'
      top='0'
      right='0'
      left='0'
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      zIndex='100'
      {...rest}
    >
      {children}
    </Box>
  )
}

export default Navbar
