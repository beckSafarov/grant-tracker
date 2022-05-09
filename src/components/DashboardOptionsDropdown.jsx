import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { blue } from '@mui/material/colors'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import MenuDropDown from './MenuDropDown'
dayjs.extend(LocalizedFormat)
const grantNames = {
  prg: 'Publication Reseach Grant',
  short: 'Short Term',
  ruTeam: 'RU Team',
  ruTrans: 'RU Trans',
  bridging: 'Bridging',
}

const otherMenuOptions = [
  { link: '/dean/dashboard', label: 'Dean Dashboard', color: '' },
  { link: '/grants/new', label: '+ New Grant', color: blue[700] },
]

const DashboardOptionsDropdown = ({ grants, isAdmin, currGrant }) => {
  const navigate = useNavigate()
  const { pathname: path } = useLocation()
  const getStartDate = ({ startDate }) =>
    startDate ? dayjs(startDate.toDate()).format('LL') : ''

  const getLabel = useCallback(() => {
    return path.match(/dean/)
      ? 'Dean Dashboard'
      : currGrant
      ? grantNames[currGrant.type]
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

  const buildGrantPageOpt = (grant) => {
    return {
      startDate: grant.startDate,
      onClick: () => navigate(`/research/${grant.id}/dashboard`),
      children: (
        <p style={{ fontSize: '0.7rem' }}>
          {grantNames[grant.type]} (<small>{getStartDate(grant)}</small>)
        </p>
      ),
    }
  }

  const buildGrantPageOpts = (l) => l.map(buildGrantPageOpt)

  const omitCurrGrant = () =>
    buildGrantPageOpts(grants.filter((g) => g.id !== currGrant.id))

  const getOptionsList = useCallback(() => {
    if (!grants || grants.length < 1) return getOtherOptions()
    const grantPageOptions = currGrant
      ? omitCurrGrant()
      : buildGrantPageOpts(grants)

    return [...grantPageOptions, ...getOtherOptions()]
  }, [grants, currGrant])
  return <MenuDropDown label={getLabel()} options={getOptionsList()} />
}

export default DashboardOptionsDropdown
