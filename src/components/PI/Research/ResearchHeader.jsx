import { Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import Navbar from '../../Navbar'
import { capitalize } from 'lodash'
import MenuDropDown from '../../MenuDropDown'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { logout } from '../../../firebase/auth'
import { useTheme } from '@emotion/react'
dayjs.extend(LocalizedFormat)
const grantNames = {
  prg: 'Publication Reseach Grant',
  short: 'Short Term',
  ruTeam: 'RU Team',
  ruTrans: 'RU Trans',
  bridging: 'Bridging',
}

const ResearchHeader = ({ title, grants, currGrant, isAdmin }) => {
  const navigate = useNavigate()
  const theme = useTheme()

  const getLabel = useCallback(() => {
    return currGrant ? grantNames[currGrant.type] + ' ▾' : 'Menu'
  }, [currGrant])

  const getStartDate = ({ startDate }) => {
    return startDate ? dayjs(startDate.toDate()).format('LL') : ''
  }

  const getOptionObj = (grant) => {
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

  const getOtherOptions = () => {
    const data = [
      { link: '/dean/dashboard', label: 'Dean Dashboard' },
      { link: `/grants/new`, label: '+ New Grant' },
    ]
    const list = isAdmin ? data : [data[1]]
    return list.map((option) => ({
      onClick: () => navigate(option.link),
      children: (
        <p style={{ fontSize: '0.7rem', color: theme.text.blue }}>
          {option.label}
        </p>
      ),
    }))
  }

  const getOptionsList = useCallback(() => {
    if (!grants || !currGrant) return []
    return [
      ...grants.filter((g) => g.id !== currGrant.id).map(getOptionObj),
      ...getOtherOptions(),
    ]
  }, [grants, currGrant])

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <Navbar border={'1px solid #ccc'} py={'10px'}>
      <Stack spacing={2} direction='row' alignItems='center'>
        <Typography fontSize='1.2rem'>
          <strong>{capitalize(title)}</strong>
        </Typography>
      </Stack>
      <button onClick={handleLogout}>Logout</button>
      <MenuDropDown label={getLabel()} options={getOptionsList()} />
    </Navbar>
  )
}
ResearchHeader.defaultProps = {
  title: 'Dashboard',
  isAdmin: false,
}

export default ResearchHeader
