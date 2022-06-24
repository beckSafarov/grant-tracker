import { Paper, Stack } from '@mui/material'
import { useCallback } from 'react'
import { useState } from 'react'
import FloatingAddButton from '../../components/FloatingAddButton'
import ExpenseModal from '../../components/Modals/ExpenseModals/ExpenseModal'
import FilesModal from '../../components/Modals/FilesModal'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import Spinner from '../../components/Spinner'
import StickyHeadTable from '../../components/StickyHeadTable'
import { getArrOfObjects, getScreenWidth } from '../../helpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import ErrorAlert from '../../components/ErrorAlert'
import ExpensesLineChart from '../../components/Charts/ExpensesLineChart'
import VotBudgetChart from '../../components/Charts/VotBudgetsChart'
import ExpensesPieChart from '../../components/Charts/ExpensesPieChart'
import LinksToFiles from '../../components/Research/LinksToFiles'
import { dateFormat, getDateSafely } from '../../helpers/dateHelpers'
import useUserStatus from '../../hooks/useUserStatus'
import EditExpenseModal from '../../components/Modals/ExpenseModals/EditExpenseModal'
const rowCharts = [ExpensesPieChart, VotBudgetChart]

const columns = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['expenseFor', 'Expense For', 200],
  ['amount', 'Amount (RM)', 150],
  ['vot', 'VOT', 200],
  ['date', 'Date', 200],
  ['files', 'Files', 200],
])

const ExpensesScreen = () => {
  const [addModal, setAddModal] = useState(false)
  const [filesModal, setFilesModal] = useState({})
  const [editModal, setEditModal] = useState({})
  const { grant, error } = useGrantContext()
  const { isResearcher } = useUserStatus()
  const expenses = grant?.expenses || []
  const isRuGrant = grant?.type?.match(/ru/i)
  const lChartLen = getScreenWidth() - 500

  const getRows = useCallback(() => {
    return expenses.map((expense) => ({
      ...expense,
      date: dateFormat(getDateSafely(expense.date)),
      onClick: () => setEditModal({ open: true, expense }),
      files: (
        <LinksToFiles
          files={expense.files}
          onMore={() => setFilesModal({ open: true, files: expense.files })}
        />
      ),
    }))
  }, [expenses])

  return (
    <ResearchScreenContainer sx={{ pb: '30px' }}>
      <Spinner hidden={true} />
      <ErrorAlert error={error} hidden={addModal} />
      {addModal && (
        <ExpenseModal open={addModal} onClose={() => setAddModal(false)} />
      )}
      <Stack spacing={3}>
        {/* expenses table */}
        <Paper elevation={2}>
          <StickyHeadTable
            rows={getRows()}
            columns={columns}
            title='Expenses'
            searchBy={['expenseFor']}
          />
        </Paper>
        {/* line chart */}
        <Paper elevation={2} sx={{ px: '10px', py: '15px', width: '100%' }}>
          <ExpensesLineChart
            expenses={expenses}
            width={lChartLen}
            height={lChartLen / 4}
          />
        </Paper>
        {/* pie & bar chart */}
        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          flexWrap={isRuGrant ? 'wrap' : ''}
        >
          {rowCharts.map((Chart, i) => (
            <Paper
              key={i}
              elevation={2}
              id={`paper-${i}`}
              sx={{
                p: '15px',
                flex: i === 0 ? 1 : 2,
              }}
            >
              <Chart />
            </Paper>
          ))}
        </Stack>
      </Stack>
      <FilesModal {...filesModal} onClose={() => setFilesModal({})} />
      {editModal.open && (
        <EditExpenseModal {...editModal} onClose={() => setEditModal({})} />
      )}
      <FloatingAddButton
        hidden={!isResearcher}
        onClick={() => setAddModal(true)}
      />
    </ResearchScreenContainer>
  )
}

export default ExpensesScreen
