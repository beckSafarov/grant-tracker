import React, { useEffect, useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import HistoryIcon from '@mui/icons-material/History'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dean/Dashboard'
import Researchers from '../components/Dean/Researchers'
import PastResearches from '../components/Dean/PastResearches'
import { useLocation } from 'react-router-dom'
import { useUserContext } from '../hooks/ContextHooks'

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
  dashboard: <Dashboard />,
  researchers: <Researchers />,
  pastResearches: <PastResearches />,
}

const DeanDashboard = () => {
  const { pathname: path } = useLocation()
  const { user } = useUserContext()
  const [component, setComponent] = useState(<></>)

  useEffect(() => {
    const currPageName = path.split('/').pop()
    setComponent(pages[currPageName])
  }, [path])

  return (
    <>
      <Sidebar links={links} user={user} />
      {component}
    </>
  )
}

export default DeanDashboard
