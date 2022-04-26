import React, { createContext, useReducer } from 'react'
import { getDataById, setUserData } from '../firebase/controllers'
import { emailSignIn, emailSignUp } from '../firebase/auth'
import { omit } from '../helpers'

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

  const setUpUserProfile = async (vals) => {
    const pureVals = omit(vals, ['password'])
    const res = await setUserData({
      ...pureVals,
      grants: [],
    })
    handleResponse(res.success, vals, res)
  }

  const signUp = async (vals) => {
    setLoading()
    const { success, error, user } = await emailSignUp(vals)
    success ? setUpUserProfile({ ...vals, uid: user.uid }) : handleError(error)
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
