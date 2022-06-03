import { Modal, Stack } from '@mui/material'
import React, { useEffect, useCallback } from 'react'
import useModalStyles from '../../hooks/useModalStyles'
import { useGrantContext } from '../../hooks/ContextHooks'
import LocalSpinner from '../LocalSpinner'
import ComponentTitle from '../ComponentTitle'
import { dateFormat } from '../../helpers/dateHelpers'
import { grantOptions } from '../../config'
import { Link } from 'react-router-dom'
import { useTheme } from '@emotion/react'

const PubInfoModal = ({ open, onClose, pub }) => {
  const style = useModalStyles({ width: '800px', height: '400px' })
  const { text } = useTheme()
  const { grant, getGrantById } = useGrantContext()
  const loading = !pub || !grant || grant.id !== pub.grantId
  const showTable = Boolean(pub && grant && grant.id === pub.grantId)
  useEffect(() => {
    if (pub) {
      if (!grant || grant.id !== pub.grantId) {
        getGrantById(pub.grantId)
      }
    }
  }, [pub, grant])

  const getFields = useCallback(() => {
    if (!pub || !grant) return []
    const genObj = (label, value) => ({ label, value })
    const pi = (
      <Link style={{ color: text.blue }} to={`/dean/user/${pub.user.uid}`}>
        {pub.user.name}
      </Link>
    )
    return [
      genObj('Publication Title', pub.title),
      genObj('Publication Year', pub.year),
      genObj('PI', pi),
      genObj('Grant Title', grant.title),
      genObj('Grant Type', grantOptions[grant.type]),
      genObj('Number of Publications in the grant', grant.pubNumber),
      genObj('Grant Start', dateFormat(grant.startDate.toDate())),
      genObj('Grant End', dateFormat(grant.endDate.toDate())),
    ]
  }, [pub, grant])

  return (
    <Modal open={open} onClose={onClose}>
      <Stack spacing={2} sx={style}>
        <ComponentTitle>Publication Info</ComponentTitle>
        <LocalSpinner hidden={!loading} />
        {showTable && (
          <table style={{ width: '100%', height: '100%' }}>
            {getFields().map((field, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc' }}>
                  <strong>{field.label}</strong>
                </td>
                <td style={{ border: '1px solid #ccc' }}>{field.value}</td>
              </tr>
            ))}
          </table>
        )}
      </Stack>
    </Modal>
  )
}

PubInfoModal.defaultProps = {
  open: false,
  pub: null,
  onClose: () => void 0,
}

export default PubInfoModal
