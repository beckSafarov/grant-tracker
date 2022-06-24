import { useState, useEffect } from 'react'
import { balanceCheck } from '../../../helpers/expenseHelpers'
import { useGrantContext } from '../../../hooks/ContextHooks'
import ModalBase from '../ModalBase'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Stack } from '@mui/material'
import FormikField from '../../FormikField'
import SubmitButton from '../../SubmitButton'
import { getArrOfObjects } from '../../../helpers'

const validationSchema = Yup.object().shape({
  expenseFor: Yup.string().required(),
  amount: Yup.number().required(),
})

const fields = getArrOfObjects([
  ['name', 'type', 'label'],
  ['expenseFor', 'text', 'Expense For'],
  ['amount', 'number', 'Amount'],
])

const EditExpenseModal = ({ open, onClose, expense }) => {
  const { loading, error, updateExpense, success, grant } = useGrantContext()
  const defValues = { expenseFor: expense?.expenseFor, amount: expense?.amount }
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (success) onClose()
  }, [success])

  const validated = (values) => {
    const { success } = balanceCheck(
      { ...expense, amount: values.amount },
      grant
    )
    setAlert(success ? '' : 'Not enough funding in the VOT')
    return success
  }

  const handleSubmit = (values) => {
    if (!validated(values)) return
    updateExpense(values, grant.id, expense.id)
  }

  const formik = useFormik({
    initialValues: defValues,
    onSubmit: handleSubmit,
    validationSchema,
  })

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      baseSx={{ width: '500px' }}
      loading={loading}
      error={error || alert}
      title='Edit Expense'
      spacing={2}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {fields.map((field, i) => (
            <FormikField key={i} formik={formik} field={field} />
          ))}
        </Stack>
        <SubmitButton />
      </form>
    </ModalBase>
  )
}

EditExpenseModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default EditExpenseModal
