import React from 'react'
import { Paper, Stack } from '@mui/material'
import StatCard from '../StatCard'
import StickyHeadTable from '../StickyHeadTable'
import Box from '@mui/system/Box'

const cards = [
  { label: 'Overall Allocated', data: '1,534,000', date: 'April, 26' },
  { label: 'Overall Spent by Now', data: '639,941.4', date: 'April, 26' },
  { label: 'Number of Researches', data: '8', date: 'April, 26' },
]

const researchesTable = {
  columns: [
    { field: 'title', label: 'Research Titles', minWidth: 200 },
    { field: 'grant', label: 'Grant', minWidth: 200 },
    { field: 'allocated', label: 'Allocated (RM)', minWidth: 180 },
    { field: 'spent', label: 'Spent (RM)', minWidth: 180 },
    { field: 'endDate', label: 'Expected End Date', minWidth: 180 },
  ],
  rows: [
    {
      title: 'Lie Detecting Using AI',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Sign language translation system for machine learning purposes',
      grant: 'Short term',
      allocated: '42,000',
      spent: '7,800',
      endDate: 'March 1, 2024',
    },
    {
      title: 'DriveThru: Smart drive through...',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Farmtab: Precision Agriculture...',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Senior Citizen Chatbot ',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Online Topic Detection System...',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Cross-domain sentinel classif...',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Automated Compliance Asses...',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'lorem ipsum...',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Pepsi mipsum',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
    {
      title: 'Yopale popale',
      grant: 'RU Team',
      allocated: '280,000',
      spent: '153,200',
      endDate: 'March 1, 2024',
    },
  ],
}

const Dashboard = () => {
  return (
    <Box px='40px'>
      <Stack justifyContent='space-between' direction='row' mt='30px'>
        {cards.map((card, i) => (
          <StatCard key={i} card={card} />
        ))}
      </Stack>
      <Paper
        elevation={1}
        sx={{ mt: '40px', width: '100%', overflow: 'hidden' }}
      >
        <StickyHeadTable
          columns={researchesTable.columns}
          rows={researchesTable.rows}
        />
      </Paper>
    </Box>
  )
}

export default Dashboard
