import { Button, Stack, TextField } from '@mui/material'
import React from 'react'
import { useGrantContext } from '../../hooks/ContextHooks'
import ModalBase from './ModalBase'
import { GRANT_PERIODS } from '../../config'
import { useState } from 'react'
import produce from 'immer'
import { getDateSafely, getMonthsAdded } from '../../helpers/dateHelpers'
import { useEffect } from 'react'

const GrantEditModal = ({ open, onClose }) => {
  const { loading, grant, success, updateGrant, error } = useGrantContext()
  const defValues = {
    title: grant?.title || '',
    moreMonths: 0,
  }
  const [values, setValues] = useState(defValues)

  useEffect(() => {
    if (success) handleClose()
  }, [success])

  const getExtensionOptions = () => {
    if (!grant) return []
    const maxMonths = GRANT_PERIODS[grant.type].extension
    const list = Array(maxMonths + 1).fill(0, 0, maxMonths + 1)
    return list.map((_, i) => ({
      label: i,
      value: i,
    }))
  }

  const handleChange = (name, value) =>
    setValues(
      produce((draft) => {
        draft[name] = value
      })
    )

  const getNewEndDate = () => {
    const currEndDate = getDateSafely(grant.endDate)
    return getMonthsAdded(values.moreMonths, currEndDate)
  }

  const buildValsToSubmit = () => {
    const vals = {}
    if (values.moreMonths > 0) {
      vals.endDate = getNewEndDate()
    }
    vals.title = values.title || grant.title
    return vals
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updates = buildValsToSubmit()
    updateGrant(grant.id, updates)
  }

  const handleClose = () => {
    setValues(defValues)
    onClose()
  }

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      title='Edit Grant'
      spacing={2}
      loading={loading}
      error={error}
      baseSx={{ width: '500px' }}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            type={'text'}
            label={'Grant Title'}
            fullWidth
          />
          <TextField
            value={values.monthMore}
            onChange={(e) => handleChange('moreMonths', +e.target.value)}
            type={'select'}
            label={'Extend By Months'}
            SelectProps={{ native: true }}
            select
            fullWidth
          >
            {getExtensionOptions().map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button
            type='submit'
            variant='contained'
            sx={{ mt: 3, width: '100%' }}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </ModalBase>
  )
}

export default GrantEditModal
