import produce from 'immer'

export const GrantReducer = produce((draft, action) => {
  switch (action.type) {
    case 'loading':
      return { ...draft, loading: true }
    case 'backgroundLoading':
      draft.backgroundLoading = !Boolean(draft.backgroundLoading)
      break
    case 'setGrantSuccess':
      return { ...draft, loading: false, success: true, grant: action.data }
    case 'error':
      return { ...draft, success: false, loading: false, error: action.error }
    case 'setAllGrants':
      return { ...draft, loading: false, success: true, allGrants: action.data }
    case 'resetSuccess':
      return { ...draft, success: false }
    case 'addPub':
      const prevPubs = draft.grant.publications || []
      draft.grant.publications = [...prevPubs, action.data]
      draft.loading = false
      draft.success = true
      break
    case 'setPublications':
      draft.loading = false
      draft.grant.publications = action.data
      break
    case 'addMilestone':
      const prevMiles = draft.grant.milestones || []
      draft.grant.milestones = [...prevMiles, action.data]
      draft.loading = false
      draft.success = true
      break
    case 'addActivity':
      const activities = draft.grant.activities || []
      activities.push(action.data)
      draft.grant.activities = activities
      break
    case 'updateActivity':
      draft.grant.activities = draft.grant.activities.map((act) =>
        act.id === action.id ? { ...act, ...action.updates } : act
      )
      break
    case 'deleteActivity':
      draft.grant.activities = draft.grant.activities.filter(
        (a) => a.id !== action.id
      )
      break
    case 'backupSuccess':
      return { ...draft, backupSuccess: true, backgroundLoading: false }
    case 'updateMilestone':
      draft.grant.milestones = draft.grant.milestones.map((ms) =>
        ms.id === action.id ? { ...ms, ...action.data } : ms
      )
      break
    case 'addExpense':
      const expenses = draft.grant.expenses || []
      expenses.push(action.data)
      draft.grant.expenses = expenses
      draft.loading = false
      draft.success = true
      break
    case 'updateExpenses':
      const expenses2 = draft.grant.expenses
      draft.grant.expenses = expenses2.map((expense) =>
        expense.id === action.id ? { ...expense, ...action.updates } : expense
      )
      break
    case 'resetState':
      draft[action.state] = false
      break
    default:
      return draft
  }
})
