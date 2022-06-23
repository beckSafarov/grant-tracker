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

// const updateExpense = async(updates, grantId, expenseId)=>{
//   try {
//     const grant = await getDataById('Grants', grantId)
//     if (!grant.expenses) return
//     const updatedExpenses = grant.expenses.map((expense) =>
//       expense.id === expenseId ? { ...expense, ...updates } : expense
//     )
//     const updatedGrant = { ...grant, expenses: updatedExpenses }
//     const res = await setDocData('Grants', grantId, updatedGrant, true)
//     return res
//   } catch (error) {
//     return { error }
//   }
// }
