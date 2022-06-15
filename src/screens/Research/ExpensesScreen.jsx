import { Button, Paper, Stack } from '@mui/material'
import { useCallback } from 'react'
import { useState } from 'react'
import FloatingAddButton from '../../components/FloatingAddButton'
import ExpenseModal from '../../components/Modals/ExpenseModals/ExpenseModal'
import FilesModal from '../../components/Modals/FilesModal'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import Spinner from '../../components/Spinner'
import StickyHeadTable from '../../components/StickyHeadTable'
import { getArrOfObjects } from '../../helpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ErrorAlert from '../../components/ErrorAlert'
import ExternalLink from '../../components/ExternalLink'
import ExpensesLineChart from '../../components/Charts/ExpensesLineChart'

const columns = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['expenseFor', 'Expense For', 200],
  ['amount', 'Amount (RM)', 150],
  ['vot', 'VOT', 200],
  ['files', 'Files', 200],
])

const ExpensesScreen = () => {
  const [addModal, setAddModal] = useState(false)
  const [filesModal, setFilesModal] = useState({})
  const { grant, error } = useGrantContext()
  const expenses = grant?.expenses || []

  const getLChartLen = useCallback(() => {
    const screen = window?.screen?.availWidth || 1440
    return screen - 500
  }, [window?.screen?.availWidth])

  const buildFilesLinks = ({ files }) => {
    if (!files || files.length < 1) return
    return (
      <Stack direction='column' spacing={1}>
        {files.slice(0, 2).map(({ link, name }, i) => (
          <ExternalLink key={i} to={`${link}`} label={name} />
        ))}
        {files.length === 2 && (
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
      <Stack spacing={3}>
        <Paper elevation={2}>
          <StickyHeadTable
            rows={getRows()}
            columns={columns}
            title='Expenses'
            searchBy={['expenseFor']}
          />
        </Paper>
        <Paper elevation={2} sx={{ px: '10px', py: '15px', width: '100%' }}>
          <ExpensesLineChart
            expenses={expenses}
            width={getLChartLen()}
            height={getLChartLen() / 4}
          />
        </Paper>
      </Stack>
      <FilesModal {...filesModal} onClose={() => setFilesModal({})} />
      <FloatingAddButton onClick={() => setAddModal(true)} />
    </ResearchScreenContainer>
  )
}

export default ExpensesScreen
