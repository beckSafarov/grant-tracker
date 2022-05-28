import React, { useState, useEffect } from 'react'
import { Button, Modal, Stack, Typography } from '@mui/material'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getCurrYear } from '../helpers/dateHelpers'
import { useTheme } from '@emotion/react'
import { Box } from '@mui/system'
import FormikField from './FormikField'
import { useUserContext } from '../hooks/ContextHooks'
import { useGrantContext } from '../hooks/ContextHooks'
import AlertBox from './AlertBox'
import Spinner from './Spinner'

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  width: '500px',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
}

const initialValues = {
  title: '',
  year: getCurrYear(),
  journal: '',
  doi: '',
}

const formFields = [
  { name: 'title', type: 'text', label: 'Title' },
  { name: 'year', type: 'number', label: 'Year' },
  { name: 'journal', type: 'text', label: 'Journal' },
  { name: 'doi', type: 'text', label: 'DOI' },
]

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  year: Yup.number().required(),
  journal: Yup.string().required(),
  doi: Yup.string().required(),
})

const PublicationModal = ({ open, onClose }) => {
  const { text } = useTheme()
  const { user } = useUserContext()
  const [alert, setAlert] = useState('')
  const { loading, error, grant, addPub, success, resetState } =
    useGrantContext()

  useEffect(() => {
    if (error) handleError()
    if (success) handleSuccess()
  }, [error, success])

  const handleError = () => {
    setAlert(error.toString())
    resetState('error')
  }

  const handleSuccess = () => {
    resetState('success')
    onClose()
  }

  const handleSubmit = (values, { resetForm }) => {
    const date = new Date()
    const pubNumber = grant.pubNumber ? grant.pubNumber + 1 : 1
    addPub({ ...values, grantId: grant.id, uid: user.uid, date }, pubNumber)
    resetForm()
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema,
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Spinner hidden={!loading} />
        <Typography fontSize='1rem' color={text.blue}>
          New Publication
        </Typography>
        <AlertBox sx={{ mt: 2 }} hidden={!alert}>
          {alert}
        </AlertBox>
        <Box sx={{ mt: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              {formFields.map((field, i) => (
                <FormikField key={i} formik={formik} field={field} />
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
      </Box>
    </Modal>
  )
}

PublicationModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default PublicationModal
