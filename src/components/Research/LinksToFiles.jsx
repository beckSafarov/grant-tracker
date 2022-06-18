import { Button, Stack } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import React from 'react'
import { isNone } from '../../helpers'
import ExternalLink from '../ExternalLink'

const LinksToFiles = ({ files, maxFiles, onMore }) => {
  return (
    <>
      {!isNone(files) && (
        <Stack direction='column' spacing={1}>
          {files.slice(0, maxFiles).map(({ link, name }, i) => (
            <ExternalLink key={i} to={link} label={name} />
          ))}
          {files.length > maxFiles && (
            <Button type='click' variant='text' size='small' onClick={onMore}>
              <OpenInNewIcon sx={{ fontSize: '1rem' }} />
            </Button>
          )}
        </Stack>
      )}
    </>
  )
}

LinksToFiles.defaultProps = {
  maxFiles: 2,
  onMore: () => void 0,
}

export default LinksToFiles
