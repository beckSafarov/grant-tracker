import { Box } from '@mui/system'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import PublicHeader from '../components/PublicHeader'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import FormikField from '../components/FormikField'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Typography } from '@mui/material'
import Stack from '@mui/material/Stack'
import { emailSignIn } from '../firebase/auth'

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
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleError = ({ errorMessage: err }) => {
    if (err.match(/password|user-not-found/gi)) {
      setError('Invalid Credentials')
      return
    }
    setError(err)
  }

  const handleSubmit = async (vals) => {
    const res = await emailSignIn(vals)
    res.success ? navigate('/dean/dashboard') : handleError(res)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  })
  return (
    <>
      <PublicHeader />
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
          <h1>Log in</h1>
          {error && (
            <Box my={2}>
              <Alert severity='error' my={2}>
                {error}
              </Alert>
            </Box>
          )}
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
          <Link to='/signup'>
            <Typography variant='span' fontSize='0.9rem' color='#2196f3'>
              Do not have an account yet? Sign up
            </Typography>
          </Link>
        </Box>
      </Box>
    </>
  )
}

export default LoginScreen
