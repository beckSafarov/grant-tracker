import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import DashboardHeader from '../../components/DashboardHeader'
import { Stack } from '@mui/material'
import GrantTypeForm from '../../components/PI/Forms/GrantTypeForm'
import RuGrantInfoForm from '../../components/PI/Forms/RuGrantInfoForm'
import ShortTermForm from '../../components/PI/Forms/ShortTermForm'
import BridgingAndPrgForm from '../../components/PI/Forms/BridgingAndPrgForm'
import VotAllocationsForm from '../../components/PI/Forms/VotAllocationsForm'
import { useGrantContext, useUserContext } from '../../hooks/ContextHooks'
import Spinner from '../../components/Spinner'
import AlertBox from '../../components/AlertBox'
import { useNavigate } from 'react-router-dom'

const steps = ['Grant type', 'Grant details', 'VOT allocations']

export default function NewGrantFormsScreen() {
  const [activeStep, setActiveStep] = useState(0)
  const [grant, setGrant] = useState({})
  const { user } = useUserContext()
  const {
    loading,
    error,
    setNewGrant,
    success,
    grant: grantFromContext,
  } = useGrantContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (success) {
      navigate(`/research/${grantFromContext.id}/dashboard`)
    }
  }, [success])
  const handleSubmit = () => {
    setNewGrant({ ...grant, uid: user.uid })
  }

  const handleNext = useCallback(async () => {
    activeStep === steps.length - 1
      ? handleSubmit()
      : setActiveStep((prev) => prev + 1)
  }, [activeStep, setActiveStep])

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1)
  }, [setActiveStep])

  const canProceed = useCallback(() => {
    const props = [grant.type, grant.info, grant.votAllocations]
    return Boolean(props[activeStep])
  }, [activeStep, grant])

  const getGrantInfoForm = () => {
    const setGrantInfo = (info) => setGrant({ ...grant, info })
    switch (grant.type) {
      case 'ruTeam':
      case 'ruTrans':
        return (
          <RuGrantInfoForm onSubmit={setGrantInfo} grantType={grant.type} />
        )
      case 'bridging':
      case 'prg':
        return (
          <BridgingAndPrgForm onSubmit={setGrantInfo} grantType={grant.type} />
        )
      case 'short':
        return <ShortTermForm onSubmit={setGrantInfo} />
    }
  }

  const displayCurrForm = useCallback(() => {
    const lookUp = {
      0: (
        <GrantTypeForm
          defaultValue={grant.type}
          onChange={(type) => setGrant({ ...grant, type })}
        />
      ),
      1: getGrantInfoForm(),
      2: (
        <VotAllocationsForm
          grantType={grant.type}
          grantAmount={grant?.info?.appCeiling}
          onSubmit={(v) => setGrant({ ...grant, votAllocations: v })}
        />
      ),
    }
    return lookUp[activeStep]
  }, [activeStep, grant.type, grant.info])

  return (
    <>
      <DashboardHeader title='New Grant' titleLink={'/grants/all'} />
      <Spinner hidden={!loading} />
      <Box
        width='100%'
        mt='100px'
        mb='50px'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Stack width='700px' spacing={5}>
          <AlertBox my={2} hidden={!error}>
            {error}
          </AlertBox>
          <Stepper activeStep={activeStep}>
            {steps.map((label, i) => (
              <Step key={i}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* body */}
          {displayCurrForm()}

          {/* control buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color='inherit'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            <Button onClick={handleNext} disabled={!canProceed()}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  )
}
