import React from 'react'
import {
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Line,
  Legend,
  Tooltip,
} from 'recharts'

/**
 * @data ArrObj [{name, x, y, amt}]
 */
const MyLineChart = ({ width, height, data }) => {
  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type='monotone' dataKey='value' stroke='#8884d8' />
    </LineChart>
  )
}

MyLineChart.defaultProps = {
  width: 730,
  height: 250,
}

export default MyLineChart
