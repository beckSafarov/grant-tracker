import { serverTimestamp } from 'firebase/firestore'
import React from 'react'

const TestScreen = () => {
  console.log(serverTimestamp())
  return <div>TestScreen</div>
}

export default TestScreen
