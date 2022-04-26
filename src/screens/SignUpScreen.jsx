import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { useState, useEffect } from 'react'
import PublicHeader from '../components/PublicHeader'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import FormikField from '../components/FormikField'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import { omit } from '../helpers'
import { useUserContext } from '../hooks/ContextHooks'
import Spinner from '../components/Spinner'
import AlertBox from '../components/AlertBox'
const initialValues = {
  name: '',
  status: 'pi',
  school: 'cs',
  email: '',
  password: '',
  confirmPass: '',
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  status: Yup.string().required('Please enter your status'),
  school: Yup.string().required(),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter your email'),
  password: Yup.string().min(6).required('Please enter your password'),
  confirmPass: Yup.string().required('Please confirm your password'),
})

const statuses = [
  { label: 'Dean', value: 'dean' },
  { label: 'Deputy Dean', value: 'depDean' },
  { label: 'Primary Investigator', value: 'pi' },
  { label: 'Co-Researcher', value: 'coResearcher' },
]

const schools = [
  { label: 'Computer Science', value: 'cs' },
  { label: 'Mathematics', value: 'math' },
  { label: 'Biology', value: 'biology' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Management', value: 'management' },
  { label: 'Arts', value: 'arts' },
]

const formFields = [
  { name: 'name', type: 'text', label: 'Full Name' },
  { name: 'email', type: 'email', label: 'Email' },
  { name: 'status', type: 'select', label: 'Status', options: statuses },
  {
    name: 'school',
    type: 'select',
    label: 'School',
    options: schools,
  },
  { name: 'password', type: 'password', label: 'Password' },
  { name: 'confirmPass', type: 'password', label: 'Confirm Password' },
]

const SignUpScreen = () => {
  const [alert, setAlert] = useState('')
  const { loading, signUp, error } = useUserContext()

  useEffect(() => {
    if (error) handleError()
  }, [error])

  const handleValidate = (vals) => {
    return vals.password !== vals.confirmPass
      ? { confirmPass: 'Passwords do not match' }
      : {}
  }

  const handleError = () => {
    let errMsg = error.toString()
    if (error.match(/email-already-in-use/)) {
      errMsg = 'You already have an account. Please log in'
    }
    if (error.match(/internal-error/)) {
      errMsg = 'Sorry, something went wrong in our server. Please try again.'
    }
    setAlert(errMsg)
  }

  const handleSubmit = async (vals) => {
    const userData = omit(vals, ['confirmPass'])
    await signUp(userData)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <PublicHeader />
      <Spinner hidden={!loading} />
      <Box
        fullWidth
        height='100%'
        pt='100px'
        display='flex'
        justifyContent='center'
      >
        <Box
          display='flex'
          flexDirection={'column'}
          width='450px'
          background='blue'
          textAlign='center'
        >
          <h1>Sign up</h1>
          <AlertBox hidden={!alert}>{alert}</AlertBox>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              {formFields.map((field, i) => (
                <FormikField key={i} formik={formik} field={field} />
              ))}
            </Stack>
            <Box my={3}>
              <Button
                color='primary'
                variant='contained'
                fullWidth
                type='submit'
              >
                Submit
              </Button>
            </Box>
          </form>
          <Link to='/login'>
            <Typography variant='span' color='#2196f3' fontSize='0.9rem'>
              Already have an account? Sign in
            </Typography>
          </Link>
        </Box>
      </Box>
    </>
  )
}

export default SignUpScreen
