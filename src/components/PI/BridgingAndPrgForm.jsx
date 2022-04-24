import { useCallback, useState, useEffect } from 'react'
import {
  FormControl,
  Stack,
  TextField,
  Typography,
  FormLabel,
} from '@mui/material'
import Button from '@mui/material/Button'

const BridgingAndPrgForm = ({ onSubmit, grantType }) => {
  const [appCeiling, setAppCeiling] = useState('')
  const [maxAllocation, setMaxAllocation] = useState(20000)

  useEffect(() => {
    setMaxAllocation(grantType === 'bridging' ? 25000 : 20000)
  }, [grantType])

  const handleChange = useCallback(
    (e) => {
      setAppCeiling(e.target.value)
    },
    [setAppCeiling]
  )
  const isAmountValid = +appCeiling > 5000 && +appCeiling <= maxAllocation

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAmountValid) return
    onSubmit({
      period: 12,
      appCeiling: +appCeiling,
    })
  }

  return (
    <>
      <Typography sx={{ textAlign: 'center' }} fontSize='1rem' fontWeight='500'>
        Provide Grant Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '100%' }}>
          <Stack spacing={2}>
            <FormLabel>
              Enter the grant amount between 5000 and {maxAllocation}
            </FormLabel>
            <TextField
              name='appCeiling'
              label='Grant Amount'
              type='number'
              variant='outlined'
              value={appCeiling}
              onChange={handleChange}
            />
            <Button
              disabled={!isAmountValid}
              variant='contained'
              color='primary'
              type='submit'
            >
              Submit
            </Button>
          </Stack>
        </FormControl>
      </form>
    </>
  )
}
BridgingAndPrgForm.defaultProps = {
  onSubmit: () => void 0,
  grantType: '',
}
export default BridgingAndPrgForm
