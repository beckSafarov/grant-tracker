import {
  setDoc,
  doc,
  getFirestore,
  getDoc,
  collection,
  getDocs,
  arrayUnion,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'
import { app } from './config'

const db = getFirestore(app)
const success = { success: true }

const setDocData = async (collectionName, docId, updates, merge = false) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, updates, { merge })
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

const getColSnap = async (collName) => {
  const col = collection(db, collName)
  const colSnapshot = await getDocs(col)
  return colSnapshot
}

const getAllDocs = async (colName) => {
  const docsSnapShot = await getColSnap(colName)
  return docsSnapShot.docs.map((doc) => doc.data())
}

const getDocsByProp = async (colName, propName, propValue) => {
  if (!colName || !propValue) return []
  const colRef = collection(db, colName)
  const q = query(colRef, where(propName, '==', propValue))
  try {
    const querySnapshot = await getDocs(q)
    const res = []
    querySnapshot.forEach(async (doc) => {
      res.push(doc)
    })
    return { success: true, data: res.map((doc) => doc.data()) }
  } catch (error) {
    return { error }
  }
}

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
  setDocData,
  getDataById,
  updateArrInDoc,
  getColSnap,
  getAllDocs,
  addToArrInDoc,
  getDocsByProp,
}
