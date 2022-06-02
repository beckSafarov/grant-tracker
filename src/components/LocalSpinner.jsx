import { CircularProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import FullyCentered from './FullyCentered'

const LocalSpinner = ({ hidden, ...rest }) => {
  return (
    <>
      {!hidden && (
        <Stack
          justifyContent='center'
          alignItems='center'
          sx={{ width: '100%', height: '100%' }}
        >
          <CircularProgress {...rest} sx={{ zIndex: '100' }} />
        </Stack>
      )}
    </>
  )
}

LocalSpinner.defaultProps = {
  hidden: false,
}

export default LocalSpinner
