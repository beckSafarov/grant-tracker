import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import AlertBox from '../../components/AlertBox'
import FloatingAddButton from '../../components/FloatingAddButton'
import FullyCentered from '../../components/FullyCentered'
import Spinner from '../../components/Spinner'
import { useGrantContext } from '../../hooks/ContextHooks'
import PublicationModal from '../../components/Modals/PublicationModal'
import BasicTable from '../../components/BasicTable'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'

const tableColumns = [
  { field: 'title', label: 'Title' },
  { field: 'year', label: 'Year' },
  { field: 'journal', label: 'Journal' },
  { field: 'doi', label: 'DOI' },
  { field: 'date', label: 'Added Date' },
]

const Publications = () => {
  const { loading, error, getPubs, grant } = useGrantContext()
  const [alert, setAlert] = useState('')
  const [modal, setModal] = useState({ open: false })
  const pubs = grant?.publications

  useEffect(() => {
    if (!pubs && grant) getPubs(grant.id)
    if (error) handleError()
  }, [grant, pubs])

  const handleError = () => {
    if (!modal.open) setAlert(error.toString())
    console.error(error)
  }

  return (
    <ResearchScreenContainer>
      <Spinner hidden={!loading} />
      <AlertBox my={2} hidden={!alert}>
        {alert}
      </AlertBox>
      {pubs && (
        <>
          {pubs.length > 0 && (
            <BasicTable columns={tableColumns} rows={pubs} hover />
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
