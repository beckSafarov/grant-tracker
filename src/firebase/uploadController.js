import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'

const storage = getStorage()

/**
 * @file -- file from input
 */
export const upload = async (file) => {
  const imageRef = ref(storage, 'expenseReceipts/' + file.name + v4())
  const snapshot = await uploadBytes(imageRef, file)
  const url = await getDownloadURL(snapshot.ref)
  return url
}
