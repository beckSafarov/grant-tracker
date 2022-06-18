import { Box } from '@mui/system'
import { useEffect, useState, useCallback } from 'react'
import { dateFormat } from '../../helpers/dateHelpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import ErrorAlert from '../ErrorAlert'
import StickyHeadTable from '../StickyHeadTable'
import { grantsTableColumns } from './Dashboard'

const PastGrants = () => {
  const { allGrants, error } = useGrantContext()
  const [grants, setGrants] = useState([])

  useEffect(() => {
    if (allGrants) initGrants()
  }, [allGrants])

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
      <ErrorAlert error={error} />
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
