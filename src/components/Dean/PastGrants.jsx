import { Box } from '@mui/system'
import { useEffect, useState, useCallback } from 'react'
import { dateFormat } from '../../helpers/dateHelpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import AlertBox from '../AlertBox'
import StickyHeadTable from '../StickyHeadTable'
import { grantsTableColumns } from './Dashboard'

const PastGrants = () => {
  const { allGrants, error } = useGrantContext()
  const [alert, setAlert] = useState('')
  const [grants, setGrants] = useState([])

  useEffect(() => {
    if (allGrants) initGrants()
    if (error) handleError()
  }, [allGrants, error])

  const handleError = () => {
    setAlert(error.toString())
    console.error(error)
  }

  const initGrants = () => {
    const now = new Date()
    const filtered = allGrants.filter((g) => g.endDate.toDate() < now)
    setGrants(filtered)
  }

  const getRows = useCallback(() => {
    return grants.map((grant) => ({
      ...grant,
      pi: grant.user.name,
      allocated: grant.info.appCeiling,
      spent: '',
      startDate: dateFormat(grant.startDate.toDate()),
      endDate: dateFormat(grant.endDate.toDate()),
      pubNumber: grant.pubNumber || 0,
      link: `/research/${grant.id}/dashboard`,
    }))
  }, [grants])

  return (
    <Box px='40px'>
      <AlertBox hidden={!alert}>{alert}</AlertBox>
      <StickyHeadTable
        columns={grantsTableColumns}
        rows={getRows()}
        searchBy={['grant', 'pi']}
        maxLength={22}
      />
    </Box>
  )
}

export default PastGrants
