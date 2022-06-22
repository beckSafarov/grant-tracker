import React from 'react'
import Fab from '@mui/material/Fab'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/system/Box'

const FloatingAddButton = ({ onClick, hidden }) => {
  return (
    <>
      {!hidden && (
        <Box position='fixed' sx={{ right: '30px', bottom: '30px' }}>
          <Fab
            size='large'
            color='primary'
            aria-label='add'
            sx={{ width: '70px', height: '70px' }}
            onClick={onClick}
          >
            <AddRoundedIcon sx={{ fontSize: '32px' }} />
          </Fab>
        </Box>
      )}
    </>
  )
}
FloatingAddButton.defaultProps = {
  onClick: () => void 0,
  hidden: false,
}
export default FloatingAddButton
