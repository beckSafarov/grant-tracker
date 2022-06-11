import { Button, Paper, Stack, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { useState } from 'react'
import FloatingAddButton from '../../components/FloatingAddButton'
import ExpenseModal from '../../components/Modals/ExpenseModals/ExpenseModal'
import FilesModal from '../../components/Modals/FilesModal'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import Spinner from '../../components/Spinner'
import StickyHeadTable from '../../components/StickyHeadTable'
import { buildFormFieldObj as buildField } from '../../helpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ErrorAlert from '../../components/ErrorAlert'

const columns = [
  buildField('expenseFor', 'Expense For', 200),
  buildField('amount', 'Amount (RM)', 150),
  buildField('vot', 'VOT', 200),
  buildField('files', 'Files', 200),
]

const ExpensesScreen = () => {
  const [alert, setAlert] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [filesModal, setFilesModal] = useState({})
  const { grant, error } = useGrantContext()
  const expenses = grant?.expenses || []
  const { text } = useTheme()

  const buildFilesLinks = ({ files }) => {
    if (!files || files.length < 1) return
    return (
      <Stack direction='column' spacing={1}>
        {files.slice(0, 2).map(({ link, name }, i) => (
          <a
            key={i}
            className='underlineOnHover'
            target='_blank'
            href={`${link}`}
            style={{ color: text.blue }}
          >
            {name}
          </a>
        ))}
        {files.length > 2 && (
          <Button
            type='click'
            variant='text'
            size='small'
            onClick={() => setFilesModal({ open: true, files })}
          >
            <OpenInNewIcon sx={{ fontSize: '1rem' }} />
          </Button>
        )}
      </Stack>
    )
  }

  const getRows = useCallback(() => {
    return expenses.map((expense) => ({
      ...expense,
      files: buildFilesLinks(expense),
    }))
  }, [expenses])

  return (
    <ResearchScreenContainer>
      <Spinner hidden={true} />
      <ErrorAlert error={error} hidden={addModal} />
      {addModal && (
        <ExpenseModal open={addModal} onClose={() => setAddModal(false)} />
      )}
      <Paper elevation={2}>
        <StickyHeadTable
          rows={getRows()}
          columns={columns}
          title='Expenses'
          searchBy={['expenseFor']}
        />
      </Paper>
      <FilesModal {...filesModal} onClose={() => setFilesModal({})} />
      <FloatingAddButton onClick={() => setAddModal(true)} />
    </ResearchScreenContainer>
  )
}

export default ExpensesScreen
