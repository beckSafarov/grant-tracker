import React, { createContext, useReducer } from 'react'
import { getDataById, handleCoResearcherEmails } from '../firebase/controllers'
import {
  setGrantData,
  addGrantToUser,
  getAllGrants as getAllGrantsFromDB,
} from '../firebase/grantControllers'
import {
  addPublication,
  getPubsById,
  incrementPublications,
} from '../firebase/publicationsControllers'
import produce from 'immer'

const initialState = {
  loading: false,
  error: null,
  grant: null,
  allGrants: null,
}
export const GrantContext = createContext(initialState)

const GrantReducer = produce((draft, action) => {
  switch (action.type) {
    case 'loading':
      return { ...draft, loading: true }
    case 'success':
      return { ...draft, loading: false, success: true, grant: action.data }
    case 'error':
      return { ...draft, success: false, loading: false, error: action.error }
    case 'setAllGrants':
      return { ...draft, loading: false, success: true, allGrants: action.data }
    case 'resetSuccess':
      return { ...draft, success: false }
    case 'addPub':
      const prevPubs = draft.grant.publications || []
      draft.loading = false
      draft.success = true
      draft.grant.publications = [...prevPubs, action.data]
      break
    case 'setPublications':
      draft.loading = false
      draft.grant.publications = action.data
      break
    case 'resetState':
      draft[action.state] = false
      break
    default:
      return draft
  }
})

export const GrantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GrantReducer, initialState)

  const setLoading = () => dispatch({ type: 'loading' })

  /**
   * @grantData Obj:{type, vots, info, uid }
   */
  const setNewGrant = async (grantData) => {
    setLoading()
    try {
      const res = await setGrantData(grantData)
      const mainGrantData = {
        id: res.grantId,
        type: grantData.type,
        researcherStatus: 'pi',
        startDate: grantData.startDate,
        endDate: grantData.endDate,
      }
      await addGrantToUser(mainGrantData)
      await handleCoResearcherEmails(
        { ...mainGrantData, info: grantData.info },
        { name: grantData.user.name }
      )
      dispatch({
        type: 'success',
        data: mainGrantData,
      })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getGrantById = async (id) => {
    setLoading()
    const data = await getDataById('Grants', id)
    const error = 'No grant found with the id of ' + id
    data
      ? dispatch({ type: 'success', data })
      : dispatch({ type: 'error', error })
  }

  const getAllGrants = async () => {
    setLoading()
    try {
      const data = await getAllGrantsFromDB()
      dispatch({ type: 'setAllGrants', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const addPub = async (data, pubNumber) => {
    setLoading()
    try {
      const { id } = await addPublication(data)
      await incrementPublications(data, pubNumber)
      dispatch({ type: 'addPub', data: { ...data, id } })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const getPubs = async (id) => {
    setLoading()
    try {
      const data = await getPubsById('grantId', id)
      dispatch({ type: 'setPublications', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  const resetState = (stateToReset) =>
    dispatch({ type: 'resetState', state: stateToReset })

  const resetSuccess = () => resetState('success')

  return (
    <GrantContext.Provider
      value={{
        ...state,
        allGrants: state.allGrants,
        setNewGrant,
        getGrantById,
        getAllGrants,
        resetState,
        resetSuccess,
        addPub,
        getPubs,
      }}
    >
      {children}
    </GrantContext.Provider>
  )
}
