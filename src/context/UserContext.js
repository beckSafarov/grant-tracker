import React, { createContext, useReducer } from 'react'
import { getDataById, setUserData } from '../firebase/controllers'
import { emailSignIn, emailSignUp } from '../firebase/auth'
import produce from 'immer'
import { omit } from '../helpers'

const initialState = {
  loading: false,
  user: null,
  error: null,
}
export const UserContext = createContext(initialState)

const UserReducer = produce((draft, action) => {
  switch (action.type) {
    case 'loading':
      draft.loading = true
      break
    case 'setUser':
      draft.loading = false
      draft.user = { ...action.data }
      break
    case 'logout':
      draft.user = null
      break
    case 'error':
      draft.loading = false
      draft.error = action.error
      break
    default:
      return draft
  }
})

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState)

  const getUserData = async (uid) => {
    dispatch({ type: 'loading' })
    const data = await getDataById('Users', uid)
    data
      ? dispatch({ type: 'setUser', data })
      : dispatch({ type: 'error', error: `No user found with the id ${uid}` })
  }

  const signIn = async (vals) => {
    dispatch({ type: 'loading' })
    const data = await emailSignIn(vals)

    dispatch(
      data.success
        ? { type: 'setUser', data: data.user }
        : { type: 'error', error: data.errorMessage }
    )
  }

  const setUpUser = async (vals) => {
    const res = await setUserData(vals)
    if (!res.success) {
      dispatch({ type: 'error', error: res })
      return
    }
    dispatch({ type: 'setUser', data: vals })
  }

  const signUp = async (vals) => {
    dispatch({ type: 'loading' })
    const authRes = await emailSignUp(vals)
    if (!authRes.success) {
      dispatch({ type: 'error', error: authRes.errorMessage.toString() })
      return
    }
    const newUser = { uid: authRes.user.uid, ...vals }
    setUpUser(omit(newUser, ['password']))
  }

  const logoutFromContext = () => {
    dispatch({ type: 'logout' })
  }

  return (
    <UserContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        user: state.user,
        logoutFromContext,
        getUserData,
        signIn,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
