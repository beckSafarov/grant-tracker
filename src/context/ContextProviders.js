import React from 'react'
import { UserProvider } from './UserContext'
import { GrantProvider } from './GrantContext'
import { PubProvider } from './PublicationsContext'

const ContextProviders = ({ children }) => {
  return (
    <UserProvider>
      <GrantProvider>
        <PubProvider>{children}</PubProvider>
      </GrantProvider>
    </UserProvider>
  )
}

export default ContextProviders