import { getCurrDayOfMonth, getCurrMonth, getCurrYear } from './dateHelpers'
import { grantPeriodValidated } from './newGrantHelpers'
import { GRANT_PERIODS } from '../config'
import dayjs from 'dayjs'
const aMonthAgo = dayjs().subtract(1, 'M').toDate()
const wayBeforeAMonth = new Date('03-10-2022')
const beforeOneMonth = dayjs(aMonthAgo).subtract(1, 'd').toDate()
const today = new Date()
const tomorrow = dayjs(today).add(1, 'd').toDate()
const lastOneMonth = dayjs(aMonthAgo).add(10, 'd').toDate()

const getExpectedBool = (type, yearsAfter, monthsAfter) => {
  const periods = GRANT_PERIODS[type].length
  const maxMonths = periods.concat().pop()
  const minMonths = periods.concat().shift()
  const chosenPeriod = yearsAfter + monthsAfter / 12
  return maxMonths / 12 >= chosenPeriod && minMonths / 12 <= chosenPeriod
}

const buildPeriodTestCase = (type, yearsAfter = 0, monthsAfter = 0) => {
  const currMonth = getCurrMonth() + monthsAfter
  const currDay = getCurrDayOfMonth() + 1
  const endDateYear = getCurrYear() + yearsAfter
  const expected = getExpectedBool(type, yearsAfter, monthsAfter)
  return {
    desc: `${type}, after ${yearsAfter} year(s) and ${monthsAfter} month(s)`,
    param: {
      startDate: new Date(),
      endDate: new Date(endDateYear, currMonth, currDay),
      type,
    },
    expected,
  }
}

const buildStartTestCase = (
  startDateName,
  startDate,
  expected,
  type = 'ruTrans'
) => {
  const endDate = dayjs(startDate).add(2, 'y').toDate()
  return {
    desc: `Starting ${startDateName}`,
    param: {
      startDate: startDate,
      endDate: endDate,
      type,
    },
    expected,
  }
}

const cases = [
  buildPeriodTestCase('ruTrans', 2),
  buildPeriodTestCase('ruTrans', 3),
  buildPeriodTestCase('ruTrans', 4),
  buildPeriodTestCase('ruTeam', 2),
  buildPeriodTestCase('ruTeam', 3),
  buildPeriodTestCase('ruTeam', 4),
  buildPeriodTestCase('short', 1),
  buildPeriodTestCase('short', 2),
  buildPeriodTestCase('short', 3),
  buildPeriodTestCase('prg', 0, 6),
  buildPeriodTestCase('prg', 1),
  buildPeriodTestCase('prg', 1, 3),
  buildPeriodTestCase('prg', 2),
  buildPeriodTestCase('bridging', 0, 6),
  buildPeriodTestCase('bridging', 1),
  buildPeriodTestCase('bridging', 1, 3),
  buildPeriodTestCase('bridging', 2),
  buildStartTestCase('way before a month', wayBeforeAMonth, false),
  buildStartTestCase('right before a month', beforeOneMonth, false),
  buildStartTestCase('a month ago', aMonthAgo, true),
  buildStartTestCase('in the last 1 month', lastOneMonth, true),
  buildStartTestCase('today', today, true),
  buildStartTestCase('in the future', tomorrow, false),
]

const methodWrapper = (param) => grantPeriodValidated(param).success

for (let currCase of cases) {
  test(currCase.desc, () => {
    expect(methodWrapper(currCase.param)).toBe(currCase.expected)
  })
}
