import {
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import FloatingAddButton from '../../components/FloatingAddButton'
import FullyCentered from '../../components/FullyCentered'
import Spinner from '../../components/Spinner'
import { useGrantContext } from '../../hooks/ContextHooks'
import PublicationModal from '../../components/Modals/PublicationModal'
import BasicTable from '../../components/BasicTable'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import { getArrOfObjects, isNone } from '../../helpers'
import ErrorAlert from '../../components/ErrorAlert'
import useUserStatus from '../../hooks/useUserStatus'
import useIsGrantActive from '../../hooks/useIsGrantActive'

const tableColumns = getArrOfObjects([
  ['field', 'label'],
  ['title', 'Title'],
  ['year', 'Year'],
  ['journal', 'Journal'],
  ['conference', 'Conference'],
  ['doi', 'DOI'],
  ['date', 'Added Date'],
])

const sortOptions = {
  year: 'Year',
  date: 'Added Date',
}

const Publications = () => {
  const { loading, error, getPubs, grant } = useGrantContext()
  const { isPi } = useUserStatus()
  const isActiveGrant = useIsGrantActive()
  const [modal, setModal] = useState({ open: false })
  const [sortBy, setSortBy] = useState('year')
  const pubs = grant?.publications
  const canAdd = isPi && isActiveGrant

  useEffect(() => {
    if (!pubs && grant) getPubs(grant.id)
  }, [grant, pubs])

  const getRows = useCallback(() => {
    const getPlace = (type, pub) =>
      pub.pubPlace === type ? pub.jonference : '-'
    return pubs
      .map((pub) => ({
        ...pub,
        journal: getPlace('journal', pub),
        conference: getPlace('conference', pub),
      }))
      .sort((x, y) => x[sortBy] - y[sortBy])
  }, [pubs, sortBy])

  return (
    <ResearchScreenContainer>
      <Spinner hidden={!loading} />
      <ErrorAlert error={error} hidden={modal.open} />
      {pubs && (
        <>
          {pubs.length > 0 && (
            <Stack
              direction='row'
              justifyContent='flex-start'
              alignItems='center'
              spacing={1}
            >
              <div>Sort By</div>
              <ToggleButtonGroup
                color='primary'
                value={sortBy}
                exclusive
                onChange={(e) => setSortBy(e.target.value)}
                size='small'
              >
                {Object.keys(sortOptions).map((option, i) => (
                  <ToggleButton key={i} value={option}>
                    {sortOptions[option]}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          )}
          {pubs.length > 0 && (
            <BasicTable columns={tableColumns} rows={getRows()} hover />
          )}

          <FullyCentered left='56%' hidden={pubs.length > 0}>
            <Typography fontSize='2rem' color='gray'>
              No Publications yet
            </Typography>
          </FullyCentered>
        </>
      )}
      <PublicationModal open={modal.open} onClose={() => setModal({})} />
      <FloatingAddButton
        hidden={!canAdd}
        onClick={() => setModal({ open: true })}
      />
    </ResearchScreenContainer>
  )
}

export default Publications
