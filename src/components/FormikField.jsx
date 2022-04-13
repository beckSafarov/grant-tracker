import React from 'react'
import TextField from '@mui/material/TextField'

const FormikField = ({ formik, field }) => {
  const hasError =
    formik.touched[field.name] && Boolean(formik.errors[field.name])

  const needHelperText = formik.touched[field.name] && formik.errors[field.name]

  return (
    <TextField
      fullWidth
      name={field.name}
      id={field.name}
      type={field.type}
      label={field.label}
      value={formik.values[field.name]}
      onChange={formik.handleChange}
      error={hasError}
      helperText={needHelperText}
      select={field.type === 'select'}
      SelectProps={{ native: true }}
    >
      {field.type === 'select' &&
        field.options.map((option, k) => (
          <option key={k} value={option.value}>
            {option.label}
          </option>
        ))}
    </TextField>
  )
}

export default FormikField
