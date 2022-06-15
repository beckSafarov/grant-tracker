import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useState, useCallback } from 'react'
import {
  genEmptyExpensesTillNow,
  getSameDatesSummed,
  splitExpensesByMonth,
  splitExpensesByWeek,
} from '../../helpers/expenseHelpers'
import {
  flattenArrDates,
  formatWeekInterval,
  getCurrMonth,
  getCurrYear,
  isSame,
  monthNames,
} from '../../helpers/dateHelpers'
import ComponentTitle from '../ComponentTitle'
import MyLineChart from './MyLineChart'
import { WEEKLY_EXPENSE_WEEKS as weeksMax } from '../../config'
const lchartBtns = ['daily', 'weekly', 'monthly']

const ExpensesLineChart = ({ expenses, width: w, height: h }) => {
  const [lchartTime, setLchartTime] = useState('daily')
  const width = w || 600
  const height = h || 200

  const getDailyExpenses = useCallback(
    (flatData) => {
      const expensesInThisMonth = flatData.filter(({ date }) =>
        isSame(new Date(), date, 'month')
      )
      const sameDatesSummed = getSameDatesSummed(expensesInThisMonth)
      const emptyExpenses = genEmptyExpensesTillNow(sameDatesSummed)
      const sorted = [...sameDatesSummed, ...emptyExpenses].sort(
        (x, y) => x.date.getTime() - y.date.getTime()
      )
      return sorted.map((expense) => ({
        ...expense,
        date: expense.date.getDate(),
      }))
    },
    [expenses]
  )

  const getWeeklyExpenses = useCallback(
    (flatData) => {
      const weeklyExpenses = splitExpensesByWeek(flatData)
      return weeklyExpenses.slice(-weeksMax).map((amount, i) => ({
        date: formatWeekInterval(i + 1 + (weeklyExpenses.length - weeksMax)),
        amount,
      }))
    },
    [expenses]
  )

  const getMonthlyExpenses = useCallback(
    (flatData) => {
      const expensesByMonth = splitExpensesByMonth(flatData)
      return expensesByMonth.map((amount, i) => ({
        date: monthNames[i].slice(0, 3),
        amount,
      }))
    },
    [expenses]
  )

  const switchExpenseMethods = useCallback(
    (data) => {
      const lookUp = {
        daily: (data) => getDailyExpenses(data),
        weekly: (data) => getWeeklyExpenses(data),
        monthly: (data) => getMonthlyExpenses(data),
      }
      return lookUp[lchartTime](data)
    },
    [lchartTime]
  )

  const getChartData = useCallback(() => {
    const expensesFlat = flattenArrDates(expenses, 'date')
    const chartData = switchExpenseMethods(expensesFlat)
    return chartData.map(({ date, amount }) => ({
      name: date,
      value: amount,
    }))
  }, [expenses, lchartTime])

  const getTitle = useCallback(() => {
    const currMonth = monthNames[getCurrMonth()]
    const currYear = getCurrYear()
    const lookup = {
      daily: `Daily expenses for the month of ${currMonth}`,
      weekly: `Weekly expenses for the last ${weeksMax} weeks`,
      monthly: `Monthly expenses for the year ${currYear}`,
    }
    return lookup[lchartTime]
  }, [lchartTime])

  return (
    <Stack spacing={3}>
      <Stack direction='row' justifyContent='space-between'>
        <ComponentTitle>{getTitle()}</ComponentTitle>
        <ToggleButtonGroup
          color='primary'
          value={lchartTime}
          exclusive
          onChange={(e) => setLchartTime(e.target.value)}
          size='small'
        >
          {lchartBtns.map((btn, i) => (
            <ToggleButton key={i} value={btn}>
              {btn}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Stack direction='row' justifyContent='center'>
        <MyLineChart data={getChartData()} width={width} height={height} />
      </Stack>
    </Stack>
  )
}

export default ExpensesLineChart
