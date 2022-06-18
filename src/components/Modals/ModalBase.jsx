import { Modal, Stack } from '@mui/material'
import useModalStyles from '../../hooks/useModalStyles'
import ComponentTitle from '../ComponentTitle'
import LocalSpinner from '../LocalSpinner'
import ErrorAlert from '../ErrorAlert'

const ModalBase = ({
  open,
  onClose,
  baseSx,
  title,
  children,
  loading,
  error,
  spacing,
}) => {
  const sx = useModalStyles(baseSx)
  return (
    <Modal open={open} onClose={onClose}>
      <Stack sx={sx} spacing={spacing}>
        <ComponentTitle>{title}</ComponentTitle>
        {children}
        <LocalSpinner hidden={!loading} />
        <ErrorAlert error={error} />
      </Stack>
    </Modal>
  )
}

ModalBase.defaultProps = {
  baseSx: {},
  open: false,
  loading: false,
  error: null,
  onClose: () => void 0,
  title: '',
  spacing: {},
}

export default ModalBase
