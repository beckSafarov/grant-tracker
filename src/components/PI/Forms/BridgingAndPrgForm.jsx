import { useCallback, useState, useEffect, useRef } from 'react'
import { FormControl, Stack, TextField, FormLabel } from '@mui/material'
import Button from '@mui/material/Button'
import FormTitle from './FormTitle'

const BridgingAndPrgForm = ({ onSubmit, grantType }) => {
  const [appCeiling, setAppCeiling] = useState('')
  const [maxAllocation, setMaxAllocation] = useState(20000)
  const inputRef = useRef(null)

  useEffect(() => {
    setMaxAllocation(grantType === 'bridging' ? 25000 : 20000)
    inputRef.current.focus()
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
      <FormTitle> Provide Grant Information</FormTitle>
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
              ref={inputRef}
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
