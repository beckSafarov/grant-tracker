import {
  Box,
  Button,
  Divider,
  FormLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import produce from 'immer'
import React, { useState, useEffect, useCallback } from 'react'
import FormTitle from './FormTitle'
import { compact } from 'lodash'
import { votDescriptions, VOTS } from '../../../config'
const vots = VOTS

const VotAllocationsForm = ({ onSubmit, grantType, grantAmount: amount }) => {
  const [grantAmount, setGrantAmount] = useState(0)
  const [allocations, setAllocations] = useState({})
  const [votList, setVotList] = useState([])
  const [focusedVot, setFocusedVot] = useState({
    code: 11000,
    description: votDescriptions[11000],
  })
  useEffect(() => {
    setGrantAmount(amount)
    setVotList(vots[grantType] || [])
  }, [grantType, amount])

  const handleChange = ({ target }) => {
    const { name, value } = target
    setAllocations(
      produce((draft) => {
        draft[name] = +value
      })
    )
  }

  const getAllocated = useCallback(() => {
    return Object.keys(allocations).reduce(
      (total, prop) => (total += allocations[prop]),
      0
    )
  }, [allocations])

  const getRemaining = useCallback(() => {
    return grantAmount - getAllocated()
  }, [allocations])

  const isValidAllocation = useCallback(() => {
    return (
      grantAmount === getAllocated() &&
      compact(Object.values(allocations)).length === votList.length
    )
  }, [grantAmount, getAllocated, allocations, votList])

  const handleSubmit = () => {
    if (!isValidAllocation()) return
    onSubmit(allocations)
  }

  const handleVotFocus = (code) => {
    const description = votDescriptions[code]
    setFocusedVot({ code, description })
  }

  return (
    <>
      <FormTitle>Enter the VOT amounts</FormTitle>
      <Stack spacing={2} mb={4} justifyContent='center' alignItems='center'>
        {votList.map((vot, i) => (
          <Stack
            direction='row'
            key={i}
            spacing={3}
            width='100%'
            justifyContent='center'
            alignItems='center'
          >
            <FormLabel>VOT {vot} (RM)</FormLabel>
            <TextField
              name={vot.toString()}
              onFocus={() => handleVotFocus(vot)}
              variant='outlined'
              size='small'
              type='number'
              value={allocations[vot] || ''}
              onChange={handleChange}
            />
          </Stack>
        ))}
      </Stack>
      <Stack position='fixed' top='30%' right={'50px'} spacing={2}>
        <Paper
          elevation={1}
          sx={{
            // position: 'fixed',
            // top: '25%',
            // left: '50px',
            width: '300px',
            px: '10px',
            py: '10px',
          }}
        >
          <Typography fontSize='1.1rem' fontWeight='500'>
            {focusedVot.code}
          </Typography>
          <p>{focusedVot.description}</p>
        </Paper>
        <Box
          // position='fixed'
          // top='25%'
          // right={'50px'}
          backgroundColor='#fff'
          px={'10px'}
          pb='10px'
          fontSize='1rem'
          borderRadius={'4px'}
          width={'300px'}
          boxShadow={'0px 0px 4px rgba(0, 0, 0, 0.25)'}
        >
          <Box display='flex' justifyContent='space-between'>
            <div>
              <p>Overall Budget (RM)</p>
              <p>Allocated (RM)</p>
              <Divider />
              <strong>
                <p>Remaining (RM)</p>
              </strong>
            </div>
            <div>
              <p>{grantAmount}</p>
              <p>{getAllocated()}</p>
              <Divider />
              <strong>
                <p>{getRemaining()}</p>
              </strong>
            </div>
          </Box>
          <Button
            type='click'
            variant='contained'
            disabled={!isValidAllocation()}
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Stack>
    </>
  )
}

VotAllocationsForm.defaultProps = {
  onSubmit: () => void 0,
  grantType: 'short',
  grantAmount: 42000,
}

export default VotAllocationsForm
