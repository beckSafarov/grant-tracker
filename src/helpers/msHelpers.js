import { MINIMAL_MS_LEN as minMsLen } from '../config'
import { dateDiff, getDateSafely, isBefore } from './dateHelpers'
import { findIndex } from 'lodash'

const getLastMsEndDate = ({ milestones }, id) => {
  if (!milestones) return undefined
  if (!id) {
    return getDateSafely([...milestones].pop().endDate)
  }
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

const isInvalidRange = ({ endDate, startDate }) => {
  const diff = dateDiff(endDate, startDate)
  return diff < minMsLen
}

const isInvalidEndDate = ({ grant, endDate }) => {
  return isBefore(grant.endDate.toDate(), endDate)
}
const isInvalidStartDate = ({ grant, startDate }) => {
  return isBefore(startDate, grant.startDate.toDate())
}

const clashesWithPrevious = ({ id, grant, startDate }) => {
  const lastMsEndDate = getLastMsEndDate(grant, id)
  if (!lastMsEndDate) return false
  return isBefore(startDate, lastMsEndDate)
}

const clashesWithNext = ({ id, grant, endDate }) => {
  if (!id) return false
  const nextMsStartDate = getNextMsStartDate(grant, id)
  if (!nextMsStartDate) return false
  return isBefore(nextMsStartDate, endDate)
}

/**
 * @data Obj { startDate, endDate, id, grant }
 */
export const msDatesValidated = (data) => {
  const conditions = [
    {
      isInvalid: isInvalidRange(data),
      msg: `Milestone range should not be less than ${minMsLen} days`,
    },
    {
      isInvalid: isInvalidEndDate(data),
      msg: 'End date cannot be later than the grant end date',
    },
    {
      isInvalid: isInvalidStartDate(data),
      msg: 'Start date cannot be earlier than the grant startdate',
    },
    {
      isInvalid: clashesWithPrevious(data),
      msg: 'Milestone timeline cannot clash with the previous milestone',
    },
    {
      isInvalid: clashesWithNext(data),
      msg: 'Milestone timeline cannot clash with the next milestone',
    },
  ]
  const invalidCase = conditions.find((cond) => cond.isInvalid === true)
  return invalidCase
    ? { success: false, msg: invalidCase.msg }
    : { success: true }
}

export const datesToTimeStamp = (data) => {
  const buildToDate = (type) => ({ toDate: () => new Date(data[type]) })
  const updatedData = { ...data }
  if (data.startDate) {
    updatedData.startDate = buildToDate('startDate')
  }
  if (data.endDate) {
    updatedData.endDate = buildToDate('endDate')
  }
  return updatedData
}