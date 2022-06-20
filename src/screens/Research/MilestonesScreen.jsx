import React, { useState, useEffect, useCallback } from 'react'
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
import {
  getDateInterval,
  getDateSafely,
  isBefore,
} from '../../helpers/dateHelpers'
import { Box } from '@mui/system'
import Activities from '../../components/Research/Activities'
import Collapse from '@mui/material/Collapse'
import EditMilestoneModal from '../../components/Modals/EditMilestoneModal'
import ErrorAlert from '../../components/ErrorAlert'
import { getCurrMsIndex } from '../../helpers/msHelpers'
import { useMemo } from 'react'

const MilestonesScreen = () => {
  const [addMsModal, setAddMsModal] = useState(false)
  const [editModal, setEditModal] = useState({})
  const [selectedMs, setSelectedMs] = useState({})
  const [currMilestone, setCurrMilestone] = useState({})
  const [showMsActions, setShowMsActions] = useState(false)
  const [viewPastActs, setViewPastActs] = useState(false)
  const { grant, loading, error, updateMilestone, backup } = useGrantContext()
  const milestones = grant?.milestones
  const currMsIndex = useMemo(() => getCurrMsIndex(milestones), [milestones])

  useEffect(() => {
    if (milestones) {
      setCurrMilestone(milestones[currMsIndex])
    }
  }, [error, milestones])

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

  const handleMsUpdate = async (update, id) => {
    updateMilestone(update, id)
    await backup('updateMilestone', update, {
      grant: grant.id,
      ms: id,
    })
  }

  const endCurrMsNow = async () => {
    const update = { done: true }
    const now = new Date()
    const currMsEndDate = getDateSafely(currMilestone.endDate)
    if (now.getTime() < currMsEndDate.getTime()) {
      update.endDate = now
    }
    await handleMsUpdate(update, currMilestone.id)
  }

  const startNextMsNow = async () => {
    const nextMs = milestones[currMsIndex + 1]
    const update = { startDate: new Date() }
    await handleMsUpdate(update, nextMs.id)
  }

  const handleMilestoneDone = async () => {
    await endCurrMsNow()
    if (milestones.length - 1 > currMsIndex) {
      await startNextMsNow()
    }
  }

  const canAddNewMs = useCallback(() => {
    const now = new Date()
    return now.getTime() < getDateSafely(grant.endDate).getTime()
  }, [grant?.endDate])

  const isPastMs = () => {
    if (!selectedMs.endDate) return
    const now = new Date()
    const endDate = getDateSafely(selectedMs.endDate)
    return now.getTime() > endDate.getTime()
  }

  const isFutureMs = () => {
    if (!selectedMs.startDate) return
    const now = new Date()
    const startDate = getDateSafely(selectedMs.startDate)
    return now.getTime() < startDate.getTime()
  }

  const handleViewPastActs = () => {
    setViewPastActs((v) => !v)
    if (viewPastActs) {
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
            <p style={{ fontSize: '0.8rem' }}>Viewing: {currMilestone.name}</p>
          )}
        </Stack>
      </Collapse>
      <ResearchScreenContainer>
        <Spinner hidden={!loading} />
        <ErrorAlert error={error} hidden={addMsModal || editModal.open} />
        {grant && (
          <>
            {milestones ? (
              <>
                <Stepper activeStep={currMsIndex} alternativeLabel>
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
                  <Activities
                    msId={currMilestone.id}
                    sx={{ mt: '40px' }}
                    inputDisabled={viewPastActs}
                  />
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
