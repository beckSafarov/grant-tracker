import { FormControl, TextField } from '@mui/material'
import { useState, useTransition } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'
import { v4 as uuid4 } from 'uuid'

const AddActivity = ({ height, width, onAdd }) => {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title) return
    const newActivity = {
      title,
      id: uuid4(),
      createdAt: new Date(),
    }
    onAdd(newActivity)
    setTitle('')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        height,
        width,
      }}
    >
      <AddIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <FormControl sx={{ width: '100%' }}>
          <TextField
            id='input-with-sx'
            label='Add an activity'
            variant='standard'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </FormControl>
      </form>
    </Box>
  )
}

AddActivity.defaultProps = {
  height: '50px',
  width: '500px',
  currMilestoneIndex: 0,
  onAdd: () => void 0,
}

export default AddActivity
