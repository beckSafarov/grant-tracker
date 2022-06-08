import Box from '@mui/system/Box'
import React from 'react'

const ResearchScreenContainer = ({ children, sx }) => {
  const defs = { px: '40px', pt: '30px' }
  return <Box sx={{ ...defs, ...sx }}>{children}</Box>
}

ResearchScreenContainer.defaultProps = {
  sx: {},
}

export default ResearchScreenContainer
