import React from 'react'
import { useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useGrantContext } from '../../hooks/ContextHooks'
import { getTotalExpensesPerProp as getTotalExpenses } from '../../helpers/expenseHelpers'
import ComponentTitle from '../ComponentTitle'
import { Stack } from '@mui/material'

const VotBudgetChart = () => {
  const { grant } = useGrantContext()
  const expenses = grant?.expenses || []
  const allVots = grant?.votAllocations || {}
  const width = expenses.length > 0 ? 550 : 800

  const getData = useCallback(() => {
    if (!grant || !expenses) return []
    const votExpenses = getTotalExpenses(expenses, 'vot')
    return Object.keys(allVots).map((vot) => {
      const ceiling = allVots[vot]
      const spent = votExpenses[vot] || 0
      const left = ceiling - spent
      return { vot, spent, left }
    })
  }, [grant, expenses])

  return (
    <Stack spacing={2}>
      <ComponentTitle>VOT Balances</ComponentTitle>
      <BarChart
        width={width}
        height={300}
        data={getData()}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='vot' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='spent' stackId='a' fill='#8884d8' />
        <Bar dataKey='left' stackId='a' fill='#82ca9d' />
      </BarChart>
    </Stack>
  )
}
export default VotBudgetChart
