import { useCallback, useState } from 'react'
import {
  FormControl,
  Stack,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import produce from 'immer'
import * as Yup from 'yup'
import { collect } from '../../helpers'
import { compact } from 'lodash'

const domainOptions = [
  { label: 'Pure and Applied Sciences', value: 'pas' },
  { label: 'Technology and Engineering', value: 'te' },
  { label: 'Clinical and Health Sciences', value: 'chs' },
  { label: 'Social Sciences', value: 'ss' },
  { label: 'Arts and Applied Arts', value: 'aaa' },
  { label: 'Natural and Cultural Heritage', value: 'nch' },
  { label: 'Information and Communication Technology', value: 'ict' },
]

const fields = [
  { name: 'title', type: 'text', label: 'Project Title' },
  {
    name: 'domain',
    type: 'select',
    label: 'Project Domain',
    options: domainOptions,
  },
  { name: 'coResearcherEmail', type: 'email', label: 'Co-Researcher email' },
]

const sampleProject = {
  title: '',
  domain: 'pas',
  coResearcherEmail: '',
}

const schema = Yup.object().shape({
  title: Yup.string().required(),
  domain: Yup.string().required(),
  coResearcherEmail: Yup.string().email(),
})

const getInitialProjects = () => {
  const res = []
  for (let i = 0; i < 3; i++) {
    res.push({ ...sampleProject, domain: domainOptions[i].value })
  }
  return res
}

const getArrayWithEmptyObjs = (length) => {
  const res = []
  for (let i = 0; i < length; i++) {
    res.push({})
  }
  return res
}

const RuGrantInfoForm = ({ onSubmit }) => {
  const [period, setPeriod] = useState(24)
  const [projects, setProjects] = useState(getInitialProjects())
  const [alert, setAlert] = useState('')
  const [errors, setErrors] = useState(getArrayWithEmptyObjs(3))

  const addOneMoreProject = useCallback(() => {
    setProjects([
      ...projects,
      { ...sampleProject, domain: domainOptions[projects.length + 1] },
    ])
    setErrors([...errors, {}])
  }, [projects, errors])

  const handleChange = useCallback(({ value, name, row }) => {
    setProjects(
      produce((draft) => {
        draft[row][name] = value
      })
    )
  }, [])

  const handleSuccess = () => {
    setAlert('')
    setErrors(getArrayWithEmptyObjs(errors.length))
    onSubmit({ appCeiling: projects.length * 70000, period, projects })
  }

  const handleFieldError = (err, row) => {
    const msg = err.toString()
    const fieldName = msg.match(/title|domain|coResearcherEmail/)[0]
    setErrors(
      produce((draft) => {
        draft[row][fieldName] = msg.split(': ')[1]
      })
    )
  }
  const fieldsValidated = async () => {
    for (let i = 0; i < projects.length; i++) {
      try {
        await schema.validate(projects[i])
      } catch (err) {
        handleFieldError(err, i)
        return false
      }
    }
    return true
  }
  const deepValidated = () => {
    const filledEmails = compact(collect(projects, 'coResearcherEmail'))
    const haveEmail = filledEmails.length > 0
    if (!haveEmail) {
      setAlert('There must be at least one Co-Researcher')
      return false
    }
    const uniqEmails =
      Array.from(new Set(filledEmails)).length === filledEmails.length
    if (!uniqEmails) {
      setAlert('Please provide unique emails')
      return false
    }

    const domains = collect(projects, 'domain')
    const atLeastThree = Array.from(new Set(domains)).length > 2
    if (!atLeastThree) {
      setAlert('There should be at least three distinct domains')
      return false
    }

    return true
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const fieldsValid = await fieldsValidated()
    if (fieldsValid && deepValidated()) {
      handleSuccess()
    }
  })

  const btns = [
    {
      disabled: projects.length > 4,
      variant: 'text',
      type: 'button',
      onClick: addOneMoreProject,
      label: 'Add Project +',
    },
    {
      variant: 'contained',
      type: 'submit',
      label: 'Submit',
    },
  ]

  return (
    <>
      <Typography sx={{ textAlign: 'center' }} fontSize='1rem' fontWeight='500'>
        Provide Grant Information
      </Typography>
      {alert && (
        <Box my={1}>
          <Alert severity='error' my={2}>
            {alert}
          </Alert>
        </Box>
      )}
      <FormLabel>Research Period</FormLabel>
      <RadioGroup
        row
        name='period'
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        style={{ marginTop: '10px' }}
      >
        {[24, 36].map((option, i) => (
          <FormControlLabel
            key={i}
            value={option}
            control={<Radio />}
            label={option + ' months'}
          />
        ))}
      </RadioGroup>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: 0 }}>
        <FormControl>
          <Stack direction='column' spacing={3}>
            {projects.map((_, i) => (
              <Stack key={i} direction='row' spacing={1}>
                {fields.map((field, j) => {
                  const value = projects[i][field.name]
                  const hasError = Boolean(errors[i][field.name])
                  const helperText = errors[i][field.name]
                  const label = `${field.label} (${i + 1})`
                  return (
                    <TextField
                      key={i + '.' + j}
                      {...field}
                      label={label}
                      value={value}
                      onChange={(e) => {
                        handleChange({
                          value: e.target.value,
                          name: field.name,
                          row: i,
                        })
                      }}
                      select={field.type === 'select'}
                      SelectProps={{ native: true }}
                      error={hasError}
                      helperText={helperText}
                      fullWidth
                    >
                      {field.type === 'select' &&
                        field.options.map((option, k) => (
                          <option key={k} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </TextField>
                  )
                })}
              </Stack>
            ))}
            <Stack spacing={1}>
              {btns.map((btn, i) => (
                <Button key={i} {...btn}>
                  {btn.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </FormControl>
      </form>
    </>
  )
}

export default RuGrantInfoForm
