import { Button, FormLabel, Modal, Stack, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useGrantContext } from '../../hooks/ContextHooks'
import useModalStyles from '../../hooks/useModalStyles'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { Box } from '@mui/system'
import ComponentTitle from '../ComponentTitle'
import { msDatesValidated } from '../../helpers/msHelpers'
import ErrorAlert from '../ErrorAlert'
import { getArrOfObjects } from '../../helpers'

const formFields = getArrOfObjects([
  ['name', 'type', 'label'],
  ['name', 'text', 'Name'],
  ['startDate', 'date', 'Start Date'],
  ['endDate', 'date', 'End Date'],
])

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
    if (success) handleSuccess()
  }, [success])

  const handleSuccess = () => {
    resetState('success')
    onClose()
  }

  const getDefStartDate = useCallback(() => {
    return milestones && milestones.length > 0
      ? [...milestones].pop().endDate
      : new Date()
  }, [milestones])

  const datesValidated = (vals) => {
    const validated = msDatesValidated({ ...vals, grant })
    setAlert(validated.msg || '')
    return validated.success
  }

  const handleSubmit = (vals) => {
    if (!datesValidated(vals)) return false
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
        <ComponentTitle>New Milestone</ComponentTitle>
        <ErrorAlert
          error={error || alert}
          onError={() => error && resetState('error')}
        />
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
