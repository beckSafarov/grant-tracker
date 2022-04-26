import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { GrantContext } from '../context/GrantContext'


export const useUserContext = () => useContext(UserContext)
export const useGrantContext = () => useContext(GrantContext)
