import {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
} from 'firebase/firestore'
import { v4 as uuid4 } from 'uuid'
import { app } from './config'
import { setDocData } from './controllers'
const db = getFirestore(app)

export const getPubsById = async (prop, id) => {
  const pubsRef = collection(db, 'Publications')
  const q = query(pubsRef, where(prop, '==', id))
  const querySnapshot = await getDocs(q)
  const res = []
  querySnapshot.forEach(async (doc) => {
    res.push(doc)
  })
  return res.map((doc) => doc.data())
}
/**
 * @data Object {title, year, journal, doi, piId, grantId}
 */
export const addPublication = async (data) => {
  const id = uuid4()
  try {
    await setDocData('Publications', id, { ...data, id })
    return { success: true, id }
  } catch (error) {
    return { error }
  }
}

export const incrementPublications = async (
  { grantId, uid },
  { grantPubNumber, userPubNumber }
) => {
  try {
    await setDocData('Grants', grantId, { pubNumber: grantPubNumber }, true)
    await setDocData('Users', uid, { pubNumber: userPubNumber }, true)
    return { success: true }
  } catch (error) {
    return { error }
  }
}
