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
import { getDateInterval } from '../../helpers/dateHelpers'
import { Box } from '@mui/system'
import { findIndex } from 'lodash'
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
  const { grant, loading, error, updateMilestone, backup } = useGrantContext()
  const milestones = grant?.milestones
  const [pending, setTransition] = useTransition()

  useEffect(() => {
    if (error) handleError()
    if (milestones) {
      setCurrMilestone(milestones[getCurrMilestoneIndex()])
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

  const getCurrMilestoneIndex = useCallback(() => {
    const undoneIndex = findIndex(milestones, { done: false })
    return undoneIndex !== -1 ? undoneIndex : milestones.length - 1
  }, [milestones])

  const handleMilestoneDone = () => {
    const index = getCurrMilestoneIndex()
    const msId = milestones[index].id
    const updates = { done: true }
    updateMilestone(updates, msId)
    setTransition(() => {
      backup('updateMilestone', updates, { grant: grant.id, ms: msId })
    })
  }

  const canFinishMs = useCallback(() => {
    return !selectedMs.done && selectedMs.id !== currMilestone.id
  }, [selectedMs, currMilestone])

  const milestoneControls = [
    {
      label: 'Finish Milestone',
      onClick: handleMilestoneDone,
      variant: 'text',
      color: 'success',
      disabled: canFinishMs(),
    },
    {
      label: 'Edit',
      onClick: handleEditClick,
      variant: 'text',
      color: 'primary',
    },
  ]

  return (
    <>
      <Collapse in={showMsActions} mountOnEnter unmountOnExit>
        <Stack
          direction='row'
          spacing={2}
          sx={{ px: 5, py: 1, bgcolor: '#f4f4f4' }}
        >
          {milestoneControls.map((act, i) => (
            <Button key={i} size='small' {...act}>
              {act.label}
            </Button>
          ))}
        </Stack>
      </Collapse>
      <ResearchScreenContainer sx={{ pt: '30px' }}>
        <Spinner hidden={!loading} />
        <AlertBox hidden={!alert}>{alert}</AlertBox>
        {grant && (
          <>
            {milestones ? (
              <>
                <Stepper activeStep={getCurrMilestoneIndex()} alternativeLabel>
                  {[...milestones].map((ms) => (
                    <Step
                      key={ms.id}
                      onClick={() => handleMsClick(ms)}
                      sx={{ cursor: 'pointer' }}
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
        <AddMsModal open={addMsModal} onClose={() => setAddMsModal(false)} />
        {editModal.open && (
          <EditMilestoneModal {...editModal} onClose={() => setEditModal({})} />
        )}
        <FloatingAddButton onClick={() => setAddMsModal(true)} />
      </ResearchScreenContainer>
    </>
  )
}

export default MilestonesScreen
