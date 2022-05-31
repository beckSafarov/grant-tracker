import React, { useState, useEffect } from 'react'
import { Button, Modal, Stack, Typography } from '@mui/material'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { getCurrYear } from '../../helpers/dateHelpers'
import { useTheme } from '@emotion/react'
import { Box } from '@mui/system'
import FormikField from '../FormikField'
import { useUserContext } from '../../hooks/ContextHooks'
import { useGrantContext } from '../../hooks/ContextHooks'
import AlertBox from '../AlertBox'
import Spinner from '../Spinner'
import useModalStyles from '../../hooks/useModalStyles'

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
  const style = useModalStyles({ top: '40%', width: '500px' })
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

  const buildPubData = (values) => {
    return { ...values, grantId: grant.id, uid: user.uid, data: new Date() }
  }

  const getPubNumbers = () => {
    const grantPubNumber = grant.publications
      ? grant.publications.length + 1
      : 1
    const userPubNumber = user.pubNumber ? user.pubNumber + 1 : 1
    return { grantPubNumber, userPubNumber }
  }

  const handleSubmit = (values, { resetForm }) => {
    addPub(buildPubData(values), getPubNumbers())
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
