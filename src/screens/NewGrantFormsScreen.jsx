import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import AllGrantsHeader from '../components/AllGrantsHeader'
import { Stack } from '@mui/material'
import RuGrantInfoForm from '../components/PI/Forms/RuGrantInfoForm'
import ShortTermForm from '../components/PI/Forms/ShortTermForm'
import BridgingAndPrgForm from '../components/PI/Forms/BridgingAndPrgForm'
import VotAllocationsForm from '../components/PI/Forms/VotAllocationsForm'
import { useGrantContext, useUserContext } from '../hooks/ContextHooks'
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import BasicInfoForm from '../components/PI/Forms/BasicInfoForm'
import ErrorAlert from '../components/ErrorAlert'

const steps = ['Basic Grant Info', 'Grant details', 'VOT allocations']

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
    if (success && grantFromContext) {
      navigate(`/research/${grantFromContext.id}/dashboard`)
    }
  }, [success])

  const handleSubmit = () => {
    setNewGrant({
      ...grant,
      uid: user.uid,
      school: user.school,
      user: { id: user.uid, name: user.name },
    })
  }

  const handleNext = useCallback(async () => {
    activeStep === steps.length - 1
      ? handleSubmit()
      : setActiveStep((prev) => prev + 1)
  }, [activeStep, setActiveStep, grant])

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1)
  }, [setActiveStep])

  const canProceed = useCallback(() => {
    const props = [grant.type, grant.info, grant.votAllocations]
    return Boolean(props[activeStep])
  }, [activeStep, grant])

  const getGrantInfoForm = () => {
    const runSetGrant = (info) => setGrant({ ...grant, info })
    switch (grant.type) {
      case 'ruTeam':
      case 'ruTrans':
        return <RuGrantInfoForm onSubmit={runSetGrant} grantType={grant.type} />
      case 'bridging':
      case 'prg':
        return (
          <BridgingAndPrgForm onSubmit={runSetGrant} grantType={grant.type} />
        )
      case 'short':
        return <ShortTermForm onSubmit={runSetGrant} />
    }
  }

  const displayCurrForm = useCallback(() => {
    const lookUp = {
      0: (
        <BasicInfoForm
          defaultValue={grant.type}
          onSubmit={(vals) => setGrant({ ...grant, ...vals })}
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
    <Box position='relative'>
      <AllGrantsHeader title='New Grant' titleLink={'/grants/all'} />
      <Spinner hidden={!loading} />
      <Box
        width='100%'
        minHeight='100%'
        mt='100px'
        mb='50px'
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        sx={{ mb: '100px' }}
      >
        <Stack width='700px' spacing={5}>
          <ErrorAlert error={error} />
          <Stepper activeStep={activeStep}>
            {steps.map((label, i) => (
              <Step key={i}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* body */}
          {displayCurrForm()}
        </Stack>
        {/* control buttons */}
        <Box
          sx={{
            width: '900px',
            position: 'fixed',
            bottom: '30px',
            display: 'flex',
            flexDirection: 'row',
            pt: 2,
          }}
        >
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
      </Box>
    </Box>
  )
}
