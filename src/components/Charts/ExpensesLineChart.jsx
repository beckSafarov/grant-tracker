import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useState, useCallback } from 'react'
import {
  formatDateInterval,
  genEmptyExpensesTillNow,
  getSameDatesSummed,
  splitExpensesByMonth,
  splitExpensesByWeek,
  splitExpensesByYearAndMonth,
} from '../../helpers/expenseHelpers'
import {
  flattenArrDates,
  getCurrMonth,
  getCurrYear,
  getDateSafely,
  getWeekIntervals,
  isSame,
  monthNames,
} from '../../helpers/dateHelpers'
import ComponentTitle from '../ComponentTitle'
import MyLineChart from './MyLineChart'
import { WEEKLY_EXPENSE_WEEKS as weeksMax } from '../../config'
import useIsGrantActive from '../../hooks/useIsGrantActive'
import { useGrantContext } from '../../hooks/ContextHooks'
import { flatten } from 'lodash'
const lchartBtns = ['daily', 'weekly', 'monthly']

const ExpensesLineChart = ({ expenses, width: w, height: h }) => {
  const [lchartTime, setLchartTime] = useState('daily')
  const { grant } = useGrantContext()
  const width = w || 600
  const height = h || 200
  const isActive = useIsGrantActive()

  const filterExpensesForDailyChart = (data) => {
    const endDate = grant ? getDateSafely(grant.endDate) : new Date()
    const filterDate = isActive ? new Date() : endDate
    return data.filter(({ date }) => isSame(filterDate, date, 'month'))
  }

  const getDailyExpenses = (flatData) => {
    const expensesInThisMonth = filterExpensesForDailyChart(flatData)
    const sameDatesSummed = getSameDatesSummed(expensesInThisMonth)
    const emptyExpenses = genEmptyExpensesTillNow(sameDatesSummed)
    return sameDatesSummed
      .concat(emptyExpenses)
      .sort((x, y) => x.date - y.date)
      .map((expense) => ({
        ...expense,
        date: getDateSafely(expense.date).getDate(),
      }))
  }

  const getWeeklyExpenses = (flatData) => {
    const weeklyExpenses = splitExpensesByWeek(flatData)
    const weekDates = getWeekIntervals(weeksMax)
    return weeklyExpenses.slice(-weeksMax).map((amount, i) => ({
      date: formatDateInterval(weekDates[i]),
      amount,
    }))
  }

  const filterForMonthlyChart = (data) => {
    if (isActive) return splitExpensesByMonth(data)
    const all = splitExpensesByYearAndMonth(data)
    return flatten(Object.values(all))
  }

  const getMonthlyExpenses = (flatData) => {
    const expensesByMonth = filterForMonthlyChart(flatData)
    return expensesByMonth.map((amount, i) => ({
      date: monthNames[i].slice(0, 3),
      amount,
    }))
  }

  const switchExpenseMethods = useCallback(
    (data) => {
      const lookUp = {
        daily: (data) => getDailyExpenses(data),
        weekly: (data) => getWeeklyExpenses(data),
        monthly: (data) => getMonthlyExpenses(data),
      }
      return lookUp[lchartTime](data)
    },
    [lchartTime, expenses, isActive]
  )

  const getChartData = useCallback(() => {
    const expensesFlat = flattenArrDates(expenses, 'date')
    const chartData = switchExpenseMethods(expensesFlat)
    return chartData.map(({ date, amount }) => ({
      name: date,
      value: amount,
    }))
  }, [expenses, lchartTime, isActive])

  const getTitle = useCallback(() => {
    const currMonth = monthNames[getCurrMonth()]
    const currYear = isActive
      ? getCurrYear()
      : getDateSafely(grant?.endDate)?.getFullYear?.()

    const lookup = {
      daily: `Daily expenses for the month of ${currMonth}`,
      weekly: `Weekly expenses for the last ${weeksMax} weeks`,
      monthly: `Monthly expenses for the year ${currYear}`,
    }
    return lookup[lchartTime]
  }, [lchartTime, isActive])

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
