import { Button } from '@mui/material'
import React from 'react'

const SubmitButton = ({ label }) => {
  return (
    <Button type='submit' variant='contained' sx={{ mt: 3, width: '100%' }}>
      {label}
    </Button>
  )
}

SubmitButton.defaultProps = {
  label: 'Submit',
}

export default SubmitButton
