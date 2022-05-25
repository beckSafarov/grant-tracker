import FormTitle from './FormTitle'
import { useFormik } from 'formik'
import { Box } from '@mui/system'
import Stack from '@mui/material/Stack'
import FormikField from '../../FormikField'
import { Button } from '@mui/material'
import * as Yup from 'yup'

const initialValues = {
  title: '',
  type: '',
  startDate: '',
  endDate: '',
}
const formFields = [
  { name: 'title', type: 'text', label: 'Grant Title' },
  {
    name: 'type',
    type: 'select',
    label: 'Grant Type',
    options: [
      { value: 'short', label: 'Short Term' },
      { value: 'ruTeam', label: 'RU Team' },
      { value: 'ruTrans', label: 'RU Trans' },
      { value: 'bridging', label: 'Bridging (Incentive)' },
      { value: 'prg', label: 'Publication Research Grants' },
    ],
  },
  { name: 'startDate', type: 'date', label: 'Start Date' },
  { name: 'endDate', type: 'date', label: 'End Date' },
]

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  type: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.string().required(),
})

const BasicInfoForm = ({ onSubmit }) => {
  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      startDate: new Date(values.startDate),
      endDate: new Date(values.endDate),
    })
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
