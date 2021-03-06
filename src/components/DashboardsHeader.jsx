import { Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { capitalize } from 'lodash'
import { useLocation } from 'react-router-dom'
import { useGrantContext } from '../hooks/ContextHooks'
import DashboardOptionsDropdown from './DashboardOptionsDropdown'
import { truncate } from 'lodash'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const Title = ({ grant, title }) => {
  const grantTitle = grant?.title || 'Dean'
  const grantTitleShort = truncate(grantTitle, { length: 60 })
  const titleCapital = capitalize(title)
  return (
    <Stack
      direction='row'
      alignItems='center'
      sx={{ fontSize: '1.1rem' }}
      spacing={'0.5rem'}
    >
      <Typography fontWeight='400' fontSize='inherit'>
        {grantTitleShort}
      </Typography>
      <ArrowForwardIosIcon sx={{ fontSize: '1rem' }} />
      <Typography fontWeight='500' fontSize='inherit' title={grantTitle}>
        {titleCapital}
      </Typography>
    </Stack>
  )
}

const DashboardsHeader = ({ title }) => {
  const { pathname: path } = useLocation()
  const { grant } = useGrantContext()
  const [currGrant, setCurrGrant] = useState('')

  useEffect(() => {
    setCurrGrant(path.match(/dean/) ? '' : grant)
  }, [path, grant])

  return (
    <Navbar border={'1px solid #ccc'} py={'10px'}>
      <Stack spacing={2} direction='row' alignItems='center'>
        <Title title={title} grant={currGrant} />
      </Stack>
      <DashboardOptionsDropdown />
    </Navbar>
  )
}
DashboardsHeader.defaultProps = {
  title: 'Dashboard',
}

export default DashboardsHeader
