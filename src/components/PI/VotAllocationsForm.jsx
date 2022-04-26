import {
  Box,
  Button,
  Divider,
  FormLabel,
  Stack,
  TextField,
} from '@mui/material'
import produce from 'immer'
import React, { useState, useEffect, useCallback } from 'react'
import FormTitle from './FormTitle'
import {compact} from 'lodash'
const ruVots = [
  11000, 14000, 21000, 22000, 23000, 24000, 26000, 27000, 28000, 29000, 35000,
  52000,
]
const vots = {
  ruTeam: ruVots,
  ruTrans: ruVots,
  prg: [11000, 21000, 27000, 29000],
  bridging: [11000, 27000, 29000],
  short: ruVots,
}

const VotAllocationsForm = ({ onSubmit, grantType, grantAmount: amount }) => {
  const [grantAmount, setGrantAmount] = useState(0)
  const [allocations, setAllocations] = useState({})
  const [votList, setVotList] = useState([])

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

  const isValidAllocation = useCallback(()=>{
    return grantAmount === getAllocated() &&
    compact(Object.values(allocations)).length === votList.length
  }, [grantAmount, getAllocated, allocations, votList])
    

  const handleSubmit = () => {
    if (!isValidAllocation()) return
    onSubmit(allocations)
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
              variant='outlined'
              size='small'
              type='number'
              value={allocations[vot] || ''}
              onChange={handleChange}
            />
          </Stack>
        ))}
      </Stack>
      <Box
        position='fixed'
        top='25%'
        right={'50px'}
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
    </>
  )
}

VotAllocationsForm.defaultProps = {
  onSubmit: () => void 0,
  grantType: 'short',
  grantAmount: 42000,
}

export default VotAllocationsForm