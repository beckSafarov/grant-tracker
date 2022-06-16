import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import MenuDropDown from './MenuDropDown'
import { useGrantContext } from '../hooks/ContextHooks'
import { truncate } from 'lodash'
import { Stack } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
const otherMenuOptions = [
  { link: '/dean/dashboard', label: 'Dean Dashboard', color: '' },
  { link: '/grants/new', label: '+ New Grant', color: blue[700] },
]

const DashboardOptionsDropdown = ({ grants, isAdmin }) => {
  const navigate = useNavigate()
  const { pathname: path } = useLocation()
  const { grant: currGrant } = useGrantContext()
  const isDeanScreen = path.match(/dean/)

  const getLabel = useCallback(() => {
    return isDeanScreen
      ? 'Dean Dashboard'
      : currGrant
      ? truncate(currGrant.title, { length: 28 })
      : 'Menu'
  }, [currGrant, path])

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

  const buildGrantPageOpt = (grant) => ({
    startDate: grant.startDate,
    onClick: () => navigate(`/research/${grant.id}/dashboard`),
    children: (
      <p style={{ fontSize: '0.7rem' }}>
        {truncate(grant.title, { length: 28 })}
      </p>
    ),
  })

  const buildGrantPageOpts = (l) => l.map(buildGrantPageOpt)

  const omitCurrGrant = () =>
    buildGrantPageOpts(grants.filter((g) => g.id !== currGrant.id))

  const getOptionsList = useCallback(() => {
    if (!grants || grants.length < 1) {
      return getOtherOptions()
    }
    const grantPageOptions =
      currGrant && !isDeanScreen ? omitCurrGrant() : buildGrantPageOpts(grants)
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
