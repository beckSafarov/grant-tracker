import { getAuth, updateProfile } from '@firebase/auth'
import {
  setDoc,
  doc,
  getFirestore,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'
import { app } from './config'
import { getCoResearcherEmails } from '../helpers'
import { getMonthsAdded } from '../helpers/dateHelpers'
import { sendInvitation } from './emailControllers'

const db = getFirestore(app)
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

const setDocData = async (collectionName, docId, updates, merge = false) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, updates, { merge })
    return success
  } catch (error) {
    return { error }
  }
}

const setUserData = async (userData = {}, merge = false) => {
  const id = auth?.currentUser?.uid
  console.log({ userData, id })
  return setDocData('Users', id, userData, merge)
}

const grantInits = (period) => ({
  id: uuid4(),
  startDate: new Date(),
  endDate: getMonthsAdded(period),
})

/**
 * @param Object:{type, info, votAllocations, uid}
 */
const setGrantData = async (data, merge = false) => {
  try {
    const { id, startDate, endDate } = grantInits(data.info.period)
    const docRef = doc(db, 'Grants', id)
    await setDoc(docRef, { ...data, id, startDate, endDate }, { merge })
    return { ...success, grantId: id, startDate, endDate }
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

const getDataById = async (dbName, id) => {
  const docRef = doc(db, dbName, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : false
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

const getColSnap = async (collName) => {
  const col = collection(db, collName)
  const colSnapshot = await getDocs(col)
  return colSnapshot
}

const getAllGrants = async () => {
  const grantsSnapshot = await getColSnap('Grants')
  return grantsSnapshot.docs
    .map((doc) => doc.data())
    .sort((x, y) => y.startDate.toDate() - x.startDate.toDate())
}

const getAllUsers = async () => {
  const usersSnapshot = await getColSnap('Users')
  return usersSnapshot.docs.map((doc) => doc.data())
}

export {
  updateCurrUser,
  setDocData,
  setUserData,
  getDataById,
  getGrantName,
  getAllGrants,
  getAllUsers,
  setGrantData,
  addGrantToUser,
  addGrantIfUserExists,
  handleCoResearcherEmails,
}
