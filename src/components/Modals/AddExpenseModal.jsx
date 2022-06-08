import React, { useCallback, useEffect, useState } from 'react'
import { Button, FormLabel, Modal, Stack, TextField } from '@mui/material'
import useModalStyles from '../../hooks/useModalStyles'
import { Box } from '@mui/system'
import ComponentTitle from '../ComponentTitle'
import AlertBox from '../AlertBox'
import { useGrantContext } from '../../hooks/ContextHooks'
import { VOTS, votDescriptions } from '../../config'
import { useFormik } from 'formik'
import FormikField from '../FormikField'
import * as Yup from 'yup'
import LocalSpinner from '../LocalSpinner'
import { upload } from '../../firebase/uploadController'
import { truncate } from 'lodash'
import { balanceCheck } from '../../helpers/expenseHelpers'
const buildField = (name, type, label, options) => ({
  name,
  type,
  label,
  options,
})

const formFields = [
  buildField('amount', 'number', 'Amount (RM)'),
  buildField('vot', 'select', 'VOT'),
  buildField('project', 'select', 'Project', []),
  buildField('expenseFor', 'text', 'Expense For'),
]

const validationSchema = Yup.object().shape({
  amount: Yup.number().min(1).required(),
  vot: Yup.string().required(),
  expenseFor: Yup.string().required(),
})

const AddExpenseModal = ({ open, onClose }) => {
  const sx = useModalStyles({ top: '40%', width: '450px' })
  const { grant, loading, error } = useGrantContext()
  const [alert, setAlert] = useState('')
  const [imageUpload, setImageUpload] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const isRuGrant = useCallback(() => grant.type.match(/ru/), [grant])

  useEffect(() => {
    if (error) handleError()
  }, [error])

  const handleError = () => setAlert(error.toString())

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
      amount: 0,
      vot: VOTS[grant.type][0],
      expenseFor: '',
    }
    if (isRuGrant()) {
      defs.project = grant.info.projects[0].id
    }
    return defs
  }, [grant])

  const handleUpload = async () => {
    if (!imageUpload) return
    setUploadLoading(true)
    const url = await upload(imageUpload)
    setUploadLoading(false)
    return url
  }

  const deepValidated = (expense) => {
    const validation = balanceCheck(expense, grant)
    setAlert(validation.success ? '' : 'Not enough funding in the VOT')
    return validation.success
  }

  const handleSubmit = async (expense) => {
    if (!deepValidated(expense)) return
    const url = await handleUpload()
    console.log({
      ...expense,
      imageUrl: url,
    })
  }

  const formik = useFormik({
    initialValues: getInitVals(),
    onSubmit: handleSubmit,
    validationSchema,
  })

  const handleClose = () => {
    setAlert('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={sx}>
        <ComponentTitle>New Expense</ComponentTitle>
        <LocalSpinner hidden={!loading} />
        <AlertBox hidden={!alert} sx={{ mt: 2 }}>
          {alert}
        </AlertBox>
        <Box sx={{ mt: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              {getFormFields().map((field, i) => (
                <Stack key={i} spacing={1}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormikField key={i} formik={formik} field={field} noLabel />
                </Stack>
              ))}
              <TextField
                type='file'
                name='file'
                accept='image/jpg, image/jpeg, image/png'
                onChange={(e) => setImageUpload(e.target.files[0])}
              />
            </Stack>
            <Button
              type='submit'
              variant='contained'
              sx={{ mt: 3, width: '100%' }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}

AddExpenseModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}
export default AddExpenseModal
