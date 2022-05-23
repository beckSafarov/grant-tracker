import { Box } from '@mui/system'
import React, { useCallback, useEffect } from 'react'
import { dateFormat } from '../../helpers/dateHelpers'
import { useUserContext } from '../../hooks/ContextHooks'
import StickyHeadTable from '../StickyHeadTable'

const tableColumns = [
  { field: 'researcherName', label: 'Researcher', minWidth: 180 },
  { field: 'email', label: 'Email', minWidth: 180 },
  { field: 'status', label: 'User Status', minWidth: 180 },
  { field: 'grants', label: 'Grants', minWidth: 133 },
  { field: 'piIn', label: 'Leading Researches', minWidth: 133 },
  { field: 'lastGrant', label: 'Last Grant End Date', minWidth: 133 },
]

const Researchers = () => {
  const { allUsers: users, getAllUsers } = useUserContext()

  useEffect(() => {
    if (!users) getAllUsers()
  }, [users])

  const getRows = useCallback(() => {
    const getPiNumb = ({ grants }) => {
      return grants.map((g) => g.researcherStatus === 'pi').length
    }

    const getEndDate = ({ grants }) => {
      return grants?.length > 0
        ? dateFormat([...grants].pop().endDate.toDate())
        : ''
    }

    return users.map((user) => ({
      researcherName: user.name,
      email: user.email,
      status: user.status,
      grants: user.grants.length,
      piIn: getPiNumb(user),
      lastGrant: getEndDate(user),
    }))
  }, [users])

  const searchFilter = ({ researcherName, email }, regex) =>
    researcherName.match(regex) || email.match(regex)
  if (users) console.log(getRows())
  return (
    <Box px='40px'>
      {users && (
        <>
          {/* {users.map((user, key) => (
            <div key={key} style={{ borderBottom: '1px solid #ccc' }}>
              <p>Name: {user.name}</p>
              <p>Grants: {user.grants.length}</p>
            </div>
          ))} */}
          <StickyHeadTable
            columns={tableColumns}
            rows={getRows()}
            searchFilter={searchFilter}
          />
        </>
      )}
    </Box>
  )
}

export default Researchers
