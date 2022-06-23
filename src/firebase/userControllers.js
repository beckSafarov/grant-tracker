import { getAuth, updateProfile } from '@firebase/auth'
import { getAllDocs, getDocsByProp, setDocData } from './helperControllers'
import { sendInvitation } from './emailControllers'
import {
  addGrantIfUserExists,
  getCoResearcherGrantData,
} from './grantControllers'

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

/**
 * @grant Obj:{type, startDate, endDate, id}
 */
const handleCoResearcherEmails = async (grant, user) => {
  if (grant.type.match(/prg|bridging/)) return
  const { emails, dataToDB, dataToEmail } = getCoResearcherGrantData(
    grant,
    user
  )
  try {
    emails.forEach(async (email) => {
      const isExistingUser = await addGrantIfUserExists(email, dataToDB)
      await sendInvitation(email, dataToEmail, isExistingUser)
    })
    return success
  } catch (error) {
    return { error }
  }
}

const getAllUsersBySchool = async (school) => {
  return await getDocsByProp('Users', 'school', school)
}

export {
  updateCurrUser,
  handleCoResearcherEmails,
  setUserData,
  getAllUsersBySchool,
}
