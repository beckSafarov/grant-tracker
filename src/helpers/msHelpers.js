import { MINIMAL_MS_LEN as minMsLen } from '../config'
import { dateDiff, getDateSafely, isBefore } from './dateHelpers'
import { findIndex } from 'lodash'

const getLastMsEndDate = ({ milestones }, id) => {
  if (!milestones) return undefined
  const currMsIndex = findIndex(milestones, { id })
  return currMsIndex > 0
    ? getDateSafely(milestones[currMsIndex - 1].endDate)
    : undefined
}

const getNextMsStartDate = ({ milestones }, id) => {
  if (!milestones) return undefined
  const currMsIndex = findIndex(milestones, { id })
  return milestones.length > currMsIndex + 1
    ? getDateSafely(milestones[currMsIndex + 1].startDate)
    : undefined
}

export const msDatesValidated = ({ startDate, endDate, id, grant }) => {
  const diff = dateDiff(endDate, startDate)
  const lastMsEndDate = getLastMsEndDate(grant)
  const nextMsStartDate = id ? getNextMsStartDate(grant, id) : undefined
  const conditions = [
    {
      isInvalid: diff < minMsLen,
      msg: `Milestone range should not be less than ${minMsLen} days`,
    },
    {
      isInvalid: isBefore(grant.endDate.toDate(), endDate),
      msg: 'End date cannot be later than the grant end date',
    },
    {
      isInvalid: isBefore(startDate, grant.startDate.toDate()),
      msg: 'Start date cannot be earlier than the grant startdate',
    },
    {
      isInvalid: lastMsEndDate ? isBefore(startDate, lastMsEndDate) : false,
      msg: 'Milestone timeline cannot overlap with the previous milestone',
    },
    {
      isInvalid: nextMsStartDate ? isBefore(nextMsStartDate, endDate) : false,
      msg: 'Milestone timeline cannot overlap with the next milestone',
    },
  ]
  const invalidCase = conditions.find((cond) => cond.isInvalid)
  return invalidCase
    ? { success: false, msg: invalidCase.msg }
    : { success: true }
}
