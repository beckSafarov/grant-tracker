import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

export const getDateSafely = (obj) => {
  return obj.toDate ? obj.toDate() : obj
}

export const getMonthsAdded = (n) => {
  return new Date(dayjs().add(n, 'month'))
}

export const dateFormat = (date) => {
  return dayjs(date).format('LL')
}

const timeToString = (time) => {
  const date = new Date(time)
  return date.toString()
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