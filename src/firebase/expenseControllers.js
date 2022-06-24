import { updateArrInDoc, addToArrInDoc } from './helperControllers'

export const addExpense = async (expense, grantId) => {
  return await addToArrInDoc({
    colName: 'Grants',
    docId: grantId,
    arrName: 'expenses',
    elem: expense,
  })
}

export const updateExpense = async (updates, grantId, expenseId) => {
  return await updateArrInDoc({
    colName: 'Grants',
    arrName: 'expenses',
    docId: grantId,
    elemId: expenseId,
    updates,
  })
}
