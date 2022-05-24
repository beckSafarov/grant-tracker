import { Stack, Typography } from '@mui/material'
import React from 'react'
import Title from './Title'

const CountDownTitle = ({ months, days, color }) => {
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Title color={color} fontSize='1.8rem'>
        {months}
      </Title>
      <p style={{ color, fontWeight: '500' }}>month(s)</p>
      <Title color={color} fontSize='1.8rem'>
        {days}
      </Title>
      <p style={{ color, fontWeight: '500' }}>day(s)</p>
    </Stack>
  )
}
CountDownTitle.defaultProps = {
  color: '#fff',
  months: 0,
  days: 0,
}
export default CountDownTitle
