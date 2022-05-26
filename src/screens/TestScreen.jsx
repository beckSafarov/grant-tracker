import React from 'react'
import { logout } from '../firebase/auth'
import MenuDropDown from '../components/MenuDropDown'
import { getAllGrants } from '../firebase/grantControllers'
import { getMonthsAdded } from '../helpers/dateHelpers'
import { collect } from '../helpers'

const shortGrantDummy = {
  type: 'short',
  startDate: new Date(),
  endDate: getMonthsAdded(12),
  info: {
    appCeiling: 42000,
    coResearcherEmail: 'beckSafari@yandex.com',
    period: 24,
    st: true,
  },
  uid: 'some-awesome-id-3423423',
}

const TestScreen = () => {
  const onClick = async () => {
    try {
      const something = await getAllGrants()
      // const something = await handleCoResearcherEmails(shortGrantDummy, {
      //   name: 'John Doe',
      // })
      console.log(something.map((s) => s.startDate.toDate()))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>TestScreen</h1>
      <button style={{ marginBottom: '30px' }} onClick={onClick}>
        Click
      </button>
      <br />
      <MenuDropDown />
    </div>
  )
}

export default TestScreen
