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

const Activities = ({ msId, sx, inputDisabled }) => {
  const { grant, addActivity, updateActivity, deleteActivity, backup } =
    useGrantContext()
  const [activities, setActivities] = useState([])
  const [pending, setTransition] = useTransition()
  const actsFromContext = grant?.activities

  useEffect(() => {
    actsFromContext && initActivities()
  }, [msId])

  const initActivities = () => {
    setActivities(actsFromContext.filter((act) => act.msId === msId))
  }

  const handleToggleTransition = (act) => {
    const data = { done: !act.done }
    updateActivity(data, act.id)
    backup('updateActivity', data, { grant: grant.id, act: act.id })
  }

  const handleToggle = useCallback(
    (act) => {
      setActivities(
        produce((draft) => {
          const actToUpdate = draft.find((a) => a.id === act.id)
          actToUpdate.done = !act.done
        })
      )
      setTransition(() => handleToggleTransition(act))
    },
    [setActivities]
  )

  const handleDeleteTransition = (id) => {
    deleteActivity(id)
    backup('deleteActivity', {}, { grant: grant.id, act: id })
  }

  const handleDelete = useCallback(
    ({ id }) => {
      setActivities((acts) => acts.filter((a) => a.id !== id))
      setTransition(() => handleDeleteTransition(id))
    },
    [setActivities]
  )

  const handleAddTransition = (newAct) => {
    addActivity(newAct)
    backup('addActivity', newAct, { grant: grant.id })
  }

  const handleAdd = useCallback(
    (newActivity) => {
      const newAct = { ...newActivity, msId }
      setActivities([...activities, newAct])
      setTransition(() => handleAddTransition(newAct))
    },
    [msId, activities]
  )

  return (
    <Stack sx={sx} spacing={2}>
      <AddActivity onAdd={handleAdd} disabled={inputDisabled} />
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
  inputDisabled: false,
}

export default Activities
