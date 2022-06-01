import produce from 'immer'

export const PubReducer = produce((draft, action) => {
  draft.loading = action.type === 'loading'
  switch (action.type) {
    case 'setPublications':
      draft.publications = action.data
      draft.success = true
      break
    case 'error':
      draft.error = action.error
      break
    default:
      return draft
  }
})
