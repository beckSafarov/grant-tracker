import dayjs from 'dayjs'
import { getCurrMonth, getWeekOfYear } from './dateHelpers'

export const balanceCheck = (expense, grant) => {
  const totalCurrExpenses = grant.expenses
    ? grant.expenses
        .filter((prevExp) => prevExp.vot === expense.vot)
        .reduce((acc, { amount }) => (acc += amount), 0)
    : 0
  const allocation = grant.votAllocations[expense.vot]
  const res = allocation - (totalCurrExpenses + expense.amount)
  return { success: res > 0, res }
}

/**
 * @desc sums the amounts for the same date and returns the array with the dates and amounts
 * @arr [{date, amount}, ...]
 * @returns [{date: '', amount: 100}]
 */
export const getSameDatesSummed = (arr) => {
  const res = []
  let acc = 0
  const arrLen = arr.length
  const list = arr.sort((x, y) => x.date - y.date)
  const push = (date) => res.push({ date, amount: acc })
  for (let i = 0; i < arrLen; i++) {
    const curr = list[i]
    acc += curr.amount
    if (i === arrLen - 1) {
      push(curr.date)
      break
    }
    const currDate = curr.date
    const nextDate = list[i + 1].date
    if (currDate.getDate() === nextDate.getDate()) {
      if (i + 2 < arrLen) continue
      acc += list[i + 1].amount
      push(nextDate)
      break
    }
    push(currDate)
    acc = 0
  }
  return res
}

/**
 * @except Optional [{date1}, {date2}]
 * @returns [{date: 1st, amount: 0}, {date: 2nd, amount: 0}, ....]
 */
export const genEmptyExpensesTillNow = (except) => {
  const now = new Date()
  const currDay = now.getDate()
  const res = []
  for (let i = currDay - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'd').toDate()
    if (except) {
      const alreadyExists = except.find(
        (e) => e.date.getDate() === date.getDate()
      )
      if (alreadyExists) continue
    }
    res.push({ date, amount: 0 })
  }
  return res
}

const splitByMonth = (arr = []) => {
  const res = {}
  for (let expense of arr) {
    const month = expense.date.getMonth()
    if (!res[month]) res[month] = []
    res[month].push(expense)
  }
  return res
}

export const splitExpensesByMonth = (arr = []) => {
  const expensesByMonth = splitByMonth(arr)
  const currMonth = getCurrMonth()
  const res = Array(currMonth + 1).fill(0, 0, currMonth + 1)
  for (let month of Object.keys(expensesByMonth)) {
    res[month] = expensesByMonth[month].reduce((a, c) => (a += c.amount), 0)
  }
  return res
}

const splitByWeek = (arr = []) => {
  const res = {}
  for (let expense of arr) {
    const week = getWeekOfYear(expense.date)
    res[week] = res[week] || []
    res[week].push(expense)
  }
  return res
}

export const splitExpensesByWeek = (arr = []) => {
  const currWeek = getWeekOfYear()
  const expByWeek = splitByWeek(arr)
  const res = Array(currWeek + 1).fill(0, 0, currWeek + 1)
  for (let week of Object.keys(expByWeek)) {
    res[week] = expByWeek[week].reduce((a, c) => {
      a += c.amount
      return a
    }, 0)
  }
  return res
}

const splitExpensesByYear = (data) => {
  return data.reduce((acc, currExpense) => {
    const year = currExpense.date.getFullYear()
    acc[year] = acc[year] || []
    acc[year].push(currExpense)
    return acc
  }, {})
}

export const splitExpensesByYearAndMonth = (data) => {
  const expensesByYear = splitExpensesByYear(data)
  return Object.keys(expensesByYear).reduce((acc, currYear) => {
    acc[currYear] = splitExpensesByMonth(expensesByYear[currYear])
    return acc
  }, {})
}

/**
 * @expenses [{amount, <prop>}, ...]
 * @prop vot|project
 * @returns {prop1: amount1, prop2: amount2}
 */
export const getTotalExpensesPerProp = (expenses = [], prop) =>
  expenses.reduce((acc, curr) => {
    const currProp = curr[prop]
    acc[currProp] = acc[currProp] || 0
    acc[currProp] += curr.amount
    return acc
  }, {})

export const formatDateInterval = ({ beginning, end }) => {
  const date1 = dayjs(beginning).format('ll').split(',')[0]
  const date2 = dayjs(end).format('ll').split(',')[0]
  return `${date1} - ${date2}`
}
