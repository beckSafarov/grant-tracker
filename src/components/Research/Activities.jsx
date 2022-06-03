import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Stack, Typography } from '@mui/material'
import { useGrantContext } from '../../hooks/ContextHooks'
import { useState, useEffect, useTransition, useCallback } from 'react'
import AddActivity from './AddActivity'
import ClearIcon from '@mui/icons-material/Clear'
import produce from 'immer'

const Activities = ({ onToggle, msId, sx }) => {
  const { grant, addMilestoneActivity, updateActivity, deleteActivity } =
    useGrantContext()
  const [activities, setActivities] = useState([])
  const [pending, setTransition] = useTransition()
  const actsFromContext = grant?.activities

  useEffect(() => {
    setActivities(actsFromContext)
  }, [])

  const handleToggle = useCallback(
    (act) => {
      setActivities(
        produce((draft) => {
          const actToUpdate = draft.find((a) => a.id === act.id)
          actToUpdate.done = !act.done
        })
      )
      setTransition(() => updateActivity({ done: !act.done }, act.id))
    },
    [setActivities]
  )

  const handleDelete = useCallback(
    ({ id }) => {
      setActivities((acts) => acts.filter((a) => a.id !== id))
      setTransition(() => deleteActivity(id))
    },
    [setActivities]
  )

  const handleAdd = useCallback(
    (newActivity) => {
      const newAct = { ...newActivity, msId }
      setActivities([...activities, newAct])
      setTransition(() => addMilestoneActivity(newAct))
    },
    [msId, activities]
  )

  return (
    <Stack sx={sx} spacing={2}>
      <AddActivity onAdd={handleAdd} />
      <List>
        {activities.map((act, i) => (
          <ListItem
            key={act.id}
            secondaryAction={
              <IconButton
                edge='end'
                aria-label='comments'
                onClick={() => handleDelete(act)}
              >
                <ClearIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={() => handleToggle(act)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={act.done || false}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    component={act.done ? 'del' : 'p'}
                    color={act.done ? 'gray' : ''}
                  >
                    {act.title}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}

Activities.defaultProps = {
  activities: [],
  sx: {},
}

export default Activities
