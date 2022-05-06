import React from 'react'
import { logout } from '../firebase/auth'
import MenuDropDown from '../components/MenuDropDown'
import { setGrant } from '../firebase/grantDataSetup'
const TestScreen = () => {
  const onClick = async () => {
    await logout()
    window.location.reload()
  }
  return (
    <div style={{ padding: '50px' }}>
      <h1>TestScreen</h1>
      <button style={{ marginBottom: '30px' }} onClick={onClick}>
        Logout
      </button>
      <br />
      <MenuDropDown />
    </div>
  )
}

export default TestScreen
