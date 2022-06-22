import { useGrantContext, useUserContext } from './ContextHooks'

const useUserStatus = () => {
  const { user } = useUserContext()
  const { grant } = useGrantContext()
  if (!user || !grant) {
    return { userStatus: user?.status, researcherStatus: '' }
  }
  const userStatus = user.status
  const researcherStatus =
    user.grants.find((userGrant) => userGrant.id === grant.id)
      ?.researcherStatus || ''
  return {
    userStatus,
    researcherStatus,
    isResearcher: researcherStatus.match(/pi|co/i),
    isPi: researcherStatus === 'pi',
  }
}

export default useUserStatus
