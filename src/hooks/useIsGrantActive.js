import { getDateSafely } from '../helpers/dateHelpers'
import { useGrantContext } from './ContextHooks'

const useIsGrantActive = () => {
  const { grant } = useGrantContext()
  if (!grant) return false
  const now = new Date()
  return getDateSafely(grant.endDate) > now
}

export default useIsGrantActive
