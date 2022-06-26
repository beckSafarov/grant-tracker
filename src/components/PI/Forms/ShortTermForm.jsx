import { useCallback, useState } from 'react'
import * as Yup from 'yup'
import { FormControl, FormControlLabel, Stack, TextField } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import produce from 'immer'

const emailSchema = Yup.object().shape({
  coResearcherEmail: Yup.string().email().required(),
})

const ShortTermForm = ({ onSubmit }) => {
  const [values, setValues] = useState({
    coResearcherEmail: '',
    st: true,
  })
  const [errors, setErrors] = useState({})

  const handleChange = useCallback(
    ({ target }) => {
      const { name, value } = target
      setValues(
        produce((draft) => {
          draft[name] = name === 'period' ? +value : value
        })
      )
    },
    [setValues]
  )

  const handleSuccess = () => {
    setErrors({})
    onSubmit({
      appCeiling: values.st ? 42000 : 32000,
      ...values,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid = await emailSchema.isValid(values)
    valid ? handleSuccess() : setErrors({ email: 'Please enter a valid email' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <TextField
            name='coResearcherEmail'
            label='Co-Researcher Email'
            type='email'
            variant='outlined'
            value={values.coResearcherEmail}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.st}
                sx={{ pl: 0 }}
                onChange={() =>
                  handleChange({
                    target: { name: 'st', value: !values.st },
                  })
                }
              />
            }
            label='Science & Technology'
          />
          <Button
            disabled={false}
            variant='contained'
            color='primary'
            type='submit'
          >
            Submit
          </Button>
        </Stack>
      </FormControl>
    </form>
  )
}
ShortTermForm.defaultProps = {
  onSubmit: () => void 0,
}
export default ShortTermForm
