import { getAuth, updateProfile } from '@firebase/auth'
import { setDoc, doc, getFirestore } from 'firebase/firestore'

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

/**
 * userProfile = {
 *  _id: ...,
 *  status: ...,
 *  school: ...,
 * }
 */

export { updateCurrUser, setUserData }
