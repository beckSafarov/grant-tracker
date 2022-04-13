import { Box } from '@mui/system'
import { useFormik } from 'formik'
import React from 'react'
import PublicHeader from '../components/PublicHeader'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import FormikField from '../components/FormikField'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

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
  { label: 'Deputy Dean', value: 'depdean' },
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
  const formik = useFormik({
    initialValues: {
      name: '',
      status: 'pi',
      school: 'cs',
      email: '',
      password: '',
      confirmPass: '',
    },
    validationSchema,
    validate: (vals) => {
      return vals.password !== vals.confirmPass
        ? { confirmPass: 'Passwords do not match' }
        : {}
    },
    onSubmit: (vals) => {
      console.log(vals)
    },
  })

  return (
    <>
      <PublicHeader />
      <Box
        fullWidth
        height='100vh'
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
          sx={{
            '& .MuiTextField-root': { my: 1 },
          }}
        >
          <h1>Sign up</h1>
          <form onSubmit={formik.handleSubmit}>
            {formFields.map((field, i) => (
              <FormikField key={i} formik={formik} field={field} />
            ))}
            <Box my={1}>
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
