import { getAuth, updateProfile } from '@firebase/auth'
import {
  setDoc,
  doc,
  getFirestore,
  getDoc,
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
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

const getAllDocs = async (colName) => {
  const docsSnapShot = await getColSnap(colName)
  return docsSnapShot.docs.map((doc) => doc.data())
}

const getAllUsers = async () => await getAllDocs('Users')

const updateArrInDoc = async ({ updates, docId, arrName, elemId, colName }) => {
  try {
    const doc = await getDataById(colName, docId)
    if (!doc[arrName]) return
    const updatedArr = doc[arrName].map((elem) =>
      elem.id === elemId ? { ...elem, ...updates } : elem
    )
    doc[arrName] = updatedArr
    return await setDocData(colName, docId, doc, true)
  } catch (error) {
    return { error }
  }
}

const addToArrInDoc = async ({ colName, docId, arrName, elem }) => {
  const docRef = doc(db, colName, docId)
  const update = {}
  update[arrName] = arrayUnion(elem)
  try {
    const res = await updateDoc(docRef, update)
    return { success: true, res }
  } catch (error) {
    return { error }
  }
}

export {
  updateCurrUser,
  setDocData,
  setUserData,
  getDataById,
  getAllUsers,
  updateArrInDoc,
  handleCoResearcherEmails,
  getColSnap,
  getAllDocs,
  addToArrInDoc,
}
