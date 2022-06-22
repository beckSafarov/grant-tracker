import { Step, StepLabel, Stepper } from '@mui/material'
import React from 'react'
import { getDateInterval } from '../../helpers/dateHelpers'
import { getCurrMsIndex } from '../../helpers/msHelpers'
import { truncate } from 'lodash'

const MilestoneSteps = ({
  milestones,
  onClick,
  showIntervals,
  truncateName,
  disabled,
}) => {
  const currMsIndex = getCurrMsIndex(milestones)

  const getName = ({ name }) => {
    return truncateName ? truncate(name, { length: 25 }) : name
  }

  return (
    <Stepper activeStep={currMsIndex} alternativeLabel>
      {milestones.map((ms) => (
        <Step
          key={ms.id}
          onClick={() => !disabled && onClick(ms)}
          sx={{ cursor: 'pointer' }}
          completed={ms.done}
          disabled={disabled}
        >
          <StepLabel>
            {getName(ms)}
            <br />
            {showIntervals && `(${getDateInterval(ms)})`}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

MilestoneSteps.defaultProps = {
  showIntervals: false,
  truncateName: false,
  onClick: () => void 0,
  milestones: [],
  disabled: false,
}

export default MilestoneSteps
