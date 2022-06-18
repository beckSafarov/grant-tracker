import { useEffect, useState } from 'react'
import { Button, Stack } from '@mui/material'
import { useFormik } from 'formik'
import FormikField from '../FormikField'
import * as Yup from 'yup'
import { useGrantContext } from '../../hooks/ContextHooks'
import { getDateSafely } from '../../helpers/dateHelpers'
import { msDatesValidated } from '../../helpers/msHelpers'
import { getArrOfObjects } from '../../helpers'
import ModalBase from './ModalBase'
const defInitials = {
  name: '',
  startDate: '',
  endDate: '',
  done: false,
}

const formFields = getArrOfObjects([
  ['name', 'label', 'type'],
  ['name', 'Title', 'text'],
  ['startDate', 'Start Date', 'date'],
  ['endDate', 'End Date', 'date'],
])

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
})

/**
 * @data Object {title, startDate, endDate, done}
 */
const EditMilestoneModal = ({ open, onClose, data }) => {
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
  }, [backupSuccess])

  const handleSuccess = () => {
    resetState('backupSuccess')
    updateMilestone(newVals, newVals.id)
    onClose()
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

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      baseSx={{ top: '40%', width: '400px' }}
      title='Edit Milestone'
      loading={backupLoading}
      error={error || alert}
    >
      <form onSubmit={formik.handleSubmit}>
        <Stack sx={{ mt: 2 }} spacing={1}>
          {formFields.map((field, i) => (
            <div key={i}>
              <small>{field.label}</small>
              <FormikField formik={formik} field={field} noLabel />
            </div>
          ))}
        </Stack>
        <Button type='submit' variant='contained' sx={{ mt: 3, width: '100%' }}>
          Submit
        </Button>
      </form>
    </ModalBase>
  )
}

EditMilestoneModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default EditMilestoneModal
