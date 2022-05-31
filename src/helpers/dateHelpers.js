import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

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
  const getDate = (prop) => dateFormat(dates[prop].toDate())
  return `${getDate('startDate')} ${seperator} ${getDate('endDate')}`
}