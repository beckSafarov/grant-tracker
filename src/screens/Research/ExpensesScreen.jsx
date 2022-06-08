import { useState } from 'react'
import AlertBox from '../../components/AlertBox'
import FloatingAddButton from '../../components/FloatingAddButton'
import AddExpenseModal from '../../components/Modals/AddExpenseModal'
import ResearchScreenContainer from '../../components/Research/ResearchScreenContainer'
import Spinner from '../../components/Spinner'

const ExpensesScreen = () => {
  const [alert, setAlert] = useState('')
  const [addModal, setAddModal] = useState(false)

  return (
    <ResearchScreenContainer>
      <Spinner hidden={true} />
      <AlertBox hidden={!alert}>{alert}</AlertBox>
      {addModal && (
        <AddExpenseModal open={addModal} onClose={() => setAddModal(false)} />
      )}
      <FloatingAddButton onClick={() => setAddModal(true)} />
    </ResearchScreenContainer>
  )
}

export default ExpensesScreen
