import { useCallback, useState } from 'react'
import ProgressBar from '../components/Charts/ProgressBar'
import { assertValues } from '../firebase/helperControllers'
import { getWeekIntervals } from '../helpers/dateHelpers'

const TestScreen = () => {
  const [some, setSome] = useState('')
  const [counter, setCounter] = useState(0)

  const onClick = async () => {
    const res = getWeekIntervals(10)
    console.log(res)
  }
  const sampleFunc = useCallback(() => {
    return { name: 'beck', age: 21 }
  }, [some])

  const increment = () => setCounter((c) => ++c)

  return (
    <div style={{ padding: '50px' }}>
      <h1>TestScreen</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>{counter}</h3>
        <button style={{ marginBottom: '30px' }} onClick={increment}>
          Increment
        </button>
      </div>
      <p>Name: {sampleFunc().name}</p>
      <p>Age: {sampleFunc().age}</p>
      <ProgressBar label='1 year 2 months' />
      <br />
    </div>
  )
}

export default TestScreen
