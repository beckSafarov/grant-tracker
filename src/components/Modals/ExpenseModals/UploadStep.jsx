import React, { useCallback, useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { useGrantContext } from '../../../hooks/ContextHooks'
import { upload } from '../../../firebase/uploadController'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ClearIcon from '@mui/icons-material/Clear'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Box } from '@mui/system'

const fileTypes = ['image/jpg', 'image/jpeg', 'image/png', '.pdf']

const UploadStep = ({ setLoading, expenseId }) => {
  const { grant, updateExpense } = useGrantContext()
  const [files, setFiles] = useState([])

  const uploadFiles = async () => {
    setLoading(true)
    const urls = []
    for (const file of files) {
      const res = await upload(file)
      urls.push(res)
    }
    setLoading(false)
    return urls
  }

  const buildFilesObjects = (urls = []) => {
    return files.map((file, i) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      link: urls[i],
    }))
  }

  const handleUpdateExpense = (files) => {
    updateExpense({ files }, grant.id, expenseId)
  }

  const handleUpload = async () => {
    if (files.length < 1) return
    const urls = await uploadFiles()
    const filesObjects = buildFilesObjects(urls)
    handleUpdateExpense(filesObjects)
  }

  const handleSetFiles = ({ target }) => {
    const newFiles = Array.from(target.files)
    setFiles((files) => [...files, ...newFiles])
  }

  const removeFile = ({ name }) => {
    setFiles((files) => files.filter((file) => file.name !== name))
  }

  return (
    <Stack spacing={2}>
      <div>
        <Typography fontSize='1rem'>Upload a receipt/proof</Typography>
        <small>Supported file types: jpg, jpeg, png, pdf</small>
      </div>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          py: '5px',
          px: '2px',
        }}
      >
        <input
          type='file'
          name='file'
          accept={fileTypes.join(', ')}
          onChange={handleSetFiles}
          multiple
        />
      </Box>
      {files.length > 0 && (
        <List>
          Selected files:
          {files.map((file, i) => (
            <ListItem disablePadding key={i}>
              <ListItemButton>
                <ListItemText sx={{ fontSize: '0.8rem' }} primary={file.name} />
                <ListItemIcon onClick={() => removeFile(file)}>
                  <ClearIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <Button
        type='click'
        onClick={handleUpload}
        variant='contained'
        disabled={files.length < 1}
        sx={{ mt: 3, width: '100%' }}
      >
        <FileUploadIcon sx={{ fontSize: '1rem', mr: '5px' }} /> Upload
      </Button>
    </Stack>
  )
}

export default UploadStep
