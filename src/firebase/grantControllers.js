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
import { getColSnap, getDataById } from './controllers'
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
  const grantsSnapshot = await getColSnap('Grants')
  return grantsSnapshot.docs
    .map((doc) => doc.data())
    .sort((x, y) => y.startDate.toDate() - x.startDate.toDate())
}

const addPublication = (publication) => {}

export {
  setGrantData,
  addGrantIfUserExists,
  addGrantToUser,
  getGrantName,
  getCoResearcherGrantData,
  getAllGrants,
  addPublication,
}
