import React from 'react'
import { Stack, useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import DashboardHeader from '../../components/DashboardHeader'
import FullyCentered from '../../components/FullyCentered'
import FloatingAddButton from '../../components/FloatingAddButton'
import GrantDataCard from '../../components/GrantDataCard'
import { useNavigate } from 'react-router-dom'

const PiAllGrants = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const grants = [
    {
      title: 'Grant 1',
      grantType: 'RU Team',
      date: 'April 26, 2022 - ...',
    },
    {
      title: 'Grant 2',
      grantType: 'RU Trans One',
      date: 'March 26, 2021 - March 26, 2024',
    },
    {
      title: 'Grant 3',
      grantType: 'Short term',
      date: 'March 26, 2021 - March 26, 2024',
    },
  ]
  return (
    <Box height='100vh'>
      <DashboardHeader title='All Grants' />
      <Divider sx={{ color: '#F7F9FC' }} />

      <Box px={'40px'} mt='50px'>
        {grants.length === 0 ? (
          <FullyCentered>
            <Typography fontSize='2rem' color='gray'>
              No Grants Yet
            </Typography>
          </FullyCentered>
        ) : (
          <Stack direction='row' spacing={2}>
            {grants.map((grant, i) => (
              <GrantDataCard key={i} card={grant} />
            ))}
          </Stack>
        )}
        <FloatingAddButton onClick={() => navigate('/pi/grants/new')} />
      </Box>
    </Box>
  )
}

export default PiAllGrants
