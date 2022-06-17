import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import MenuDropDown from './MenuDropDown'
import { useGrantContext } from '../hooks/ContextHooks'
import { truncate } from 'lodash'
import { Stack } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTheme } from '@emotion/react'
import { getArrOfObjects } from '../helpers'

const otherMenuOptions = getArrOfObjects([
  ['link', 'label', 'color'],
  ['/dean/dashboard', 'Dean Dashboard', ''],
  ['/grants/new', '+ New Grant', blue[700]],
])

const DashboardOptionsDropdown = ({ grants, isAdmin }) => {
  const navigate = useNavigate()
  const { pathname: path } = useLocation()
  const { grant: currGrant } = useGrantContext()
  const { text } = useTheme()

  const buildOtherOption = (option) => ({
    onClick: () => navigate(option.link),
    children: (
      <p style={{ fontSize: '0.7rem', color: option.color }}>{option.label}</p>
    ),
  })

  const getOtherOptions = () => {
    const adminInGrantPage = isAdmin && path !== '/dean/dashboard'
    const list = adminInGrantPage ? otherMenuOptions : [otherMenuOptions[1]]
    return list.map(buildOtherOption)
  }

  const buildGrantPageOpt = (grant) => {
    const link = `/research/${grant.id}/dashboard`
    const color = currGrant && currGrant.id === grant.id ? text.grey : ''
    const label = truncate(grant.title, { length: 28 })
    return {
      startDate: grant.startDate,
      onClick: () => navigate(link),
      children: (
        <p
          style={{
            fontSize: '0.7rem',
            color,
          }}
          title={grant.title}
        >
          {label}
        </p>
      ),
    }
  }

  const buildGrantPageOpts = (l) => l.map(buildGrantPageOpt)

  const getOptionsList = useCallback(() => {
    if (!grants || grants.length < 1) {
      return getOtherOptions()
    }
    const grantPageOptions = buildGrantPageOpts(grants)
    return [...grantPageOptions, ...getOtherOptions()]
  }, [grants, currGrant])

  return (
    <MenuDropDown
      label={
        <Stack
          direction='row'
          sx={{ fontSize: '0.8rem' }}
          alignItems='center'
          justifyContent='center'
        >
          <div>Jump to </div>
          <ArrowDropDownIcon sx={{ fontSize: '1.1rem' }} />
        </Stack>
      }
      options={getOptionsList()}
    />
  )
}

export default DashboardOptionsDropdown
