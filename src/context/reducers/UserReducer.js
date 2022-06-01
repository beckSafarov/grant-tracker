import produce from 'immer'

export const UserReducer = produce((draft, action) => {
  draft.loading = action.type === 'loading'
  switch (action.type) {
    case 'setUser':
      draft.user = action.data
      break
    case 'setSomeUser':
      draft.others.user = action.data
      break
    case 'error':
      draft.error = action.error
      break
    case 'setAllUsers':
      draft.allUsers = action.data
      break
    default:
      return draft
  }
})
