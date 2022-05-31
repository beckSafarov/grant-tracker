import { useTheme } from '@emotion/react'
import { Button, Modal, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { grantOptions, schoolsNames } from '../../config'
import SVGAvatar from '../SVGAvatar'
import { dateFormat } from '../../helpers/dateHelpers'
import { Link } from 'react-router-dom'
import Mailto from '../Mailto'

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
  const [grantsPrev, setGrantsPrev] = useState([])
  const school = schoolsNames[user?.school] || ''

  useEffect(() => {
    if (user) initPrev()
  }, [user?.grants])

  const initPrev = () => {
    const len = user.grants.length
    setGrantsPrev(len > 2 ? user.grants.slice(0, 2) : user.grants)
  }

  const getStartDate = (grant) => {
    return dateFormat(grant.startDate.toDate())
  }

  const getEndDate = (grant) => {
    return dateFormat(grant.endDate.toDate())
  }

  const handleClose = () => {
    setGrantsPrev([])
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
              <Mailto>{user.email}</Mailto>
              <p>{school}</p>
            </div>
          </Stack>
          {user.grants.length > 0 && (
            <Stack>
              <p>
                <strong>Grants: </strong>
              </p>

              {grantsPrev.map((grant, i) => (
                <div key={i}>
                  <p>
                    {i + 1}. {grant.title} ({grantOptions[grant.type]})
                  </p>

                  <p>
                    <em>{getStartDate(grant) + ' to ' + getEndDate(grant)}</em>
                  </p>
                </div>
              ))}
            </Stack>
          )}
          {user.grants.length > 2 && (
            <Link to={`/dean/user/${user.uid}`}>
              <Button sx={{ mt: 2, width: '100%' }}>More</Button>
            </Link>
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
