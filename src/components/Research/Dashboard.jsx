import { Paper, Stack, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { getElemWidth, isNone } from '../../helpers'
import { useGrantContext } from '../../hooks/ContextHooks'
import ErrorAlert from '../ErrorAlert'
import Spinner from '../Spinner'
import Container from './ResearchScreenContainer'
import ComponentTitle from '../ComponentTitle'
import GrantPeriodProgress from '../Charts/GrantPeriodProgress'
import MilestoneSteps from './MilestoneSteps'
import { useNavigate } from 'react-router-dom'
import { chunk } from 'lodash'
import ExpensesLineChart from '../Charts/ExpensesLineChart'
import ExpensesPieChart from '../Charts/ExpensesPieChart'
import VotBudgetChart from '../Charts/VotBudgetsChart'
import DashboardStatCards from './DashboardStatCards'
import DashboardPubsList from './DashboardPubsList'

const saveWidth = (name, width) => {
  localStorage.setItem(name, JSON.stringify(width))
}

const getWidthForElem = (elem) => {
  const widthFromLCS = JSON.parse(localStorage.getItem(elem))
  const width = widthFromLCS || getElemWidth(elem)
  if (!widthFromLCS) saveWidth(elem, width)
  return width
}

const Dashboard = () => {
  const { loading, error, grant } = useGrantContext()
  const navigate = useNavigate()
  const { text } = useTheme()
  const FallBackText = ({ children }) => {
    return (
      <div
        style={{
          textAlign: 'center',
          color: text.grey,
        }}
      >
        {children}
      </div>
    )
  }

  const getComponents = useCallback(() => {
    if (!grant) return []
    return [
      {
        title: 'Milestone Progress',
        component: (
          <>
            {isNone(grant.milestones) ? (
              <FallBackText>No Milestones Yet</FallBackText>
            ) : (
              <MilestoneSteps
                milestones={grant.milestones}
                onClick={() => navigate(`/research/${grant.id}/milestones`)}
                truncateName
              />
            )}
          </>
        ),
      },
      {
        title: 'Overall Research Time',
        component: (
          <div id='grantPeriodProgress'>
            <GrantPeriodProgress
              grant={grant}
              width={getWidthForElem('grantPeriodProgress')}
            />
          </div>
        ),
      },
      {
        component: (
          <div id='expLineChart'>
            <ExpensesLineChart
              expenses={grant.expenses}
              width={getElemWidth('expLineChart')}
              height={getElemWidth('expLineChart') / 3}
            />
          </div>
        ),
      },
      {
        component: (
          <div id='pieChart'>
            {grant.expenses ? (
              <ExpensesPieChart width={getWidthForElem('pieChart')} />
            ) : (
              <Stack spacing={2}>
                <ComponentTitle>Expenses By VOT</ComponentTitle>
                <FallBackText>No Expenses Yet</FallBackText>
              </Stack>
            )}
          </div>
        ),
      },
      {
        title: 'Publications',
        component: <DashboardPubsList />,
      },
      {
        component: (
          <div id='votBudgetChart'>
            <VotBudgetChart width={getWidthForElem('votBudgetChart')} />
          </div>
        ),
      },
    ]
  }, [grant])

  return (
    <Container>
      <Spinner hidden={!loading} />
      <ErrorAlert error={error} />
      {grant && (
        <>
          <DashboardStatCards />
          <Stack sx={{ mt: 5 }} spacing={3}>
            {chunk(getComponents(), 2).map((row, rowId) => (
              <Stack key={rowId} width='100%' direction='row' spacing={4}>
                {row.map((block, i) => (
                  <Paper
                    key={i}
                    sx={{ flex: i === 0 ? 1.5 : 1, p: '15px' }}
                    elevation={1}
                  >
                    <Stack spacing={2}>
                      <ComponentTitle>{block.title}</ComponentTitle>
                      {block.component}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Container>
  )
}

export default Dashboard
