import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { getCurrMsIndex } from '../../helpers/msHelpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import { Stack } from '@mui/material'
import { getArrOfObjects, isNone } from '../../helpers'
import {
  getCurrMonth,
  getDateSafely,
  getMonthsAndDaysLeft,
} from '../../helpers/dateHelpers'
import Title from './Title'
import CountDownTitle from './CountDownTitle'
import ResearchCard from './ResearchCard'

const cardsBases = getArrOfObjects([
  ['name', 'bg', 'textColor', 'subtitle', 'title'],
  ['monthlyTotal', '#FFE7D9', '#7A0C2E', 'Spent in this month', 'RM 0'],
  ['leftInTheBudget', '#C8FACD', '#005249', 'Left in the budget', 'RM 0'],
  [
    'timeForCurrMs',
    '#FFF7CD',
    '#7A4F01',
    'Left for this milestone',
    'undefined time',
  ],
  ['actsPercentage', '#D0F2FF', '#04297A', 'Activities Completed', '0/0'],
])

const DashboardStatCards = () => {
  const { grant } = useGrantContext()
  const [stats, setStats] = useState([])

  useEffect(() => {
    if (grant) handleSetStats()
  }, [grant])

  const currMsIndex = useMemo(() => {
    return getCurrMsIndex(grant?.milestones)
  }, [grant?.milestones])

  const getTotalExpense = (arr) => {
    const expenses = arr || grant.expenses || []
    return expenses.reduce((a, c) => (a += c.amount), 0)
  }

  const getMonthlyTotalExpense = () => {
    const currMonth = getCurrMonth()
    const expenses = grant.expenses || []
    const expensesForThisMonth = expenses.filter((curr, i) => {
      const date = getDateSafely(curr.date)
      return date.getMonth() === currMonth
    })
    return getTotalExpense(expensesForThisMonth)
  }

  const getTimeForCurrMs = () => {
    const milestones = grant.milestones
    if (isNone(milestones)) return {}
    const currMs = milestones[currMsIndex]
    const endDate = getDateSafely(currMs.endDate)
    return getMonthsAndDaysLeft(endDate)
  }

  const getActivitiesPercentage = () => {
    const acts = grant.activities
    if (isNone(acts)) return '0/0'
    const currMs = grant.milestones[currMsIndex]
    const doneActivities = acts
      .filter((act) => act.id === currMs.id)
      .reduce((a, c) => {
        a = c.done ? a + 1 : a
        return a
      }, 0)
    return `${doneActivities}/${acts.length}`
  }

  const handleSetStats = useCallback(() => {
    const total = getTotalExpense()
    setStats({
      monthlyTotal: getMonthlyTotalExpense(),
      leftInTheBudget: grant.info.appCeiling - total,
      timeForCurrMs: getTimeForCurrMs(),
      actsPercentage: getActivitiesPercentage(),
    })
  }, [grant])

  const getCardsWithStats = useCallback(() => {
    if (isNone(stats)) return cardsBases
    return cardsBases.map((card, i) => {
      const value = stats[card.name]
      const titleText = card.name.match(/total|left/i) ? `RM ${value}` : value
      return {
        bg: card.bg,
        title:
          card.name !== 'timeForCurrMs' ? (
            <Title color={card.textColor}>{titleText}</Title>
          ) : (
            <CountDownTitle
              months={stats[card.name].months}
              days={stats[card.name].days}
              color={card.textColor}
            />
          ),
        subTitle: <p style={{ color: card.textColor }}>{card.subtitle}</p>,
      }
    })
  }, [stats])

  return (
    <Stack direction='row' spacing={2}>
      {getCardsWithStats().map((card, i) => (
        <ResearchCard key={i} {...card} />
      ))}
    </Stack>
  )
}

export default DashboardStatCards
