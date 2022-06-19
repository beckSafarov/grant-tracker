import FormTitle from './FormTitle'
import { useFormik } from 'formik'
import { Box } from '@mui/system'
import Stack from '@mui/material/Stack'
import FormikField from '../../FormikField'
import { Button } from '@mui/material'
import * as Yup from 'yup'
import { getArrOfObjects } from '../../../helpers'
import ErrorAlert from '../../ErrorAlert'
import { useState } from 'react'
import { grantPeriodValidated } from '../../../helpers/newGrantHelpers'

const initialValues = {
  title: '',
  type: 'short',
  startDate: '',
  endDate: '',
}

const grantOptions = getArrOfObjects([
  ['value', 'label'],
  ['short', 'Short Term'],
  ['ruTeam', 'RU Team'],
  ['ruTrans', 'RU Trans'],
  ['bridging', 'Bridging (Incentive)'],
  ['prg', 'Publication Research Grants'],
])

const formFields = getArrOfObjects([
  ['name', 'type', 'label', 'options'],
  ['title', 'text', 'Grant Title'],
  ['type', 'select', 'Grant Type', grantOptions],
  ['startDate', 'date', 'Start Date'],
  ['endDate', 'date', 'End Date'],
])

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  type: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.string().required(),
})

const BasicInfoForm = ({ onSubmit }) => {
  const [error, setError] = useState('')

  const datesValidated = (values) => {
    const validated = grantPeriodValidated(values)
    setError(validated.msg || '')
    return validated.success
  }

  const handleSubmit = (values) => {
    const dataToSubmit = {
      ...values,
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
    }
    if (!datesValidated(dataToSubmit)) return
    onSubmit(dataToSubmit)
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema,
  })

  return (
    <>
      <FormTitle>Enter the grant information</FormTitle>
      <Box sx={{ mt: 2 }}>
        <ErrorAlert error={error} />
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={1}>
            {formFields.map((field, i) => (
              <div key={i}>
                <p>{field.label}</p>
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
    </>
  )
}

BasicInfoForm.defaultProps = {
  onSubmit: () => void 0,
  defaultValue: '',
}
export default BasicInfoForm
