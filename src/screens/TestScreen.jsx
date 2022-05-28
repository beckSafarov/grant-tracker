import React from 'react'
import { logout } from '../firebase/auth'
import MenuDropDown from '../components/MenuDropDown'
import { getAllGrants } from '../firebase/grantControllers'
import { getMonthsAdded } from '../helpers/dateHelpers'
import { collect } from '../helpers'
import { getPubsById } from '../firebase/publicationsControllers'

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
      const res = await getPubsById(
        'grantId',
        '39a8386d-98f8-41c0-95ad-70ec6e6f2667'
      )
      console.log(res)
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
