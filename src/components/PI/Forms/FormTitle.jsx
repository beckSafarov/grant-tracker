import React from 'react'
import Typography from '@mui/material/Typography'

const FormTitle = ({ children }) => {
  return (
    <Typography sx={{ textAlign: 'center' }} fontSize='1rem' fontWeight='500'>
      {children}
    </Typography>
  )
}

export default FormTitle
