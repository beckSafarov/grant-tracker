import React, { createContext, useReducer } from 'react'
import {
  setGrantData,
  addGrantToUser,
  getDataById,
  handleCoResearcherEmails,
  getAllGrants as getAllGrantsFromDB,
} from '../firebase/controllers'

const initialState = {
  loading: false,
  error: null,
  grant: null,
  allGrants: null,
}
export const GrantContext = createContext(initialState)

const GrantReducer = (state, action) => {
  const success = { ...state, loading: false, success: true }
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return { ...state, loading: false, success: true, grant: action.data }
    case 'error':
      return { ...state, success: false, loading: false, error: action.error }
    case 'setAllGrants':
      return { ...state, loading: false, success: true, allGrants: action.data }
    case 'resetSuccess':
      return { ...state, success: false }
    default:
      return state
  }
}

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

  const resetSuccess = () => dispatch({ type: 'resetSuccess' })

  return (
    <GrantContext.Provider
      value={{
        loading: state.loading,
        success: state.success,
        error: state.error,
        grant: state.grant,
        allGrants: state.allGrants,
        setNewGrant,
        getGrantById,
        getAllGrants,
        resetSuccess,
      }}
    >
      {children}
    </GrantContext.Provider>
  )
}
