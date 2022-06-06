import { useEffect, useState, useCallback } from 'react'
import { Button, Modal, Stack } from '@mui/material'
import AlertBox from '../AlertBox'
import useModalStyles from '../../hooks/useModalStyles'
import { Box } from '@mui/system'
import ComponentTitle from '../ComponentTitle'
import { useFormik } from 'formik'
import FormikField from '../FormikField'
import LocalSpinner from '../LocalSpinner'
import * as Yup from 'yup'
import { useGrantContext } from '../../hooks/ContextHooks'
import { getDateSafely, isBefore } from '../../helpers/dateHelpers'
import { msDatesValidated } from '../../helpers/msHelpers'
const defInitials = {
  name: '',
  startDate: '',
  endDate: '',
  done: false,
}

const buildField = (name, label, type, options) => ({
  name,
  label,
  type,
  options,
})

const formFields = [
  buildField('name', 'Title', 'text'),
  buildField('startDate', 'Start Date', 'date'),
  buildField('endDate', 'End Date', 'date'),
  buildField('done', 'Finished', 'select', [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ]),
]

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
})

/**
 * @data Object {title, startDate, endDate, done}
 */
const EditMilestoneModal = ({ open, onClose, data, currMilestone }) => {
  const sx = useModalStyles({ top: '40%', width: '400px' })
  const {
    grant,
    updateMilestone,
    backup,
    backupLoading,
    backupSuccess,
    resetState,
    error,
  } = useGrantContext()
  const [alert, setAlert] = useState('')
  const [newVals, setNewVals] = useState({})

  useEffect(() => {
    if (backupSuccess) handleSuccess()
    if (error) handleError()
  }, [backupSuccess])

  const handleSuccess = () => {
    resetState('backupSuccess')
    updateMilestone(newVals, newVals.id)
    onClose()
  }

  const handleError = () => {
    setAlert(error.toString())
    console.error(error)
  }

  const getRefinedData = () => {
    return data.id
      ? {
          ...data,
          startDate: getDateSafely(data.startDate),
          endDate: getDateSafely(data.endDate),
        }
      : undefined
  }

  const deepValidated = (vals) => {
    const validated = msDatesValidated({ ...vals, grant })
    setAlert(validated.success ? '' : validated.msg)
    return validated.success
  }

  const handleSubmit = async (vals) => {
    if (!deepValidated(vals)) return
    setNewVals(vals)
    backup('updateMilestone', vals, {
      grant: grant.id,
      ms: vals.id,
    })
  }

  const formik = useFormik({
    initialValues: getRefinedData() || defInitials,
    onSubmit: handleSubmit,
    validationSchema,
  })

  const isFinishable = useCallback(() => {
    const { endDate } = data
    const d2 = getDateSafely(endDate)
    const now = new Date()
    return currMilestone.id === data.id || isBefore(d2, now)
  }, [data])

  const getFormFields = useCallback(() => {
    return formFields.map((field) =>
      field.name === 'done' ? { ...field, disabled: !isFinishable() } : field
    )
  }, [data])

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={sx}>
        <LocalSpinner hidden={!backupLoading} />
        <ComponentTitle>Edit Milestone</ComponentTitle>
        <AlertBox sx={{ mt: 2 }} hidden={!alert}>
          {alert}
        </AlertBox>
        <form onSubmit={formik.handleSubmit}>
          <Stack sx={{ mt: 2 }} spacing={1}>
            {getFormFields().map((field, i) => (
              <div key={i}>
                <small>{field.label}</small>
                <FormikField formik={formik} field={field} noLabel />
              </div>
            ))}
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
    </Modal>
  )
}

EditMilestoneModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default EditMilestoneModal
