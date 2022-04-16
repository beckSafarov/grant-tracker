import { getAuth, updateProfile } from '@firebase/auth'
import { setDoc, doc, getFirestore, getDoc } from 'firebase/firestore'

import { app } from './config'
const db = getFirestore(app)
const auth = getAuth()
const success = { success: true }

const updateCurrUser = async (updates = {}) => {
  try {
    await updateProfile(auth?.currentUser, updates)
    return success
  } catch (err) {
    return err
  }
}

const setUserData = async (userData = {}) => {
  try {
    await setDoc(doc(db, 'Users', auth?.currentUser?.uid), userData)
    return success
  } catch (err) {
    return err
  }
}

const getDataById = async (dbName, id) => {
  const docRef = doc(db, dbName, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : false
}

/**
 * userProfile = {
 *  _id: ...,
 *  status: ...,
 *  school: ...,
 * }
 */

export { updateCurrUser, setUserData, getDataById }
