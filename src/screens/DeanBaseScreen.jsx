import React, { useEffect, useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import HistoryIcon from '@mui/icons-material/History'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dean/Dashboard'
import Researchers from '../components/Dean/Researchers'
import PastResearches from '../components/Dean/PastResearches'
import { useLocation } from 'react-router-dom'
import { useGrantContext, useUserContext } from '../hooks/ContextHooks'
import { getScreenWidths } from '../helpers'
import Box from '@mui/system/Box'
import DashboardsHeader from '../components/DashboardsHeader'
import Spinner from '../components/Spinner'

const links = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dean/dashboard' },
  { icon: <PeopleIcon />, label: 'Researchers', path: '/dean/researchers' },
  {
    icon: <HistoryIcon />,
    label: 'Past Researches',
    path: '/dean/pastResearches',
  },
]

const pages = {
  dashboard: {
    component: <Dashboard />,
    title: 'Dashboard',
  },
  researchers: {
    component: <Researchers />,
    title: 'Researchers',
  },
  pastResearches: {
    component: <PastResearches />,
    title: 'Past Researchers',
  },
}

const DeanScreen = () => {
  const { pathname: path } = useLocation()
  const [title, setTitle] = useState('Dashboard')
  const { user } = useUserContext()
  const screenWidths = getScreenWidths([1, 5])
  const [component, setComponent] = useState(<></>)
  const { loading, allGrants, getAllGrants } = useGrantContext()

  useEffect(() => {
    if (!allGrants) getAllGrants()
    switchComponent()
  }, [allGrants, path])

  const switchComponent = () => {
    const currPage = path.split('/').pop()
    setTitle(pages[currPage].title)
    setComponent(pages[currPage].component)
  }

  return (
    <>
      <Sidebar links={links} user={user} width={screenWidths[0] + 'px'} />
      <Box ml={screenWidths[0] + 'px'}>
        <DashboardsHeader title={title} grants={user.grants} isAdmin />
        <Spinner hidden={!loading} />
        {component}
      </Box>
    </>
  )
}

export default DeanScreen
