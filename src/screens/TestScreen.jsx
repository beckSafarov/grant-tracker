import { useState } from 'react'
import { logout } from '../firebase/auth'
import MenuDropDown from '../components/MenuDropDown'
import { getAllGrants } from '../firebase/grantControllers'
import { getMonthsAdded, isBefore, dateDiff } from '../helpers/dateHelpers'
import { collect } from '../helpers'
import { getPubsById } from '../firebase/publicationsControllers'
import { upload } from '../firebase/uploadController'

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
  const [imageUpload, setImageUpload] = useState(null)

  const handleUpload = async () => {
    if (!imageUpload) return
    const url = await upload(imageUpload)
    console.log(url)
  }

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
      <input
        type='file'
        placeholder='Upload file'
        onChange={({ target }) => setImageUpload(target.files[0])}
        accept='image/jpg, image/jpeg, image/png'
      />
      <button onClick={handleUpload}>Upload</button>
      <br />
    </div>
  )
}

export default TestScreen
