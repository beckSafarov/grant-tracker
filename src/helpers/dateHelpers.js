import dayjs from 'dayjs'

export const getMonthsAdded = (n) => {
  return new Date(dayjs().add(n, 'month'))
}

const timeToString = (time) => {
  const date = new Date(time)
  return date.toString()
}

const buildDateObj = (a = '', b = '') => ({ startDate: a, endDate: b })

export const getFormattedDates = (dates) => {
  if (!dates) return buildDateObj()
  const { startDate: sd, endDate: ed } = dates
  const nested = Boolean(sd.seconds)
  const a = nested ? sd.toDate().toString() : timeToString(sd)
  const b = nested ? ed.toDate().toString() : timeToString(ed)
  return buildDateObj(a, b)
}
