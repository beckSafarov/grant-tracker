import { getCurrDayOfMonth, getCurrMonth, getCurrYear } from './dateHelpers'
import { grantPeriodValidated } from './newGrantHelpers'
import { GRANT_PERIODS } from '../config'

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
  const currYear = getCurrYear()
  const endDate = startDate.replace(currYear + '', currYear + 2 + '')
  return {
    desc: `Starting ${startDateName}`,
    param: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
  buildStartTestCase('way before a month', '03-10-2022', false),
  buildStartTestCase('right before a month', '06-01-2022', false),
  buildStartTestCase('a month ago', '06-02-2022', true),
  buildStartTestCase('in the last 1 month', '06-10-2022', true),
  buildStartTestCase('today', '07-02-2022', true),
  buildStartTestCase('in the future', '07-02-2024', false),
]

const methodWrapper = (param) => grantPeriodValidated(param).success

for (let currCase of cases) {
  test(currCase.desc, () => {
    expect(methodWrapper(currCase.param)).toBe(currCase.expected)
  })
}
