export const balanceCheck = (expense, grant) => {
  const totalCurrExpenses = grant.expenses
    ? grant.expenses
        .filter((prevExp) => prevExp.vot === expense.vot)
        .reduce((acc, { amount }) => (acc += amount), 0)
    : 0
  const allocation = grant.votAllocations[expense.vot]
  const res = allocation - (totalCurrExpenses + expense.amount)
  return { success: res > 0, res }
}
