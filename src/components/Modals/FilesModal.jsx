import React from 'react'
import ModalBase from './ModalBase'
import BasicTable from '../BasicTable'
import { useCallback } from 'react'
import ExternalLink from '../ExternalLink'

const columns = [
  { field: 'name', label: 'Name' },
  { field: 'type', label: 'Type' },
  { field: 'size', label: 'Size (KB)' },
  { field: 'link', label: 'Link' },
]

const FilesModal = ({ open, onClose, files }) => {
  const getRows = useCallback(() => {
    return files.map((file) => ({
      ...file,
      size: Math.round(file.size / 1000),
      type: file.type.split('/')[1],
      link: <ExternalLink to={file.link} label='Open' />,
    }))
  }, [files])

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title='Files'
      baseSx={{ width: '700px' }}
    >
      <BasicTable rows={getRows()} columns={columns} />
    </ModalBase>
  )
}

FilesModal.defaultProps = {
  open: false,
  onClose: () => void 0,
  files: [],
}

export default FilesModal
