import { getAuth } from '@firebase/auth'
import {
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'
import { getCoResearcherEmails } from '../helpers'
import { setDocData, getColSnap, getDataById, getAllDocs } from './controllers'
import { app } from './config'

const db = getFirestore(app)
const auth = getAuth()
const success = { success: true }

/**
 * @param Object:{type, info, votAllocations, uid}
 */
const setGrantData = async (data, merge = false) => {
  try {
    const id = uuid4()
    const docRef = doc(db, 'Grants', id)
    await setDoc(docRef, { ...data, id }, { merge })
    return { ...success, grantId: id }
  } catch (error) {
    return { error }
  }
}

const addGrantToUser = async (data, id) => {
  const uid = id || auth?.currentUser?.uid
  try {
    const userRef = doc(db, 'Users', uid)
    await updateDoc(userRef, {
      grants: arrayUnion(data),
    })
    return success
  } catch (error) {
    return { error }
  }
}

const getGrantName = async (shortName) => {
  const data = await getDataById('GrantsData', shortName)
  return data.fullName
}

const addGrantIfUserExists = async (email, grant) => {
  const usersRef = collection(db, 'Users')
  const q = query(usersRef, where('email', '==', email))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(async ({ id }) => {
    await addGrantToUser(grant, id)
  })
  return querySnapshot.size > 0
}

const getCoResearcherGrantData = (grant, user) => {
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

const getAllGrants = async () => {
  const allGrants = await getAllDocs('Grants')
  return allGrants.sort((x, y) => y.startDate.toDate() - x.startDate.toDate())
}

const addMilestone = async (data, grantId) => {
  const id = uuid4()
  const grantRef = doc(db, 'Grants', grantId)
  try {
    await updateDoc(grantRef, {
      milestones: arrayUnion({ ...data, id }),
    })
    return { success: true, id }
  } catch (error) {
    return { error }
  }
}

const updateMilestone = async (updates, grantId, msId) => {
  console.log({ updates, grantId, msId })
  try {
    const grant = await getDataById('Grants', grantId)
    if (!grant.milestones) return
    const updatedMilestones = grant.milestones.map((ms) =>
      ms.id === msId ? { ...ms, ...updates } : ms
    )
    const updatedGrant = { ...grant, milestones: updatedMilestones }
    console.log({ grantId, updatedGrant })
    const res = await setDocData('Grants', grantId, updatedGrant, true)
    console.log(res)
    return { success: true }
  } catch (error) {
    return { error }
  }
}

const addActivity = async (data, grantId) => {
  const grantRef = doc(db, 'Grants', grantId)
  try {
    await updateDoc(grantRef, {
      activities: arrayUnion(data),
    })
    return { success: true }
  } catch (error) {
    return { error }
  }
}

const updateActivity = async (grantId, actId, updates) => {
  try {
    const grant = await getDataById('Grants', grantId)
    if (!grant.activities) return
    const updatedActivities = grant.activities.map((act) =>
      act.id === actId ? { ...act, ...updates } : act
    )
    const updatedGrant = { ...grant, activities: updatedActivities }
    await setDocData('Grants', grantId, updatedGrant, true)
    return { success: true }
  } catch (error) {
    return { error }
  }
}

const deleteActivity = async (grantId, actId) => {
  try {
    const grant = await getDataById('Grants', grantId)
    if (!grant.activities) return
    const updatedActivities = grant.activities.filter((act) => act.id !== actId)
    const updatedGrant = { ...grant, activities: updatedActivities }
    await setDocData('Grants', grantId, updatedGrant, true)
    return { success: true }
  } catch (error) {
    return { error }
  }
}

export {
  setGrantData,
  addGrantIfUserExists,
  addGrantToUser,
  getGrantName,
  getCoResearcherGrantData,
  getAllGrants,
  addMilestone,
  updateMilestone,
  addActivity,
  updateActivity,
  deleteActivity,
}
