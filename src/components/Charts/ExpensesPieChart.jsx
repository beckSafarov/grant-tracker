import { NativeSelect, Stack, Typography } from '@mui/material'
import React from 'react'
import { useCallback, useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import CircleIcon from '@mui/icons-material/Circle'
import { COLORS, votDescriptions } from '../../config'
import { truncate } from 'lodash'
import ComponentTitle from '../ComponentTitle'
import { getTotalExpensesPerProp as getTotalExpenses } from '../../helpers/expenseHelpers'
import PieLabel from './PieLabel'
import { useGrantContext } from '../../hooks/ContextHooks'
import { useEffect } from 'react'

const ExpensesPieChart = ({ width: w }) => {
  const { grant } = useGrantContext()
  const expenses = grant?.expenses || null
  const [prop, setProp] = useState('vot')
  const [width, setWidth] = useState(w + 'px')

  useEffect(() => {
    setWidth(w + 'px')
  }, [w])

  const getProjectTitle = (id) => {
    const projects = grant.info.projects || []
    const { title } = projects.find((project) => project.id === id)
    return truncate(title, { length: 30 })
  }

  const buildDataObjects = (totals) =>
    Object.keys(totals).map((id) => ({
      name: prop === 'vot' ? id : getProjectTitle(id),
      value: totals[id],
    }))

  const getData = useCallback(() => {
    if (!expenses) return []
    const totals = getTotalExpenses(expenses, prop)
    const data = buildDataObjects(totals)
    return data.sort((x, y) => y.value - x.value)
  }, [expenses, prop])

  const getVotDesc = useCallback(
    (code) => {
      return truncate(votDescriptions[code], { length: 35 })
    },
    [expenses]
  )

  return (
    <Stack spacing={2} sx={{ height: '100%' }} position='relative'>
      <Stack direction='row' justifyContent='space-between'>
        <ComponentTitle>Expenses by {prop.toUpperCase()}</ComponentTitle>
        {grant && grant.type.match(/ru/i) && (
          <NativeSelect value={prop} onChange={(e) => setProp(e.target.value)}>
            <option value='vot'>VOT</option>
            <option value='project'>Project</option>
          </NativeSelect>
        )}
      </Stack>
      {!expenses || expenses.length < 1 ? (
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          sx={{
            height: '200px',
            width,
            top: '35%',
            left: '50%',
            position: 'relative',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography fontSize='1.2rem' color='gray' textAlign='center'>
            No Data to show
          </Typography>
        </Stack>
      ) : (
        <Stack
          direction='row'
          spacing={3}
          alignItems='center'
          justifyContent='center'
          sx={{ height: '100%', width }}
        >
          <div style={{ width: 'fit-content', flex: 1 }}>
            <PieChart width={200} height={200}>
              <Pie
                data={getData()}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={PieLabel}
                outerRadius={80}
                dataKey='value'
              >
                {getData().map((data, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <Stack flex='1' spacing={1} justifyContent='center'>
            {getData().map(({ name }, i) => (
              <Stack key={i} direction='row' spacing={1} alignItems='center'>
                <CircleIcon fontSize='0.8rem' sx={{ color: COLORS[i] }} />
                <p>
                  {name}
                  {prop === 'vot' && `(${getVotDesc(name)})`}
                </p>
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

ExpensesPieChart.defaultProps = {
  width: 450,
}

export default ExpensesPieChart
