import { v4 as uuid4 } from 'uuid'
import { getDocsByProp, setDocData } from './helperControllers'

export const getPubsById = async (id) => {
  return await getDocsByProp('Publications', 'id', id)
}

export const getPubsBySchool = async (school) => {
  return await getDocsByProp('Publications', 'school', school)
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
