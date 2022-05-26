import { Box } from '@mui/system'
import { useEffect, useState, useCallback } from 'react'
import { grantOptions } from '../../config'
import { dateFormat } from '../../helpers/dateHelpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import AlertBox from '../AlertBox'
import StickyHeadTable from '../StickyHeadTable'
import { truncate } from 'lodash'
const tableColumns = [
  { field: 'title', label: 'Title', minWidth: 150 },
  { field: 'grant', label: 'Type', minWidth: 150 },
  { field: 'pi', label: 'Primary Investigator', minWidth: 180 },
  { field: 'allocated', label: 'Allocated (RM)', minWidth: 100 },
  { field: 'spent', label: 'Spent (RM)', minWidth: 100 },
  { field: 'startDate', label: 'Start Date', minWidth: 100 },
  { field: 'endDate', label: 'End Date', minWidth: 100 },
]

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
    const trun = (w) => truncate(w, { length: 22 })
    return grants.map((grant) => ({
      title: trun(grant.title),
      grant: trun(grantOptions[grant.type]),
      pi: trun(grant.user.name),
      allocated: grant.info.appCeiling,
      spent: '',
      startDate: dateFormat(grant.startDate.toDate()),
      endDate: dateFormat(grant.endDate.toDate()),
      link: `/research/${grant.id}/dashboard`,
    }))
  }, [grants])

  const searchFilter = ({ grant, pi }, regex) =>
    grant.match(regex) || pi.match(regex)

  return (
    <Box px='40px'>
      <AlertBox hidden={!alert}>{alert}</AlertBox>
      <StickyHeadTable
        columns={tableColumns}
        rows={getRows()}
        searchFilter={searchFilter}
      />
    </Box>
  )
}

export default PastGrants
