import dayjs from 'dayjs'
import { grantOptions, GRANT_PERIODS } from '../config'
import { dateDiff } from './dateHelpers'

const isInvalidStart = ({ startDate }) => {
  const monthAgo = dayjs().subtract(1, 'M').toDate()
  return startDate.getTime() < monthAgo.getTime()
}

const isInvalidDiff = ({ startDate, endDate, type }) => {
  const diff = dateDiff(endDate, startDate, 'M')
  const periods = GRANT_PERIODS[type].length
  return periods.indexOf(diff) === -1
}

const getInvalidDiffMsg = ({ type }) => {
  const grantName = grantOptions[type]
  const months = GRANT_PERIODS[type].length
  const period = months.length < 2 ? months : months[0] + '/' + months[1]
  return `Grant Period for ${grantName} grant is ${period} months`
}

export const grantPeriodValidated = (data) => {
  const conditions = [
    {
      isInvalid: isInvalidStart(data),
      msg: 'Grant start date cannot be earlier than a month ago',
    },
    {
      isInvalid: isInvalidDiff(data),
      msg: getInvalidDiffMsg(data),
    },
  ]
  const invalidCase = conditions.find((cond) => cond.isInvalid)
  return invalidCase
    ? { success: false, msg: invalidCase.msg }
    : { success: true }
}
