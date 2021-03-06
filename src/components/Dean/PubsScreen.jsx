import React, { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import StickyHeadTable from '../StickyHeadTable'
import {
  usePubContext,
  useGrantContext,
  useUserContext,
} from '../../hooks/ContextHooks'
import Spinner from '../Spinner'
import { dateFormat } from '../../helpers/dateHelpers'
import { getArrOfObjects } from '../../helpers'
import PubInfoModal from '../Modals/PubInfoModal'
import ErrorAlert from '../ErrorAlert'

const titleCols = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['title', 'Title', 200],
  ['grant', 'Grant', 200],
  ['pi', 'PI', 200],
  ['journal', 'Journal', 180],
  ['conference', 'Conference', 180],
  ['year', 'Year', 150],
])

const grantCols = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['grant', 'Grant', 220],
  ['type', 'Type', 150],
  ['pi', 'PI', 200],
  ['pubNumber', 'Number of Papers', 150],
  ['endDate', 'Due Date', 150],
])

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
  const { user } = useUserContext()
  const [tab, setTab] = useState('1')
  const [modal, setModal] = useState({ open: false })
  const loading = pubLoading || grantsLoading
  const error = pubError || grantsError

  useEffect(() => {
    const needPubs = pubs.length < 1 && !askedPubs
    if (needPubs) getAllPubs(user.school)
    if (tab === '2' && !allGrants) getAllGrants()
  }, [pubs, askedPubs, allGrants, tab])

  const handleTabSwitch = (e, v) => setTab(v)

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
      onClick: () => setModal({ open: true, pub }),
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
      <ErrorAlert error={error} />
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
          searchBy={['title', 'grant', 'pi']}
        />
      </TabPanel>
      <TabPanel value='2'>
        <StickyHeadTable
          columns={grantCols}
          rows={getByGrantRows()}
          searchBy={['grant', 'type', 'pi']}
        />
      </TabPanel>
      <PubInfoModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        pub={modal.pub}
      />
    </TabContext>
  )
}

export default Publications
