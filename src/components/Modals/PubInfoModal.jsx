import React, { useEffect, useCallback } from 'react'
import { useGrantContext } from '../../hooks/ContextHooks'
import { dateFormat } from '../../helpers/dateHelpers'
import { grantOptions } from '../../config'
import { Link } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import { getArrOfObjects } from '../../helpers'
import ModalBase from './ModalBase'

const PubInfoModal = ({ open, onClose, pub }) => {
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
    const pi = (
      <Link style={{ color: text.blue }} to={`/dean/user/${pub.user.uid}`}>
        {pub.user.name}
      </Link>
    )
    return getArrOfObjects([
      ['label', 'value'],
      ['Publication Title', pub.title],
      ['Publication Year', pub.year],
      ['PI', pi],
      ['Grant Title', grant.title],
      ['Grant Type', grantOptions[grant.type]],
      ['Number of Publications in the grant', grant.pubNumber],
      ['Grant Start', dateFormat(grant.startDate.toDate())],
      ['Grant End', dateFormat(grant.endDate.toDate())],
    ])
  }, [pub, grant])

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      spacing={2}
      baseSx={{ width: '800px', height: '400px', left: '55%' }}
      title='Publication Info'
      loading={loading}
    >
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
    </ModalBase>
  )
}

PubInfoModal.defaultProps = {
  open: false,
  pub: null,
  onClose: () => void 0,
}

export default PubInfoModal
