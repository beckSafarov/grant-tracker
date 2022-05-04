import { serverTimestamp } from 'firebase/firestore'
import { setEmails } from '../firebase/grantDataSetup'
import React from 'react'
import { setStore } from '../helpers'
import { logout } from '../firebase/auth'

const TestScreen = () => {
  const onClick = async () => {
    await logout()
    window.location.reload()
  }
  return (
    <div style={{ padding: '50px' }}>
      <h1>TestScreen</h1>
      <button onClick={onClick}>Click here</button>
    </div>
  )
}

export default TestScreen
