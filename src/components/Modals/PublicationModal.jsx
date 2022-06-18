import React, { useEffect } from 'react'
import {
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
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
import { getArrOfObjects } from '../../helpers'
import ErrorAlert from '../ErrorAlert'
const currYear = getCurrYear()
const initialValues = {
  title: '',
  year: currYear,
  pubPlace: 'journal',
  jonference: '',
  doi: '',
}

const radios = [
  { label: 'Journal', value: 'journal' },
  { label: 'Conference', value: 'conference' },
]

const formFields = getArrOfObjects([
  ['name', 'type', 'label'],
  ['title', 'text', 'Title'],
  ['year', 'number', 'Year'],
  ['jonference', 'text', 'Journal/Conference name'],
  ['doi', 'text', 'DOI'],
])

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  year: Yup.number().max(currYear).required(),
  jonference: Yup.string().required(),
  doi: Yup.string().required(),
})

const PublicationModal = ({ open, onClose }) => {
  const { text } = useTheme()
  const { user } = useUserContext()
  const style = useModalStyles({ top: '40%', width: '500px' })
  const { loading, error, grant, addPub, success, resetState } =
    useGrantContext()

  useEffect(() => {
    if (success) handleSuccess()
  }, [success])

  const handleSuccess = () => {
    resetState('success')
    onClose()
  }

  const buildPubData = (values) => {
    return {
      ...values,
      date: new Date(),
      grant: { id: grant.id, type: grant.type, endDate: grant.endDate },
      grantId: grant.id,
      uid: user.uid,
      user: { uid: user.uid, name: user.name },
    }
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
        <ErrorAlert error={error} onError={() => resetState('error')} />
        <Box sx={{ mt: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              {formFields.map((field, i) => (
                <div key={i}>
                  {field.name === 'jonference' && (
                    <RadioGroup
                      name='pubPlace'
                      value={formik.values.pubPlace}
                      onChange={formik.handleChange}
                      sx={{ display: 'flex', flexDirection: 'row', mb: '20px' }}
                    >
                      {radios.map((radio, i) => (
                        <FormControlLabel
                          key={i}
                          value={radio.value}
                          control={<Radio />}
                          label={radio.label}
                        />
                      ))}
                    </RadioGroup>
                  )}
                  <FormikField key={i} formik={formik} field={field} />
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
      </Box>
    </Modal>
  )
}

PublicationModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default PublicationModal
