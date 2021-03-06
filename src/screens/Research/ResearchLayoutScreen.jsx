import { useState, useEffect, useCallback } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Box from '@mui/system/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TimelineIcon from '@mui/icons-material/Timeline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useGrantContext, useUserContext } from '../../hooks/ContextHooks'
import { getScreenWidths } from '../../helpers'
import Sidebar from '../../components/Sidebar'
import Dashboard from '../../components/Research/Dashboard'
import DashboardsHeader from '../../components/DashboardsHeader'
import Publications from './Publications'
import MilestonesScreen from './MilestonesScreen'
import ExpensesScreen from './ExpensesScreen'
import InfoIcon from '@mui/icons-material/Info'
import GrantInfoModal from '../../components/Modals/GrantInfoModal'
import EditIcon from '@mui/icons-material/Edit'
import GrantEditModal from '../../components/Modals/GrantEditModal'
import useUserStatus from '../../hooks/useUserStatus'
import useIsGrantActive from '../../hooks/useIsGrantActive'

const getBasicLinks = (id) => {
  const pathHeader = `/research/${id}`
  return [
    {
      icon: <InfoIcon />,
      label: 'Info',
    },
    {
      icon: <EditIcon />,
      label: 'Edit Grant',
    },
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
  milestones: <MilestonesScreen />,
  expenses: <ExpensesScreen />,
  publications: <Publications />,
}

const ResearchBaseScreen = () => {
  const { pathname: path } = useLocation()
  const { user } = useUserContext()
  const { isPi } = useUserStatus()
  const isActive = useIsGrantActive()
  const {
    grant,
    getGrantById,
    success: grantSuccess,
    resetSuccess,
  } = useGrantContext()
  const screenWidths = getScreenWidths([1, 5])
  const [component, setComponent] = useState(<></>)
  const [currPage, setCurrPage] = useState('dashboard')
  const [modal, setModal] = useState('')
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

  const getLinks = useCallback(() => {
    const links = getBasicLinks(id)
    links[0].onClick = () => setModal('info')
    links[1].onClick = () => setModal('edit')
    links[1].hidden = !isPi || !isActive
    return links
  }, [grant, path])

  return (
    <>
      <Sidebar
        links={getLinks(id)}
        user={user}
        width={screenWidths[0] + 'px'}
      />
      <Box ml={screenWidths[0] + 'px'} sx={{ mb: '30px' }}>
        <DashboardsHeader
          title={currPage}
          grants={user.grants}
          currGrant={grant}
          isAdmin={Boolean(user.status.match(/dean|depDean/))}
        />
        {component}
        <GrantInfoModal
          grant={grant}
          open={modal === 'info'}
          onClose={() => setModal('')}
        />
        <GrantEditModal open={modal === 'edit'} onClose={() => setModal('')} />
      </Box>
    </>
  )
}

export default ResearchBaseScreen
