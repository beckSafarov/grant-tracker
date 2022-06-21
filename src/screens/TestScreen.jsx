import { useCallback, useState } from 'react'
import ProgressBar from '../components/Charts/ProgressBar'

const TestScreen = () => {
  const [some, setSome] = useState('')

  const onClick = async () => {
    setSome(Math.random() * 100)
  }

  const sampleFunc = useCallback(() => {
    console.log('sampleFunc executed...')
    return { name: 'beck', age: 21 }
  }, [some])

  return (
    <div style={{ padding: '50px' }}>
      <h1>TestScreen</h1>
      <button style={{ marginBottom: '30px' }} onClick={onClick}>
        Click
      </button>
      <p>Name: {sampleFunc().name}</p>
      <p>Age: {sampleFunc().age}</p>
      <ProgressBar label='1 year 2 months' />
      <br />
    </div>
  )
}

export default TestScreen
