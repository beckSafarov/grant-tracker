import { Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import FloatingAddButton from '../../components/FloatingAddButton'
import FullyCentered from '../../components/FullyCentered'
import Spinner from '../../components/Spinner'
import { useGrantContext } from '../../hooks/ContextHooks'
import PublicationModal from '../../components/Modals/PublicationModal'
import BasicTable from '../../components/BasicTable'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import { getArrOfObjects } from '../../helpers'
import ErrorAlert from '../../components/ErrorAlert'

const tableColumns = getArrOfObjects([
  ['field', 'label'],
  ['title', 'Title'],
  ['year', 'Year'],
  ['journal', 'Journal'],
  ['conference', 'Conference'],
  ['doi', 'DOI'],
  ['date', 'Added Date'],
])

const Publications = () => {
  const { loading, error, getPubs, grant } = useGrantContext()
  const [modal, setModal] = useState({ open: false })
  const pubs = grant?.publications

  useEffect(() => {
    if (!pubs && grant) getPubs(grant.id)
  }, [grant, pubs])

  const getRows = useCallback(() => {
    const getPlace = (type, pub) =>
      pub.pubPlace === type ? pub.jonference : '-'
    return pubs.map((pub) => ({
      ...pub,
      journal: getPlace('journal', pub),
      conference: getPlace('conference', pub),
    }))
  }, [pubs])

  return (
    <ResearchScreenContainer>
      <Spinner hidden={!loading} />
      <ErrorAlert error={error} hidden={modal.open} />
      {pubs && (
        <>
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
      <FloatingAddButton onClick={() => setModal({ open: true })} />
    </ResearchScreenContainer>
  )
}

export default Publications
