import { Stack } from '@mui/material'
import React from 'react'
import { useCallback } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import CircleIcon from '@mui/icons-material/Circle'
import { COLORS, votDescriptions } from '../../config'
import { truncate } from 'lodash'
import ComponentTitle from '../ComponentTitle'
import { getTotalExpensesPerVot as getTotalExpenses } from '../../helpers/expenseHelpers'

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const RADIAN = Math.PI / 180
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const ExpensesByVotPie = ({ expenses }) => {
  const getData = useCallback(() => {
    const votExpenses = getTotalExpenses(expenses)
    const data = Object.keys(votExpenses).map((vot) => ({
      name: vot,
      value: votExpenses[vot],
    }))
    return data.sort((x, y) => y.value - x.value)
  }, [expenses])

  const getVotDesc = useCallback(
    (code) => {
      return truncate(votDescriptions[code], { length: 35 })
    },
    [expenses]
  )

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <ComponentTitle>Expense Amounts by VOT</ComponentTitle>
      <Stack
        direction='row'
        spacing={3}
        alignItems='center'
        justifyContent='center'
        sx={{ height: '100%' }}
      >
        <PieChart width={200} height={200}>
          <Pie
            data={getData()}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            dataKey='value'
          >
            {getData().map(({ vot }, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <Stack spacing={1} justifyContent='center'>
          {getData().map(({ name }, i) => (
            <Stack key={i} direction='row' spacing={1} alignItems='center'>
              <CircleIcon fontSize='0.8rem' sx={{ color: COLORS[i] }} />
              <p>
                {name}({getVotDesc(name)})
              </p>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ExpensesByVotPie
