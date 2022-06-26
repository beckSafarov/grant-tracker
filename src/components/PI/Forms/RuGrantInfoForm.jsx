import { useCallback, useState } from 'react'
import { FormControl, Stack, TextField, Box, Alert } from '@mui/material'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import produce from 'immer'
import * as Yup from 'yup'
import { collect, genObjectsArr, getArrOfObjects } from '../../../helpers'
import { compact } from 'lodash'
import FormTitle from './FormTitle'
import { v4 } from 'uuid'
import ErrorAlert from '../../ErrorAlert'

const domainOptions = getArrOfObjects([
  ['label', 'value'],
  ['Pure and Applied Sciences', 'pas'],
  ['Technology and Engineering', 'te'],
  ['Clinical and Health Sciences', 'chs'],
  ['Social Sciences', 'ss'],
  ['Arts and Applied Arts', 'aaa'],
  ['Natural and Cultural Heritage', 'nch'],
  ['Information and Communication Technology', 'ict'],
])

const fields = getArrOfObjects([
  ['name', 'type', 'label', 'options'],
  ['title', 'text', 'Project Title'],
  ['domain', 'select', 'Project Domain', domainOptions],
  ['coResearcherEmail', 'email', 'Co-Researcher email'],
])

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
    res.push({ ...sampleProject, domain: domainOptions[i].value, id: v4() })
  }
  return res
}

const RuGrantInfoForm = ({ onSubmit, grantType }) => {
  const [projects, setProjects] = useState(getInitialProjects())
  const [alert, setAlert] = useState('')
  const [errors, setErrors] = useState(genObjectsArr({}, 3))

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
    setErrors(genObjectsArr(errors.length))
    onSubmit({ appCeiling: projects.length * 70000, projects })
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
      sx: { display: grantType === 'ruTrans' ? 'none' : '' },
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
      <ErrorAlert error={alert} />
      <FormLabel>Research Period</FormLabel>
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
