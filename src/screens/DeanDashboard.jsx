import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrUser, logout } from '../firebase/auth'

const DeanDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <h1>Welcome to Dean HomeScreen</h1>
      <Button type='button' onClick={handleLogout}>
        Logout
      </Button>
      <Button type='button' onClick={() => console.log(getCurrUser())}>
        Get Curr User
      </Button>
    </>
  )
}

export default DeanDashboard
