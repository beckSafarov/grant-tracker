import { getAuth, updateProfile } from '@firebase/auth'
import {
  setDoc,
  doc,
  getFirestore,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'
import { app } from './config'
import { getMonthsAdded } from '../helpers'

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

const setDocData = async (collectionName, docId, updates, merge = false) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, updates, { merge })
    return success
  } catch (err) {
    return err
  }
}

const setUserData = async (userData = {}, merge = false) =>
  setDocData('Users', auth?.currentUser?.uid, userData, merge)

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
  } catch (err) {
    return err
  }
}

const addGrantToUser = async (data) => {
  try {
    const userRef = doc(db, 'Users', auth?.currentUser?.uid)
    await updateDoc(userRef, {
      grants: arrayUnion(data),
    })
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
 * sample format: 
 * message: {
      subject: 'Welcome to Firebase',
      text: 'Welcome to Firebase',
      html: '<centered><p>This message is to confirm that  email sending functionality in <strong>GTrack</strong> has been set up in the app programmatically</p><br/> <small>Powered by SendinBlue</small></centered>',
    },
    to: ['begzodsafarov@student.usm.my'],
 */
const sendEmail = async (body) => {
  await setDocData('Email', uuid4(), {
    ...body,
  })
}

export {
  updateCurrUser,
  setDocData,
  setUserData,
  getDataById,
  setGrantData,
  addGrantToUser,
  sendEmail,
}
