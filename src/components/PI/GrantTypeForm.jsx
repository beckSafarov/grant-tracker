import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormTitle from './FormTitle'

const options = {
  short: 'Short Term',
  ruTeam: 'RU Team',
  ruTrans: 'RU Trans',
  bridging: 'Bridging (Incentive)',
  prg: 'Publication Research Grants',
}

const GrantTypeForm = ({ onChange, defaultValue }) => {
  const handleChange = (e) => {
    const value = e.target.value
    onChange(value)
  }

  return (
    <>
      <FormTitle>Choose your grant type</FormTitle>
      <FormControl sx={{ mt: 2 }}>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          value={defaultValue}
          name='radio-buttons-group'
          onChange={handleChange}
        >
          {Object.keys(options).map((option, i) => (
            <FormControlLabel
              value={option}
              key={i}
              control={<Radio />}
              label={options[option]}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  )
}

GrantTypeForm.defaultProps = {
  onChange: () => void 0,
  defaultValue: '',
}
export default GrantTypeForm