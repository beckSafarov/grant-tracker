import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { schoolsNames } from '../../config'
import { dateFormat } from '../../helpers/dateHelpers'
import { useUserContext } from '../../hooks/ContextHooks'
import GrantsModal from '../Modals/GrantsModal'
import StickyHeadTable from '../StickyHeadTable'

const tableColumns = [
  { field: 'researcherName', label: 'Researcher', minWidth: 180 },
  { field: 'email', label: 'Email', minWidth: 180 },
  { field: 'status', label: 'User Status', minWidth: 150 },
  { field: 'school', label: 'School', minWidth: 180 },
  { field: 'grants', label: 'Grants', minWidth: 100 },
  { field: 'piIn', label: 'Leading Researches', minWidth: 100 },
  { field: 'lastGrant', label: 'Last Grant End Date', minWidth: 133 },
]

const Researchers = () => {
  const [modal, setModal] = useState({})
  const { allUsers: users, getAllUsers } = useUserContext()

  useEffect(() => {
    if (!users) getAllUsers()
  }, [users])

  const getRows = useCallback(() => {
    const getPiNumb = ({ grants }) => {
      return grants.map((g) => g.researcherStatus === 'pi').length
    }

    const getEndDate = ({ grants }) => {
      if (!grants || grants.length < 1) return ''
      const date = [...grants].pop().endDate.toDate()
      return dateFormat(date)
    }

    return users.map((user) => ({
      researcherName: user.name,
      email: user.email,
      status: user.status,
      school: schoolsNames[user.school],
      grants: user.grants.length,
      piIn: getPiNumb(user),
      lastGrant: getEndDate(user),
      onClick: () => setModal({ open: true, user }),
    }))
  }, [users])

  const searchFilter = ({ researcherName, email }, regex) =>
    researcherName.match(regex) || email.match(regex)

  return (
    <Box px='40px'>
      {users && (
        <>
          <StickyHeadTable
            columns={tableColumns}
            rows={getRows()}
            searchFilter={searchFilter}
          />
          <GrantsModal
            open={modal.open}
            user={modal.user}
            onClose={() => setModal({ ...modal, open: false })}
          />
        </>
      )}
    </Box>
  )
}

export default Researchers
