import React, { useCallback, useEffect, useState } from 'react'
import { Paper, Stack } from '@mui/material'
import StatCard from '../StatCard'
import StickyHeadTable from '../StickyHeadTable'
import Box from '@mui/system/Box'
import { useGrantContext } from '../../hooks/ContextHooks'
import Spinner from '../Spinner'
import { grantOptions } from '../../config'
import { dateFormat } from '../../helpers/dateHelpers'
import AlertBox from '../AlertBox'
import { commafy } from '../../helpers'

const buildCardsObj = (overall, numbOfResearches) => {
  const today = dateFormat(new Date())
  return [
    {
      label: 'Overall Allocated',
      data: overall,
      date: today,
    },
    {
      label: 'Overall Spent By Now',
      data: '-',
      date: today,
    },
    {
      label: 'Number of Researches',
      data: numbOfResearches,
      date: today,
    },
  ]
}

const tableColumns = [
  { field: 'grant', label: 'Grant', minWidth: 180 },
  { field: 'pi', label: 'Primary Investigator', minWidth: 180 },
  { field: 'allocated', label: 'Allocated (RM)', minWidth: 133 },
  { field: 'spent', label: 'Spent (RM)', minWidth: 133 },
  { field: 'startDate', label: 'Start Date', minWidth: 133 },
  { field: 'endDate', label: 'End Date', minWidth: 133 },
]

const Dashboard = () => {
  const { loading, allGrants, error, getAllGrants } = useGrantContext()
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (!allGrants) getAllGrants()
    if (error) handleError()
  }, [allGrants, error])

  const handleError = () => {
    setAlert(error.toString())
    console.error(error)
  }

  const getRows = useCallback(() => {
    return allGrants.map((grant) => ({
      grant: grantOptions[grant.type],
      pi: grant.user.name,
      allocated: grant.info.appCeiling,
      spent: '',
      startDate: dateFormat(grant.startDate.toDate()),
      endDate: dateFormat(grant.endDate.toDate()),
    }))
  }, [allGrants])

  const getCards = useCallback(() => {
    const overallNumb = allGrants.reduce((acc, { info }) => {
      return (acc += info.appCeiling)
    }, 0)
    const overallCommafied = commafy(overallNumb)
    return buildCardsObj(overallCommafied, allGrants.length)
  }, [allGrants])

  const searchFilter = ({ grant, pi }, regex) =>
    grant.match(regex) || pi.match(regex)

  return (
    <Box px='40px'>
      <Spinner hidden={!loading} />
      <AlertBox my={2} hidden={!alert}>
        {alert}
      </AlertBox>
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
              columns={tableColumns}
              rows={getRows()}
              searchFilter={searchFilter}
            />
          </Paper>
        </>
      )}
    </Box>
  )
}

export default Dashboard
