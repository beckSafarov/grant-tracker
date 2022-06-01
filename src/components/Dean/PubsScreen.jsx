import React, { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import StickyHeadTable from '../StickyHeadTable'
import { usePubContext, useGrantContext } from '../../hooks/ContextHooks'
import Spinner from '../Spinner'
import AlertBox from '../AlertBox'
import { dateFormat } from '../../helpers/dateHelpers'

const titleCols = [
  { field: 'title', label: 'Title', mindWidth: 200 },
  { field: 'grant', label: 'Grant', mindWidth: 200 },
  { field: 'pi', label: 'PI', mindWidth: 200 },
  { field: 'journal', label: 'Journal', mindWidth: 180 },
  { field: 'conference', label: 'Conference', mindWidth: 180 },
  { field: 'year', label: 'Year', mindWidth: 150 },
]

const grantCols = [
  { field: 'grant', label: 'Grant', mindWidth: 220 },
  { field: 'type', label: 'Type', mindWidth: 150 },
  { field: 'pi', label: 'PI', mindWidth: 200 },
  { field: 'pubNumber', label: 'Number of Papers', mindWidth: 150 },
  { field: 'endDate', label: 'Due Date', mindWidth: 150 },
]

const Publications = () => {
  const {
    error: pubError,
    loading: pubLoading,
    publications: pubs,
    getAllPubs,
    success: askedPubs,
  } = usePubContext()
  const {
    loading: grantsLoading,
    error: grantsError,
    allGrants,
    getAllGrants,
  } = useGrantContext()
  const [tab, setTab] = useState('1')
  const loading = pubLoading || grantsLoading
  const error = pubError || grantsError

  useEffect(() => {
    const needPubs = pubs.length < 1 && !askedPubs
    if (needPubs) getAllPubs()
    if (tab === '2' && !allGrants) getAllGrants()
  }, [pubs, askedPubs, allGrants, tab])

  const handleTabSwitch = (e, v) => setTab(v)

  const searchInTitleTable = ({ title, grant, pi }, regex) => {
    return title.match(regex) || grant.match(regex) || pi.match(regex)
  }
  const searchInGrantTable = ({ grant, type, pi }, regex) => {
    return grant.match(regex) || type.match(regex) || pi.match(regex)
  }

  const getByTitleRows = useCallback(() => {
    if (pubs.length < 1) return pubs
    const getPlace = (type, pub) =>
      pub.pubPlace === type ? pub.jonference : '-'

    return pubs.map((pub) => ({
      ...pub,
      grant: pub.grant.type,
      pi: pub.user.name,
      journal: getPlace('journal', pub),
      conference: getPlace('conference', pub),
      year: pub.year,
    }))
  }, [pubs])

  const getByGrantRows = useCallback(() => {
    if (!allGrants) return []
    return allGrants.map((grant) => ({
      grant: grant.title,
      type: grant.type,
      pi: grant.user.name,
      pubNumber: grant.pubNumber || 0,
      endDate: dateFormat(grant.endDate.toDate()),
    }))
  }, [allGrants])

  return (
    <TabContext value={tab}>
      <Spinner hidden={!loading} />
      <AlertBox hidden={!error} sx={{ mt: 2 }}>
        {error?.message}
      </AlertBox>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleTabSwitch} aria-label='lab API tabs example'>
          <Tab label='By Title' value='1' />
          <Tab label='By Grant' value='2' />
        </TabList>
      </Box>
      <TabPanel value='1'>
        <StickyHeadTable
          columns={titleCols}
          rows={getByTitleRows()}
          searchFilter={searchInTitleTable}
        />
      </TabPanel>
      <TabPanel value='2'>
        <StickyHeadTable
          columns={grantCols}
          rows={getByGrantRows()}
          searchFilter={searchInGrantTable}
        />
      </TabPanel>
    </TabContext>
  )
}

export default Publications
