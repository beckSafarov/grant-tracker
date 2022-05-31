import { Box } from '@mui/material'
import React from 'react'

const ResearchCard = ({ bg, title, subTitle }) => {
  return (
    <Box
      width='300px'
      borderRadius='5px'
      backgroundColor={bg}
      sx={{ boxSizing: 'border-box', py: '5px', px: '20px' }}
    >
      {title}
      {subTitle}
    </Box>
  )
}
ResearchCard.defaultProps = {
  bg: 'white',
  title: '',
  subTitle: '',
}
export default ResearchCard
