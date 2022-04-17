import React from 'react'
import { Box } from '@mui/system'

const SVGAvatar = ({ mode, fullName, width, bg, color }) => {
  const nameSplit = fullName.trim().split(' ')
  const firstLetter = fullName.charAt(0).toUpperCase()
  const lastLetter =
    nameSplit.length > 1 ? nameSplit.pop().charAt(0).toUpperCase() : ''

  const center = width / 2
  const radius = width / 2
  const fontSize = width / 2 + 'px'
  return (
    <Box h={width + 'px'} w={width + 'px'} position='relative'>
      <Box position='absolute' sx={{ zIndex: 0 }}>
        <svg height={width} width={width}>
          <circle cx={center} cy={center} r={radius} fill={bg} />
        </svg>
      </Box>
      <Box
        position='relative'
        sx={{ zIndex: 10 }}
        textAlign='center'
        width={width + 'px'}
        height={width + 'px'}
        display='flex'
        justifyContent='center'
        alignItems='center'
        fontSize={fontSize}
        color={color}
      >
        {firstLetter + lastLetter}
      </Box>
    </Box>
  )
}

SVGAvatar.defaultProps = {
  mode: 'light',
  fullName: 'User',
  width: 80,
  bg: '#80ccff',
  color: '#000',
}

export default SVGAvatar
