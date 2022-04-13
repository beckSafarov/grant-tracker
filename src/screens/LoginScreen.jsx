import { Box } from '@mui/system'
import { useFormik } from 'formik'
import React from 'react'
import PublicHeader from '../components/PublicHeader'
import * as Yup from 'yup'
import Button from '@mui/material/Button'
import FormikField from '../components/FormikField'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

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
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
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
          <h1>Log in</h1>
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
