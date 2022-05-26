import React, { createContext, useReducer } from 'react'
import {
  getDataById,
  setUserData,
  getAllUsers as getAllUsersFromDB,
} from '../firebase/controllers'
import { emailSignIn, emailSignUp } from '../firebase/auth'
import { omit, renameProp } from '../helpers'

const initialState = {
  loading: false,
  user: null,
  error: null,
  allUsers: null,
  others: {
    user: null,
  },
}
export const UserContext = createContext(initialState)

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'setUser':
      return { ...state, loading: true, user: action.data }
    case 'setSomeUser':
      const others = { ...state.others, user: action.data }
      return { ...state, loading: false, others }
    case 'error':
      return { ...state, loading: false, error: action.error }
    case 'setAllUsers':
      return { ...state, loading: false, allUsers: action.data }
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

  const getCurrUserById = async (uid) => {
    setLoading()
    const data = await getDataById('Users', uid)
    const errMsg = `No user found with the id ${uid}`
    handleResponse(data, data, errMsg)
  }
  const getSomeUserById = async (uid) => {
    setLoading()
    const data = await getDataById('Users', uid)
    const errMsg = `No user found with the id ${uid}`
    data
      ? dispatch({ type: 'setSomeUser', data })
      : dispatch({ type: 'error', error: errMsg })
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

  const getAllUsers = async () => {
    setLoading()
    try {
      const data = await getAllUsersFromDB()
      dispatch({ type: 'setAllUsers', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  return (
    <UserContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        user: state.user,
        allUsers: state.allUsers,
        others: state.others,
        getCurrUserById,
        getSomeUserById,
        getAllUsers,
        signIn,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
