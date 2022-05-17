import React, { createContext, useReducer } from 'react'
import { getDataById, setUserData } from '../firebase/controllers'
import { emailSignIn, emailSignUp } from '../firebase/auth'
import { omit, renameProp } from '../helpers'

const initialState = {
  loading: false,
  user: null,
  error: null,
}
export const UserContext = createContext(initialState)

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'setUser':
      return { loading: true, user: action.data }
    case 'error':
      return { loading: false, error: action.error }
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState)

  const setLoading = () => dispatch({ type: 'loading' })

  const handleError = (error) => {
    dispatch({ type: 'error', error })
  }

  const handleResponse = (condition, data, error) => {
    condition
      ? dispatch({ type: 'setUser', data })
      : dispatch({ type: 'error', error })
  }

  const getUserData = async (uid) => {
    setLoading()
    const data = await getDataById('Users', uid)
    const errMsg = `No user found with the id ${uid}`
    handleResponse(data, data, errMsg)
  }

  const signIn = async (vals) => {
    setLoading()
    const { success, error, user } = await emailSignIn(vals)
    handleResponse(success, user, error)
  }

  const getRefinedGrantData = (data) => {
    delete data.email
    const propRenamed = renameProp(data, 'grantId', 'id')
    const startDate = new Date(+data.startDate)
    const endDate = new Date(+data.endDate)
    return {
      ...propRenamed,
      startDate,
      endDate,
      researcherStatus: 'coResearcher',
    }
  }

  const setUpUserProfile = async (vals) => {
    const res = await setUserData(vals)
    handleResponse(res.success, vals, res)
  }

  const handleSignupSuccess = async (vals, grantData) => {
    const pureVals = omit(vals, ['password'])
    const grants = []
    if (grantData) {
      grants.push(getRefinedGrantData(grantData))
    }
    await setUpUserProfile({ ...pureVals, grants })
  }

  const signUp = async (vals, grantData) => {
    setLoading()
    const { success, error, user } = await emailSignUp(vals)
    if (success) {
      await handleSignupSuccess({ ...vals, uid: user.uid }, grantData)
      return
    }
    handleError(error)
  }

  return (
    <UserContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        user: state.user,
        getUserData,
        signIn,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
