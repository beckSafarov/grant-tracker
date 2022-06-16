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
  const push = (date) => res.push({ date, amount: acc })
  for (let i = 0; i < arrLen; i++) {
    const curr = arr[i]
    acc += curr.amount
    if (i === arrLen - 1) {
      push(curr.date)
      break
    }
    const currDate = curr.date
    const nextDate = arr[i + 1].date
    if (currDate.getDate() === nextDate.getDate()) {
      if (i + 2 < arrLen) continue
      acc += arr[i + 1].amount
      push(nextDate)
      break
    }
    push(currDate)
    acc = 0
  }
  return res
}

/**
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
    if (!res[week]) res[week] = []
    res[week].push(expense)
  }
  return res
}

export const splitExpensesByWeek = (arr = []) => {
  const currWeek = getWeekOfYear()
  const expByWeek = splitByWeek(arr)
  const res = Array(currWeek).fill(0, 0, currWeek)
  for (let week of Object.keys(expByWeek)) {
    res[week] = expByWeek[week].reduce((a, c) => {
      a += c.amount
      return a
    }, 0)
  }
  return res
}

export const getTotalExpensesPerVot = (expenses = []) => {
  const res = {}
  for (const expense of expenses) {
    res[expense.vot] = res[expense.vot] || 0
    res[expense.vot] += expense.amount
  }
  return res
}
