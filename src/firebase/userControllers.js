import { getAuth, updateProfile } from '@firebase/auth'
import {
  assert,
  assertValues,
  getDocsByProp,
  setDocData,
} from './helperControllers'
import { sendInvitation } from './emailControllers'
import { addGrantIfUserExists } from './grantControllers'
import { collect, isAnyNone } from '../helpers'

const auth = getAuth()
const success = { success: true }

const updateCurrUser = async (updates = {}) => {
  try {
    await updateProfile(auth?.currentUser, updates)
    return success
  } catch (error) {
    return { error }
  }
}

const setUserData = async (userData = {}, merge = false) => {
  const id = auth?.currentUser?.uid
  return setDocData('Users', id, userData, merge)
}

const getCoResearcherEmails = ({ type, info }) =>
  type.match(/ru/)
    ? collect(info.projects, 'coResearcherEmail')
    : [info.coResearcherEmail]

/**
 * @grant {type, startDate, endDate, id}
 * @user {name}
 */
export const getCoResearcherGrantData = (grant, user) => {
  if (isAnyNone([grant, user])) {
    throw new Error('Undefined or empty value passed')
  }
  const { startDate, endDate } = grant
  const emails = getCoResearcherEmails(grant)
  const startDateTime = startDate.getTime()
  const endDateTime = endDate.getTime()
  const dataToDB = { ...grant, researcherStatus: 'coResearcher' }
  const dataToEmail = {
    ...grant,
    startDate: startDateTime,
    endDate: endDateTime,
    piName: user.name,
  }
  return { emails, dataToDB, dataToEmail }
}

/**
 * @grant {type, startDate, endDate, id, info}
 * @user {name}
 */
const handleCoResearcherEmails = async (grant, user) => {
  if (isAnyNone([grant, user])) {
    throw new Error('Undefined or empty value passed')
  }
  if (grant.type.match(/prg|bridging/)) return
  const { emails, dataToDB, dataToEmail } = getCoResearcherGrantData(
    grant,
    user
  )
  try {
    for (let email of emails) {
      const isExistingUser = await addGrantIfUserExists(email, dataToDB)
      const { error } = await sendInvitation(email, dataToEmail, isExistingUser)
      if (error) return { error }
    }
    return success
  } catch (error) {
    return { error }
  }
}

const getAllUsersBySchool = async (school) => {
  assert(school, 'school')
  return await getDocsByProp('Users', 'school', school)
}

export {
  updateCurrUser,
  handleCoResearcherEmails,
  setUserData,
  getAllUsersBySchool,
}
