import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import DashboardHeader from '../../components/DashboardHeader'
import { Stack } from '@mui/material'
import GrantTypeForm from '../../components/PI/GrantTypeForm'
import RegularGrantInfoForm from '../../components/PI/RegularGrantInfoForm'
import RuGrantInfoForm from '../../components/PI/RuGrantInfoForm'
import { useTheme } from '@emotion/react'

const steps = ['Grant type', 'Grant details', 'VOT allocation']

export default function NewGrantFormsScreen() {
  const [activeStep, setActiveStep] = useState(0)
  const [grant, setGrant] = useState({})
  const theme = useTheme()

  const handleSubmit = useCallback(() => {}, [activeStep])

  const handleNext = useCallback(() => {
    if (activeStep === steps.length - 1) {
      handleSubmit()
      return
    }
    setActiveStep((prev) => prev + 1)
  }, [activeStep, setActiveStep])

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const canProceed = useCallback(() => {
    const lookup = {
      0: Boolean(grant.type),
      1: Boolean(grant.info),
      2: Boolean(grant.votAllocations),
    }
    return lookup[activeStep]
  }, [activeStep, grant])

  // console.log(grant)

  const displayCurrForm = useCallback(() => {
    switch (activeStep) {
      case 0:
        return (
          <GrantTypeForm
            defaultValue={grant.type}
            onChange={(type) => setGrant({ ...grant, type })}
          />
        )
      case 1:
        const setGrantInfo = (info) => setGrant({ ...grant, info })
        return grant.type.match(/ru/) ? (
          <RuGrantInfoForm onSubmit={setGrantInfo} />
        ) : (
          <RegularGrantInfoForm
            defaultValues={grant.info}
            onSubmit={setGrantInfo}
          />
        )
      case 2:
        return <h1>VOT allocations</h1>
    }
  }, [activeStep, grant.type, grant.info])

  return (
    <>
      <DashboardHeader title='New Grant' />
      <Box
        width='100%'
        mt='100px'
        mb='50px'
        // border='1px solid green'
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Stack width='700px' spacing={5}>
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
