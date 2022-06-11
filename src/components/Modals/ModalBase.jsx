import { Modal, Stack } from '@mui/material'
import useModalStyles from '../../hooks/useModalStyles'
import ComponentTitle from '../ComponentTitle'

const ModalBase = ({ open, onClose, baseSx, title, children, ...rest }) => {
  const sx = useModalStyles(baseSx)
  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={sx} {...rest}>
        <ComponentTitle>{title}</ComponentTitle>
        {children}
      </Stack>
    </Modal>
  )
}

ModalBase.defaultProps = {
  baseSx: {},
  open: false,
  onClose: () => void 0,
  title: '',
}

export default ModalBase
