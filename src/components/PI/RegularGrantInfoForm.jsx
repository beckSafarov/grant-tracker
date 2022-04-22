import { useCallback, useEffect, useState } from 'react'
import * as Yup from 'yup'
import {
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { isEmptyObj } from '../../helpers'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'

const fields = [
  { name: 'appCeiling', type: 'number', label: 'Application Ceiling' },
  { name: 'coResearcherEmail', type: 'email', label: 'Co-Researcher Email' },
  {
    name: 'researchPeriod',
    type: 'number',
    label: 'Research Period in months',
  },
]

const validationSchema = Yup.object().shape({
  appCeiling: Yup.number().required('Please enter your application ceiling'),
  coResearcherEmail: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter an email'),
  researchPeriod: Yup.number().required(
    'Please enter your application ceiling'
  ),
})

const defaults = {
  appCeiling: '',
  coResearcherEmail: '',
  researchPeriod: '',
  st: true,
}

const RegularGrantInfoForm = ({ onSubmit, defaultValues: previousValues }) => {
  const [initialValues, setInitialValues] = useState(defaults)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmit,
  })

  useEffect(() => {
    if (!isEmptyObj(previousValues)) {
      setInitialValues(previousValues)
    }
  }, [formik.errors, previousValues])

  const hasError = (name) =>
    formik.touched[name] && Boolean(formik.errors[name])

  const needHelperText = (name) => formik.touched[name] && formik.errors[name]

  const canSubmit = useCallback(() => {
    if (!isEmptyObj(formik.errors)) return false
    const { appCeiling, coResearcherEmail, researchPeriod } = formik.values
    return appCeiling && coResearcherEmail && researchPeriod
  }, [formik.errors, formik.values])

  return (
    <>
      <Typography sx={{ textAlign: 'center' }} fontSize='1rem' fontWeight='500'>
        Provide Grant Information
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={{ width: '100%' }}>
          <Stack spacing={2}>
            {fields.map((field, i) => (
              <TextField
                key={i}
                name={field.name}
                label={field.label}
                type={field.type}
                variant='outlined'
                value={formik.values[field.name]}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={hasError(field.name)}
                helperText={needHelperText(field.name)}
              />
            ))}

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.st}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={(e) => {
                    formik.handleChange({
                      target: {
                        name: 'st',
                        value: !formik.values.st,
                      },
                    })
                  }}
                />
              }
              label='Science & Technology'
            />
            <Button
              disabled={!canSubmit()}
              variant='contained'
              color='primary'
              type='submit'
            >
              Submit
            </Button>
          </Stack>
        </FormControl>
      </form>
    </>
  )
}
RegularGrantInfoForm.defaultProps = {
  onSubmit: () => void 0,
  defaultValues: {},
}
export default RegularGrantInfoForm
