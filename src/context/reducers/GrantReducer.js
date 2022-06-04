import produce from 'immer'

export const GrantReducer = produce((draft, action) => {
  switch (action.type) {
    case 'loading':
      return { ...draft, loading: true }
    case 'backgroundLoading':
      draft.backgroundLoading = !Boolean(draft.backgroundLoading)
      break
    case 'success':
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
    case 'backUpAddActivitySuccess':
      return { ...draft, success: true, loading: false }
    case 'updateMilestone':
      const newData = action.data
      draft.grant.milestones = draft.grant.milestones.map((ms) =>
        ms.id === action.id ? { ...ms, ...newData } : ms
      )
      break
    case 'resetState':
      draft[action.state] = false
      break
    default:
      return draft
  }
})
