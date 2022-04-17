import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../hooks/ContextHooks'
import { Stack } from '@mui/material'
import StatCard from '../StatCard'

/**
 * TO-DO
 * ✅ Stat cards
 *  ✅ Stat card
 *  ✅ Row from those cards
 * [] research projects list
 */

const cards = [
  { label: 'Overall Allocated', data: '1,534,000', date: 'April, 26' },
  { label: 'Overall Spent by Now', data: '639,941.4', date: 'April, 26' },
  { label: 'Number of Researches', data: '8', date: 'April, 26' },
]

const Dashboard = () => {
  // const navigate = useNavigate()
  // const { logoutFromContext, user } = useUserContext()

  return (
    <>
      <Stack justifyContent='space-between' px='40px' direction='row' mt='30px'>
        {cards.map((card, i) => (
          <StatCard key={i} card={card} />
        ))}
      </Stack>
    </>
  )
}

export default Dashboard
