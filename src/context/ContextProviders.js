import React from 'react'
import { UserProvider } from './UserContext'
import { GrantProvider } from './GrantContext'

const ContextProviders = ({ children }) => {
  return (
    <UserProvider>
      <GrantProvider>{children}</GrantProvider>
    </UserProvider>
  )
}

export default ContextProviders