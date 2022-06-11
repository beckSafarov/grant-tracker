import { useState, useEffect } from 'react'
import { Button, FormLabel, Modal, Stack, TextField } from '@mui/material'
import useModalStyles from '../../../hooks/useModalStyles'
import { Box } from '@mui/system'
import ComponentTitle from '../../ComponentTitle'
import LocalSpinner from '../../LocalSpinner'
import AlertBox from '../../AlertBox'
import { useGrantContext } from '../../../hooks/ContextHooks'
import ExpenseInfoStep from './ExpenseInfoStep'
import UploadStep from './UploadStep'

const ExpenseModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1)
  const [alert, setAlert] = useState('')
  const [expenseId, setExpenseId] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const {
    loading: grantLoading,
    error,
    success,
    resetState,
  } = useGrantContext()
  const sx = useModalStyles({ top: '40%', width: '450px' })
  const loading = grantLoading || uploadLoading

  useEffect(() => {
    if (error) handleError()
    if (success) handleSuccess()
  }, [error, success])

  const handleSuccess = () => {
    setStep((s) => (s === 1 ? 2 : s))
    resetState('success')
    step === 2 && onClose()
  }

  const handleError = () => {
    setAlert(error.toString())
    console.error(error)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={sx}>
        <ComponentTitle>New Expense</ComponentTitle>
        <LocalSpinner hidden={!loading} />
        <AlertBox hidden={!alert} sx={{ mt: 2 }}>
          {alert}
        </AlertBox>
        <Box sx={{ mt: 2 }}>
          {step === 1 ? (
            <ExpenseInfoStep
              setAlert={setAlert}
              setLoading={setUploadLoading}
              setExpenseId={setExpenseId}
            />
          ) : (
            <UploadStep setLoading={setUploadLoading} expenseId={expenseId} />
          )}
        </Box>
      </Box>
    </Modal>
  )
}

ExpenseModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default ExpenseModal
