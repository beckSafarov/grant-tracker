import { Button, Stack, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AuthFormsBase from '../components/AuthFormsBase'
import { compareTokens } from '../firebase/emailControllers'
import { getStore } from '../helpers'
import { useUserContext } from '../hooks/ContextHooks'

const TokenEnterScreen = () => {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { search } = useLocation()
  const { signUp, error: signUpError } = useUserContext()
  const id = search.split('=')[1]

  useEffect(() => {
    if (signUpError) setError(signUpError.toString())
  }, [signUpError])

  const handleSuccess = async () => {
    setError('')
    const data = getStore('formData')
    await signUp(data)
  }

  const handleError = async () => {
    setError('Invalid token')
  }

  const handleSubmit = async () => {
    if (!token || token.length < 6) {
      setError('Token should be 6 digits')
      return
    }
    setLoading(true)
    const valid = await compareTokens(Number(token), id)
    valid ? await handleSuccess() : handleError()
    setLoading(false)
  }

  return (
    <AuthFormsBase title='Confirmation Token' loading={loading}>
      <p>
        You must have received a 6-digit confirmation token in your email. If
        you can't find it, it must be in your junk.
      </p>

      <Stack spacing={3}>
        <TextField
          type='number'
          label='Token'
          value={token}
          onChange={(e) => setToken(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
        <Button
          type='click'
          color='primary'
          variant='contained'
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Stack>
    </AuthFormsBase>
  )
}

export default TokenEnterScreen
