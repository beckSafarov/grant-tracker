import { CircularProgress } from '@mui/material'
import React from 'react'
import FullyCentered from './FullyCentered'

const Spinner = ({ hidden, ...rest }) => {
  return hidden ? (
    <></>
  ) : (
    <FullyCentered>
      <CircularProgress {...rest} sx={{ zIndex: '100' }} />
    </FullyCentered>
  )
}

Spinner.defaultProps = {
  hidden: false,
}

export default Spinner
