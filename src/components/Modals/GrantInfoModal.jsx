import { useCallback, useEffect } from 'react'
import { grantOptions } from '../../config'
import { collect, getArrOfObjects, isNone } from '../../helpers'
import { dateFormat, getDateSafely } from '../../helpers/dateHelpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import useUserStatus from '../../hooks/useUserStatus'
import MyLink from '../MyLink'
import ModalBase from './ModalBase'

const GrantInfoModal = ({ open, onClose }) => {
  const { grant, loading, getCoResearchers } = useGrantContext()
  const { userStatus } = useUserStatus()
  const isRegularUser = userStatus === 'regular'
  const corchers = grant?.coResearchers
  const shouldHaveCorchers = Boolean(grant?.type?.match(/ru|short/i))

  useEffect(() => {
    if (open && shouldHaveCorchers && !corchers) {
      getCoResearchers(grant.id)
    }
  }, [corchers, shouldHaveCorchers, open])

  const getPiName = () => {
    return isRegularUser ? (
      grant.user.name
    ) : (
      <MyLink to={`/dean/user/${grant.user.uid}`}>{grant.user.name}</MyLink>
    )
  }

  const getCorcherNames = () => {
    if (isNone(corchers)) {
      return loading ? 'Loading...' : '-'
    }
    if (isRegularUser) {
      return collect(corchers, 'name').join(', ')
    }
    return (
      <>
        {corchers.map((corcher, i) => (
          <MyLink key={i} to={`/dean/user/${corcher.uid}`}>
            {corcher.name}
          </MyLink>
        ))}
      </>
    )
  }

  const getData = () => {
    const type = grantOptions[grant.type]
    const pi = getPiName()
    const startDate = dateFormat(getDateSafely(grant.startDate))
    const endDate = dateFormat(getDateSafely(grant.endDate))
    const corcherNames = getCorcherNames()
    return { ...grant, type, pi, startDate, endDate, corcherNames }
  }

  const getFields = useCallback(() => {
    if (isNone(grant)) return []
    const data = getData()
    return getArrOfObjects([
      ['label', 'value'],
      ['Grant Title', data.title],
      ['Grant Type', data.type],
      ['PI', data.pi],
      ['Co-Researchers', data.corcherNames],
      ['Number of Publications', data.pubNumber],
      ['Grant Start Date', data.startDate],
      ['Grant End Date', data.endDate],
    ])
  }, [grant])

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      spacing={2}
      baseSx={{ width: '600px', height: '300px', left: '55%' }}
      title='Grant Info'
    >
      <table style={{ width: '100%', height: '100%' }}>
        <tbody>
          {getFields().map((field, i) => (
            <tr key={i}>
              <td style={{ borderBottom: '1px solid #ccc' }}>
                <strong>{field.label}</strong>
              </td>
              <td style={{ borderBottom: '1px solid #ccc' }}>{field.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalBase>
  )
}

export default GrantInfoModal
