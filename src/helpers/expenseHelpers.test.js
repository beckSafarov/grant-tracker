import { getArrOfObjects } from '.'
import { getSameDatesSummed, getTotalExpensesPerProp } from './expenseHelpers'
const date1 = new Date('06-01-2022')
const date2 = new Date('06-02-2022')
const date3 = new Date('06-03-2022')
const date4 = new Date('06-04-2022')

const datesAndExpenses = getArrOfObjects([
  ['date', 'amount'],
  [date1, 100],
  [date2, 200],
  [date2, 50],
  [date2, 10],
  [date3, 300],
  [date4, 100],
  [date2, 100],
  [date3, 100],
  [date1, 10],
])

test('same date expenses', () => {
  expect(getSameDatesSummed(datesAndExpenses)).toEqual([
    { date: date1, amount: 110 },
    { date: date2, amount: 360 },
    { date: date3, amount: 400 },
    { date: date4, amount: 100 },
  ])
})

const sampleExpenses = getArrOfObjects([
  ['vot', 'amount'],
  ['A', 100],
  ['B', 200],
  ['A', 100],
  ['B', 200],
  ['C', 100],
  ['D', 200],
  ['C', 100],
  ['D', 200],
  ['E', 100],
])

const expectedOutcome = {
  A: 200,
  B: 400,
  C: 200,
  D: 400,
  E: 100,
}

test('expenses by prop, prop = vot', () => {
  expect(getTotalExpensesPerProp(sampleExpenses, 'vot')).toEqual(
    expectedOutcome
  )
})
