import React, { useCallback } from 'react'
import { Paper, Stack } from '@mui/material'
import StatCard from '../StatCard'
import StickyHeadTable from '../StickyHeadTable'
import Box from '@mui/system/Box'
import { useGrantContext } from '../../hooks/ContextHooks'
import { dateFormat } from '../../helpers/dateHelpers'
import { commafy, getArrOfObjects } from '../../helpers'
import ErrorAlert from '../ErrorAlert'

const buildCards = (overall, numbOfResearches) => {
  const today = dateFormat(new Date())
  return getArrOfObjects([
    ['label', 'data', 'date'],
    ['Overall Allocated', overall, today],
    ['Overall Spent By Now', '-', today],
    ['Number of Researches', numbOfResearches, today],
  ])
}

export const grantsTableColumns = getArrOfObjects([
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

  const getRows = useCallback(() => {
    return allGrants.map((grant) => ({
      ...grant,
      pi: grant.user.name,
      allocated: grant.info.appCeiling,
      spent: '',
      startDate: dateFormat(grant.startDate.toDate()),
      endDate: dateFormat(grant.endDate.toDate()),
      pubNumber: grant.pubNumber || 0,
      link: `/research/${grant.id}/dashboard`,
    }))
  }, [allGrants])

  const getCards = useCallback(() => {
    const overallNumb = allGrants.reduce((acc, { info }) => {
      return (acc += info.appCeiling)
    }, 0)
    const overallCommafied = commafy(overallNumb)
    return buildCards(overallCommafied, allGrants.length)
  }, [allGrants])

  return (
    <Box px='40px'>
      <ErrorAlert error={error} />
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
