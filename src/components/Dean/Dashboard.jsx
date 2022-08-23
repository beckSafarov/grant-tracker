import React, { useCallback, useState } from 'react'
import { Paper, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import StatCard from '../StatCard'
import StickyHeadTable from '../StickyHeadTable'
import Box from '@mui/system/Box'
import { useGrantContext } from '../../hooks/ContextHooks'
import { dateFormat, getDateSafely } from '../../helpers/dateHelpers'
import { commafy, getArrOfObjects, isNone } from '../../helpers'
import ErrorAlert from '../ErrorAlert'
import { useMemo } from 'react'

const buildCards = (allocated, spent, numbOfResearches) => {
  const today = dateFormat(new Date())
  return getArrOfObjects([
    ['label', 'data', 'date'],
    ['Overall Allocated', allocated, today],
    ['Overall Spent', spent, today],
    ['Number of Researches', numbOfResearches, today],
  ])
}

const grantsTableColumns = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['title', 'Title', 180],
  ['type', 'Type', 150],
  ['pi', 'Primary Investigator', 180],
  ['allocated', 'Allocated (RM)', 100],
  ['spent', 'Spent (RM)', 100],
  ['pubNumber', 'Publications', 100],
  ['startDate', 'Start Date', 100],
  ['endDate', 'End Date', 100],
])

const Dashboard = () => {
  const { allGrants, error } = useGrantContext()
  const [time, setTime] = useState('active')

  const currGrants = useMemo(() => {
    if (isNone(allGrants)) return []
    return allGrants.filter((grant) => {
      const endDate = getDateSafely(grant.endDate)
      const now = new Date()
      return time === 'active' ? now < endDate : now > endDate
    })
  }, [allGrants, time])

  const getSpent = ({ expenses }) => {
    if (isNone(expenses)) return 0
    return expenses.reduce((a, c) => (a += c.amount), 0)
  }

  const getRows = useCallback(() => {
    return currGrants.map((grant) => ({
      ...grant,
      pi: grant.user.name,
      allocated: grant.info.appCeiling,
      spent: getSpent(grant),
      startDate: dateFormat(grant.startDate.toDate()),
      endDate: dateFormat(grant.endDate.toDate()),
      pubNumber: grant.pubNumber || 0,
      link: `/research/${grant.id}/dashboard`,
    }))
  }, [currGrants])

  const getCards = useCallback(() => {
    const overallNumb = currGrants.reduce((acc, { info }) => {
      return (acc += info.appCeiling)
    }, 0)

    const overallSpent = currGrants.reduce((a, c) => (a += getSpent(c)), 0)
    const overallCommafied = commafy(overallNumb)
    return buildCards(overallCommafied, overallSpent, currGrants.length)
  }, [currGrants])

  return (
    <Box px='40px' pb='20px'>
      <ErrorAlert error={error} />
      <Box sx={{ mt: '10px' }}>
        <ToggleButtonGroup
          color='primary'
          value={time}
          onChange={(e) => setTime(e.target.value)}
          size='small'
          exclusive
        >
          <ToggleButton value='active'>Active</ToggleButton>
          <ToggleButton value='past'>Past</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {allGrants && (
        <>
          <Stack justifyContent='space-between' direction='row' mt='30px'>
            {getCards().map((card, i) => (
              <StatCard key={i} card={card} />
            ))}
          </Stack>
          <Paper
            elevation={1}
            sx={{ mt: '40px', width: '100%', overflow: 'hidden' }}
          >
            <StickyHeadTable
              columns={grantsTableColumns}
              rows={getRows()}
              searchBy={['title', 'type', 'pi']}
              title='Current Researches'
              maxLength={22}
            />
          </Paper>
        </>
      )}
    </Box>
  )
}

export default Dashboard
