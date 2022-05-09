import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Box from '@mui/system/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TimelineIcon from '@mui/icons-material/Timeline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useGrantContext, useUserContext } from '../../hooks/ContextHooks'
import { getScreenWidths } from '../../helpers'
import Sidebar from '../../components/Sidebar'
import Dashboard from '../../components/PI/Research/Dashboard'
import DashboardsHeader from '../../components/DashboardsHeader'

const getLinks = (id) => {
  const pathHeader = `/research/${id}`
  return [
    {
      icon: <DashboardIcon />,
      label: 'Dashboard',
      path: `${pathHeader}/dashboard`,
    },
    {
      icon: <TimelineIcon />,
      label: 'Milestones',
      path: `${pathHeader}/milestones`,
    },
    {
      icon: <AttachMoneyIcon />,
      label: 'Expenses',
      path: `${pathHeader}/expenses`,
    },
    {
      icon: <InsertDriveFileIcon />,
      label: 'Publications',
      path: `${pathHeader}/publications`,
    },
  ]
}

const pages = {
  dashboard: <Dashboard />,
  milestones: <h1>Welcome to Milestones</h1>,
  expenses: <h1>Welcome to Expenses</h1>,
  publications: <h1>Welcome to Publications</h1>,
}

const ResearchBaseScreen = () => {
  const { pathname: path } = useLocation()
  const { user } = useUserContext()
  const {
    grant,
    getGrantById,
    success: grantSuccess,
    resetSuccess,
  } = useGrantContext()
  const screenWidths = getScreenWidths([1, 5])
  const [component, setComponent] = useState(<></>)
  const [currPage, setCurrPage] = useState('dashboard')
  const { id } = useParams()

  useEffect(() => {
    switchComponent()
    if (!grant || grant.id !== id) {
      getGrantById(id)
    }
    if (grantSuccess) resetSuccess()
  }, [path, grant, id, grantSuccess])

  const switchComponent = () => {
    const currPageName = path.split('/').pop()
    setCurrPage(currPageName)
    setComponent(pages[currPageName])
  }

  return (
    <>
      <Sidebar
        links={getLinks(id)}
        user={user}
        width={screenWidths[0] + 'px'}
      />
      <Box ml={screenWidths[0] + 'px'}>
        <DashboardsHeader
          title={currPage}
          grants={user.grants}
          currGrant={grant}
          isAdmin={Boolean(user.status.match(/dean|depDean/))}
        />
        {component}
      </Box>
    </>
  )
}

export default ResearchBaseScreen
