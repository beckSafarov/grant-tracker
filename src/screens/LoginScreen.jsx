import { Box } from '@mui/system'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import FormikField from '../components/FormikField'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import { useUserContext } from '../hooks/ContextHooks'
import AuthFormsBase from '../components/AuthFormsBase'

const initialValues = {
  email: '',
  password: '',
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Please enter your email'),
  password: Yup.string().min(6).required('Please enter your password'),
})

const formFields = [
  { name: 'email', type: 'email', label: 'Email' },
  { name: 'password', type: 'password', label: 'Password' },
]

const LoginScreen = () => {
  const [alert, setAlert] = useState('')
  const { loading, signIn, error } = useUserContext()

  useEffect(() => {
    if (error) handleError()
  }, [error])

  const handleError = () => {
    const err = error.toString()
    const credentials = /password|user-not-found/gi
    setAlert(err.match(credentials) ? 'Invalid Credentials' : err)
  }

  const handleSubmit = async (vals) => await signIn(vals)

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })
  return (
    <AuthFormsBase title='Login' loading={loading} alert={alert}>
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
      <Link to='/signup'>
        <Typography variant='span' fontSize='0.9rem' color='#2196f3'>
          Do not have an account yet? Sign up
        </Typography>
      </Link>
    </AuthFormsBase>
  )
}

export default LoginScreen
