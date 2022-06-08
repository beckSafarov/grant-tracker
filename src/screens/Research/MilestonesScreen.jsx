import React, { useState, useEffect, useCallback, useTransition } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import FullyCentered from '../../components/FullyCentered'
import { Button, Stack, Typography } from '@mui/material'
import FloatingAddButton from '../../components/FloatingAddButton'
import AddMsModal from '../../components/Modals/AddMsModal'
import { useGrantContext } from '../../hooks/ContextHooks'
import Spinner from '../../components/Spinner'
import AlertBox from '../../components/AlertBox'
import {
  getDateInterval,
  getDateSafely,
  isBefore,
} from '../../helpers/dateHelpers'
import { Box } from '@mui/system'
import Activities from '../../components/Research/Activities'
import Collapse from '@mui/material/Collapse'
import EditMilestoneModal from '../../components/Modals/EditMilestoneModal'

const MilestonesScreen = () => {
  const [addMsModal, setAddMsModal] = useState(false)
  const [editModal, setEditModal] = useState({})
  const [alert, setAlert] = useState('')
  const [selectedMs, setSelectedMs] = useState({})
  const [currMilestone, setCurrMilestone] = useState({})
  const [showMsActions, setShowMsActions] = useState(false)
  const [viewPastActs, setViewPastActs] = useState(false);
  const { grant, loading, error, updateMilestone, backup } = useGrantContext()
  const milestones = grant?.milestones
  const [pending, setTransition] = useTransition()

  useEffect(() => {
    if (error) handleError()
    if (milestones) {
      const currMsIndex = getCurrMsIndex()
      setCurrMilestone(milestones[currMsIndex])
    }
  }, [error, milestones])

  const handleError = () => {
    const err = error.toString()
    if (!addMsModal && !editModal.open) setAlert(err)
    console.error(error)
  }

  const handleMsClick = (ms) => {
    setSelectedMs(ms)
    setShowMsActions(!showMsActions)
  }

  const handleEditClick = useCallback(() => {
    setEditModal({
      open: !editModal.open,
      data: selectedMs,
    })
  }, [editModal.open, currMilestone, selectedMs])

  const getCurrMsIndex = useCallback(() => {
    if (!milestones) return 0
    const now = new Date()
    for (let i = 0; i < milestones.length; i++) {
      const start = getDateSafely(milestones[i].startDate)
      const end = getDateSafely(milestones[i].endDate)
      if (isBefore(start, now) && isBefore(now, end)) {
        return i
      }
    }
    return 0
  }, [milestones])

  const handleMsUpdate = async(update, id) => {
    updateMilestone(update, id)
    await backup('updateMilestone', update, {
        grant: grant.id,
        ms: id,
    })
  }

  const endCurrMsNow = async() => {
    const update = { done: true }
    const now = new Date()
    const currMsEndDate = getDateSafely(currMilestone.endDate)
    if (now.getTime() < currMsEndDate.getTime()) {
      update.endDate = now
    }
    await handleMsUpdate(update, currMilestone.id)
  }

  const startNextMsNow = async() => {
    const nextMs = milestones[getCurrMsIndex() + 1]
    const update = { startDate: new Date() }
    await handleMsUpdate(update, nextMs.id)
  }

  const handleMilestoneDone = async() => {
    await endCurrMsNow()
    if (milestones.length - 1 > getCurrMsIndex()) {
      await startNextMsNow()
    }
  }

  const canAddNewMs = useCallback(() => {
    const now = new Date()
    return now.getTime() < getDateSafely(grant.endDate).getTime()
  }, [grant?.endDate])

  const isPastMs = () => { 
    if(!selectedMs.endDate) return
    const now = new Date()
    const endDate = getDateSafely(selectedMs.endDate)
    return now.getTime() > endDate.getTime()
  }

  const isFutureMs = () => { 
    if(!selectedMs.startDate) return
    const now = new Date()
    const startDate = getDateSafely(selectedMs.startDate)
    return now.getTime() < startDate.getTime()
  }

  const handleViewPastActs = () => { 
    setViewPastActs(v=>!v)  
    if(viewPastActs){
      const currMsIndex = getCurrMsIndex()
      setCurrMilestone(milestones[currMsIndex])
      return 
    }
    setCurrMilestone(selectedMs)
  }

  const milestoneControls = [
    {
      label: 'Finish Milestone',
      onClick: handleMilestoneDone,
      color: 'success',
      disabled: isPastMs() || isFutureMs(),
    },
    {
      label: 'Edit',
      onClick: handleEditClick,
      color: 'primary',
    },
    {
      label: viewPastActs ? 'Cancel' : 'View Activities',
      onClick: handleViewPastActs,
      color: 'primary',
      disabled: !isPastMs(),
    },
  ]

  return (
    <>
      <Collapse in={showMsActions} mountOnEnter unmountOnExit>
        <Stack
          direction='row'
          spacing={2}
          sx={{ px: 5, py: 1, bgcolor: '#f4f4f4' }}
          alignItems='center'
        >
          {milestoneControls.map((act, i) => (
            <Button key={i} size='small' variant='text' {...act}>
              {act.label}
            </Button>
          ))}
          {viewPastActs && (
            <Typography color='gray.300' sx={{fontSize: '0.8rem'}}>Viewing: {currMilestone.name}</Typography>
          )}
        </Stack>
      </Collapse>
      <ResearchScreenContainer>
        <Spinner hidden={!loading} />
        <AlertBox hidden={!alert}>{alert}</AlertBox>
        {grant && (
          <>
            {milestones ? (
              <>
                <Stepper activeStep={getCurrMsIndex()} alternativeLabel>
                  {milestones.map((ms, i) => (
                    <Step
                      key={ms.id}
                      onClick={() => handleMsClick(ms)}
                      sx={{ cursor: 'pointer' }}
                      completed={ms.done}
                    >
                      <StepLabel>
                        {ms.name}
                        <br />({getDateInterval(ms)})
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box display='flex' justifyContent='center'>
                  <Activities msId={currMilestone.id} sx={{ mt: '40px' }} />
                </Box>
              </>
            ) : (
              <FullyCentered left='56%'>
                <Typography fontSize='2rem' color='gray'>
                  No Milestones
                </Typography>
              </FullyCentered>
            )}
          </>
        )}
        {canAddNewMs && (
          <AddMsModal open={addMsModal} onClose={() => setAddMsModal(false)} />
        )}
        {editModal.open && (
          <EditMilestoneModal
            {...editModal}
            onClose={() => setEditModal({})}
            currMilestone={currMilestone}
          />
        )}
        <FloatingAddButton onClick={() => setAddMsModal(true)} />
      </ResearchScreenContainer>
    </>
  )
}

export default MilestonesScreen
