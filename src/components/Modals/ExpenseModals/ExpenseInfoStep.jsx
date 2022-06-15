import React, { useCallback } from 'react'
import { Button, FormLabel, Stack } from '@mui/material'
import { useGrantContext } from '../../../hooks/ContextHooks'
import { VOTS, votDescriptions } from '../../../config'
import { useFormik } from 'formik'
import FormikField from '../../FormikField'
import * as Yup from 'yup'
import { truncate } from 'lodash'
import { balanceCheck } from '../../../helpers/expenseHelpers'
import { v4 } from 'uuid'
import { getArrOfObjects } from '../../../helpers'

const formFields = getArrOfObjects([
  ['name', 'type', 'label', 'options'],
  ['amount', 'number', 'Amount (RM)'],
  ['vot', 'select', 'VOT'],
  ['project', 'select', 'Project', []],
  ['expenseFor', 'text', 'Expense For'],
])

const validationSchema = Yup.object().shape({
  amount: Yup.number().min(1).required(),
  vot: Yup.string().required(),
  expenseFor: Yup.string().required(),
})

const ExpenseInfoStep = ({ setAlert, setExpenseId }) => {
  const { grant, addExpense } = useGrantContext()
  const isRuGrant = useCallback(() => grant.type.match(/ru/), [grant])

  const getProjectOptions = () => {
    const projects = grant.info.projects
    return projects.map(({ id, title }) => ({
      value: id,
      label: title,
    }))
  }

  const getVotOptions = () => {
    const votOptions = VOTS[grant.type]
    const buildObj = (value, label) => ({ value, label })
    return votOptions.map((code) => {
      const desc = truncate(votDescriptions[code], { length: 40 })
      const label = `${code} (${desc})`
      return buildObj(code, label)
    })
  }

  const handleRuGrant = (fields) => {
    const projectOptions = getProjectOptions()
    return fields.map((field) =>
      field.name === 'project' ? { ...field, options: projectOptions } : field
    )
  }

  const handleRegularGrant = (fields) =>
    fields.filter(({ name }) => name !== 'project')

  const getFormFields = useCallback(() => {
    const votOptions = getVotOptions()
    const res = [...formFields].map((field) =>
      field.name === 'vot' ? { ...field, options: votOptions } : field
    )
    return isRuGrant() ? handleRuGrant(res) : handleRegularGrant(res)
  }, [grant])

  const getInitVals = useCallback(() => {
    const defs = {
      amount: '',
      vot: VOTS[grant.type][0],
      expenseFor: '',
    }
    if (isRuGrant()) {
      defs.project = grant.info.projects[0].id
    }
    return defs
  }, [grant])

  const deepValidated = (expense) => {
    const validation = balanceCheck(expense, grant)
    setAlert(validation.success ? '' : 'Not enough funding in the VOT')
    return validation.success
  }

  const handleSubmit = async (expense) => {
    if (!deepValidated(expense)) return
    expense.id = v4()
    expense.date = new Date()
    setExpenseId(expense.id)
    await addExpense(expense, grant.id)
  }

  const formik = useFormik({
    initialValues: getInitVals(),
    onSubmit: handleSubmit,
    validationSchema,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        {getFormFields().map((field, i) => (
          <Stack key={i} spacing={1}>
            <FormLabel>{field.label}</FormLabel>
            <FormikField key={i} formik={formik} field={field} noLabel />
          </Stack>
        ))}
      </Stack>
      <Button type='submit' variant='contained' sx={{ mt: 3, width: '100%' }}>
        Next
      </Button>
    </form>
  )
}

ExpenseInfoStep.defaultProps = {
  open: false,
  onClose: () => void 0,
}
export default ExpenseInfoStep
