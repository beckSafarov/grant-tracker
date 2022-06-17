import FormTitle from './FormTitle'
import { useFormik } from 'formik'
import { Box } from '@mui/system'
import Stack from '@mui/material/Stack'
import FormikField from '../../FormikField'
import { Button } from '@mui/material'
import * as Yup from 'yup'
import { getArrOfObjects } from '../../../helpers'

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
