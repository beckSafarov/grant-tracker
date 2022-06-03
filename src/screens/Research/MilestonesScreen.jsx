import React, { useState, useEffect, useCallback } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import FullyCentered from '../../components/FullyCentered'
import { Button, Stack, Typography } from '@mui/material'
import FloatingAddButton from '../../components/FloatingAddButton'
import MilestonesModal from '../../components/Modals/MilestonesModal'
import { useGrantContext } from '../../hooks/ContextHooks'
import Spinner from '../../components/Spinner'
import AlertBox from '../../components/AlertBox'
import { getDateInterval } from '../../helpers/dateHelpers'
import { Box } from '@mui/system'
import AddActivity from '../../components/Research/AddActivity'
import { findIndex } from 'lodash'
import Activities from '../../components/Research/Activities'
import Collapse from '@mui/material/Collapse'
import { useTheme } from '@emotion/react'

const MilestonesScreen = () => {
  const [modal, setModal] = useState(false)
  const [alert, setAlert] = useState('')
  const [currMilestone, setCurrMilestone] = useState({})
  const [msActions, setMsActions] = useState(false)
  const { grant, loading, error, setMilestone, updateActivity } =
    useGrantContext()
  const milestones = grant?.milestones
  const { components } = useTheme()

  useEffect(() => {
    if (error) handleError()
    if (milestones) {
      setCurrMilestone(milestones[getCurrMilestoneIndex()])
    }
  }, [error, milestones])

  const handleMsClick = (id) => {
    if (id === currMilestone.id) setMsActions(!msActions)
  }

  const handleError = () => {
    const err = error.toString()
    if (!modal) setAlert(err)
    console.error(err)
  }

  const getCurrMilestoneIndex = useCallback(() => {
    const undoneIndex = findIndex(milestones, { done: false })
    return undoneIndex !== -1 ? undoneIndex : milestones.length - 1
  }, [milestones])

  const handleMilestoneDone = () => {
    const index = getCurrMilestoneIndex()
    setMilestone({ done: true }, milestones[index].id, grant.id)
  }

  const handleActToggle = (currStatus, id) => {
    updateActivity({ done: !currStatus }, id)
  }

  const getCurrActivities = useCallback(() => {
    if (!grant || !grant.activities) return []
    return grant.activities.filter((act) => act.msId === currMilestone.id)
  }, [grant?.activities, currMilestone?.id])

  const milestoneControls = [
    {
      label: 'Finish Milestone',
      onClick: handleMilestoneDone,
      variant: 'contained',
      color: 'success',
    },
    {
      label: 'Edit',
      onClick: () => void 0,
      variant: 'text',
      color: 'primary',
    },
  ]

  return (
    <>
      <Collapse in={msActions} mountOnEnter unmountOnExit>
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
                      onClick={() => handleMsClick(ms.id)}
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
        <MilestonesModal open={modal} onClose={() => setModal(false)} />
        <FloatingAddButton onClick={() => setModal(true)} />
      </ResearchScreenContainer>
    </>
  )
}

export default MilestonesScreen
