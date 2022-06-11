import React from 'react'
import ModalBase from './ModalBase'
import BasicTable from '../BasicTable'
import { useTheme } from '@emotion/react'
import { useCallback } from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const columns = [
  { field: 'name', label: 'Name' },
  { field: 'type', label: 'Type' },
  { field: 'size', label: 'Size (KB)' },
  { field: 'link', label: 'Link' },
]

const FilesModal = ({ open, onClose, files }) => {
  const { text } = useTheme()
  const handleRowClick = ({ link }) => {
    window.location.href = link
  }

  const getRows = useCallback(() => {
    return files.map((file) => ({
      ...file,
      size: Math.round(file.size / 1000),
      type: file.type.split('/')[1],
      link: (
        <a
          target='_blank'
          className='underlineOnHover'
          href={file.link}
          style={{ color: text.blue }}
        >
          Open
        </a>
      ),
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
