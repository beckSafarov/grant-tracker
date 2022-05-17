import React, { createContext, useReducer } from 'react'
import {
  setGrantData,
  addGrantToUser,
  getDataById,
  handleCoResearcherEmails,
} from '../firebase/controllers'

const initialState = {
  loading: false,
  error: null,
  grant: null,
}
export const GrantContext = createContext(initialState)

const GrantReducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return { loading: false, success: true, grant: action.data }
    case 'error':
      return { ...state, success: false, loading: false, error: action.error }
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
  const setNewGrant = async (grantData, user) => {
    setLoading()
    try {
      const res = await setGrantData(grantData)
      const mainGrantData = {
        id: res.grantId,
        type: grantData.type,
        researcherStatus: 'pi',
        startDate: res.startDate,
        endDate: res.endDate,
      }
      await addGrantToUser(mainGrantData)
      await handleCoResearcherEmails(
        { ...mainGrantData, info: grantData.info },
        user
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

  const resetSuccess = () => dispatch({ type: 'resetSuccess' })

  return (
    <GrantContext.Provider
      value={{
        loading: state.loading,
        success: state.success,
        error: state.error,
        grant: state.grant,
        setNewGrant,
        getGrantById,
        resetSuccess,
      }}
    >
      {children}
    </GrantContext.Provider>
  )
}
