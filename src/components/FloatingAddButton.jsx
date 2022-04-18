import React from 'react'
import Fab from '@mui/material/Fab'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/system/Box'

const FloatingAddButton = ({ onClick }) => {
  return (
    <Box position='absolute' right='30px' bottom='30px'>
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
  )
}
FloatingAddButton.defaultProps = {
  onClick: () => void 0,
}
export default FloatingAddButton
