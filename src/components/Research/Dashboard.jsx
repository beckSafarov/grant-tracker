import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useGrantContext } from '../../hooks/ContextHooks'
import AlertBox from '../AlertBox'
import Spinner from '../Spinner'
import CountDownTitle from './CountDownTitle'
import ResearchCard from './ResearchCard'
import Title from './Title'

const Dashboard = () => {
  const { loading, error, grant } = useGrantContext()

  const cardColors = ['#7A0C2E', '#005249', '#04297A', '#7A4F01']
  const cards = [
    {
      bg: '#FFE7D9',
      title: <Title color={cardColors[0]}>RM 1,030.00</Title>,
      subTitle: <p style={{ color: cardColors[0] }}>Spent in this month</p>,
    },
    {
      bg: '#C8FACD',
      title: <Title color={cardColors[1]}>RM 40,970.00</Title>,
      subTitle: <p style={{ color: cardColors[1] }}>Left in the budget</p>,
    },
    {
      bg: '#D0F2FF',
      title: <Title color={cardColors[2]}>5.3%</Title>,
      subTitle: <p style={{ color: cardColors[2] }}>Activities Completed</p>,
    },
    {
      bg: '#FFF7CD',
      title: <CountDownTitle months='3' days='2' color={cardColors[3]} />,
      subTitle: <p style={{ color: cardColors[3] }}>Left for this milestone</p>,
    },
  ]
  return (
    <Box sx={{ px: '40px', pt: '10px' }}>
      <Spinner hidden={!loading} />
      <AlertBox my={2} hidden={!error}>
        {error?.toString() || ''}
      </AlertBox>

      {grant && (
        <>
          <Stack direction='row' spacing={2}>
            {cards.map((card, i) => (
              <ResearchCard key={i} {...card} />
            ))}
          </Stack>
          {/* <p>Grant type: {grant.type}</p>
          <p>Grant startDate: {stringifyDates(grant).startDate}</p> */}
        </>
      )}
    </Box>
  )
}

export default Dashboard
