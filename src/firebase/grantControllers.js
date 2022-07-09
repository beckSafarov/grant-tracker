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
  addDoc,
} from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'
import { collect } from '../helpers'
import { setDocData, getDataById, getDocsByProp } from './helperControllers'
import { compact } from 'lodash'
import { app } from './config'

const db = getFirestore(app)
const auth = getAuth()
const success = { success: true }

/**
 * @param Object:{type, info, votAllocations}
 */
const setGrantData = async (data) => {
  try {
    const id = uuid4()
    const res = await setDocData('Grants', id, { ...data, id })
    return { ...res, grantId: id }
  } catch (error) {
    return { error }
  }
}

const addGrantToUser = async (data, id) => {
  const uid = id || auth?.currentUser?.uid
  try {
    const userRef = doc(db, 'Users', uid)
    const res = await updateDoc(userRef, {
      grants: arrayUnion(data),
    })
    return { ...success, ...res }
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
  try {
    const q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(async ({ id }) => {
      await addGrantToUser(grant, id)
    })
    return querySnapshot.size > 0
  } catch (error) {
    return { error }
  }
}

const getGrantsBySchool = async (school = 'cs') => {
  return await getDocsByProp('Grants', 'school', school)
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
  try {
    const grant = await getDataById('Grants', grantId)
    if (!grant.milestones) return
    const updatedMilestones = grant.milestones.map((ms) =>
      ms.id === msId ? { ...ms, ...updates } : ms
    )
    const updatedGrant = { ...grant, milestones: updatedMilestones }
    const res = await setDocData('Grants', grantId, updatedGrant, true)
    return res
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

const getCorcherEmails = ({ type, info }) => {
  if (type.match(/ru/i)) {
    const emails = collect(info.projects, 'coResearcherEmail')
    return compact(emails)
  }
  return [info.coResearcherEmail]
}

const getCoResearchers = async (grantId) => {
  try {
    const grant = await getDataById('Grants', grantId)
    const emails = getCorcherEmails(grant)
    const usersRef = collection(db, 'Users')
    const res = []
    for (let email of emails) {
      const q = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        res.push(doc)
      })
    }
    return res.map((res) => res.data())
  } catch (error) {
    return { error }
  }
}

const updateGrant = async (grantId, updates) => {
  try {
    return await setDocData('Grants', grantId, updates, true)
  } catch (error) {
    return { error }
  }
}

const updateGrantProp = async ({ grantId, field, value }) => {
  try {
    const grantRef = doc(db, 'Grants', grantId)
    const update = {}
    update[field] = value
    const res = await updateDoc(grantRef, update)
    return { success: true, res }
  } catch (error) {
    return { error }
  }
}

export {
  setGrantData,
  addGrantIfUserExists,
  addGrantToUser,
  getGrantName,
  addMilestone,
  updateMilestone,
  addActivity,
  updateActivity,
  deleteActivity,
  getCoResearchers,
  getGrantsBySchool,
  updateGrantProp,
  updateGrant,
}
