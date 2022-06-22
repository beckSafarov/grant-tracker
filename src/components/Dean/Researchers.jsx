import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { schoolsNames } from '../../config'
import { getArrOfObjects } from '../../helpers'
import { dateFormat } from '../../helpers/dateHelpers'
import { useUserContext } from '../../hooks/ContextHooks'
import ResearcherInfoModal from '../Modals/ResearcherInfoModal'
import StickyHeadTable from '../StickyHeadTable'

const tableColumns = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['researcherName', 'Researcher', 180],
  ['email', 'Email', 180],
  ['status', 'User Status', 150],
  ['school', 'School', 180],
  ['grants', 'Grants', 100],
  ['piIn', 'Leading Researches', 100],
  ['lastGrant', 'Last Grant End Date', 133],
])

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

  return (
    <Box px='40px'>
      {users && (
        <>
          <StickyHeadTable
            columns={tableColumns}
            rows={getRows()}
            searchBy={['researcherName', 'email']}
          />
          <ResearcherInfoModal
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
