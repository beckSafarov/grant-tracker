import React, { useCallback, useEffect, useState } from 'react'
import { Paper, Stack } from '@mui/material'
import StatCard from '../StatCard'
import StickyHeadTable from '../StickyHeadTable'
import Box from '@mui/system/Box'
import { useGrantContext } from '../../hooks/ContextHooks'
import { dateFormat } from '../../helpers/dateHelpers'
import AlertBox from '../AlertBox'
import { buildFormFieldObj as buildField, commafy } from '../../helpers'

const buildCards = (overall, numbOfResearches) => {
  const today = dateFormat(new Date())
  const buildCard = (label, data, date) => ({ label, data, date })
  return [
    buildCard('Overall Allocated', overall, today),
    buildCard('Overall Spent By Now', '-', today),
    buildCard('Number of Researches', numbOfResearches, today),
  ]
}

export const grantsTableColumns = [
  buildField('title', 'Title', 180),
  buildField('type', 'Type', 150),
  buildField('pi', 'Primary Investigator', 180),
  buildField('allocated', 'Allocated (RM)', 100),
  buildField('spent', 'Spent (RM)', 100),
  buildField('pubNumber', 'Publications', 100),
  buildField('startDate', 'Start Date', 100),
  buildField('endDate', 'End Date', 100),
]

const Dashboard = () => {
  const { allGrants, error } = useGrantContext()
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (error) handleError()
  }, [error])

  const handleError = () => {
    setAlert(error.toString())
    console.error(error)
  }

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
