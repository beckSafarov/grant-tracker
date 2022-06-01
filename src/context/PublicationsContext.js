import React, { createContext, useReducer } from 'react'
import { getAllDocs } from '../firebase/controllers'
import { PubReducer } from './reducers/PubReducer'

const initialState = {
  loading: false,
  publications: [],
  success: false,
  error: null,
}

export const PubContext = createContext(initialState)

export const PubProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PubReducer, initialState)

  const getAllPubs = async () => {
    dispatch({ type: 'loading' })
    try {
      const data = await getAllDocs('Publications')
      dispatch({ type: 'setPublications', data })
    } catch (error) {
      dispatch({ type: 'error', error })
    }
  }

  return (
    <PubContext.Provider
      value={{
        ...state,
        getAllPubs,
      }}
    >
      {children}
    </PubContext.Provider>
  )
}
