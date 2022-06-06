import { Button, FormLabel, Modal, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useGrantContext } from '../../hooks/ContextHooks'
import useModalStyles from '../../hooks/useModalStyles'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { Box } from '@mui/system'
import ComponentTitle from '../ComponentTitle'
import AlertBox from '../AlertBox'
import { msDatesValidated } from '../../helpers/msHelpers'

const buildField = (name, type, label) => ({
  name,
  type,
  label,
})

const formFields = [
  buildField('name', 'text', 'Name'),
  buildField('startDate', 'date', 'Start Date'),
  buildField('endDate', 'date', 'End Date'),
]

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
})

const MilestonesModal = ({ open, onClose }) => {
  const [alert, setAlert] = useState('')
  const style = useModalStyles({ top: '40%', width: '400px' })
  const { grant, addMilestone, error, success, resetState } = useGrantContext()
  const milestones = grant?.milestones

  useEffect(() => {
    if (error) handleError()
    if (success) handleSuccess()
  }, [error, success])

  const handleError = () => {
    setAlert(error.toString())
    resetState('error')
  }

  const handleSuccess = () => {
    resetState('success')
    onClose()
  }

  const getDefStartDate = useCallback(() => {
    return milestones && milestones.length > 0
      ? [...milestones].pop().endDate
      : new Date()
  }, [milestones])

  const deepValidated = (vals) => {
    const validated = msDatesValidated({ ...vals, grant })
    setAlert(validated.success ? '' : validated.msg)
    return validated.success
  }

  const handleSubmit = (vals) => {
    if (!deepValidated(vals)) return false
    const refined = {
      ...vals,
      startDate: new Date(vals.startDate),
      endDate: new Date(vals.endDate),
      done: false,
    }
    addMilestone(refined, grant.id)
    onClose()
  }

  const formikStuff = {
    initialValues: {
      name: '',
      startDate: getDefStartDate(),
      endDate: '',
    },
    onSubmit: handleSubmit,
    validationSchema,
  }

  const handleClose = () => {
    setAlert('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <ComponentTitle>New Modal</ComponentTitle>
        <AlertBox hidden={!alert} sx={{ mt: 2 }}>
          {alert}
        </AlertBox>
        <Formik {...formikStuff}>
          <Form>
            {formFields.map((formField, i) => (
              <Box sx={{ mt: 2 }} key={i}>
                <Field name={formField.name}>
                  {({ field, form }) => {
                    const { touched, errors } = form
                    const error = touched[field.name] && errors[field.name]
                    const hText =
                      field.name === 'endDate'
                        ? 'Milestone length should not be less than 10 days'
                        : error
                    return (
                      <Stack spacing={1}>
                        <FormLabel sx={{ fontSize: '0.8rem' }}>
                          {formField.label}
                        </FormLabel>
                        <TextField
                          {...field}
                          error={Boolean(error)}
                          helperText={error}
                          type={formField.type}
                          fullWidth
                        />
                      </Stack>
                    )
                  }}
                </Field>
              </Box>
            ))}
            <Button
              type='submit'
              variant='contained'
              sx={{ mt: 3, width: '100%' }}
            >
              Submit
            </Button>
          </Form>
        </Formik>
      </Box>
    </Modal>
  )
}

MilestonesModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default MilestonesModal
