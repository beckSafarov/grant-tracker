import { useState, useEffect } from 'react'
import { Box } from '@mui/system'
import { useGrantContext } from '../../../hooks/ContextHooks'
import ExpenseInfoStep from './ExpenseInfoStep'
import UploadStep from './UploadStep'
import ModalBase from '../ModalBase'

const ExpenseModal = ({ open, onClose }) => {
  const [step, setStep] = useState(2)
  const [alert, setAlert] = useState('')
  const [expenseId, setExpenseId] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const {
    loading: grantLoading,
    error,
    success,
    resetState,
  } = useGrantContext()
  const loading = grantLoading || uploadLoading

  useEffect(() => {
    if (success) handleSuccess()
  }, [success])

  const handleSuccess = () => {
    setStep((s) => (s === 1 ? 2 : s))
    resetState('success')
    step === 2 && onClose()
  }

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title='New Expense'
      loading={loading}
      error={error || alert}
      baseSx={{ top: '40%', width: '450px' }}
    >
      <Box sx={{ mt: 2 }}>
        {step === 1 ? (
          <ExpenseInfoStep setAlert={setAlert} setExpenseId={setExpenseId} />
        ) : (
          <UploadStep setLoading={setUploadLoading} expenseId={expenseId} />
        )}
      </Box>
    </ModalBase>
  )
}

ExpenseModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default ExpenseModal
