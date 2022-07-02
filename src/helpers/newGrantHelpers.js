import dayjs from 'dayjs'
import { grantOptions, GRANT_PERIODS } from '../config'
import { dateDiff } from './dateHelpers'

const isItTooLate = ({ startDate }) => {
  const monthAgo = dayjs().subtract(1, 'M').toDate()
  const daysMore = dateDiff(startDate, monthAgo, 'd')
  return daysMore < 0
}

const isItTooEarly = ({ startDate }) => {
  const now = new Date()
  return now.getTime() < startDate.getTime()
}

const isInvalidDiff = ({ startDate, endDate, type }) => {
  const diff = dateDiff(endDate, startDate, 'M')
  const periods = GRANT_PERIODS[type].length
  const isBiggerThanLast = diff > periods.concat().pop()
  const isSmallerThanFirst = diff < periods.concat().shift()
  return isBiggerThanLast || isSmallerThanFirst
}

const getInvalidDiffMsg = ({ type }) => {
  const grantName = grantOptions[type]
  const months = GRANT_PERIODS[type].length
  const period = months.length < 2 ? months[0] : months[0] + ' or ' + months[1]
  return `Grant Period for ${grantName} grant is ${period} months`
}

/**
 * @data {startDate, endDate, type}
 * @type -- grant type
 */
export const grantPeriodValidated = (data) => {
  const conditions = [
    {
      isInvalid: isItTooLate(data),
      msg: 'Grant start date cannot be earlier than a month ago',
    },
    {
      isInvalid: isItTooEarly(data),
      msg: 'Grant start date cannot be in the future',
    },
    {
      isInvalid: isInvalidDiff(data),
      msg: getInvalidDiffMsg(data),
    },
  ]
  const invalidCase = conditions.find((cond) => cond.isInvalid)
  return { success: !Boolean(invalidCase), msg: invalidCase?.msg }
}
