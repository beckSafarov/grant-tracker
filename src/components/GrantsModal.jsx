import { useTheme } from '@emotion/react'
import { Button, Modal, Stack } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { grantOptions, schoolsNames } from '../config'
import SVGAvatar from './SVGAvatar'
import { dateFormat } from '../helpers/dateHelpers'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
}

const labels = ['Name', 'Email', 'School']

const GrantsModal = ({ open, onClose, user }) => {
  const { components } = useTheme()
  const { bg, text } = components.avatar
  const [indexes, setIndexes] = useState([0, 3])
  const school = schoolsNames[user?.school] || ''

  useEffect(() => {
    if (user) initIndexes()
  }, [user?.grants])

  const initIndexes = () => {
    const len = user.grants.length
    if (len > 0) {
      const lastIndex = len > 3 ? 3 : len
      setIndexes([0, lastIndex])
    }
  }

  const getStartDate = (grant) => {
    return dateFormat(grant.startDate.toDate())
  }

  const getEndDate = (grant) => {
    return dateFormat(grant.endDate.toDate())
  }

  const getGrants = useCallback(() => {
    return user.grants
      .slice(indexes[0], indexes[1])
      .sort((x, y) => y.startDate.toDate() - x.startDate.toDate())
  }, [user, indexes])

  const canMoveBack = useCallback(() => {
    return indexes[0] !== 0
  }, [indexes])

  const canMoveNext = useCallback(() => {
    return indexes[1] !== user.grants.length
  }, [indexes, user?.grants])

  const nextPage = useCallback(() => {
    const len = user.grants.length
    const newStartIndex = indexes[1]
    if (newStartIndex === len) return
    const moreElems = len - newStartIndex
    const newLastIndex =
      moreElems > 3 ? newStartIndex + 3 : newStartIndex + moreElems
    setIndexes([newStartIndex, newLastIndex])
  }, [user?.grants, indexes])

  const prevPage = useCallback(() => {
    if (indexes[0] === 0) return
    const newStartIndex = indexes[0] - 3
    const newLastIndex = newStartIndex + 3
    setIndexes([newStartIndex, newLastIndex])
  }, [user?.grants, indexes])

  const handleClose = () => {
    initIndexes()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      {user && (
        <Stack spacing={1} sx={style}>
          <Stack justifyContent='center' alignItems='center'>
            <SVGAvatar fullName={user.name} width={70} bg={bg} color={text} />
          </Stack>
          <Stack spacing={1} direction='row' fontSize='1rem'>
            <div>
              {labels.map((label, index) => (
                <p key={index}>
                  <strong>{label}</strong>
                </p>
              ))}
            </div>
            <div>
              <p>{user.name}</p>
              <p>{user.email} </p>
              <p>{school}</p>
            </div>
          </Stack>
          {user.grants.length > 0 && (
            <Stack>
              <p>
                <strong>Grants: </strong>
              </p>

              {getGrants().map((grant, i) => (
                <div key={i}>
                  <p>
                    {indexes[0] + i + 1}. {grantOptions[grant.type]}
                  </p>
                  <p>
                    <em>{getStartDate(grant) + ' to ' + getEndDate(grant)}</em>
                  </p>
                </div>
              ))}
              {user.grants.length > 3 && (
                <>
                  <small style={{ textAlign: 'center' }}>
                    {indexes[1]} out of {user.grants.length}
                  </small>
                  <Stack direction='row' justifyContent='space-between'>
                    <Button onClick={prevPage} disabled={!canMoveBack()}>
                      <ChevronLeftIcon />
                    </Button>
                    <Button onClick={nextPage} disabled={!canMoveNext()}>
                      <ChevronRightIcon />
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Modal>
  )
}

GrantsModal.defaultProps = {
  open: false,
  onClose: () => void 0,
  user: null,
}

export default GrantsModal
