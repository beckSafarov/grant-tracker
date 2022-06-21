import { Stack } from '@mui/material'
import { useCallback } from 'react'
import { getElemWidth, pluralize } from '../../helpers'
import {
  dateDiff,
  getDateSafely,
  getMonthsAndDaysLeft,
} from '../../helpers/dateHelpers'
import ProgressBar from './ProgressBar'
const now = new Date()

const GrantPeriodProgress = ({ grant, width }) => {
  const startDate = getDateSafely(grant?.startDate)
  const endDate = getDateSafely(grant?.endDate)

  const getProgress = useCallback(() => {
    const periodDays = dateDiff(endDate, startDate, 'd')
    const passedDays = dateDiff(now, startDate, 'd')
    return Math.round((passedDays / periodDays) * 100)
  }, [grant])

  const getTimeLeftForGrant = useCallback(() => {
    const { months, days } = getMonthsAndDaysLeft(endDate)
    const monthLabel = pluralize('month', months)
    const dayLabel = pluralize('day', days)
    return `${months} ${monthLabel} ${days} ${dayLabel}`
  }, [grant])

  return (
    <Stack id='msStack' justifyContent='center' alignItems='center'>
      <ProgressBar
        width={width || getElemWidth('msStack') - 100}
        progress={getProgress()}
        label={getTimeLeftForGrant()}
      />
    </Stack>
  )
}

export default GrantPeriodProgress
