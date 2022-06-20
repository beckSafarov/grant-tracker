import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { WEEKLY_EXPENSE_WEEKS } from '../config'
dayjs.extend(LocalizedFormat)

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const throwUndefined = (methodName, param = 'date obj') => {
  throw Error(`${methodName} received an undefined ${param}`)
}

export const getDateSafely = (obj) => {
  if (!obj) throwUndefined('getDateSafely')
  return obj.toDate ? obj.toDate() : obj
}

export const flattenArrDates = (arr = [], prop) => {
  const getProp = (date) => {
    const obj = {}
    obj[prop] = date.toDate ? date.toDate() : date
    return obj
  }
  return arr.map((obj) => {
    return { ...obj, ...getProp(obj[prop]) }
  })
}

export const uniqDays = (arr = [], prop = 'date') => {
  return arr.filter((curr, i) => {
    if (i === arr.length - 1) return curr
    const currDate = curr[prop]
    const nextDate = arr[i + 1][prop]
    const sameDays = isSameDate(currDate, nextDate)
    if (!sameDays) return curr
  })
}

export const getMonthsAdded = (n) => {
  return dayjs().add(n, 'month').toDate()
}
export const timeAgo = (number, type, from) => {
  return dayjs(from).subtract(number, type)
}

export const dateFormat = (date, format = 'LL') => {
  return dayjs(date).format(format)
}

const timeToString = (time) => {
  const date = new Date(time)
  return date.toString()
}

export const getCurrMonth = () => {
  const now = new Date()
  return now.getMonth()
}

export const getWeekOfYear = (date) => {
  dayjs.extend(weekOfYear)
  return dayjs(date).week()
}

const buildDateObj = (a = '', b = '') => ({ startDate: a, endDate: b })

export const getCurrYear = () => {
  const now = new Date()
  return now.getFullYear()
}

export const stringifyDates = (dates) => {
  if (!dates) return buildDateObj()
  const { startDate: sd, endDate: ed } = dates
  const nested = Boolean(sd.seconds)
  const a = nested ? sd.toDate().toString() : timeToString(sd)
  const b = nested ? ed.toDate().toString() : timeToString(ed)
  return buildDateObj(a, b)
}

/**
 * @dates Obj {startDate, endDate}
 */
export const getDateInterval = (dates, seperator = '➞') => {
  const getDate = (prop) => {
    const pureDate = getDateSafely(dates[prop])
    return dateFormat(pureDate)
  }
  return `${getDate('startDate')} ${seperator} ${getDate('endDate')}`
}

/**
 * @date1 -- latest date
 * @date2 -- old date
 * @returns dat1-date2
 */
export const dateDiff = (date1, date2, diffIn = 'days') => {
  const d1 = dayjs(date1)
  const d2 = dayjs(date2)
  return d1.diff(d2, diffIn)
}

/**
 * @date1 -- old date
 * @date2 -- latest date
 * @returns does date1 come before date2
 */
export const isBefore = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getTime() < d2.getTime()
}

/**
 * @date1 -- old date
 * @date2 -- latest date
 * @returns does date1 come before date2
 */
export const isBeforeOrEqual = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diff = d1.getTime() <= d2.getTime()
  return diff
}

export const isSameDate = (date1, date2) => {
  return dayjs(date1).isSame(date2)
}

export const isSame = (date1 = undefined, date2, type) => {
  return dayjs(date1).isSame(date2, type)
}

export const getWeekIntervals = (n) => {
  const now = new Date()
  const currDayOfWeek = now.getDay()
  const currWeekStart = dayjs(now).subtract(currDayOfWeek)
  const currWeekEnd = dayjs(currWeekStart).add(6, 'd')
  const weeks = Array(n).fill(null, 0, n)
  return weeks
    .map((_, i) => {
      const beginning = dayjs(currWeekStart)
        .subtract(7 * i, 'd')
        .toDate()
      const end = dayjs(currWeekEnd)
        .subtract(7 * i, 'd')
        .toDate()
      return { beginning, end }
    })
    .reverse()
}

