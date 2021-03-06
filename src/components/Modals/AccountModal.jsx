import { Button, Modal, Stack } from '@mui/material'
import React from 'react'
import { schoolsList } from '../../config'
import { logout } from '../../firebase/auth'
import { useUserContext } from '../../hooks/ContextHooks'
import useModalStyles from '../../hooks/useModalStyles'
import Avatar from '../Avatar'

const labels = ['Name', 'Email', 'School']

const AccountModal = ({ open, onClose }) => {
  const { user } = useUserContext()
  const style = useModalStyles()
  const school = schoolsList.find((s) => s.value === user.school).label

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Stack spacing={2} sx={style}>
        <Stack justifyContent='center' alignItems='center'>
          <Avatar user={user} width={70} />
        </Stack>
        <Stack spacing={2} direction='row' fontSize='1rem'>
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
        <Button onClick={handleLogout} variant='outlined' color='error'>
          Logout
        </Button>
      </Stack>
    </Modal>
  )
}

AccountModal.defaultProps = {
  open: false,
  onClose: () => void 0,
}

export default AccountModal
