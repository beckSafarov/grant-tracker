import { Box, capitalize, Stack } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Mailto from '../components/Mailto'
import StickyHeadTable from '../components/StickyHeadTable'
import { grantOptions, schoolsNames } from '../config'
import { getArrOfObjects } from '../helpers'
import { getDateInterval } from '../helpers/dateHelpers'
import { useUserContext } from '../hooks/ContextHooks'

const tableColumns = getArrOfObjects([
  ['field', 'label', 'minWidth'],
  ['title', 'Title', 300],
  ['type', 'Type', 180],
  ['date', 'Date', 300],
])

const UserInfoScreen = () => {
  const { pathname: path } = useLocation()
  const { getSomeUserById, others } = useUserContext()
  const { user } = others
  const uid = path.split('/').pop()

  useEffect(() => {
    if (!user || user.id !== uid) getSomeUserById(uid)
  }, [uid, user])

  const basicInfo = {
    name: user?.name,
    email: <Mailto>{user?.email}</Mailto>,
    school: schoolsNames[user?.school],
    grants: user?.grants?.length,
  }

  const getRows = useCallback(() => {
    const sortDescending = (x, y) => y.startDate.toDate() - x.startDate.toDate()
    return user.grants.map((grant) => ({
      title: grant.title,
      type: grantOptions[grant.type],
      date: getDateInterval(grant, 'to'),
    }))
  })

  return (
    <Box px='40px' pt='30px'>
      {user && (
        <>
          <Stack
            direction='row'
            spacing={4}
            sx={{ width: '100%' }}
            alignItems='flex-start'
          >
            <Avatar width={100} user={user} />
            <Stack direction='row' spacing={2} sx={{ p: 0, m: 0 }}>
              <div>
                {Object.keys(basicInfo).map((prop, i) => (
                  <p key={i}>
                    <strong>{capitalize(prop)}</strong>
                  </p>
                ))}
              </div>
              <div>
                {Object.values(basicInfo).map((val, i) => (
                  <p key={i}>{val}</p>
                ))}
              </div>
            </Stack>
          </Stack>
          <Box mt='40px'>
            <StickyHeadTable
              columns={tableColumns}
              rows={getRows()}
              searchBy={['title', 'type']}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default UserInfoScreen
