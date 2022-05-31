import { FormControl, TextField } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box } from '@mui/system'
import { useGrantContext } from '../../hooks/ContextHooks'
import { v4 as uuid4 } from 'uuid'

const ActivityInput = ({ height, width, currMilestoneIndex }) => {
  const { grant, addMilestoneActivity, backUpSetMilestone } = useGrantContext()
  const [title, setTitle] = useState('')

  const runBackup = (newActivity) => {
    setTimeout(
      () => backUpSetMilestone(newActivity, currMilestoneIndex, grant.id),
      300
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newActivity = { title, id: uuid4(), createdAt: new Date() }
    addMilestoneActivity(newActivity, currMilestoneIndex)
    setTitle('')
    // runBackup(newActivity)
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

ActivityInput.defaultProps = {
  height: '50px',
  width: '500px',
  currMilestoneIndex: 0,
}

export default ActivityInput
