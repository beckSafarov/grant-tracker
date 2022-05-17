import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { useState, useEffect, useCallback } from 'react'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import FormikField from '../components/FormikField'
import { Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import { getParams, omit, setStore } from '../helpers'
import { useUserContext } from '../hooks/ContextHooks'
import { compareEmails, sendToken } from '../firebase/emailControllers'
import AuthFormsBase from '../components/AuthFormsBase'
import { schoolsList as schools, userStatuses as statuses } from '../config'
const initialValues = {
  name: '',
  status: 'regular',
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
  const navigate = useNavigate()
  const params = getParams()

  useEffect(() => {
    if (error) handleError()
  }, [error])

  const handleValidate = (vals) => {
    return vals.password !== vals.confirmPass
      ? { confirmPass: 'Passwords do not match' }
      : {}
  }

  const handleError = useCallback(() => {
    const errMsg = error.toString()
    if (errMsg.match(/email-already-in-use/)) {
      setAlert('You already have an account. Please log in')
      return
    }
    if (errMsg.match(/internal-error/)) {
      setAlert('Sorry, something went wrong in our server. Please try again.')
      return
    }
    setAlert(errMsg)
  }, [error])

  const stageConfirmToken = useCallback(
    async (data) => {
      const { id } = await sendToken(data.email)
      setStore('formData', data)
      navigate('/confirmToken?id=' + id)
    },
    [navigate]
  )

  const handleDean = useCallback(
    async (data) => {
      const valid = await compareEmails(data)
      valid ? stageConfirmToken(data) : setAlert('Wrong email')
    },
    [setAlert]
  )

  const handleSubmit = useCallback((vals) => {
    const userData = omit(vals, ['confirmPass'])
    userData.status === 'regular'
      ? signUp(userData, params)
      : handleDean(userData)
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema,
    validate: handleValidate,
    onSubmit: handleSubmit,
  })

  return (
    <AuthFormsBase title='Sign up' loading={loading} alert={alert}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          {formFields.map((field, i) => (
            <FormikField key={i} formik={formik} field={field} />
          ))}
        </Stack>
        <Box my={3}>
          <Button color='primary' variant='contained' fullWidth type='submit'>
            Submit
          </Button>
        </Box>
      </form>
      <Link to='/login'>
        <Typography variant='span' color='#2196f3' fontSize='0.9rem'>
          Already have an account? Sign in
        </Typography>
      </Link>
    </AuthFormsBase>
  )
}

export default SignUpScreen
