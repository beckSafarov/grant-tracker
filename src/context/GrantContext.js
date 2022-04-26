import React, { createContext, useReducer } from 'react'
import { setGrantData, addGrantToUser } from '../firebase/controllers'

const initialState = {
  loading: false,
  error: null,
  grant: {
    type: '',
    info: '',
    votAllocations: '',
    uid: '',
  },
}
export const GrantContext = createContext(initialState)

const GrantReducer = (state, action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true }
    case 'success':
      return { loading: false, grant: action.data }
    case 'error':
      return { loading: false, error: action.error }
  }
}

export const GrantProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GrantReducer, initialState)

  const setNewGrant = async (data) => {
    dispatch({ type: 'loading' })
    try {
      const res = await setGrantData(data)
      await addGrantToUser({
        id: res.grantId,
        type: data.type,
        startDate: new Date(),
        endDate: res.endDate,
      })
      dispatch({ type: 'success', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  return (
    <GrantContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        grant: state.grant,
        setNewGrant,
      }}
    >
      {children}
    </GrantContext.Provider>
  )
}
