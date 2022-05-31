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
import ActivityInput from '../../components/Research/ActivityInput'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { findIndex } from 'lodash'

const MilestonesScreen = () => {
  const [modal, setModal] = useState(false)
  const [alert, setAlert] = useState('')
  const { grant, loading, error, setMilestone } = useGrantContext()
  const milestones = grant?.milestones

  useEffect(() => {
    if (error) handleError()
  }, [error])

  const handleMsClick = (id) => {}

  const handleError = () => {
    const err = error.toString()
    if (!modal) setAlert(err)
    console.error(err)
  }

  const getCurrMilestoneIndex = useCallback(() => {
    const undoneIndex = findIndex(milestones, { done: false })
    return undoneIndex || milestones.length - 1
  }, [milestones])

  const handleMilestoneDone = () => {
    const index = getCurrMilestoneIndex()
    setMilestone({ done: true }, milestones[index].id, grant.id)
  }
  console.log(milestones)
  return (
    <ResearchScreenContainer sx={{ pt: '30px' }}>
      <Spinner hidden={!loading} />
      <AlertBox hidden={!alert}>{alert}</AlertBox>
      {grant && (
        <>
          {milestones ? (
            <>
              <Stepper activeStep={getCurrMilestoneIndex()} alternativeLabel>
                {[...milestones].map((ms) => (
                  <Step key={ms.id} onClick={() => handleMsClick(ms.id)}>
                    <StepLabel>
                      {ms.name}
                      <br />({getDateInterval(ms)})
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Stack direction='column' spacing={5}>
                <Box sx={{ mt: '40px' }} display='flex' justifyContent='center'>
                  <ActivityInput currMilestoneIndex={getCurrMilestoneIndex()} />
                </Box>
                {milestones.activities && (
                  <Stack direction='column' spacing={1}>
                    {milestones.activities.map((act, i) => (
                      <p key={i}>{act.name}</p>
                    ))}
                  </Stack>
                )}
                {milestones.length > 1 && (
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      variant='text'
                      type='button'
                      onClick={handleMilestoneDone}
                      sx={{ width: '200px', fontSize: '0.8rem' }}
                    >
                      <CheckCircleIcon sx={{ fontSize: '1rem' }} />{' '}
                      <span style={{ marginLeft: '5px' }}>
                        Milestone Completed
                      </span>
                    </Button>
                  </div>
                )}
              </Stack>
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
  )
}

export default MilestonesScreen
