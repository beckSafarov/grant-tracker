import { Stack } from '@mui/material'
import { useCallback } from 'react'
import { getElemWidth, pluralize } from '../../helpers'
import {
  dateDiff,
  getDateSafely,
  getMonthsAndDaysLeft,
} from '../../helpers/dateHelpers'
import useIsGrantActive from '../../hooks/useIsGrantActive'
import ProgressBar from './ProgressBar'
const now = new Date()

const GrantPeriodProgress = ({ grant, width }) => {
  const startDate = getDateSafely(grant?.startDate)
  const endDate = getDateSafely(grant?.endDate)
  const isActive = useIsGrantActive()

  const getProgress = useCallback(() => {
    if (!isActive) return 100
    const periodDays = dateDiff(endDate, startDate, 'd')
    const passedDays = dateDiff(now, startDate, 'd')
    return Math.round((passedDays / periodDays) * 100)
  }, [grant])

  const buildLabel = (years, months, days) => {
    const yearLabel = pluralize('year', years)
    const monthLabel = pluralize('month', months)
    const dayLabel = pluralize('day', days)
    return `${years} ${yearLabel}  ${months} ${monthLabel} ${days} ${dayLabel}`
  }

  const getZeros = useCallback(() => 'The Grant Has Expired', [grant])

  const getTimeLeftForGrant = useCallback(() => {
    const { years, months, days } = getMonthsAndDaysLeft(endDate)
    return buildLabel(years, months, days)
  }, [grant])

  return (
    <Stack id='msStack' justifyContent='center' alignItems='center'>
      <ProgressBar
        width={width || getElemWidth('msStack') - 100}
        progress={getProgress()}
        label={isActive ? getTimeLeftForGrant() : getZeros()}
      />
    </Stack>
  )
}

export default GrantPeriodProgress
