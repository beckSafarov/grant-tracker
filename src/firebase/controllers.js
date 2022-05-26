import { getAuth, updateProfile } from '@firebase/auth'
import {
  setDoc,
  doc,
  getFirestore,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore'
import { app } from './config'
import { sendInvitation } from './emailControllers'
import {
  addGrantIfUserExists,
  getCoResearcherGrantData,
} from './grantControllers'

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

const getDataById = async (dbName, id) => {
  const docRef = doc(db, dbName, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : false
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

const getAllUsers = async () => {
  const usersSnapshot = await getColSnap('Users')
  return usersSnapshot.docs.map((doc) => doc.data())
}

export {
  updateCurrUser,
  setDocData,
  setUserData,
  getDataById,
  getAllUsers,
  handleCoResearcherEmails,
  getColSnap,
}
