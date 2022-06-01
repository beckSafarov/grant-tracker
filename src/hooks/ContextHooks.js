import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { GrantContext } from '../context/GrantContext'
import { PubContext } from '../context/PublicationsContext'

export const useUserContext = () => useContext(UserContext)
export const useGrantContext = () => useContext(GrantContext)
export const usePubContext = () => useContext(PubContext)
