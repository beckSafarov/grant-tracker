import { Button, FormLabel, Modal, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useGrantContext } from '../../hooks/ContextHooks'
import useModalStyles from '../../hooks/useModalStyles'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { Box } from '@mui/system'
import ComponentTitle from '../ComponentTitle'
import AlertBox from '../AlertBox'

const formFields = [
  { name: 'name', type: 'text', label: 'Name' },
  { name: 'startDate', type: 'date', label: 'Start Date' },
  { name: 'endDate', type: 'date', label: 'End Date' },
]

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
})

const MilestonesModal = ({ open, onClose }) => {
  const [alert, setAlert] = useState('')
  const style = useModalStyles({ width: '400px' })
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

  const initialValues = {
    name: '',
    startDate: getDefStartDate(),
    endDate: '',
  }

  const handleSubmit = (vals) => {
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
    initialValues,
    onSubmit: handleSubmit,
    validationSchema,
  }

  return (
    <Modal open={open} onClose={onClose}>
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
